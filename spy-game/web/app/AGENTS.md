# App conventions

- Keep page and component styles alongside their markup using scoped `styled-jsx`. The registry in `registry.tsx` renders those styles on the server.
- Reserve `globals.css` for shared theme, fonts, and base styles.
- Use `components/Button.tsx` for button actions. It supports `filled` and `outlined` variants, `small`, `medium`, and `large` sizes, and `primary` and `danger` colors. Defaults are `filled`, `medium`, and `primary`.
- SVG imports are React components via SVGR; use `currentColor` in SVG assets when they need to inherit their color.
