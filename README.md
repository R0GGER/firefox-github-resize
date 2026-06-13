# GitHub Resizer

**Firefox extension** that widens GitHub pages between the native **1280 px default** and the **full viewport**, in **1% steps**. The chosen value is persisted in both `browser.storage.local` and `browser.storage.sync`, so it follows you across devices when you are signed into a Firefox account.

>  In short: the existing extensions answer the question *"narrow or full width?"*. **GitHub Resizer** answers *"how wide?"*.

![GitHub Resizer in action](screenshots/screencast.gif)

<sub>The toolbar popup, with the slider, presets and reset button.</sub>

![GitHub Resizer popup](screenshots/image.png)



---

## What it does

GitHub's main container (`.container-xl`) is capped at 1280 px. On a 1440p or 4K monitor that leaves huge empty margins on the left and right of every repo, PR, issue and code view.

GitHub Resizer adds a slider to the Firefox toolbar that lets you smoothly choose any width between GitHub's native default and the full width of your browser window - not just "on" or "off". The page reflows live, without a reload, on every open GitHub/Gist tab.

The slider value is interpreted as *"how much of the extra space above the 1280 px default should be used"*:

```
width = max(1280px, 1280px + slider/100 * (viewport - 1280px))
```

| Slider | 1280 px viewport | 1920 px viewport | 3840 px viewport |
| --- | --- | --- | --- |
| 0%   | 1280 (default)        | 1280 (default)   | 1280 (default)   |
| 25%  | 1280 (viewport bound) | 1440             | 1920             |
| 50%  | 1280 (viewport bound) | 1600             | 2560             |
| 100% | 1280 (viewport bound) | 1920 (full)      | 3840 (full)      |

On viewports up to 1280 px the extension produces **exactly the same layout as default GitHub** - no narrowing, no crushed sidebars, no visual change at all.

---

## How it differs from other "Wide GitHub" extensions

There are several existing extensions in the same space. All of them are essentially a binary on/off toggle: either GitHub's max-width is removed entirely, or it isn't. GitHub Resizer takes a different approach.

| Feature | **GitHub Resizer** | [Wide GitHub](https://addons.mozilla.org/firefox/addon/widegithub/)¹ | [Wide GitHub](https://addons.mozilla.org/firefox/addon/wide-github-chrome/)² | [Wider GitHub](https://addons.mozilla.org/firefox/addon/widergithub/)³ |
| --- | :---: | :---: | :---: | :---: |
| Width control | Yes, slider (0-100%) | On / off toggle | On / off toggle | Always on |
| Stays identical to default on ≤ 1280 px screens | Yes | – | – | – |
| Live updates, no reload | Yes | – | – | – |
| Cross-device sync (`storage.sync`) | Yes | – | – | – |
| Widens inner content column too [¹](#-why-this-matters) | Yes | Yes | Partial | – |
| Keeps README markdown responsive | Yes | – | – | – |
| GitHub Enterprise / custom TLDs | – | Yes | – | – |
| Toolbar UI | Slider + presets | Settings panel | Toggle button | – |

### When to pick which

In short: the existing extensions answer the question *"narrow or full width?"* pick Wide or Wider Github. **GitHub Resizer** answers *"how wide?"*.

### ¹ Why this matters

Think of a GitHub page as having two layers:

- the **outer page frame** (the part that hits 1280 px), and
- the **inner content column** (where the file list, README or pull-request actually lives).

Most "wide GitHub" extensions only stretch the outer frame. On GitHub's modern pages there is a *second*, separate width limit on the inner column, so the result is a wide header with a narrow column floating in the middle and lots of empty space around it — wide on the outside, narrow on the inside.

GitHub Resizer removes both limits, so the page actually fills the extra space the way you'd expect.

The technical reason this is fiddly: GitHub builds those modern pages with the Primer `<PageLayout>` component and ships it through CSS Modules, which means the class names carry a build-specific hash (e.g. `PageLayout-module__contentWrapper--abc123`) that changes on every release. The extension matches them by prefix so it keeps working across GitHub updates.

# Storage / Sync

The width is stored under the key `widthPercent` in both `browser.storage.local` (instant, always available) and `browser.storage.sync` (cross-device when signed into a Firefox account). On load, `sync` wins if it has a value, otherwise `local`, otherwise the default. Changes are pushed to every open GitHub tab without a reload via `storage.onChanged`.

Example of what is stored:

```json
{ "widthPercent": 50 }
```

## Defaults

| Setting | Value |
| --- | --- |
| Minimum | 0% (= default GitHub) |
| Maximum | 100% (= full viewport) |
| Step | 1% |
| Default | 0% (= GitHub default) |

## License

MIT.
