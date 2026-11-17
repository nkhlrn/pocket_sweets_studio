(function () {
  var FAV_KEY = "pss_favorites_v1";

  function getFavorites() {
    try {
      var raw = localStorage.getItem(FAV_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleFavorite(id) {
    var list = getFavorites();
    var idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(id);
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
    updateFavBadge(list.length);
    return list.indexOf(id) >= 0;
  }

  function updateFavBadge(count) {
    var badge = document.getElementById("nav-fav-count");
    if (badge) badge.textContent = count;
  }

  function openZoomModal(title, subtitle, desc, imgSrc, isDessert) {
    var backdrop = document.getElementById("dessert-modal");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "dessert-modal";
      backdrop.className = "modal-backdrop";
      document.body.appendChild(backdrop);
    }

    var recordBtn = isDessert
      ? '<a class="btn-cream" href="studio-log.html?dessert=' + encodeURIComponent(title) + '">寫入製作紀錄</a>'
      : "";

    backdrop.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true" style="max-width:880px;">' +
      '  <button class="modal-close" type="button" aria-label="關閉視窗">✕</button>' +
      '  <div style="text-align:center;margin-bottom:1.25rem;background:var(--color-cream-warm);padding:0.75rem;border-radius:var(--radius-md);border:1px solid var(--color-brass-gold);">' +
      '    <img src="' + imgSrc + '" alt="' + title + '" style="max-height:68vh;width:auto;max-width:100%;margin:0 auto;border-radius:var(--radius-sm);object-fit:contain;" />' +
      '  </div>' +
      '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem;">' +
      '    <div>' +
      '      <h2 style="font-family:var(--font-serif);margin:0 0 0.25rem;">' + title + '</h2>' +
      '      <p style="margin:0 0 0.5rem;color:var(--color-wood-light);font-style:italic;">' + subtitle + '</p>' +
      '      <p style="margin:0;max-width:60ch;">' + desc + '</p>' +
      '    </div>' +
      '    <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">' +
             recordBtn +
      '      <button class="btn-brass modal-return-btn" type="button">關閉返回</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    var closeModal = function () { backdrop.classList.remove("open"); };
    backdrop.classList.add("open");
    backdrop.querySelector(".modal-close").onclick = closeModal;
    backdrop.querySelector(".modal-return-btn").onclick = closeModal;
    backdrop.onclick = function (e) { if (e.target === backdrop) closeModal(); };
    document.onkeydown = function (e) { if (e.key === "Escape") closeModal(); };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.getElementById("nav-toggle-btn");
    var navList = document.getElementById("nav-links-list");
    if (toggleBtn && navList) {
      toggleBtn.addEventListener("click", function () {
        navList.classList.toggle("open");
      });
    }

    var favs = getFavorites();
    updateFavBadge(favs.length);

    // 作品／場景／製作步驟卡片放大與收藏
    var cards = document.querySelectorAll(".showcase-card[data-title], .step-box[data-title]");
    cards.forEach(function (card) {
      var id = card.getAttribute("data-id") || "";
      var title = card.getAttribute("data-title") || "";
      var subtitle = card.getAttribute("data-subtitle") || "";
      var desc = card.getAttribute("data-desc") || "";
      var imgSrc = card.getAttribute("data-img") || "";
      var isDessert = card.getAttribute("data-kind") === "dessert";

      var favBtn = card.querySelector(".fav-toggle");
      if (favBtn && id) {
        if (favs.indexOf(id) >= 0) {
          favBtn.classList.add("is-fav");
          favBtn.textContent = "♥";
        }
        favBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var nowFav = toggleFavorite(id);
          favBtn.classList.toggle("is-fav", nowFav);
          favBtn.textContent = nowFav ? "♥" : "♡";
        });
      }

      var openFn = function () { openZoomModal(title, subtitle, desc, imgSrc, isDessert); };
      var media = card.querySelector(".showcase-card__media, img");
      var detailBtn = card.querySelector(".detail-btn");
      if (media) {
        media.style.cursor = "zoom-in";
        media.addEventListener("click", openFn);
      }
      if (detailBtn) detailBtn.addEventListener("click", openFn);
    });

    // 甜點製作日誌：四種甜點獨立選擇切換
    var logTabs = document.querySelectorAll("[data-process-target]");
    var logPanels = document.querySelectorAll(".process-panel");
    if (logTabs.length && logPanels.length) {
      logTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = tab.getAttribute("data-process-target");
          logTabs.forEach(function (t) { t.classList.remove("active"); });
          tab.classList.add("active");
          logPanels.forEach(function (panel) {
            if (target === "all" || panel.getAttribute("data-process-id") === target) {
              panel.style.display = "";
            } else {
              panel.style.display = "none";
            }
          });
        });
      });
    }
  });
})();
