---
id: "site-architecture"
title: "Pocket Sweets Studio 完整網站架構與設計規格"
category: "concept"
tags: ["網站架構", "設計規格", "法式復古", "微縮童話屋", "互動功能"]
status: "verified"
updated: "2026-11-17"
sources:
  - "AGENTS.md"
related:
  - "wiki/index.md"
  - "src/styles/tokens.css"
  - "src/data/desserts.schema.json"
  - "src/data/tutorials.schema.json"
  - "src/data/craft-log.schema.json"
---

# Pocket Sweets Studio（掌心甜點研究所）網站架構與設計規格

本文件依據 `AGENTS.md` 規範與「法式復古微縮甜點店（深色雕花木質家具、淡粉色櫃檯、黃銅玻璃展示櫃、暖黃色燈光、精緻微縮甜點）」視覺方向，規劃網站的頁面架構、導覽系統、互動功能、現有圖片素材配置原則及未來擴充機制。

---

## 1. 整體資訊架構（Information Architecture）

網站採 **多頁面靜態前端架構（Multi-Page / Modular ES Modules）**，以四大核心功能區對應五個主要頁面：

| 頁面名稱 | 檔案位置（預定） | 核心功能與內容定位 |
| :--- | :--- | :--- |
| **首頁（店舖大廳）** | `src/pages/index.html` | 展現法式復古微縮甜點店氛圍、品牌故事、精選黃銅展示櫃作品、最新教學入口與快速搜尋列。 |
| **甜點圖鑑與探索** | `src/pages/gallery.html` | 互動式甜點展示櫃：支援分類篩選（塔派、蛋糕、馬卡龍等）、比例尺篩選、難度星等、關鍵字搜尋與一鍵收藏。 |
| **知識庫與製作教學** | `src/pages/tutorials.html` | 教學列表與單篇教學詳情頁：包含成品簡介、材料／工具連結、分步驟圖解（Process 圖組）與失敗排除。 |
| **材料與工具百科** | `src/pages/encyclopedia.html` | 依 `wiki/materials/` 與 `wiki/tools/` 編譯之圖文百科，介紹樹脂黏土、UV 膠、丸棒、矽膠筆等特性與選購建議。 |
| **個人收藏與製作紀錄** | `src/pages/studio-log.html` | 個人微縮工作檯：檢視已收藏甜點清單，並透過 `localStorage` 新增、編輯與匯出個人「製作紀錄（Craft Log）」。 |

---

## 2. 導覽系統與視覺層次（Navigation & Visual Hierarchy）

### 2.1 頂部導覽列（Top Navbar）
- **視覺隱喻**：深色雕花胡桃木招牌橫樑（`--color-wood-dark`），搭配細緻黃銅金底線（`--color-brass-gold`）。
- **導覽項目（由左至右）**：
  1. **品牌標誌**：Pocket Sweets Studio 掌心甜點研究所（點擊回首頁）。
  2. **甜點圖鑑**（`gallery.html`）
  3. **製作教學**（`tutorials.html`）
  4. **材料工具**（`encyclopedia.html`）
  5. **我的工作檯**（`studio-log.html`，右側附帶即時收藏數量徽章）。
- **行動版（RWD）**：小螢幕收合為黃銅框線漢堡選單，展開時呈現奶油色抽屜式選單。

### 2.2 頁面內容層次
1. **首頁 Hero 區塊**：使用 `Background/` 中的法式復古甜點店全景圖作為主視覺，疊加暖黃色柔光漸層遮罩，確保淡粉色櫃檯與黃銅展示櫃細節清晰可見，上方放置襯線體標題與「進入甜點展示櫃」主要行動按鈕。
2. **黃銅玻璃展示櫃卡片（Showcase Card）**：
   - 外框採用 `--border-brass` 與微弱玻璃反光（`--glass-overlay`），底座為淡粉色或暖奶油木紋底襯。
   - 懸停（Hover）時觸發 `--shadow-brass-glow` 暖黃燈光微光效果。
3. **淡粉色櫃檯互動區（Patisserie Counter Bar）**：
   - 分類標籤列、搜尋框與篩選器採用淡粉色系（`--color-counter-pink`）作為柔和底色，搭配深木色文字，呼應店舖主視覺中的淡粉色櫃檯。

---

## 3. 互動功能規格（Interactive Features）

1. **即時搜尋與多維度篩選（`src/scripts/search-filter.js`）**
   - 支援依「甜點分類」、「微縮比例尺（1:12 / 1:6 / 1:24）」、「難度（1～5 星）」與「關鍵字（名稱、材料、標籤）」即時過濾 `src/data/desserts.json` 與 `tutorials.json`。
2. **甜點收藏清單（Favorites）**
   - 每張甜點卡片與教學頁皆提供愛心／書籤切換按鈕（可套用 `Declaration/` 裝飾按鈕素材）。
   - 狀態儲存於 `localStorage`（鍵名：`pss_favorites_v1`），跨頁面即時同步數量與已收藏狀態。
3. **個人製作紀錄（Craft Log，`src/data/craft-log.schema.json`）**
   - 使用者可針對任一甜點或自由項目新增製作紀錄：包含「作品名稱」、「製作日期」、「採用比例尺」、「實際使用材料」、「製作狀態（規劃中／製作中／已完成）」與「手作心得筆記」。
   - 支援 JSON 匯出與匯入備份，未來可直接對接後端資料庫。

---

## 4. 現有圖片素材對應與使用規範

依據專案現行素材分類（`Background/`、`Declaration/`、`Process/`），所有頁面在引用圖片時須遵守以下對應原則（**嚴禁覆蓋、刪除或重新生成既有圖片**）：

| 素材來源資料夾 | 網站用途與配置位置 | 技術與視覺處理建議 |
| :--- | :--- | :--- |
| **`Background/`** | 首頁 Hero 主視覺、全站奶油／木紋背景紋理、各頁頂部橫幅（Banner） | 作為背景時須搭配 `rgba(59, 40, 27, 0.35)` 或暖奶油漸層遮罩，確保前方文字對比度符合可讀性；大圖採用 `loading="lazy"` 與響應式 `object-fit: cover`。 |
| **`Declaration/`** | 網頁介面互動按鈕、邊框裝飾、分類徽章、分隔線圖騰 | 以 `<img>` 或 CSS `background-image` 嵌入按鈕與卡片角落裝飾，保留透明背景（PNG/WebP），尺寸依容器自適應縮放，不扭曲比例。 |
| **`Process/`** | 教學步驟圖解（手部操作微型蛋糕、工具使用場景）、首頁「手作過程精選」區塊 | 搭配步驟編號標籤與簡潔圖說卡片；點擊可開啟燈箱（Lightbox）檢視微縮細節。 |

> **素材清單對接機制**：待確認各資料夾內的實際檔名後，統一登記於 `assets/images/manifest.template.json`（正式使用時存為 `assets/images/manifest.json`），前端僅透過該清單索引圖片，不寫死未經確認的檔名。

---

## 5. 未來擴充架構（Extensibility）

1. **知識庫驅動內容（LLM Wiki → JSON）**：
   - 新增材料、工具或技法時，先依 `AGENTS.md` 寫入 `wiki/` 並更新 `wiki/index.md`；需要上線至網站的甜點圖鑑與教學，同步寫入 `src/data/desserts.json` 與 `src/data/tutorials.json` 即可自動渲染於網頁。
2. **元件化擴充**：
   - 共用導覽列、頁尾、展示櫃卡片與燈箱元件集中於 `src/components/`，新增頁面（如「季節限定特輯」或「微縮屋場景指南」）時只需引用既有元件與 `src/styles/tokens.css`。
3. **資料儲存平滑升級**：
   - `src/scripts/storage.js` 封裝所有讀寫介面（`getFavorites`、`saveCraftLog` 等），日後若需加入會員雲端同步，僅需替換儲存層實作，不影響頁面 UI 邏輯。
