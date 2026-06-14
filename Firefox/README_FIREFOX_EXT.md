# GitHub Resizer - AMO listing copy

Short, copy-pasteable text for the [addons.mozilla.org](https://addons.mozilla.org/developers/) listing of GitHub Resizer.

AMO does **not** render images, tables, code fences or headings inside the extension description - only basic markdown (bold, italic, lists, links, blockquotes, inline `code`). The text below is written within those limits.

## Preview

![GitHub Resizer in action](https://raw.githubusercontent.com/R0GGER/firefox-github-resize/refs/heads/main/screenshots/screencast.gif)

<sub>The slider in action - GitHub pages reflow live as you drag, no reload needed.</sub>

![GitHub Resizer popup](https://raw.githubusercontent.com/R0GGER/firefox-github-resize/refs/heads/main/screenshots/image.png)

<sub>The toolbar popup, with the slider, presets and reset button.</sub>

> These images are hosted on GitHub for previewing this README. They are **not** part of the AMO description text below (AMO strips images), but can be uploaded separately as screenshots in the AMO dashboard - see the *Suggested screenshots* section.

---

## Summary  *(max ~250 characters, single line)*

Make GitHub pages as wide as *you* want - anywhere between the default 1280 px and your full screen, in 1 % steps. Slider in the toolbar, syncs across devices, no reload needed.

---

## Description  *(paste into the AMO "Description" field)*

GitHub Resizer puts a slider in your Firefox toolbar that lets you choose **exactly how wide** GitHub pages should be - anywhere between GitHub's native 1280 px layout and the full width of your browser window, in 1 % steps.

Most "wide GitHub" extensions are an on/off switch: either you get the default narrow layout, or you get the full screen. GitHub Resizer answers a different question: *how wide?* Pick 25 % for a comfortable reading width on a 4K monitor, 50 % on an ultrawide so code blocks stay readable, or 100 % to fill the entire screen.

**Features**

- Smooth slider from 0 % (default GitHub) to 100 % (full viewport) in 1 % steps.
- Quick presets: 25 %, 50 %, 75 %, 100 %.
- Live updates - your setting is applied to every open GitHub tab instantly, without a page reload.
- Cross-device sync - your chosen width follows you to other computers via your Firefox account (`storage.sync`), with a local fallback.
- Safe on small screens - on viewports up to 1280 px the extension does nothing, so GitHub looks identical to its default layout.
- Works on modern GitHub - also widens the inner content column on the new Primer-based GitHub pages, so the page doesn't end up wide-on-the-outside but narrow-in-the-middle.
- Keeps READMEs and other markdown content responsive instead of capping them at a fixed width.

**Where it works**

- `github.com` (repos, pull requests, issues, code view, README, etc.)
- `gist.github.com`

GitHub Enterprise and custom-domain GitHub installs are not currently supported.

**Permissions**

- *Access your data for github.com and gist.github.com* - needed to inject the CSS that widens the layout.
- *Storage* - needed to remember your chosen width and sync it across devices.

**Privacy**

No tracking, no analytics, no network requests. The only thing the extension ever stores is a single number between 0 and 100 - your chosen width - in Firefox's own storage. Nothing leaves your browser except via Firefox's built-in account sync (if you have it enabled).

---

## Suggested AMO categories

- Web Development
- Appearance

---

## Suggested AMO tags

`github`, `wide`, `width`, `layout`, `developer`, `productivity`

---

## Suggested screenshots  *(upload separately in the AMO dashboard)*

1. **The toolbar popup** - slider at e.g. 50 %, presets visible. *Caption: "Pick any width between default and full screen, in 1 % steps."*
2. **A wide GitHub repo page** - repo view at ~75 % on a wide monitor, so reviewers immediately see the effect. *Caption: "More content per row, less wasted space on big monitors."*
3. **A pull request / diff view at 100 %** - shows the full-viewport mode. *Caption: "Full-screen mode for side-by-side diffs."*
4. **A GitHub page on a smaller window** - proof that the layout is **unchanged** at ≤ 1280 px. *Caption: "Untouched on small screens - exactly the default GitHub layout."*

---

## Privacy policy text  *(if AMO asks for one)*

GitHub Resizer does not collect, transmit or share any personal data. The extension stores a single integer (the chosen width in percent, 0–100) in Firefox's `storage.local` and `storage.sync`. This value is used solely to apply your preferred page width on github.com and gist.github.com, and is only synchronised across your own devices through Firefox's built-in account sync. No data is sent to the developer or any third party.

---

## Source code

The full source code, including a detailed technical README, lives at: *(add your repository URL here, e.g. `https://github.com/<you>/github-resizer`)*

License: MIT.
