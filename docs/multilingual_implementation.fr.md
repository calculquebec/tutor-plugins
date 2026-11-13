[English](multilingual_implementation.md) | **Français**

# Implémentation technique : Prise en charge multilingue dans Evolo (Open edX)

Ce document détaille l'implémentation technique et architecturale des fonctionnalités multilingues sur la plateforme Open edX Evolo, incluant les plugins Tutor, les Micro-Frontends (MFE), les paramètres backend Django, les contraintes de base de données et les XBlocks.

---

## 1. Sélection de la langue du cours et facettes du catalogue

### Le problème
- Le paramètre Django `ALL_LANGUAGES` dans Open edX ne contient que les options de langues ISO standards.
- Le modèle `CatalogCourse` (`openedx-core` / Discovery) contient une contrainte de vérification MySQL stricte :
  ```sql
  CONSTRAINT `oex_catalog_catalogcourse_language_regex` 
  CHECK (`language` REGEXP '^[a-z][a-z](\-[a-z0-9]+)*$')
  ```
  Tenter d'utiliser un code à 3 lettres comme `mul` provoque une `IntegrityError` lors de l'enregistrement ou de la publication du cours.
- Les navigateurs et le CLDR Unicode (via `Intl.DisplayNames`) ne disposent pas de traductions intégrées pour les codes à 2 lettres non assignés. Lorsque `frontend-app-catalog` interroge `Intl.DisplayNames([locale], { type: 'language' }).of('mu')`, il retourne le code brut `'mu'`.

### La solution et l'implémentation
1. **Correctif des paramètres Django (`tutor-plugins/plugin_slots.py`)** :
   Sous le correctif `openedx-common-settings`, `ALL_LANGUAGES` est modifié dynamiquement au démarrage :
   ```python
   from django.utils.functional import lazy
   from django.utils.translation import get_language

   def _get_multilingual_display():
       lang = (get_language() or "").lower()
       if lang.startswith("fr"):
           return "Multilingue"
       return "Multilingual"

   MULTILINGUAL_LABEL = lazy(_get_multilingual_display, str)()

   if "ALL_LANGUAGES" in globals() and not any(lang[0] == "mu" for lang in ALL_LANGUAGES):
       pos = next((i for i, lang in enumerate(ALL_LANGUAGES) if lang[0] == "na"), -1)
       if pos != -1:
           ALL_LANGUAGES.insert(pos, ["mu", MULTILINGUAL_LABEL])
       else:
           ALL_LANGUAGES.append(["mu", MULTILINGUAL_LABEL])
   ```
   - Utilise `lazy()` afin que le libellé bascule entre l'anglais et le français selon la langue active de la session de l'utilisateur.
   - Utilise le code ISO 639-1 à 2 lettres non assigné `mu` pour satisfaire la contrainte d'expression régulière de la base de données MySQL.

2. **Monkeypatch `Intl.DisplayNames` pour les MFE (`theming/multilingual.tsx` & `scripts/multilingual.js`)** :
   Injecté dans tous les MFE (`mfe-env-config-buildtime-definitions` & `mfe-site-custom-app-definitions`) et les gabarits LMS :
   ```javascript
   const intlObj = typeof Intl !== 'undefined' ? Intl : null;
   if (intlObj && intlObj.DisplayNames) {
     if (!intlObj.DisplayNames._hasCustomOf) {
       const originalDisplayNamesOf = intlObj.DisplayNames.prototype.of;
       intlObj.DisplayNames.prototype.of = function(code) {
         if (code === 'mu') {
           try {
             const locale = (this.resolvedOptions().locale || '').toLowerCase();
             return locale.startsWith('fr') ? 'Multilingue' : 'Multilingual';
           } catch (e) {
             return 'Multilingual';
           }
         }
         return originalDisplayNamesOf.call(this, code);
       };
       intlObj.DisplayNames._hasCustomOf = true;
     }
   }
   ```
   Lorsque `frontend-app-catalog` affiche les facettes de filtrage, `mu` est résolu en `"Multilingue"` ou `"Multilingual"` au lieu du code brut.

---

## 2. Traduction des titres structurels (MutationObserver)

### Le problème
Les éléments structurels des cours (titres de cours, sections, sous-sections, unités et composants) sont rendus dans des dizaines de composants React distincts et de gabarits Mako Django :
- `frontend-app-learning` (barre latérale du plan, barre de navigation séquentielle, en-tête d'unité, fil d'Ariane)
- `frontend-app-catalog` (cartes de cours, résultats de recherche, pages à propos)
- Vues rendues côté serveur LMS (en-têtes historiques, cartes du tableau de bord, gabarits de certificats)

Modifier individuellement chaque dépôt frontend est fragile et nécessite de maintenir des forks lors des mises à niveau en amont.

### La solution et l'implémentation
Un parcours DOM côté client piloté par `MutationObserver` (`tutor-plugins/theming/multilingual.tsx` et `scripts/multilingual.js`) :

1. **Garde Studio / Authoring** :
   ```javascript
   const isStudioOrAuthoring = () => {
     try {
       const hostname = (window.location.hostname || '').toLowerCase();
       const pathname = (window.location.pathname || '').toLowerCase();
       return (
         hostname.startsWith('studio.') ||
         hostname.includes('authoring') ||
         pathname.startsWith('/authoring')
       );
     } catch (e) {
       return false;
     }
   };
   if (isStudioOrAuthoring()) return;
   ```
   Les instances Studio et Authoring MFE ne sont pas modifiées afin que les auteurs puissent éditer directement les balises `{fr}...{/fr}`.

2. **Analyseur basé sur des expressions régulières** :
   ```javascript
   const parseMultilingualText = (text, targetLang) => {
     if (typeof text !== 'string' || text.indexOf('{') === -1) {
       return text;
     }
     const lang = (targetLang || 'fr').toLowerCase().split('-')[0];
     const tagBlockRegex = /(?:\{([a-zA-Z]{2,3})\}([\s\S]*?)\{\/\1\}\s*)+/g;

     return text.replace(tagBlockRegex, function(matchBlock) {
       const itemRegex = /\{([a-zA-Z]{2,3})\}([\s\S]*?)\{\/\1\}/g;
       const matches = {};
       let m;
       while ((m = itemRegex.exec(matchBlock)) !== null) {
         matches[m[1].toLowerCase()] = m[2].trim();
       }
       return matches[lang] || matches['fr'] || matches['en'] || Object.values(matches)[0] || '';
     });
   };
   ```

3. **Parcours du DOM et MutationObserver** :
   - Met à jour les nœuds de texte contenant `{`.
   - Met à jour les attributs contenant des titres (`title`, `aria-label`, `alt`).
   - Met à jour `document.title`.
   - Exclut les éléments `<input>`, `<textarea>`, `[contenteditable]`, `<script>` et `<style>`.
   - Observe les nouveaux nœuds à l'aide de `MutationObserver` régulé via `requestAnimationFrame` afin d'assurer aucune latence perceptible lors des re-rendus React.

---

## 3. Pistes audio multilingues dans `xblock_video`

### Le problème
Les éléments HTML5 `<video>` natifs dans Google Chrome et Mozilla Firefox n'exposent pas l'API `AudioTrackList`, ce qui signifie que les utilisateurs de navigateurs ne peuvent pas changer de piste audio dans les fichiers MP4 standards à fichier unique sans prise en charge externe.

### La solution et l'implémentation (`xblocks-core/xblock_video`)
1. **Extension du schéma et saisie dans Studio (`xblocks-core/video`)** :
   - Ajout de `audio_tracks = List(Scope.settings, default=[])`.
   - Dans Studio, les composants vidéo standards ne disposent pas d'onglet « Advanced » ni de champ JSON brut pour les pistes audio. Pour rendre la configuration naturelle pour les auteurs de cours :
     - Les auteurs saisissent les URL vidéo dans l'onglet **Basic** de Studio (**Video URL** et **Fallback videos** / `html5_sources`).
     - Les URL peuvent inclure des fragments `#lang=<code>` (p. ex. `video.mp4#lang=fr`) ou des suffixes de langue dans le nom de fichier (p. ex. `video_fr.mp4`), qui sont automatiquement analysés en métadonnées `audioTracks`.
     - Sinon, `audio_tracks` peut être spécifié directement via Course OLX (XML).

2. **Intégration des renditions audio HLS (`hls.js`)** :
   - Lorsqu'une source HLS (`.m3u8`) est fournie, `hls.js` analyse automatiquement les groupes `#EXT-X-MEDIA:TYPE=AUDIO` depuis le manifeste de la liste de lecture.
   - Lorsque l'utilisateur sélectionne une langue audio dans le menu du lecteur, le lecteur définit `hls.audioTrack = index`, ce qui effectue un changement de flux en mémoire sans pause ni mise en mémoire tampon.

3. **Changement de source MP4 avec conservation de l'horodatage** :
   - Si des pistes MP4 autonomes sont configurées (`src`), le lecteur remplace l'attribut `src` de l'élément vidéo.
   - Le temps de lecture actuel (`currentTime`) et l'état de lecture (`paused`) sont enregistrés avant le changement et restaurés immédiatement dès que l'événement `loadedmetadata` est déclenché.

4. **Interface du lecteur et accessibilité** :
   - Lorsque `audio_tracks.length > 1`, un bouton de piste audio est injecté dans la barre de contrôle vidéo.
   - Navigation accessible au clavier (touches fléchées, Entrée, Échap).
   - La préférence linguistique sélectionnée est conservée dans `localStorage` sous `audio_track_lang` afin de mémoriser le choix d'une vidéo à l'autre du cours.

---

## 4. Conteneur de contenu texte multilingue (`xblock-multilingual-text`)

### Architecture
`multilingual_text` est implémenté comme un XBlock conteneur Open edX (`multilingual_text/block.py`) :
1. **Paradigme de conteneur** :
   - Il agit comme un bloc parent dont les enfants sont des XBlocks `html` (Texte) natifs d'Open edX.
   - Chaque bloc enfant représente une traduction dans une langue.
   - Comme les enfants sont des blocs `html` standards, les auteurs conservent un accès complet à CKEditor/TinyMCE, au téléversement d'images, aux formules mathématiques et aux liens vers les ressources du cours.

2. **Configuration du cours (`ENABLE_OTHER_COURSE_SETTINGS`)** :
   - Studio utilise `ENABLE_OTHER_COURSE_SETTINGS = True` pour exposer `multilingual_text_languages` dans **Other Course Settings** (*Autres paramètres du cours*).
   - Lorsque l'auteur clique sur **Create missing components** dans Studio, le conteneur vérifie quelles langues existent dans le catalogue du cours et appelle `self.runtime.modulestore.create_child()` pour instancier les blocs `html` manquants.

3. **Rendu d'exécution dans le LMS** :
   - Dans la vue étudiant, le conteneur affiche un menu déroulant `<select>` de sélection de langue.
   - Seuls les enfants ayant un contenu non vide sont affichés.
   - Un écouteur d'événements synchronise le choix de langue sur tous les autres blocs `multilingual_text` de la page courante via `sessionStorage` du navigateur et des événements DOM personnalisés.
