# Guide: Authoring & Configuring Multilingual Courses in Evolo (Open edX)

This guide documents how to create, configure, and maintain multilingual courses on the Calcul Québec Evolo Open edX platform. It covers course metadata, structural course navigation (sections, units, components), video audio & transcriptions, and rich-text content.

---

## 1. Course Language & Catalog Metadata

### Setting the Course Language in Studio
When creating or editing a course intended for bilingual or multilingual delivery:
1. Navigate to **Studio > Settings > Schedule & Details**.
2. Scroll to the **Course Language** dropdown.
3. Select **Multilingual / Multilingue** (language code `mu`).
4. Save changes.

### Platform Behavior
- **Backend & Catalog Storage**: The code `mu` satisfies the Open edX 2-letter regex constraint (`oex_catalog_catalogcourse_language_regex`) for catalog course models.
- **Learner-Facing Catalog & Facets**: In `frontend-app-catalog`, the `Intl.DisplayNames` hook dynamically translates `mu` into **"Multilingual"** (English UI) or **"Multilingue"** (French UI).

---

## 2. Structural Course Titles (Course, Sections, Subsections, Units, Components)

To present localized titles across navigation, sidebar outlines, breadcrumbs, and tabs without duplicating courses:

### Syntax: Paired Closing Tags
Wrap language variants using paired tags:
```text
{fr}Titre en français{/fr}{en}English title{/en}
```

You can also embed tags inside shared numbering or prefixes:
```text
Module 1: {fr}Introduction au calcul de pointe{/fr}{en}Introduction to Advanced Research Computing{/en}
```

### Supported Languages & Fallback Behavior
- Any standard 2- or 3-letter language code is supported (`{fr}`, `{en}`, `{es}`, `{de}`, etc.).
- When a learner visits the course, the client-side rewriter matches the learner's active language preference (from `openedx-language-preference` cookie or browser language).
- **Fallback Hierarchy**:
  1. Active user language (e.g. `fr` or `en`).
  2. French (`{fr}...{/fr}`) if user's language is unavailable.
  3. English (`{en}...{/en}`) if French is unavailable.
  4. First tag present in the title block.

### Authoring Experience vs. Learner Experience
- **Studio & Authoring MFE**: Raw tags remain visible so authors can see, edit, and maintain all translations directly in the title input fields.
- **Learner Experience (LMS, Learning MFE, Catalog MFE)**: The tags are stripped and only the appropriate translated title is displayed to the learner.

---

## 3. Multilingual Videos (Audio Tracks & Transcripts)

Videos support both **multiple spoken audio tracks** and **multiple subtitle/caption transcriptions**.

### A. Multiple Audio Tracks (`xblock_video`)
Learners can toggle between audio languages via an **Audio** menu in the video player controls. Modern browsers support two workflows:

#### Option 1: Multi-Audio HLS Stream (Recommended for seamless playback)
Generate an HLS stream where different audio streams are grouped together using FFmpeg:
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
In Studio (Video component > **Advanced**):
- **Video File URLs** (`html5_sources`):
  ```json
  ["https://cdn.example.com/videos/master.m3u8"]
  ```
- **Audio Tracks** (`audio_tracks`):
  ```json
  [
    {"lang": "en", "label": "English"},
    {"lang": "fr", "label": "Français"}
  ]
  ```

#### Option 2: Multiple MP4 Files (Source Swap)
Upload separate `.mp4` video files for each language. The player maintains the learner's playback timestamp when switching.
In Studio (Video component > **Advanced**):
- **Video File URLs** (`html5_sources`):
  ```json
  ["https://cdn.example.com/videos/lesson_en.mp4"]
  ```
- **Audio Tracks** (`audio_tracks`):
  ```json
  [
    {"lang": "en", "label": "English", "src": "https://cdn.example.com/videos/lesson_en.mp4"},
    {"lang": "fr", "label": "Français", "src": "https://cdn.example.com/videos/lesson_fr.mp4"}
  ]
  ```

### B. Multiple Subtitles & Transcriptions (Native Open edX)
Open edX natively supports multiple transcripts per video:
1. In Studio, edit the **Video** component.
2. In the **Basic** tab, locate **Transcript Languages**.
3. Click **Add language** for each language needed (e.g. French, English).
4. Upload the corresponding `.srt` or `.vtt` file for each language.
5. Learners can select their preferred subtitle track using the **CC** menu on the video player.

---

## 4. Multilingual Text & HTML Content (`xblock-multilingual-text`)

For rich-text lessons, instructions, and reading materials, the `multilingual_text` container XBlock allows authors to provide localized content while maintaining standard rich-text formatting, course assets, and links.

### Step 1: Course Enablement
In **Studio > Settings > Advanced Settings**:
1. Add `"multilingual_text"` to the **Advanced Module List**.
2. In **Other Course Settings**, add the language catalog:
   ```json
   {
     "multilingual_text_languages": ["Français", "English"]
   }
   ```
   *(Catalog order defines the initial default display language)*.

### Step 2: Authoring Multilingual Text Blocks
1. Inside a Unit, click **Advanced** and select **Multilingual Text**.
2. Click **View** on the component container.
3. Click **Create missing components** — Studio generates a dedicated child Text block for each configured language.
4. Edit each child component using the standard Open edX rich-text visual editor.
5. Publish the unit.

### Learner Experience
- A clean language selector dropdown appears above the content.
- Changing the language updates the current block and synchronizes across all other Multilingual Text blocks on the same page.
- The learner's choice is saved in their browser session.

---

## 5. Summary Matrix for Course Authors

| Element | Tool / Syntax | Where to Configure | Learner Experience |
| :--- | :--- | :--- | :--- |
| **Course Language** | Code `mu` | Studio > Schedule & Details | Catalog filter shows "Multilingual" / "Multilingue" |
| **Unit / Section / Title** | `{fr}Titre{/fr}{en}Title{/en}` | Display Name fields in Studio | Title switches automatically with UI language |
| **Rich Text Content** | `multilingual_text` XBlock | Studio > Advanced Components | Dropdown switcher above text with synchronized choice |
| **Video Audio** | `audio_tracks` JSON | Video Component > Advanced | Audio menu in player toolbar (instant HLS or MP4 swap) |
| **Video Subtitles** | Native Transcripts (`.srt`/`.vtt`) | Video Component > Basic | CC button with language selection list |
