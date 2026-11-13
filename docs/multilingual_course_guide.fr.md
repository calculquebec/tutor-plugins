[English](multilingual_course_guide.md) | **Français**

# Guide : Création et configuration de cours multilingues dans Evolo (Open edX)

Ce guide explique comment créer, configurer et maintenir des cours multilingues sur la plateforme Open edX Evolo de Calcul Québec. Il couvre les métadonnées du cours, la navigation structurelle du cours (sections, sous-sections, unités, composants), l'audio et les transcriptions vidéo, ainsi que le contenu en texte enrichi.

---

## 1. Langue du cours et métadonnées du catalogue

### Définir la langue du cours dans Studio
Lors de la création ou de la modification d'un cours destiné à être offert en format bilingue ou multilingue :
1. Accédez à **Studio > Settings > Schedule & Details** (*Paramètres > Calendrier et détails*).
2. Faites défiler jusqu'au menu déroulant **Course Language** (*Langue du cours*).
3. Sélectionnez **Multilingual / Multilingue** (code de langue `mu`).
4. Enregistrez les modifications.

### Comportement de la plateforme
- **Stockage backend et catalogue** : Le code `mu` satisfait la contrainte d'expression régulière à 2 lettres d'Open edX (`oex_catalog_catalogcourse_language_regex`) pour les modèles de cours du catalogue.
- **Catalogue et facettes côté apprenant** : Dans `frontend-app-catalog`, le hook `Intl.DisplayNames` traduit dynamiquement `mu` en **« Multilingual »** (interface en anglais) ou **« Multilingue »** (interface en français).

---

## 2. Titres structurels du cours (cours, sections, sous-sections, unités, composants)

Pour afficher des titres localisés dans la navigation, le plan latéral, le fil d'Ariane et les onglets sans dupliquer les cours :

### Syntaxe : Balises fermantes appariées
Enveloppez les variantes linguistiques à l'aide de balises appariées :
```text
{fr}Titre en français{/fr}{en}English title{/en}
```

Vous pouvez également intégrer des balises à l'intérieur d'une numérotation ou d'un préfixe commun :
```text
Module 1: {fr}Introduction au calcul de pointe{/fr}{en}Introduction to Advanced Research Computing{/en}
```

### Langues prises en charge et comportement de repli (*fallback*)
- Tout code de langue standard à 2 ou 3 lettres est pris en charge (`{fr}`, `{en}`, `{es}`, `{de}`, etc.).
- Lorsqu'un apprenant visite le cours, le réécriveur côté client fait correspondre la préférence linguistique active de l'apprenant (à partir du témoin `openedx-language-preference` ou de la langue du navigateur).
- **Hiérarchie de repli** :
  1. Langue active de l'utilisateur (p. ex. `fr` ou `en`).
  2. Français (`{fr}...{/fr}`) si la langue de l'utilisateur n'est pas disponible.
  3. Anglais (`{en}...{/en}`) si le français n'est pas disponible.
  4. Première balise présente dans le bloc de titre.

### Expérience auteur vs expérience apprenant
- **Studio et MFE de création (*Authoring MFE*)** : Les balises brutes restent visibles afin que les auteurs puissent voir, modifier et maintenir toutes les traductions directement dans les champs de titre.
- **Expérience apprenant (LMS, Learning MFE, Catalog MFE)** : Les balises sont supprimées et seul le titre traduit approprié est affiché à l'apprenant.

---

## 3. Vidéos multilingues (pistes audio et transcriptions)

Les vidéos prennent en charge à la fois **plusieurs pistes audio parlées** et **plusieurs transcriptions / sous-titres**.

### A. Pistes audio multiples (`xblock_video`)
Les apprenants peuvent basculer entre les langues audio via un menu **Audio** dans les contrôles du lecteur vidéo.

Comme l'éditeur vidéo de Studio ne possède pas d'onglet « Advanced » (*Avancé*) ni de champ JSON brut pour les pistes audio, celles-ci sont configurées directement à l'aide des champs vidéo standards de l'onglet **Basic** (*De base*) (**Video URL** et **Fallback videos** / `html5_sources`), ou via le format Course OLX (XML).

#### Méthode 1 : Flux HLS multipiste audio (recommandé pour une lecture fluide)
Générez un flux HLS où différents flux audio sont regroupés à l'aide de FFmpeg :
```bash
ffmpeg -i input_multilang.mp4 \
  -map 0:v:0 -map 0:a:0 -map 0:a:1 \
  -c:v copy -c:a aac -b:a 128k \
  -var_stream_map "v:0,agroup:aud a:0,agroup:aud,language:en,default:yes a:1,agroup:aud,language:fr,default:no" \
  -hls_time 6 \
  -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  -f hls "stream_%v.m3u8"
```
Dans Studio (onglet **Basic**) :
- Saisissez l'URL de la liste de lecture principale dans **Video URL** :
  ```
  https://cdn.example.com/videos/master.m3u8
  ```
- **Détection automatique** : Le lecteur vidéo (`hls.js`) lit automatiquement les groupes `#EXT-X-MEDIA:TYPE=AUDIO` dans le manifeste de la liste de lecture et génère les éléments du menu Audio avec des libellés localisés.
- *(Surcharge manuelle optionnelle de la langue)* : Vous pouvez spécifier explicitement les codes de piste en ajoutant `#lang=en,fr` à l'URL :
  ```
  https://cdn.example.com/videos/master.m3u8#lang=en,fr
  ```

#### Méthode 2 : Plusieurs fichiers MP4 (changement de source)
Téléversez des fichiers vidéo `.mp4` distincts pour chaque langue. Le lecteur conserve de manière transparente la position de lecture et l'état de lecture de l'apprenant lors du changement de langue.

Dans Studio (onglet **Basic**) :
1. **Avec des fragments `#lang=` (recommandé)** :
   - Dans **Video URL**, indiquez la langue principale :
     ```
     https://cdn.example.com/videos/lesson.mp4#lang=en
     ```
   - Dans **Fallback videos**, ajoutez les URL des autres langues :
     ```
     https://cdn.example.com/videos/lesson_fr.mp4#lang=fr
     ```
2. **Avec des suffixes de nom de fichier** :
   - Sinon, si les fichiers se terminent par des codes de langue standards (p. ex. `_en.mp4`, `_fr.mp4`), ils sont détectés automatiquement :
     - **Video URL** : `https://cdn.example.com/videos/lesson_en.mp4`
     - **Fallback videos** : `https://cdn.example.com/videos/lesson_fr.mp4`

#### Méthode 3 : Course OLX (exportation/importation XML)
Si vous rédigez via le XML du cours (OLX), l'attribut `audio_tracks` peut être spécifié directement sur la balise `<video>` :
```xml
<video url_name="intro_video"
       display_name="Course Introduction"
       download_video="true"
       html5_sources="[&quot;https://cdn.example.com/videos/master.m3u8&quot;]"
       audio_tracks="[
         {&quot;lang&quot;: &quot;en&quot;, &quot;label&quot;: &quot;English&quot;},
         {&quot;lang&quot;: &quot;fr&quot;, &quot;label&quot;: &quot;Français&quot;}
       ]">
</video>
```

### B. Sous-titres et transcriptions multiples (Open edX natif)
Open edX prend en charge nativement plusieurs transcriptions par vidéo :
1. Dans Studio, modifiez le composant **Video**.
2. Dans l'onglet **Basic**, repérez **Transcript Languages** (*Langues de transcription*).
3. Cliquez sur **Add language** (*Ajouter une langue*) pour chaque langue requise (p. ex. Français, Anglais).
4. Téléversez le fichier `.srt` ou `.vtt` correspondant pour chaque langue.
5. Les apprenants peuvent sélectionner leur piste de sous-titres préférée à l'aide du menu **CC** du lecteur vidéo.

---

## 4. Contenu texte et HTML multilingue (`xblock-multilingual-text`)

Pour les leçons en texte enrichi, les consignes et le matériel de lecture, le XBlock conteneur `multilingual_text` permet aux auteurs de fournir du contenu localisé tout en conservant le formatage en texte enrichi standard, les ressources du cours et les liens.

### Étape 1 : Activation dans le cours
Dans **Studio > Settings > Advanced Settings** (*Paramètres > Paramètres avancés*) :
1. Ajoutez `"multilingual_text"` à **Advanced Module List** (*Liste des modules avancés*).
2. Dans **Other Course Settings** (*Autres paramètres du cours*), ajoutez le catalogue des langues :
   ```json
   {
     "multilingual_text_languages": ["Français", "English"]
   }
   ```
   *(L'ordre du catalogue définit la langue d'affichage par défaut initiale.)*

### Étape 2 : Rédaction de blocs de texte multilingues
1. Dans une unité, cliquez sur **Advanced** (*Avancé*) et sélectionnez **Multilingual Text**.
2. Cliquez sur **View** (*Afficher*) sur le conteneur du composant.
3. Cliquez sur **Create missing components** (*Créer les composants manquants*) — Studio génère un bloc Texte enfant dédié pour chaque langue configurée.
4. Modifiez chaque composant enfant à l'aide de l'éditeur visuel de texte enrichi standard d'Open edX.
5. Publiez l'unité.

### Expérience apprenant
- Un menu déroulant épuré de sélection de langue apparaît au-dessus du contenu.
- Le changement de langue met à jour le bloc actuel et se synchronise sur tous les autres blocs Multilingual Text de la même page.
- Le choix de l'apprenant est enregistré dans sa session de navigateur.

---

## 5. Matrice récapitulative pour les auteurs de cours

| Élément | Outil / Syntaxe | Où configurer | Expérience apprenant |
| :--- | :--- | :--- | :--- |
| **Langue du cours** | Code `mu` | Studio > Schedule & Details | Le filtre du catalogue affiche « Multilingual » / « Multilingue » |
| **Unité / Section / Titre** | `{fr}Titre{/fr}{en}Title{/en}` | Champs Display Name dans Studio | Le titre change automatiquement selon la langue de l'interface |
| **Contenu en texte enrichi** | XBlock `multilingual_text` | Studio > Advanced Components | Sélecteur déroulant au-dessus du texte avec choix synchronisé |
| **Audio vidéo** | URL vidéo / Fallbacks (`#lang=` ou HLS) | Composant Video > Basic | Menu Audio dans la barre du lecteur (changement HLS ou MP4 instantané) |
| **Sous-titres vidéo** | Transcriptions natives (`.srt`/`.vtt`) | Composant Video > Basic | Bouton CC avec liste de sélection de langue |
