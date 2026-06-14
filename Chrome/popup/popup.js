(() => {
  "use strict";

  const STORAGE_KEY = "widthPercent";
  const MIN = 0;
  const MAX = 100;
  const DEFAULT = 0;

  const slider = document.getElementById("slider");
  const valueText = document.getElementById("valueText");
  const modeText = document.getElementById("modeText");
  const incBtn = document.getElementById("increment");
  const decBtn = document.getElementById("decrement");
  const resetBtn = document.getElementById("reset");
  const presetBtns = document.querySelectorAll(".preset");

  const describe = (v) => {
    if (v === 0) return "GitHub default";
    if (v === 100) return "Full viewport";
    if (v <= 33)   return "Slightly wider";
    if (v <= 66)   return "Comfortably wide";
    return "Almost full width";
  };

  const clamp = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return DEFAULT;
    return Math.min(MAX, Math.max(MIN, Math.round(v)));
  };

  const render = (value) => {
    const v = clamp(value);
    slider.value = String(v);
    valueText.textContent = String(v);
    if (modeText) modeText.textContent = describe(v);
    incBtn.disabled = v >= MAX;
    decBtn.disabled = v <= MIN;
    presetBtns.forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.preset) === v);
    });
    document.documentElement.style.setProperty("--fill", `${v}%`);
  };

  // Write to both local (instant, always available) and sync
  // (cross-device via the Chrome account). allSettled so a failure
  // on one storage area never blocks the other.
  const save = async (value) => {
    const v = clamp(value);
    render(v);
    const payload = { [STORAGE_KEY]: v };
    const results = await Promise.allSettled([
      chrome.storage.local.set(payload),
      chrome.storage.sync.set(payload),
    ]);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const area = i === 0 ? "local" : "sync";
        console.warn(`GitHub Resizer: storage.${area} set failed`, r.reason);
      }
    });
  };

  // Prefer sync (cross-device truth); fall back to local; fall back to DEFAULT.
  const load = async () => {
    const [syncRes, localRes] = await Promise.allSettled([
      chrome.storage.sync.get(STORAGE_KEY),
      chrome.storage.local.get(STORAGE_KEY),
    ]);
    const sync  = syncRes.status  === "fulfilled" ? syncRes.value[STORAGE_KEY]  : undefined;
    const local = localRes.status === "fulfilled" ? localRes.value[STORAGE_KEY] : undefined;
    const v = sync != null ? sync : (local != null ? local : DEFAULT);
    render(v);
  };

  slider.addEventListener("input", (e) => save(e.target.value));
  incBtn.addEventListener("click", () => save(Number(slider.value) + 1));
  decBtn.addEventListener("click", () => save(Number(slider.value) - 1));
  resetBtn.addEventListener("click", () => save(DEFAULT));
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => save(Number(btn.dataset.preset)));
  });

  // Sync when the value changes elsewhere (other window, another device)
  chrome.storage.onChanged.addListener((changes, area) => {
    if ((area === "local" || area === "sync") && changes[STORAGE_KEY]) {
      render(changes[STORAGE_KEY].newValue);
    }
  });

  load();
})();
