# MERPATI-CMS — Descriptive Design & Data Mapping

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

> Phase 2 deliverable per Agent EDNA methodology.

---

## Design Philosophy

WordPress familiarity is the primary goal. Journalists should feel at home within 5 minutes. The admin UI mirrors WordPress's classic layout: left sidebar navigation, top toolbar, main content area. Public pages are clean, fast, and optimized for reading.

---

## Color Palette & Typography

### Admin Theme: "WordPress Modern"

| Token | Hex | Usage |
|---|---|---|
| `--admin-sidebar-bg` | `#1D2327` | Sidebar background (WP dark) |
| `--admin-sidebar-text` | `#C3C4C7` | Sidebar text |
| `--admin-sidebar-hover` | `#2271B1` | Sidebar hover/active |
| `--admin-topbar-bg` | `#1D2327` | Top admin bar |
| `--admin-body-bg` | `#F0F0F1` | Main content background |
| `--admin-card-bg` | `#FFFFFF` | Card/panel background |
| `--admin-primary` | `#2271B1` | Primary buttons, links |
| `--admin-primary-hover` | `#135E96` | Primary hover state |
| `--admin-text` | `#1E1E1E` | Body text |
| `--admin-text-muted` | `#646970` | Secondary text |
| `--admin-border` | `#C3C4C7` | Borders, dividers |
| `--admin-success` | `#00A32A` | Published status, success toasts |
| `--admin-warning` | `#DBA617` | Draft status, warnings |
| `--admin-error` | `#D63638` | Error states, delete actions |
| `--admin-info` | `#72AAEA` | Info badges |

### Public Theme (Default — defined in theme.json)

| Token | Hex | Usage |
|---|---|---|
| `--pub-bg` | `#FFFFFF` | Page background |
| `--pub-text` | `#1A1A1A` | Body text |
| `--pub-heading` | `#0F172A` | Headings |
| `--pub-accent` | `#2271B1` | Links, CTAs |
| `--pub-accent-hover` | `#135E96` | Link hover |
| `--pub-muted` | `#6B7280` | Meta text (dates, author) |
| `--pub-surface` | `#F9FAFB` | Card backgrounds |
| `--pub-border` | `#E5E7EB` | Borders |
| `--pub-code-bg` | `#1E293B` | Code block background |
| `--pub-code-text` | `#E2E8F0` | Code block text |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| **Admin body** | `system-ui, -apple-system, sans-serif` | 13px | 400 |
| **Admin headings** | `system-ui, -apple-system, sans-serif` | 23px (h1), 18px (h2), 14px (h3) | 400 |
| **Admin buttons** | `system-ui` | 13px | 400 |
| **Public body** | `Inter, sans-serif` | 18px / 1.8 line-height | 400 |
| **Public headings** | `Inter, sans-serif` | 36px (h1), 28px (h2), 22px (h3) | 700 |
| **Public meta** | `Inter, sans-serif` | 14px | 400 |
| **Public code** | `JetBrains Mono, monospace` | 15px | 400 |
| **Editor content** | `Georgia, serif` | 16px / 1.8 line-height | 400 |

---

## Admin Layout & Pages

### Global Admin Layout

```
┌─────────────────────────────────────────────────────────┐
│ Top Bar (32px)  [≡ collapse] [🏠 Visit Site]  [👤 User] │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │ Main Content Area                            │
│ (160px)  │                                              │
│          │ Page Title + Action Buttons                   │
│ 📊 Dashboard │                                          │
│ 📝 Posts     │ [Content cards, tables, forms...]        │
│ 📷 Media     │                                          │
│ 📄 Pages     │                                          │
│ 🏷 Categories│                                          │
│ 🏷 Tags      │                                          │
│ 🎨 Themes    │                                          │
│ 👤 Users     │                                          │
│ ⚙ Settings   │                                          │
│          │                                              │
│ Collapse │                                              │
│ Arrow    │                                              │
└──────────┴──────────────────────────────────────────────┘
```

#### Responsive Behavior

| Breakpoint | Layout |
|---|---|
| **Desktop** (> 960px) | Full sidebar (160px) + main content |
| **Tablet** (782–960px) | Collapsed sidebar (icons only, 36px) + main content; expand on hover |
| **Mobile** (< 782px) | Sidebar hidden; hamburger menu toggle; full-width content |

> [!NOTE]
> WordPress breakpoints (782px, 960px) are used intentionally for familiarity.

---

### Page: Login

**Structure**: Centered card, fullscreen gradient background.

```
┌────────────────────────────────────────┐
│                                        │
│          MERPATI-CMS Logo              │
│          Tagline (optional)            │
│                                        │
│     ┌──────────────────────────┐       │
│     │ 🔵 Login with Google     │       │
│     └──────────────────────────┘       │
│                                        │
│     "Press freedom begins with         │
│      infrastructure independence."     │
│                                        │
└────────────────────────────────────────┘
```

- **Data Points**: None (Google handles auth)
- **States**:
  - Default: Google button visible
  - Loading: Button shows spinner
  - Denied: Red alert card "You have not been invited. Contact the administrator."
  - Error: Red alert card with error message

---

### Page: Dashboard

**Structure**: WordPress-style dashboard with widget cards in 2-column grid.

```
┌─────────────────────────────────────────────────┐
│ Dashboard                                       │
├────────────────────┬────────────────────────────┤
│ At a Glance        │ Quick Draft                │
│ ┌────────────────┐ │ ┌──────────────────────┐   │
│ │ 📝 12 Posts    │ │ │ Title: [________]    │   │
│ │ 📄 3 Pages     │ │ │ Content:             │   │
│ │ 📷 45 Media    │ │ │ [________________]   │   │
│ │ 👤 2 Users     │ │ │ [Save Draft]         │   │
│ └────────────────┘ │ └──────────────────────┘   │
├────────────────────┴────────────────────────────┤
│ Recent Posts                                     │
│ ┌───────────────────────────────────────────┐   │
│ │ Post Title         Author    Date  Status │   │
│ │ First Post         John     2/28   Pub   │   │
│ │ Draft Article      Jane     2/27   Draft │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

- **Data Points**: `post_count`, `page_count`, `media_count`, `user_count`, `recent_posts[]` (title, author.name, created_at, status)
- **Mobile**: Single column stack
- **Tablet**: Single column stack
- **Desktop**: 2-column grid

---

### Page: All Posts

**Structure**: WordPress-style list table with filters.

```
┌─────────────────────────────────────────────────────────┐
│ Posts                                    [Add New Post]  │
├─────────────────────────────────────────────────────────┤
│ All (15) | Published (10) | Draft (4) | Trash (1)       │
│                                                         │
│ Bulk Actions ▾  [Apply]    All Dates ▾  All Categories ▾│
│                                        [Filter] [Search]│
├─────────────────────────────────────────────────────────┤
│ ☐ │ Title              │ Author │ Categories │ Date     │
│───┼────────────────────┼────────┼────────────┼──────────│
│ ☐ │ Breaking News...   │ John   │ Politics   │ 2/28     │
│   │ Edit | Trash | View│        │            │ Published│
│ ☐ │ Draft Article      │ Jane   │ Tech       │ 2/27     │
│   │ Edit | Trash       │        │            │ Draft    │
├─────────────────────────────────────────────────────────┤
│ ◀ 1 2 3 ▶                              Showing 1-20    │
└─────────────────────────────────────────────────────────┘
```

- **Data Points per row**: `title`, `author.name`, `categories[].name`, `published_at` or `updated_at`, `status`
- **Quick Actions (on hover)**: Edit, Trash, View (if published)
- **Mobile**: Cards instead of table; each post = a card with title, status badge, and action icons
- **Bulk select**: Checkbox column, bulk action dropdown (Move to Trash, Publish)

---

### Page: Classic Editor (THE CRITICAL PAGE)

**Structure**: WordPress classic editor layout — title, toolbar, content area, sidebar meta boxes.

```
┌─────────────────────────────────────────────────────────────┐
│ Add New Post                                                │
├─────────────────────────────────────┬───────────────────────┤
│ MAIN EDITOR COLUMN (70%)           │ SIDEBAR (30%)         │
│                                     │                       │
│ Title:                              │ ┌─ Publish ─────────┐│
│ ┌─────────────────────────────────┐ │ │ Status: Draft  ▾  ││
│ │ Enter title here                │ │ │ Visibility: Public ││
│ └─────────────────────────────────┘ │ │ Published by: —    ││
│                                     │ │ [Save Draft]       ││
│ Permalink: site.com/post-title-here │ │ [👁 Preview]       ││
│ [Edit]                              │ │ [Publish] (blue)   ││
│                                     │ └────────────────────┘│
│ ┌─ Toolbar ─────────────────────┐   │                       │
│ │B I ∅ "" H2▾ ≡ ≡ 🔗 📷 ⋯ |HTML│   │ ┌─ Categories ──────┐│
│ └───────────────────────────────┘   │ │ ☐ Uncategorized    ││
│ ┌─────────────────────────────────┐ │ │ ☐ Technology       ││
│ │                                 │ │ │ ☐ Politics         ││
│ │  Write your content here...     │ │ │ [+ Add New]        ││
│ │                                 │ │ └────────────────────┘│
│ │                                 │ │                       │
│ │                                 │ │ ┌─ Tags ────────────┐│
│ │                                 │ │ │ [tag1] [tag2] ×   ││
│ │  (contenteditable area or       │ │ │ Add: [_______]    ││
│ │   textarea with formatting)     │ │ └────────────────────┘│
│ │                                 │ │                       │
│ │                                 │ │ ┌─ Featured Image ──┐│
│ └─────────────────────────────────┘ │ │ [Set Featured Img] ││
│                                     │ │ (thumbnail preview)││
│ ┌─ Excerpt ───────────────────────┐ │ └────────────────────┘│
│ │ [Short summary for SEO/cards]   │ │                       │
│ └─────────────────────────────────┘ │ ┌─ SEO ─────────────┐│
│                                     │ │ Title: [________]  ││
│ Word count: 423 | Autosaved 2m ago  │ │ Desc:  [________]  ││
│                                     │ │ Canonical: [____]  ││
│                                     │ │ ☑ Indexable        ││
│                                     │ │ ┌─ Preview ──────┐ ││
│                                     │ │ │ Google | Chat   │ ││
│                                     │ │ │ [title...]      │ ││
│                                     │ │ │ [description..] │ ││
│                                     │ │ └────────────────┘ ││
│                                     │ └────────────────────┘│
└─────────────────────────────────────┴───────────────────────┘
```

#### Toolbar Buttons (left to right)
| Button | Action | Icon/Label |
|---|---|---|
| Bold | Wrap `<strong>` | **B** |
| Italic | Wrap `<em>` | *I* |
| Strikethrough | Wrap `<del>` | ~~S~~ |
| Blockquote | Wrap `<blockquote>` | " |
| Heading | Dropdown: H2, H3, H4 | H▾ |
| Unordered List | Insert `<ul><li>` | ≡ |
| Ordered List | Insert `<ol><li>` | 1. |
| Align Left/Center/Right | Set text-align | ≡ buttons |
| Insert Link | Modal: URL + text + open in new tab | 🔗 |
| Insert Media | Opens Media Library modal | 📷 |
| More options | Horizontal rule, table, code block | ⋯ |
| HTML Mode | Toggle visual ↔ raw HTML | `</>` |

#### Sidebar Meta Boxes

1. **Publish Box**: Status (Draft/Published), Save Draft button, Preview button, Publish button (blue, prominent). Shows `published_by` name after publishing.
2. **Categories**: Checkboxes with hierarchical indent; "Add New" inline form.
3. **Tags**: Tag input with autocomplete; chips with × remove.
4. **Featured Image**: Click to open Media Library; shows thumbnail after selection; remove button.
5. **SEO**: Title, description, canonical URL, indexable toggle. Live preview tabs (Google SERP / Chat preview).
6. **Excerpt**: Textarea below main editor.

#### Responsive Behavior

| Breakpoint | Layout |
|---|---|
| **Desktop** (> 960px) | 70/30 split: editor + sidebar |
| **Tablet** (782–960px) | Full-width editor; sidebar collapses to accordion below editor |
| **Mobile** (< 782px) | Full-width editor; sidebar meta boxes stacked below; toolbar scrollable horizontally |

#### Editor States

- **Empty**: Placeholder text "Start writing your story..."
- **Typing**: Live word count updates
- **Autosave**: Toast "Draft autosaved" every 30s (bottom-right, 3s duration, subtle)
- **Unsaved changes**: Browser beforeunload warning
- **Publishing**: Button shows spinner → success toast "Post Published!" → redirects to All Posts or stays with confirmation

---

### Page: Media Library

**Structure**: Grid gallery with upload dropzone.

```
┌─────────────────────────────────────────────────────────┐
│ Media Library                          [Upload New] 📤   │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ 🖼       │ │ 🖼       │ │ 🖼       │ │ 🖼       │   │
│ │          │ │          │ │          │ │          │   │
│ │photo.jpg │ │hero.png  │ │banner.jpg│ │logo.svg  │   │
│ │ 245 KB   │ │ 1.2 MB   │ │ 890 KB   │ │ 12 KB    │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│ ◀ 1 2 3 ▶                                              │
└─────────────────────────────────────────────────────────┘
```

- **Upload**: Drag & drop zone at top, or click "Upload New" for file picker
- **Click on image**: Opens detail sidebar with: preview, filename, URL (copy button), alt text input, uploaded by, date, size, delete button
- **Media Library Modal** (from editor): Same grid + "Insert into post" button on selection
- **Mobile**: 2-column grid
- **Desktop**: 4-6 column grid

---

### Page: Categories / Tags

**Structure**: WordPress-style split layout — add form left, list right.

```
┌──────────────────────┬──────────────────────────────────┐
│ Add New Category      │ ☐ │ Name     │ Slug     │ Count │
│                       │───┼──────────┼──────────┼───────│
│ Name: [_________]     │ ☐ │ Politics │ politics │  5    │
│ Slug: [_________]     │   │ Edit|Del │          │       │
│ Parent: [None ▾]      │ ☐ │ — Tech   │ tech     │  3    │
│ Description:          │   │ Edit|Del │          │       │
│ [_______________]     │                                  │
│ [Add New Category]    │                                  │
└──────────────────────┴──────────────────────────────────┘
```

- Tags: Same layout but without Parent dropdown
- **Mobile**: Stacked — add form on top, list below

---

### Page: Users (Super User Only)

```
┌─────────────────────────────────────────────────────────┐
│ Users                                  [Invite User] ✉  │
├─────────────────────────────────────────────────────────┤
│ 👤 │ Name          │ Email            │ Role       │ Joined│
│────┼───────────────┼──────────────────┼────────────┼──────│
│ 🟢 │ John Doe      │ john@gmail.com   │ Super User │ 2/1  │
│    │ Edit          │                  │            │      │
│ 🟢 │ Jane Smith    │ jane@gmail.com   │ User       │ 2/15 │
│    │ Edit|Deactivate│                 │            │      │
│ 🔴 │ Bob (inactive)│ bob@gmail.com    │ User       │ 2/10 │
├─────────────────────────────────────────────────────────┤
│ Pending Invitations                                     │
│ ✉ │ invited@email.com │ User │ Invited 2/27 │ [Revoke] │
└─────────────────────────────────────────────────────────┘
```

- **Invite Modal**: Email input + role dropdown (User/Super User) + Send button
- **Edit User**: Change role, deactivate/reactivate. Cannot deactivate yourself.
- **Status indicators**: 🟢 active, 🔴 inactive

---

### Page: Settings (Super User Only)

**Structure**: Tabbed settings page.

```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                │
│ [General] [SEO] [Telegram] [Social]                     │
├─────────────────────────────────────────────────────────┤
│ General Tab:                                            │
│                                                         │
│ Site Title:      [________________]                     │
│ Tagline:         [________________]                     │
│ Description:     [________________]                     │
│ Posts Per Page:   [10]                                   │
│                                                         │
│ Logo:            [Upload] (preview)                     │
│ Favicon:         [Upload] (preview)                     │
│                                                         │
│                                    [Save Settings]      │
├─────────────────────────────────────────────────────────┤
│ Telegram Tab:                                           │
│                                                         │
│ Bot Token:       [________________] 🔒                  │
│ Chat ID:         [________________]                     │
│ [Test Notification]  ✅ "Notification sent!"            │
│                                                         │
│ Notify on:                                              │
│ ☑ Post published                                       │
│ ☑ New user joined                                      │
│                                                         │
│                                    [Save Settings]      │
└─────────────────────────────────────────────────────────┘
```

---

### Page: Themes (Super User Only)

```
┌─────────────────────────────────────────────────────────┐
│ Themes                                                  │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐              │
│ │ [Preview Image]  │  │ [Preview Image]  │              │
│ │                  │  │                  │              │
│ │ Default          │  │ Developer Dark   │              │
│ │ ✅ Active        │  │ [Activate]       │              │
│ │ v1.0.0           │  │ v1.0.0           │              │
│ │ [Customize]      │  │ Child of Default │              │
│ └──────────────────┘  └──────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## Public Pages Layout

### Global Public Layout (from theme templates)

```
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
│ [Logo / Site Title]            [nav links] [Search 🔍]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Main Content Area (max-width from theme config)         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Footer                                                  │
│ © 2026 Site Name  |  Powered by MERPATI-CMS             │
│ [Social Links]                                          │
└─────────────────────────────────────────────────────────┘
```

### Public: Homepage (Post List)

```
┌─────────────────────────────────────────────────────────┐
│ ┌─ Featured Post (latest) ────────────────────────────┐ │
│ │ [Featured Image — full width]                       │ │
│ │ Category Badge                                      │ │
│ │ Post Title (H1)                                     │ │
│ │ Excerpt text...                                     │ │
│ │ By Author Name · Feb 28, 2026 · 5 min read          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌──────────────────┐  ┌──────────────────┐              │
│ │ [Image]          │  │ [Image]          │              │
│ │ Category         │  │ Category         │              │
│ │ Post Title       │  │ Post Title       │              │
│ │ Excerpt...       │  │ Excerpt...       │              │
│ │ Author · Date    │  │ Author · Date    │              │
│ └──────────────────┘  └──────────────────┘              │
│                                                         │
│ [Load More / Pagination]                                │
└─────────────────────────────────────────────────────────┘
```

- **Mobile**: Single column, cards stacked
- **Tablet**: 2-column grid
- **Desktop**: Featured post full-width + 2-3 column grid below

---

### Public: Single Post

```
┌─────────────────────────────────────────────────────────┐
│ Category Badge                                          │
│                                                         │
│ Post Title (H1)                                         │
│                                                         │
│ 👤 Author Name · Published Feb 28, 2026                 │
│ Published by: Editor Name                               │
│ 5 min read                                              │
│                                                         │
│ [Featured Image — full width]                           │
│                                                         │
│ ─── Article Content ───                                 │
│                                                         │
│ Paragraphs, images, headings, code blocks, quotes...    │
│                                                         │
│ ─── End of Content ───                                  │
│                                                         │
│ Tags: [tag1] [tag2] [tag3]                              │
│                                                         │
│ ┌─ Share ────────────────────────────────────────────┐  │
│ │ [WhatsApp] [Twitter] [Facebook] [Telegram] [Copy]  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                         │
│ ── Author Bio Card ──                                   │
│ [Avatar] Author Name                                    │
│          Bio text...                                    │
│                                                         │
│ ── Related Posts ──                                     │
│ [Card] [Card] [Card]                                    │
└─────────────────────────────────────────────────────────┘
```

- **Share bar (mobile)**: Sticky bottom bar with share icons
- **Share bar (desktop)**: Inline after content + optional floating side bar
- **Data Points**: `title`, `content`, `featured_image`, `author.name`, `author.avatar_url`, `author.bio`, `published_by.name`, `published_at`, `reading_time` (calculated), `categories[]`, `tags[]`, `related_posts[]`

---

### Public: Category / Tag Archive

```
┌─────────────────────────────────────────────────────────┐
│ Category: Politics                                      │
│ Description text for the category...                    │
│                                                         │
│ ┌──────────────────┐  ┌──────────────────┐              │
│ │ [Post Card]      │  │ [Post Card]      │              │
│ └──────────────────┘  └──────────────────┘              │
│                                                         │
│ [Pagination]                                            │
└─────────────────────────────────────────────────────────┘
```

---

## Interactions & Feedback

### Button States

| State | Visual |
|---|---|
| **Default** | Solid fill (primary: `#2271B1`), white text |
| **Hover** | Darker fill (`#135E96`), subtle shadow |
| **Active/Pressed** | Even darker (`#0A4B78`), inset shadow |
| **Disabled** | `#C3C4C7` background, `#A7AAAD` text, no cursor |
| **Loading** | Text replaced with spinner, button width preserved |

### Toast Notifications

| Property | Value |
|---|---|
| **Position** | Bottom-right (desktop), bottom-center (mobile) |
| **Duration** | 4 seconds (auto-dismiss) |
| **Animation** | Slide in from right, fade out |
| **Types** | Success (green bar left), Error (red), Info (blue), Warning (amber) |
| **Dismissable** | Click × to close early |

### Loading States

| Context | Loading UI |
|---|---|
| **Page load** | NProgress-style thin bar at top of page |
| **Table data** | Skeleton rows (pulsing gray bars) |
| **Image upload** | Progress bar inside upload card |
| **Button action** | Inline spinner replacing button text |
| **Editor autosave** | Subtle text "Saving..." in status bar |

### Empty States

| Page | Empty State |
|---|---|
| **All Posts** (no posts) | Illustration + "No posts yet." + [Write your first post] button |
| **Media Library** (empty) | Upload dropzone + "Drag images here or click to upload" |
| **Categories** (none) | "No categories yet." + "Add your first category" prompt |

### Micro-Animations & Transitions

- **Sidebar collapse**: 200ms ease-out width transition
- **Modal open/close**: Fade in backdrop (150ms) + scale up content (200ms)
- **Post status change**: Status badge color transition (300ms)
- **Drag & drop upload**: Dropzone border turns dashed blue, slight scale pulse
- **Toast appear**: SlideInRight 300ms + FadeOut 300ms at end
- **Table row hover**: Background color transition 150ms
- **Tag chip add/remove**: Scale in/out 150ms

### Error States

| Error | UI Response |
|---|---|
| **API failure** | Toast error "Failed to save. Please try again." + retry option |
| **Image too large** | Toast warning "Image exceeds 4.5MB limit." |
| **Network offline** | Persistent banner at top "You are offline. Changes will not be saved." |
| **Auth expired** | Redirect to login with toast "Session expired. Please log in again." |
| **Form validation** | Inline red text below field + red border on input |

---

## SEO Preview Widget (in Editor)

Two preview tabs in the SEO sidebar section:

### Google SERP Preview
```
┌─────────────────────────────────────────────┐
│ site.com › category › post-slug             │
│ SEO Title or Post Title — Site Name         │
│ Meta description text showing first 160     │
│ characters of the excerpt or content...     │
└─────────────────────────────────────────────┘
```

### Chat / Social Preview (WhatsApp/Telegram)
```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ │
│ │ [Featured Image Preview]                │ │
│ ├─────────────────────────────────────────┤ │
│ │ site.com                                │ │
│ │ Post Title                              │ │
│ │ Description preview text...             │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## HTML Meta Output (per post/page)

```html
<!-- Standard SEO -->
<title>{seo_title || title} — {site_name}</title>
<meta name="description" content="{seo_description || excerpt || auto_truncate(content, 160)}">
<link rel="canonical" href="{canonical_url || page_url}">
<meta name="robots" content="{is_indexable ? 'index, follow' : 'noindex, nofollow'}">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="{seo_title || title}">
<meta property="og:description" content="{seo_description || excerpt}">
<meta property="og:image" content="{featured_image}">
<meta property="og:url" content="{canonical_url || page_url}">
<meta property="og:site_name" content="{site_name}">
<meta property="og:locale" content="id_ID">
<meta property="article:published_time" content="{published_at}">
<meta property="article:modified_time" content="{updated_at}">
<meta property="article:author" content="{author.name}">
<meta property="article:section" content="{primary_category.name}">
<meta property="article:tag" content="{tags[].name}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{seo_title || title}">
<meta name="twitter:description" content="{seo_description || excerpt}">
<meta name="twitter:image" content="{featured_image}">

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{title}",
  "image": ["{featured_image}"],
  "datePublished": "{published_at}",
  "dateModified": "{updated_at}",
  "author": {
    "@type": "Person",
    "name": "{author.name}",
    "url": "{site_url}/author/{author.slug}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{site_name}",
    "logo": { "@type": "ImageObject", "url": "{site_logo}" }
  },
  "description": "{seo_description || excerpt}",
  "mainEntityOfPage": "{page_url}"
}
</script>
```
