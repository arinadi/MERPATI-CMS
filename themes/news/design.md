# Theme News - Design Specification

This document outlines the visual structure, layout components, and configurable options for the **News** theme (inspired by modern digital media like Mojok.co).

## 🎨 Visual Identity
- **Primary Color**: `#001A33` (Dongker/Deep Navy) - Background for Header, Navigation, and Footer.
- **Accent Color**: `#B4F81B` (Hijau Neon/Green) - Used for logos, buttons, highlights, and active states.
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
    - **Menu Items**: Uppercase bold text with **Accent Color** underline on hover.
    - **Search Interface**: Integrated search input with magnifying glass icon. Rounded pills with semi-transparent background (glassmorphism).

### 2. Homepage (`Home`) [Reference: `home-futured-post+recent-post+header-scrol.png`]
- **Hero Grid**:
    - **Primary Featured Post (Left - 2/3)**: Large card showing featured image, title with bold typography, author meta, and a slight zoom effect on hover.
    - **Latest News Sidebar (Right - 1/3)**: "TERBARU" heading followed by a vertical list of post cards (small image left, title and date right).
- **Featured Category** [Reference: `home-futured-category.png`]:
    - **Header**: Active category name (e.g., "LIPUTAN") inside a bold **Accent Color** box, with a full-width thin line matching the accent Extending to the right.
    - **Post Cards (Grid/Slider)**:
        - **Layout**: 3 columns of post cards.
        - **Thumbnail**: Large landscape image with a small **Accent Color** category label (pill) overlaid on the bottom-left corner.
        - **Typography**: 
            - **Title**: Bold H3 font, black.
            - **Excerpt**: 2-3 lines of descriptive text in gray.
            - **Meta**: "OLEH [AUTHOR]" (Author name in **Accent Color**) and "[DATE]" (Date in gray).
    - **Navigation**: Centered pagination arrows (Prev/Next) at the bottom section for horizontal scrolling if implemented as a slider.

- **Category Sections (Row-based)**: [Reference: `home-categories-recent-post.png`]
    - **Category Header**: Title (e.g., "Esai") on the left, "Lihat Semua" link on the right.
    - **Post Cards**: Horizontal row of 3-4 posts or a mixed layout (1 medium + list).
- **Featured 2 Category Grid (Grid-based)**: [Reference: `home-futured-category-2.png`]
    - Square or rectangular tiles with a background category image and centered title overlay.

### 3. Archive / Category Page (`Archive`) [Reference: `list-posts.png`]
- **Taxonomy Header**: Large title for the category/tag with a short descriptive text.
- **Post List (Vertical)**:
    - **Layout**: Image on the left (rounded corners), metadata and content on the right.
    - **Elements**: 
        - Category label (**Accent Color**/black pill).
        - Title (H2, bold).
        - Summary/Excerpt (limited to 3 lines).
        - "BACA SELENGKAPNYA" button (outline style using **Accent Color**).
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

### 5. Global Footer (`ThemeFooter`)
- **Background**: **Primary Color** (Dongker).
- **Text Color**: White (`#FFFFFF`) with secondary text in light gray (`#CCCCCC`).
- **Layout Structure**:
    - **Branding & Socials (Column 1)**:
        - **Logo**: News theme logo in **Accent Color**.
        - **Quote/About**: A brief "About Us" or vision statement (e.g., "Mojok.co: Sedikit Nakal, Banyak Akal").
        - **Social Links**: Circular icons for IG, X, FB, TikTok, YT (White icons, **Accent Color** highlight on hover).
    - **Navigation Links (Columns 2-4)**:
        - Column 2: "RUBRIK" (List of major categories).
        - Column 3: "INFORMASI" (Tentang Kami, Redaksi, Pedoman Media Siber, dsb).
        - Column 4: "PRODUK" (Newsletter, Karir, Kontak).
    - **Newsletter Section (Column 5/Right)**:
        - Heading: "Berlangganan Newsletter".
        - Input: Glassmorphism-style email input.
        - Button: **Accent Color** button labeled "DAFTAR".
- **Bottom Bar**:
    - Copyright text.
    - "Back to Top" button (**Accent Color** highlight).
    - Thin separator line (`border-top: 1px solid rgba(255,255,255,0.1)`).

---

## 📱 Mobile-First Experience
Aligned with our "Mobile First" philosophy, all components are optimized for touch interaction and vertical readability.

### 1. Mobile Global Layout
- **Header**:
    - Sticky top behavior with semi-transparent **Primary Color** background (glassmorphism).
    - **Logo**: Centered, scaled down for smaller screens.
    - **Hamburger Menu**: Icon on the right that triggers a slide-out navigation drawer.
    - **Search Icon**: Dedicated icon toggles a full-screen search overlay.
- **Navigation Drawer**:
    - High-contrast background using **Primary Color**.
    - Large tap targets for menu items.
    - Social Media icons and CTA button ("Kirim Artikel") pinned to the bottom.

### 2. Card-based Listings
- **Philosophy**: To ensure a premium feel on mobile, all post lists (Home, Archive, Latest) use a **Card** layout.
- **Card Design**:
    - **Container**: White card with a very subtle shadow or 1px border.
    - **Vertical Stack**: Featured image (16:9 ratio) sits at the top, content follows below.
    - **Visual Details**: **Accent Color** author names and category pills are more prominent for touch visibility.
- **Hero Stacking**: Featured posts that were side-by-side on PC are stacked vertically, maintaining clear hierarchy.

### 3. Touch Interactions
- **Horizontal Sliders**: Sections like "Featured Category" implement **Snap-Scrolling** (overflow-x) to save vertical space. Users can swipe left/right to browse items.
- **Micro-transitions**: Visual feedback on card tap (slight scale down).

### 4. Mobile Footer
- **Layout**: Stacked single-column hierarchy.
- **Collapsible Rubrics**: Links categories (Rubrik, Informasi, produk) are **Accordions** that expand when tapped, keeping the initial footer height compact.

---

## ⚙️ Theme Options
Registers a list of configurable settings in the Admin Panel, now organized by Groups.

| Group | Option ID | Label | Type | Description |
|---|---|---|---|---|
| **Identity** | `theme_news_cta_text` | Header CTA Text | `text` | Label for the **Accent Color** header button (e.g., "Kirim Artikel"). |
| **Identity** | `theme_news_cta_url` | Header CTA URL | `url` | Destination URL for the header button. |
| **Colors** | `theme_news_primary_color` | Primary Color | `color` | Main theme color (Header/Nav background). |
| **Colors** | `theme_news_accent_color` | Accent Color | `color` | Primary accent color for highlights and buttons. |
| **Social Media** | `site_contacts` | Contact Links | `contacts` | Dynamic list of social and contact links (Managed via Global Contacts group). |
| **Homepage** | `theme_news_hero_post` | Hero Featured Post | `post` | Main post displayed in the hero section. |
| **Homepage** | `theme_news_home_cat_1` | Featured Category 1 | `select` | First category displayed on the home page rows. |
| **Homepage** | `theme_news_home_cat_2` | Featured Category 2 | `select` | Second category displayed on the home page rows. |
| **Homepage** | `theme_news_home_grid_cats` | Grid Categories | `text` | Comma-separated category IDs for the grid section. |

> [!NOTE]
> Global settings (Site Title, Tagline, URL, and Pagination) will also be managed within this interface under the **General** and **Identity** groups.

---

## 🚀 Design Polish (Antigravity Touch)
- **Micro-animations**: Subtle scale-up on post card hover.
- **Responsive Navigation**: Smooth mobile menu slide-in from the right/left drawer.
- **Loading States**: 
    - **Skeleton Loaders**: Gray pulse effects for cards and text blocks while data is fetching.
    - **Blur-up Effect**: Images should display a low-resolution placeholder or a solid **Primary Color** block before fully loading to prevent jarring layout shifts.
- **Performance Optimization**:
    - **Lazy Loading**: All images below the initial viewport MUST use native `loading="lazy"`.
    - **Priority Loading**: Hero/Featured images at the top of the page should use `loading="eager"` or `fetchpriority="high"` for optimal LCP.
    - **Next-Gen Formats**: Support for WebP/AVIF and responsive image sets (`srcset`) to serve the best size for the user's device.
- **Empty States**: Beautifully designed "No Posts Found" illustrations for Archive/Search.
