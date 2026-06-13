(() => {
  "use strict";

  const STYLE_ID = "github-resizer-style";
  const STORAGE_KEY = "widthPercent";
  const MIN = 0;
  const MAX = 100;
  const DEFAULT = 0;
  const GH_DEFAULT_PX = 1280; // GitHub's native .container-xl max-width

  const clamp = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return DEFAULT;
    return Math.min(MAX, Math.max(MIN, Math.round(v)));
  };

  /**
   * 1) .container-xl controls the outer page width (header + Layout).
   *    We set it to the user-selected percentage.
   * 2) Modern GitHub builds the repo page with Primer's <PageLayout>.
   *    Its content column has its own max-width via CSS modules
   *    (classes like "PageLayout-module__contentWrapper--xxx").
   *    Without unlocking those, the file-list column stays narrow
   *    even when the outer container is widened.
   */
  /*
   * The slider value (0..100) is interpreted as "how much extra width
   * to use above GitHub's native 1280px container":
   *   t = 0   -> default GitHub (1280px or viewport-bound)
   *   t = 0.5 -> halfway between default and the full viewport
   *   t = 1   -> full viewport (Wide GitHub behavior)
   *
   * width = max(1280px, 1280px + t * (100vw - 1280px))
   *
   * - When viewport <= 1280px, (100vw - 1280px) is negative, so the
   *   second argument of max() is < 1280px and 1280 wins. The actual
   *   rendered width is then viewport-bound (identical to default
   *   GitHub on small screens).
   * - When viewport > 1280px, the formula yields a width between
   *   1280px and the viewport, controlled linearly by the slider.
   */
  const buildCss = (percent) => {
    const t = clamp(percent) / 100;
    return `
      :root { --ghr-t: ${t}; }

      .container-xl,
      .container-lg,
      .container-md {
        max-width: max(${GH_DEFAULT_PX}px,
          calc(${GH_DEFAULT_PX}px + var(--ghr-t) * (100vw - ${GH_DEFAULT_PX}px))
        ) !important;
      }

      /*
       * Primer PageLayout: let the content column fill its grid cell.
       * Only above the native default so smaller viewports stay
       * identical to default GitHub.
       */
      @media (min-width: ${GH_DEFAULT_PX + 1}px) {
        [class*="PageLayout-module__contentWrapper"],
        [class*="PageLayout-module__content--"],
        [class*="prc-PageLayout-ContentWrapper"],
        [class*="prc-PageLayout-Content-"] {
          max-width: none !important;
          width: 100% !important;
        }
      }
    `;
  };

  const applyCss = (percent) => {
    const css = buildCss(clamp(percent));
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      el.type = "text/css";
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
  };

  /**
   * GitHub also gives the README/markdown body the `.container-lg`
   * class, so our width rule on .container-lg would constrain it and
   * stop it from filling its parent responsively. Strip that class
   * from any .markdown-body element.
   */
  const stripContainerLg = (root) => {
    if (!root || !root.querySelectorAll) return;
    const nodes = root.querySelectorAll(".markdown-body.container-lg");
    nodes.forEach((el) => el.classList.remove("container-lg"));
    if (root.nodeType === 1 &&
        root.classList?.contains("markdown-body") &&
        root.classList?.contains("container-lg")) {
      root.classList.remove("container-lg");
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) stripContainerLg(node);
      }
    }
  });

  // Prefer sync (cross-device truth) over local; fall back to DEFAULT.
  const loadWidth = async () => {
    const [syncRes, localRes] = await Promise.allSettled([
      browser.storage.sync.get(STORAGE_KEY),
      browser.storage.local.get(STORAGE_KEY),
    ]);
    const sync  = syncRes.status  === "fulfilled" ? syncRes.value[STORAGE_KEY]  : undefined;
    const local = localRes.status === "fulfilled" ? localRes.value[STORAGE_KEY] : undefined;
    return sync != null ? sync : (local != null ? local : DEFAULT);
  };

  const init = async () => {
    try {
      applyCss(await loadWidth());
    } catch (e) {
      applyCss(DEFAULT);
    }
    stripContainerLg(document);
  };

  // Live updates from the popup or another device, without a reload
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" && area !== "sync") return;
    if (changes[STORAGE_KEY]) {
      applyCss(changes[STORAGE_KEY].newValue);
    }
  });

  // Apply immediately at document_start; <head> may not exist yet,
  // so apply again once the DOM is ready to minimize FOUC.
  init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }

  // GitHub navigates with Turbo (SPA-like). New markdown-body nodes
  // can appear later in the DOM; catch them with an observer.
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
