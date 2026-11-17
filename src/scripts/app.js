/**
 * Pocket Sweets Studio — 頁面主控程式
 */
import { DESSERTS } from "./desserts-data.js";
import { renderHeader, renderFooter, createDessertCard, openDessertModal } from "./components.js";
import { getFavorites, getCraftLogs, addCraftLog, deleteCraftLog, updateCraftLogStatus } from "./storage.js";

const SHOP_SCENES = [
  {
    id: "scene-doorway-showcase",
    title: "法式門框與黃銅展示櫃",
    englishTitle: "Patisserie Entrance & Brass Showcase",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8320.PNG",
    summary: "從鼠尾草綠法式木門框望入店內，淡粉色櫃檯上的弧形黃銅玻璃展示櫃在暖燈下閃耀。"
  },
  {
    id: "scene-garden-door",
    title: "店內望向法式花園門扉",
    englishTitle: "Garden Doorway & Tea Tables",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8321.PNG",
    summary: "從甜點櫃後方望向敞開的雙扇花園木門，兩側木質圓桌擺滿午茶甜點與鮮花。"
  },
  {
    id: "scene-sunlit-window",
    title: "陽光窗邊午茶座位區",
    englishTitle: "Sunlit Window Tea Corner",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8322.PNG",
    summary: "晨光穿過法式格子窗灑落黑白菱格地磚，映照著鼠尾草綠絨面木椅與雕花大櫥櫃。"
  },
  {
    id: "scene-front-counter",
    title: "淡粉色櫃檯與雙層甜點櫥窗",
    englishTitle: "Pink Counter & Two-Tier Display",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8323.PNG",
    summary: "正面平視法式雕花淡粉色櫃檯與黃銅玻璃展示櫃，櫃頂陳列玻璃鐘罩與雙層草莓蛋糕。"
  },
  {
    id: "scene-high-angle-salon",
    title: "法式沙龍全景與午茶圓桌",
    englishTitle: "Grand Salon & Seating Area",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8324.PNG",
    summary: "高角度俯瞰整間微縮甜點店，完整展現木質圓桌、牆面壁燈、拱門層架與陳列櫃。"
  },
  {
    id: "scene-main-panorama",
    title: "微縮童話屋店舖主景",
    englishTitle: "Pocket Sweets Studio Panorama",
    scale: "店舖場景",
    coverImage: "../../assets/source/backgrounds/IMG_8288.PNG",
    summary: "融合深色雕花胡桃木櫥櫃、淡粉色主櫃檯與暖黃吊燈的法式復古甜點店完整全景。"
  }
];

function createSceneCard(scene) {
  const card = document.createElement("article");
  card.className = "showcase-card";
  card.innerHTML = `
    <div class="showcase-card__media" style="cursor:zoom-in;">
      <img src="${scene.coverImage}" alt="${scene.title}" loading="lazy" />
      <span class="showcase-card__scale">${scene.scale}</span>
    </div>
    <div class="showcase-card__body">
      <h3 class="showcase-card__title">${scene.title}</h3>
      <p class="showcase-card__desc">${scene.summary}</p>
      <div class="showcase-card__footer">
        <span style="color:var(--color-wood-light);font-size:0.8rem;">${scene.englishTitle}</span>
        <button class="pill-btn detail-btn" type="button">放大檢視</button>
      </div>
    </div>
  `;
  const openFn = () => openDessertModal(scene);
  card.querySelector(".detail-btn")?.addEventListener("click", openFn);
  card.querySelector(".showcase-card__media")?.addEventListener("click", openFn);
  return card;
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`無法載入 ${path}`);
  return res.json();
}

function initHome() {
  const scenesWrap = document.getElementById("home-scenes-showcase");
  if (!scenesWrap) return;
  scenesWrap.innerHTML = "";
  SHOP_SCENES.forEach((scene) => scenesWrap.appendChild(createSceneCard(scene)));
}

function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const countEl = document.getElementById("gallery-count");
  if (!grid) return;

  grid.innerHTML = "";
  if (countEl) countEl.textContent = `共展出 ${DESSERTS.length} 件微縮甜點成品（點擊任一圖片可放大檢視）`;
  DESSERTS.forEach((item) => grid.appendChild(createDessertCard(item, openDessertModal)));
}

async function initEncyclopedia() {
  const grid = document.getElementById("encyclopedia-grid");
  const filterBtns = document.querySelectorAll("#ency-pills .pill-btn");
  if (!grid) return;
  const items = await loadJSON("../data/encyclopedia.json");
  let activeType = "全部";

  function render() {
    const filtered = items.filter((i) => activeType === "全部" || i.type === activeType);
    grid.innerHTML = filtered
      .map(
        (i) => `
      <article class="showcase-card">
        <div class="showcase-card__media">
          <img src="${i.image}" alt="${i.name}" loading="lazy" />
          <span class="showcase-card__scale">${i.type}</span>
        </div>
        <div class="showcase-card__body">
          <div class="showcase-card__meta"><span class="tag-chip">${i.tag}</span></div>
          <h3 class="showcase-card__title">${i.name}</h3>
          <p class="showcase-card__desc">${i.summary}</p>
          <div style="padding-top:0.6rem;border-top:var(--border-wood);font-size:0.84rem;color:var(--color-wood-medium);">
            <strong>實用秘訣：</strong>${i.tips}
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeType = btn.dataset.type || "全部";
      render();
    });
  });
  render();
}

function initStudioLog() {
  const favGrid = document.getElementById("saved-desserts-grid");
  const logsWrap = document.getElementById("craft-logs-list");
  const form = document.getElementById("craft-log-form");
  const exportBtn = document.getElementById("export-logs-btn");
  if (!favGrid || !logsWrap || !form) return;

  const params = new URLSearchParams(window.location.search);
  const prefill = params.get("dessert");
  if (prefill) {
    const titleInput = document.getElementById("log-title");
    if (titleInput) titleInput.value = prefill;
  }

  function renderFavorites() {
    const favIds = getFavorites();
    const favItems = DESSERTS.filter((d) => favIds.includes(d.id));
    favGrid.innerHTML = "";
    if (favItems.length === 0) {
      favGrid.innerHTML = `<p style="color:var(--color-wood-medium);">尚未收藏任何甜點。前往<a href="gallery.html" style="text-decoration:underline;font-weight:600;">甜點展示櫃</a>點選愛心加入收藏吧！</p>`;
      return;
    }
    favItems.forEach((item) => favGrid.appendChild(createDessertCard(item, openDessertModal)));
  }

  function renderLogs() {
    const logs = getCraftLogs();
    if (logs.length === 0) {
      logsWrap.innerHTML = `<p style="color:var(--color-wood-medium);">目前還沒有手作紀錄，填寫左側表單記錄你的第一件微縮甜點作品吧！</p>`;
      return;
    }
    logsWrap.innerHTML = logs
      .map(
        (log) => `
      <div class="log-item">
        <div class="log-item__head">
          <strong style="font-family:var(--font-serif);font-size:1.05rem;">${log.title}</strong>
          <span class="status-pill">${log.status}</span>
        </div>
        <div style="font-size:0.82rem;color:var(--color-wood-light);margin-bottom:0.45rem;">
          比例：${log.scale} ｜ 紀錄時間：${new Date(log.createdAt).toLocaleDateString("zh-TW")}
        </div>
        ${
          log.usedMaterials.length
            ? `<div style="margin-bottom:0.45rem;">${log.usedMaterials.map((m) => `<span class="tag-chip" style="margin-right:0.35rem;">${m}</span>`).join("")}</div>`
            : ""
        }
        ${log.notes ? `<p style="margin:0 0 0.65rem;font-size:0.9rem;">${log.notes}</p>` : ""}
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <select class="select-vintage log-status-select" data-id="${log.id}" style="padding:0.25rem 0.55rem;font-size:0.82rem;">
            ${["規劃中", "製作中", "乾燥中", "已完成"]
              .map((s) => `<option value="${s}" ${log.status === s ? "selected" : ""}>${s}</option>`)
              .join("")}
          </select>
          <button class="pill-btn log-del-btn" data-id="${log.id}" type="button" style="font-size:0.8rem;">刪除</button>
        </div>
      </div>
    `
      )
      .join("");

    logsWrap.querySelectorAll(".log-del-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        deleteCraftLog(btn.dataset.id);
        renderLogs();
      });
    });

    logsWrap.querySelectorAll(".log-status-select").forEach((sel) => {
      sel.addEventListener("change", () => {
        updateCraftLogStatus(sel.dataset.id, sel.value);
        renderLogs();
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("log-title").value;
    if (!title.trim()) return;
    addCraftLog({
      title,
      scale: document.getElementById("log-scale").value,
      status: document.getElementById("log-status").value,
      usedMaterials: document.getElementById("log-materials").value,
      notes: document.getElementById("log-notes").value
    });
    form.reset();
    renderLogs();
  });

  exportBtn?.addEventListener("click", () => {
    const data = { favorites: getFavorites(), craftLogs: getCraftLogs(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pocket-sweets-studio-logs.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  window.addEventListener("pss:favorites-changed", renderFavorites);
  renderFavorites();
  renderLogs();
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "home";
  renderHeader(page);
  renderFooter();
  if (page === "home") initHome();
  if (page === "gallery") initGallery();
  if (page === "encyclopedia") initEncyclopedia();
  if (page === "studio-log") initStudioLog();
});
