# Theme Design - Audit Checklist

Use this checklist to verify a `design.md` file before proceeding to implementation.

## 1. Visual Specification
- [ ] Primary, Secondary, and Accent colors are defined with Hex codes.
- [ ] Typography pairings are specified for Headings and Body.
- [ ] Checks for "Purple Ban" compliance.

## 2. Mockup References
- [ ] All major UI sections have a corresponding mockup filename reference.
- [ ] Each referenced file exists in the mockup directory.
- [ ] Images have been visually analyzed using `view_file`.

## 3. Merpati CMS Integration
- [ ] `ThemeLayout` includes `cacheId` in the design.
- [ ] `SafeImage` is mentioned for all dynamic imagery.
- [ ] Pagination follows path-based logic (`/page/X`).
- [ ] Search form is designed for `next/form` compatibility.

## 4. Theme Options
- [ ] Options table includes `ID`, `Label`, `Type`, and `Description`.
- [ ] Option types are valid (`text`, `textarea`, `number`, `url`, `select`, `post`, `image`).
- [ ] Critical branding elements (logo, social) are configurable.

## 5. Components Scope
- [ ] `Home` layout is defined (if applicable).
- [ ] `Archive` page structure is described.
- [ ] `SinglePost` typography and sidebar are planned.
- [ ] `NotFound` page (404) is either planned or default mentioned.
