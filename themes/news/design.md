# Theme News - Design Specification

This document outlines the visual structure, layout components, and configurable options for the **News** theme (inspired by modern digital media like Mojok.co).

## 🎨 Visual Identity
- **Primary Color**: `#001A33` (Deep Navy) - Background for Header/Nav.
- **Accent Color**: `#B4F81B` (Neon Lime Green) - Logo and primary highlights.
- **CTA Color**: `#28A745` (Forest Green) - Buttons like "Kirim Artikel".
- **Typography**:
  - Headings: Bold Sans-serif (e.g., Inter or Montserrat).
  - Body: High-readability Sans-serif (e.g., Roboto or Inter).

---

## 🏗️ Page Layouts & Components

### 1. Global Layout (`ThemeLayout`)
- **Top Header**:
    - **Logo Section**: High-contrast SVG/Image logo on the left.
    - **Header Actions**: [Reference: `header.png`]
        - `CTA Button`: Custom labeled button (e.g., "Kirim Artikel") with configurable URL.
        - `Separator`: Vertical divider (`|`).
        - `Social Icons`: Circular icons for IG, X, FB, TikTok, YT.
    - **Navigation Bar**: [Reference: `home-futured-post+recent-post+header-scrol.png`]
    - Sticky on scroll (scroll-up reveals, scroll-down hides).
    - **Menu Items**: Uppercase bold text with neon green underline on hover.
    - **Search Interface**: Integrated search input with magnifying glass icon. Rounded pills with semi-transparent background (glassmorphism).

### 2. Homepage (`Home`) [Reference: `home-futured-post+recent-post+header-scrol.png`]
- **Hero Grid**:
    - **Primary Featured Post (Left - 2/3)**: Large card showing featured image, title with bold typography, author meta, and a slight zoom effect on hover.
    - **Latest News Sidebar (Right - 1/3)**: "TERBARU" heading followed by a vertical list of post cards (small image left, title and date right).
- **Category Sections (Row-based)**: [Reference: `home-categories-recent-post.png`, `home-futured-category.png`]
    - **Category Header**: Title (e.g., "Esai") on the left, "Lihat Semua" link on the right.
    - **Post Cards**: Horizontal row of 3-4 posts or a mixed layout (1 medium + list).
- **Featured Category Grid (Grid-based)**: [Reference: `home-futured-category-2.png`]
    - Square or rectangular tiles with a background category image and centered title overlay.

### 3. Archive / Category Page (`Archive`) [Reference: `list-posts.png`]
- **Taxonomy Header**: Large title for the category/tag with a short descriptive text.
- **Post List (Vertical)**:
    - **Layout**: Image on the left (rounded corners), metadata and content on the right.
    - **Elements**: 
        - Category label (neon green/black pill).
        - Title (H2, bold).
        - Summary/Excerpt (limited to 3 lines).
        - "BACA SELENGKAPNYA" button (outline style).
- **Sidebar**:
    - "Artikel Terbaru" widget.
    - Potential "Populer" widget based on tags.

### 4. Single Post Page (`SinglePost`) [Reference: `single-post-top.png`, `single-post-body.png`]
- **Article Header**:
    - Breadcrumbs.
    - Meta: Author (avatar + name), Date, Reading Time.
    - Title: XXL bold heading.
    - Featured Image: Full width or centered with caption.
- **Article Body**:
    - Tailwind typography (`prose`) for refined reading experience.
    - Inline "Share" sticky buttons.
    - Sidebar: Related content or "Jangan Lewatkan" posts.
- **Article Footer**:
    - Author Bio card.
    - Comments section (if enabled).

---

## ⚙️ Theme Options
Registers a list of configurable settings in the Admin Panel.

| Option ID | Label | Type | Description |
|---|---|---|---|
| `theme_news_logo` | Site Logo | `image` | Logo for the header. |
| `theme_news_cta_text` | Header CTA Text | `text` | Label for the green header button (e.g., "Kirim Artikel"). |
| `theme_news_cta_url` | Header CTA URL | `url` | Destination URL for the header button. |
| `theme_news_social_ig` | Instagram URL | `url` | Link to Instagram account. |
| `theme_news_social_x` | X (Twitter) URL | `url` | Link to X account. |
| `theme_news_social_fb` | Facebook URL | `url` | Link to Facebook page. |
| `theme_news_social_tiktok` | TikTok URL | `url` | Link to TikTok profile. |
| `theme_news_social_yt` | YouTube URL | `url` | Link to YouTube channel. |
| `theme_news_hero_post` | Hero Featured Post | `post` | Main post displayed in the hero section. |
| `theme_news_home_cat_1` | Featured Category 1 | `select` | First category displayed on the home page rows. |
| `theme_news_home_cat_2` | Featured Category 2 | `select` | Second category displayed on the home page rows. |
| `theme_news_home_grid_cats` | Grid Categories | `text` | Comma-separated category IDs for the grid section. |

---

## 🚀 Design Polish (Antigravity Touch)
- **Micro-animations**: Subtle scale-up on post card hover.
- **Responsive Navigation**: Smooth mobile menu slide-in from the left.
- **Loading States**: Skeletal loaders for images and post cards to keep the UI feeling "premium".
- **Empty States**: Beautifully designed "No Posts Found" illustrations for Archive/Search.
