# Library Reference: Handlebars

## Overview
- **Library**: Handlebars.js — Logic-less semantic templating engine
- **Version**: ^4.7.8
- **Purpose**: Render public page themes (HTML output from `.hbs` templates)
- **NPM**: `handlebars`

## Installation
```bash
pnpm add handlebars
```

## Core API

### Compile & Render
```typescript
import Handlebars from 'handlebars';

const source = '<h1>{{title}}</h1><p>{{{content}}}</p>';
const template = Handlebars.compile(source);
const html = template({ title: 'Hello', content: '<strong>World</strong>' });
// → '<h1>Hello</h1><p><strong>World</strong></p>'
```

### `{{variable}}` vs `{{{variable}}}`
- `{{var}}` — HTML-escaped output (safe)
- `{{{var}}}` — Raw HTML output (for post content that's already sanitized)

### Partials
```typescript
Handlebars.registerPartial('header', '<header>{{siteName}}</header>');
// In template: {{> header}}
```

### Helpers
```typescript
Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});
// In template: {{formatDate published_at}}  → "28 Februari 2026"
```

### Built-in Helpers
| Helper | Usage | Description |
|---|---|---|
| `{{#if condition}}` | Conditional block | Render if truthy |
| `{{#unless condition}}` | Inverse conditional | Render if falsy |
| `{{#each array}}` | Loop | Iterate over array, access `this` |
| `{{#with object}}` | Context switch | Change `this` to object |
| `{{@index}}` | Inside `#each` | Current 0-based index |
| `{{@first}}` / `{{@last}}` | Inside `#each` | Boolean flags |

### Precompilation (for performance)
```typescript
// Precompile at build time or on first request, cache the result
const precompiled = Handlebars.precompile(source);
// Store precompiled string, execute later with Handlebars.template()
```

## MERPATI-CMS Custom Helpers

```typescript
// Planned custom helpers for themes

Handlebars.registerHelper('formatDate', (date, format) => { ... });
Handlebars.registerHelper('truncate', (text, length) => { ... });
Handlebars.registerHelper('readingTime', (content) => { ... });
Handlebars.registerHelper('slugify', (text) => { ... });
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('json', (obj) => JSON.stringify(obj));
Handlebars.registerHelper('year', () => new Date().getFullYear());
```

## Configuration Options
| Option | Default | Description |
|---|---|---|
| `noEscape` | `false` | If true, `{{}}` won't HTML-escape |
| `strict` | `false` | If true, throws on missing variables |
| `preventIndent` | `false` | Prevent partial indentation |

## Known Caveats
- **No complex logic** — by design. No `if x > 5`. Use helpers for logic.
- **No async helpers** — all helpers must be synchronous. Pre-fetch all data before render.
- **`{{{triple}}}` is NOT sanitized** — only use on content already cleaned by DOMPurify.
- **Whitespace sensitive** — `{{~var~}}` trims whitespace around output.
- **Error messages can be vague** — typos in template variable names fail silently (render empty).
