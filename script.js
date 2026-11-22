const root = document.documentElement;
const themes = ["dark", "light", "blue"];
const themeToggle = document.querySelector(".theme-toggle");
const themeMenu = document.querySelector(".theme-menu");
const themeOptions = document.querySelectorAll("[data-theme-option]");

const applyTheme = (theme) => {
  if (!themes.includes(theme)) theme = "dark";
  root.dataset.theme = theme;
  themeOptions.forEach((opt) => opt.setAttribute("aria-checked", opt.dataset.themeOption === theme));
};

const savedTheme = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
applyTheme(savedTheme);

const setMenuOpen = (open) => {
  themeMenu.hidden = !open;
  themeToggle.setAttribute("aria-expanded", open);
};

themeToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  setMenuOpen(themeMenu.hidden);
});

themeOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    applyTheme(opt.dataset.themeOption);
    try { localStorage.setItem("theme", opt.dataset.themeOption); } catch {}
    setMenuOpen(false);
  });
});

document.addEventListener("click", (e) => {
  if (!themeMenu.hidden && !themeMenu.contains(e.target)) setMenuOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenuOpen(false);
});

document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + "ms";
  observer.observe(el);
});

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / 1600, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

const typed = document.querySelector(".typed");
if (typed) {
  const words = typed.dataset.words.split(",");
  let wordIdx = 0, charIdx = words[0].length, deleting = false;
  const type = () => {
    const word = words[wordIdx];
    charIdx += deleting ? -1 : 1;
    typed.textContent = word.slice(0, charIdx);
    let delay = deleting ? 50 : 100;
    if (!deleting && charIdx === word.length) { deleting = true; delay = 1800; }
    else if (deleting && charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; delay = 300; }
    setTimeout(type, delay);
  };
  setTimeout(() => { deleting = true; type(); }, 2200);
}

// GitHub-Buttons ohne eingetragenen Link werden deaktiviert
document.querySelectorAll("[data-github]").forEach((link) => {
  if (link.getAttribute("href")) return;
  link.removeAttribute("href");
  link.classList.add("is-disabled");
  link.setAttribute("aria-disabled", "true");
  const label = link.querySelector(".label");
  if (label) label.textContent = "Repository folgt";
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project").forEach((p) => {
      p.classList.toggle("hidden", f !== "all" && p.dataset.cat !== f);
    });
  });
});

// Eingebettete Demos anhalten / fortsetzen
document.querySelectorAll("[data-demo-toggle]").forEach((btn) => {
  const frame = document.getElementById(btn.dataset.demoToggle);
  if (!frame) return;
  btn.addEventListener("click", () => {
    const paused = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", paused);
    btn.textContent = paused ? "▶ Fortsetzen" : "⏸ Anhalten";
    frame.contentWindow.postMessage({ type: "hans-pause", paused }, "*");
  });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
