/**
 * Pocket Sweets Studio — 共用 UI 元件模組
 */
import { getFavorites, isFavorite, toggleFavorite } from "./storage.js";

export function renderHeader(activePage) {
  const header = document.getElementById("site-header");
  if (!header) return;
  const favCount = getFavorites().length;
  const links = [
    { id: "home", href: "index.html", label: "店舖首頁" },
    { id: "gallery", href: "gallery.html", label: "甜點展示櫃" },
    { id: "process-log", href: "process-log.html", label: "甜點製作日誌" },
    {
      id: "studio-log",
      href: "studio-log.html",
      label: `我的工作檯 <span class="fav-badge" id="nav-fav-count">${favCount}</span>`
    }
  ];

  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="brand-logo">
        <span class="brand-logo__en">Pocket Sweets Studio</span>
        <span class="brand-logo__zh">掌心甜點研究所</span>
      </a>
      <button class="nav-toggle" aria-label="切換選單" id="nav-toggle-btn">☰</button>
      <ul class="nav-links" id="nav-links-list">
        ${links
          .map(
            (l) =>
              `<li><a href="${l.href}" class="${activePage === l.id ? "active" : ""}">${l.label}</a></li>`
          )
          .join("")}
      </ul>
    </div>
  `;

  const toggleBtn = document.getElementById("nav-toggle-btn");
  const navList = document.getElementById("nav-links-list");
  toggleBtn?.addEventListener("click", () => navList?.classList.toggle("open"));

  window.addEventListener("pss:favorites-changed", (e) => {
    const badge = document.getElementById("nav-fav-count");
    if (badge) badge.textContent = e.detail.length;
  });
}

export function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="site-footer__brand">Pocket Sweets Studio · 掌心甜點研究所</div>
      <p style="margin:0;">法式復古甜點店 × 微縮童話屋｜1:12 微縮甜點作品展示櫃與個人手作紀錄</p>
    </div>
  `;
}

export function createDessertCard(item, onOpenDetail) {
  const fav = isFavorite(item.id);
  const card = document.createElement("article");
  card.className = "showcase-card";
  card.innerHTML = `
    <div class="showcase-card__media" style="cursor:zoom-in;">
      <img src="${item.coverImage}" alt="${item.title}" loading="lazy" />
      <span class="showcase-card__scale">${item.scale}</span>
      <button class="fav-toggle ${fav ? "is-fav" : ""}" type="button" title="加入或移除收藏" aria-label="收藏 ${item.title}">
        ${fav ? "♥" : "♡"}
      </button>
    </div>
    <div class="showcase-card__body">
      <h3 class="showcase-card__title">${item.title}</h3>
      <p class="showcase-card__desc">${item.summary}</p>
      <div class="showcase-card__footer">
        <span style="color:var(--color-wood-light);font-size:0.8rem;">${item.englishTitle || ""}</span>
        <button class="pill-btn detail-btn" type="button">放大檢視</button>
      </div>
    </div>
  `;

  const favBtn = card.querySelector(".fav-toggle");
  favBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(item.id);
    favBtn.classList.toggle("is-fav", nowFav);
    favBtn.textContent = nowFav ? "♥" : "♡";
  });

  const openFn = () => onOpenDetail?.(item);
  card.querySelector(".detail-btn")?.addEventListener("click", openFn);
  card.querySelector(".showcase-card__media")?.addEventListener("click", openFn);
  return card;
}

export function openDessertModal(item) {
  let backdrop = document.getElementById("dessert-modal");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "dessert-modal";
    backdrop.className = "modal-backdrop";
    document.body.appendChild(backdrop);
  }

  backdrop.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" style="max-width:880px;">
      <button class="modal-close" type="button" aria-label="關閉回到展示櫃" title="關閉回到展示櫃">✕</button>
      <div style="text-align:center;margin-bottom:1.25rem;background:var(--color-cream-warm);padding:0.75rem;border-radius:var(--radius-md);border:1px solid var(--color-brass-gold);">
        <img src="${item.coverImage}" alt="${item.title}" style="max-height:68vh;width:auto;max-width:100%;margin:0 auto;border-radius:var(--radius-sm);object-fit:contain;" />
      </div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem;">
        <div>
          <h2 style="font-family:var(--font-serif);margin:0 0 0.25rem;">${item.title}</h2>
          <p style="margin:0 0 0.5rem;color:var(--color-wood-light);font-style:italic;">${item.englishTitle || ""} · ${item.scale}</p>
          <p style="margin:0;max-width:60ch;">${item.summary}</p>
        </div>
        <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
          <a class="btn-cream" href="studio-log.html?dessert=${encodeURIComponent(item.title)}">寫入製作紀錄</a>
          <button class="btn-brass modal-return-btn" type="button">關閉回到展示櫃</button>
        </div>
      </div>
    </div>
  `;

  const closeModal = () => backdrop.classList.remove("open");
  backdrop.classList.add("open");
  backdrop.querySelector(".modal-close")?.addEventListener("click", closeModal);
  backdrop.querySelector(".modal-return-btn")?.addEventListener("click", closeModal);
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
  document.onkeydown = (e) => {
    if (e.key === "Escape") closeModal();
  };
}
