**English** | [Français](multilingual_implementation.fr.md)

# Technical Implementation: Multilingual Support in Evolo (Open edX)

This document details the engineering and architectural implementation of multilingual features across the Evolo Open edX platform, including Tutor plugins, Micro-Frontends (MFEs), Django backend settings, database constraints, and XBlocks.

---

## 1. Course Language Selection & Catalog Facets

### The Problem
- The Django `ALL_LANGUAGES` setting in Open edX only contains standard ISO language options.
- The `CatalogCourse` model (`openedx-core` / Discovery) contains a strict MySQL check constraint:
  ```sql
  CONSTRAINT `oex_catalog_catalogcourse_language_regex` 
  CHECK (`language` REGEXP '^[a-z][a-z](\-[a-z0-9]+)*$')
  ```
  Attempting to use a 3-letter code like `mul` causes an `IntegrityError` at course save/publish time.
- Browsers and the Unicode CLDR (via `Intl.DisplayNames`) do not have built-in translations for unassigned 2-letter codes. When `frontend-app-catalog` queries `Intl.DisplayNames([locale], { type: 'language' }).of('mu')`, it returns the raw code `'mu'`.

### The Solution & Implementation
1. **Django Settings Patch (`tutor-plugins/plugin_slots.py`)**:
   Under the `openedx-common-settings` patch, `ALL_LANGUAGES` is dynamically patched at startup:
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
   - Uses `lazy()` so the label switches between English and French based on the user's active session language.
   - Uses the unassigned 2-letter ISO 639-1 code `mu` to satisfy the MySQL database regex constraint.

2. **MFE `Intl.DisplayNames` Monkeypatch (`theming/multilingual.tsx` & `scripts/multilingual.js`)**:
   Injected into all MFEs (`mfe-env-config-buildtime-definitions` & `mfe-site-custom-app-definitions`) and LMS templates:
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
   When `frontend-app-catalog` renders filter facets, `mu` resolves to `"Multilingue"` or `"Multilingual"` instead of the raw code.

---

## 2. Structural Title Translations (MutationObserver)

### The Problem
Course structural items (Course titles, Sections, Subsections, Units, and Components) are rendered across dozens of distinct React components and Django Mako templates:
- `frontend-app-learning` (Outline sidebar, sequence navigation bar, unit header, breadcrumbs)
- `frontend-app-catalog` (Course cards, search results, about pages)
- LMS server-rendered views (Legacy headers, dashboard cards, certificate templates)

Patching each individual frontend repository is brittle and requires maintaining forks across upstream upgrades.

### The Solution & Implementation
A client-side DOM walker powered by `MutationObserver` (`tutor-plugins/theming/multilingual.tsx` and `scripts/multilingual.js`):

1. **Studio / Authoring Guard**:
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
   Studio and Authoring MFE instances are completely untouched so authors can edit `{fr}...{/fr}` tags directly.

2. **Regex-Based Parser**:
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

3. **DOM Traversal & Mutation Observer**:
   - Updates text nodes containing `{`.
   - Updates title-bearing attributes (`title`, `aria-label`, `alt`).
   - Updates `document.title`.
   - Excludes `<input>`, `<textarea>`, `[contenteditable]`, `<script>`, and `<style>` elements.
   - Observes new nodes using `MutationObserver` throttled via `requestAnimationFrame` to ensure zero perceptible lag during React re-renders.

---

## 3. Multilingual Audio Tracks in `xblock_video`

### The Problem
Native HTML5 `<video>` elements in Google Chrome and Mozilla Firefox do not expose the `AudioTrackList` API, meaning browser users cannot switch audio tracks in standard single-file MP4s without external support.

### The Solution & Implementation (`xblocks-core/xblock_video`)
1. **Schema Extension & Studio Input (`xblocks-core/video`)**:
   - Added `audio_tracks = List(Scope.settings, default=[])`.
   - In Studio, standard video components lack an "Advanced" tab or raw JSON field for audio tracks. To make configuration natural for course authors:
     - Authors enter video URLs in Studio's **Basic** tab (**Video URL** and **Fallback videos** / `html5_sources`).
     - URLs can include `#lang=<code>` fragments (e.g. `video.mp4#lang=fr`) or language filename suffixes (e.g. `video_fr.mp4`), which are automatically parsed into `audioTracks` metadata.
     - Alternatively, `audio_tracks` can be specified directly via Course OLX (XML).

2. **HLS Audio Renditions Integration (`hls.js`)**:
   - When an HLS source (`.m3u8`) is provided, `hls.js` automatically parses `#EXT-X-MEDIA:TYPE=AUDIO` groups from the playlist manifest.
   - When the user selects an audio language in the player menu, the player sets `hls.audioTrack = index`, which performs an in-memory stream swap without pausing or buffering.

3. **MP4 Source Swapping with Timestamp Preservation**:
   - If standalone MP4 tracks are configured (`src`), the player swaps the video element's `src` attribute.
   - The current playback time (`currentTime`) and playback state (`paused`) are saved prior to swapping and restored immediately once the `loadedmetadata` event fires.

4. **Player UI & Accessibility**:
   - When `audio_tracks.length > 1`, an Audio Track button is injected into the video control bar.
   - Keyboard accessible navigation (arrow keys, Enter, Escape).
   - Selected language preference is persisted to `localStorage` under `audio_track_lang` to remember choice across course videos.

---

## 4. Multilingual Text Content Container (`xblock-multilingual-text`)

### Architecture
`multilingual_text` is implemented as an Open edX Container XBlock (`multilingual_text/block.py`):
1. **Container Paradigm**:
   - It acts as a parent block whose children are native Open edX `html` (Text) XBlocks.
   - Each child block represents one language translation.
   - Because children are standard `html` blocks, authors retain full access to CKEditor/TinyMCE, image uploads, math formulas, and course asset links.

2. **Course Configuration (`ENABLE_OTHER_COURSE_SETTINGS`)**:
   - Studio uses `ENABLE_OTHER_COURSE_SETTINGS = True` to expose `multilingual_text_languages` in **Other Course Settings**.
   - When the author clicks **Create missing components** in Studio, the container checks which languages exist in the course catalog and invokes `self.runtime.modulestore.create_child()` to instantiate the missing `html` blocks.

3. **LMS Runtime Rendering**:
   - In student view, the container renders a language `<select>` dropdown.
   - Only children with non-empty content are shown.
   - An event listener synchronizes the language choice across all other `multilingual_text` blocks on the current page via browser `sessionStorage` and custom DOM events.
