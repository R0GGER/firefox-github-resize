# GitHub Resizer - Chrome

Chrome / Chromium port of the Firefox extension in `../Firefox`. Same UI, same behaviour, same `widthPercent` storage key.

## Load unpacked (development)

1. Open `chrome://extensions`.
2. Toggle **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select this `Chrome/` folder.
5. Pin the extension via the puzzle icon in the toolbar.

The popup behaves identically to the Firefox version: slider, presets, +/- steps, reset. Open any `github.com` or `gist.github.com` page and the layout reflows live as you drag.

## Differences vs. the Firefox build

The functional code is unchanged; only the platform glue differs.

| Area | Firefox | Chrome |
| --- | --- | --- |
| Extension API namespace | `browser.*` | `chrome.*` |
| `manifest.json` `browser_specific_settings` | required (`gecko.id`) | removed (Chrome rejects unknown keys silently) |
| `manifest.json` `action.theme_icons` | supported | removed (Firefox-only) |
| Icons | SVG accepted everywhere | PNGs declared at 16/32/48/128 |

Everything else (`content/content.js`, `popup/popup.html`, `popup/popup.css`, the storage-sync fallback logic, the Primer `PageLayout` selectors, the `.container-lg` stripping for `.markdown-body`) is byte-for-byte the same as the Firefox version.

## Package for the Chrome Web Store

```
cd Chrome
zip -r ../github-resizer-chrome.zip . -x "*.md" "web-ext-artifacts/*"
```

Upload `github-resizer-chrome.zip` in the Chrome Web Store Developer Dashboard.

## Permissions

- `storage` - remember and sync the chosen width.
- Host access to `github.com` and `gist.github.com` - inject the CSS that widens the layout.

No background service worker, no network requests, no analytics.
