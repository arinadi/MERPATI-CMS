---
name: theme-design
description: Process for designing CMS themes based on mockups. Ensures consistency with THEME.md and optimizes layout for Merpati CMS components.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Theme Design Skill

This skill governs the transition from visual mockups (PNG/JPG) to a technical design specification (`design.md`) and subsequent implementation in Merpati CMS.

## 🎯 Protocol: Mockup Analysis

When given a mockup directory, follow these steps before writing any code:

1.  **Inventory**: List all files to understand the scope (Header, Home, Post List, Single Post, Footer).
2.  **Visual Audit**: Use `view_file` on images to identify:
    *   **Branding**: Primary/Accent colors and logo style.
    *   **Typography**: Headings vs. Body font styles.
    *   **Unique Components**: Non-standard widgets or unique layout structures.
3.  **Cross-Reference**: Map each image to a specific CMS component defined in `lib/themes.ts`.

## 📝 Design Specification Standard (`design.md`)

Every theme MUST have a `design.md` file located in the theme's root directory. It must contain:

### 1. Visual Identity
Specify hex codes for colors and font families for typography.

### 2. Page Layouts (with references)
For every page/component, describe the layout and explicitly reference the mockup filename.
*Example:* `### Hero Grid [Reference: home-hero.png]`

### 3. Theme Options Mapping
Identify which parts of the design should be user-configurable.
*Checklist for Options:*
- Logo and Branding.
- Social Media Links.
- CTA Button Labels and URLs.
- Featured Posts or Categories on the Home page.

## ⚠️ THEME.md Compliance

Design with these CMS rules in mind:

| Rule | Requirement |
|---|---|
| **SafeImage** | Design for fallback icons and foreign domain support. |
| **Path-based Pagination** | Ensure UI elements for pagination map to `/page/X`. |
| **Cache Awareness** | Include `cacheId` in the footer layout. |
| **Next.js 16+ Forms** | Use `next/form` for search operations. |
| **Purple Ban** | Do NOT use violet/purple colors unless explicitly requested. |

---

## 🛠️ Template: `design.md`

Use this structure when creating a new design specification:

```markdown
# [Theme Name] - Design Specification

## 🎨 Visual Identity
- Colors: ...
- Typography: ...

## 🏗️ Layout & Components
### Global (`ThemeLayout`) [Reference: header.png, footer.png]
...

### Homepage (`Home`) [Reference: home-main.png]
...

### Archive (`Archive`) [Reference: list.png]
...

### Single Post (`SinglePost`) [Reference: post.png]
...

## ⚙️ Theme Options
| ID | Label | Type | Description |
|---|---|---|---|
| ... | ... | ... | ... |
```
