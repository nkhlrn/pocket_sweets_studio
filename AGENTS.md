# AGENTS.md — Pocket Sweets Studio（掌心甜點研究所）專案開發與知識庫維護規範

> 本文件為 **Pocket Sweets Studio（掌心甜點研究所）** 專案的核心架構規範（Schema），參考 [Andrej Karpathy 提出的 LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 概念設計，作為後續所有 AI 代理（Coding Agent / Knowledge Agent）在本專案中進行**知識管理、內容擴充與網站程式開發**時必須嚴格遵守的最高準則。

## 1. 專案願景與核心雙主軸

**Pocket Sweets Studio（掌心甜點研究所）** 是一個結合**微縮工藝知識庫**與**互動式探索體驗**的微縮甜點主題網站：

1. **微縮甜點知識與教學（Knowledge & Tutorials）**

   * 系統化整理微縮甜點的基礎概念（如 1:12 / 1:6 比例尺、微縮光影）、製作材料、專用工具、表面質感技巧與完整步驟教學。

2. **互動式甜點探索（Interactive Discovery）**

   * 提供可瀏覽與篩選的甜點圖鑑、作品分類、即時搜尋、個人收藏清單，以及瀏覽器端（或後續擴充後端）的個人製作紀錄（Craft Log）。

## 2. 視覺與體驗設計規範（Visual & UX Direction）

本網站的視覺定位為「法式復古甜點店（French Vintage Patisserie）」與「微縮童話屋（Miniature Dollhouse）」的結合。所有 UI 元件、版面配置與文案語氣皆須呼應以下美學：

* **色彩基調（定義於 `src/styles/tokens.css`）**：

  * **奶油色牆面（Cream Wall）**：溫潤的象牙白與淡奶油色作為主背景（`#FAF5EC`、`#F3E9D8`），避免刺眼的純白（`#FFFFFF`）。

  * **復古木質家具（Vintage Wood）**：深胡桃木與暖焦糖木色用於導覽列、卡片底座與分隔結構（`#4A3525`、`#6E4F3A`）。

  * **黃銅展示櫃（Brass Showcase）**：細緻的霧面黃銅金邊框、徽章與互動按鈕描邊（`#C59B48`、`#DFBE76`）。

  * **溫暖燈光（Warm Lighting）**：柔和的琥珀色光暈與暖色系陰影（`rgba(218, 165, 92, 0.18)`），營造玻璃櫃內打燈的溫馨氛圍。

  * **甜點點綴色（Patisserie Accents）**：覆盆子粉、開心果綠、焦糖栗子、藍莓墨色，僅用於標籤與狀態提示。

* **字體與排版**：

  * 標題使用帶有法式優雅感的襯線體（Serif），內文使用清晰易讀的繁體中文無襯線體（Sans-serif），比例尺與數據可使用等寬字體（Monospace）。

* **互動隱喻**：

  * 甜點圖鑑卡片應如「黃銅玻璃展示櫃中的微縮陳列」，具備細緻的懸停微光（Hover Glow）與層次感。

  * 教學與製作紀錄應如「手工烘焙筆記本與工作檯」。

## 3. 專案架構：三層式 LLM Wiki ＋ 網站應用層

參考 Andrej Karpathy 的 **LLM Wiki** 模式，本專案將「知識累積」與「網站呈現」分離又互通，避免每次查詢或開發都從零拼湊資訊：

```
pocket-sweets-studio/
├── AGENTS.md                 # 【Schema 層】本規範文件：定義架構、規則與工作流
├── README.md                 # 專案總覽與快速指南
├── raw/                      # 【Layer 1：原始資料層】不可變的第一手資料（AI 只讀不改）
│   ├── articles/             # 外部教學文章、參考資料原文
│   ├── inspirations/         # 法式復古與微縮童話屋視覺靈感筆記
│   ├── materials-specs/      # 黏土、樹脂、顏料原廠說明與規格
│   └── workshop-notes/       # 創作者原始手作紀錄與配方草稿
├── wiki/                     # 【Layer 2：LLM 知識庫層】AI 全權維護的互聯 Markdown 知識圖譜
│   ├── index.md              # 全站知識目錄索引（分類條目＋單行摘要）
│   ├── log.md                # 唯增式（Append-only）時間軸操作日誌
│   ├── concepts/             # 核心概念（比例尺、美學風格、色彩理論）
│   ├── materials/            # 材料百科（樹脂黏土、輕黏土、UV 膠、色粉等）
│   ├── tools/                # 工具指南（丸棒、矽膠筆、微縮模具、筆刷等）
│   ├── techniques/           # 技法拆解（酥皮質感、糖霜淋面、烤色漸層等）
│   ├── tutorials/            # 完整步驟教學（對應網站教學文章）
│   └── desserts/             # 甜點圖鑑條目（對應網站甜點作品）
├── src/                      # 【Layer 3：網站應用層】前端程式碼與結構化資料
│   ├── pages/                # 頁面模板與視圖
│   ├── components/           # 可重用 UI 元件
│   ├── styles/               # 設計系統與樣式表（含 tokens.css）
│   ├── data/                 # 供前端讀取的結構化 JSON 資料與 Schema
│   └── scripts/              # 搜尋、分類、收藏、製作紀錄等前端互動邏輯
└── assets/                   # 靜態媒體資源（圖片、字型、SVG 裝飾）
    └── images/
        ├── desserts/
        ├── tutorials/
        └── ui/

```

### 各層權責鐵則

1. **`raw/` 為神聖不可變層（Source of Truth）**：AI 代理**只能讀取** `raw/` 中的檔案，**絕對不可修改或覆寫**原始資料。所有提煉、摘要與重整都必須寫入 `wiki/`。

2. **`wiki/` 由 AI 代理維護**：知識條目使用標準 Markdown 撰寫，透過雙向連結（如 `[[頁面名稱]]` 或相對路徑 `[名稱](../materials/resin-clay.md)`）建立知識關聯，並確保所有外部事實都有明確的來源引用。

3. **`src/data/` 為網站結構化投影**：網站前端不直接解析雜亂的 Markdown，而是讀取 `src/data/` 下符合 JSON Schema 的資料檔案（如 `desserts.json`、`tutorials.json`）。每當 `wiki/desserts/` 或 `wiki/tutorials/` 有重大更新時，AI 須同步更新對應的 JSON 資料。

## 4. LLM Wiki 三大核心維護工作流

所有 AI 代理在處理知識與內容時，必須依照以下三種標準操作執行：

### 4.1 Ingest（攝取與編譯）

當使用者提供新的原始資料（放入 `raw/`）或口述新知識時：

1. **讀取來源**：完整閱讀 `raw/` 中的新檔案，不更動原檔。

2. **拆解與寫入 `wiki/`**：將知識歸檔至對應子目錄（`materials/`、`tools/`、`techniques/`、`tutorials/`、`desserts/`）。單一來源可能同時更新多個條目（例如一篇草莓塔教學會同時更新「草莓塔」圖鑑條目與「派皮壓紋」技法頁面）。

3. **建立交叉連結與標註衝突**：在相關頁面補上雙向連結；若新資料與既有條目有矛盾（例如烤色溫度或乾燥時間不同），必須明確標註差異與各自來源，不可靜默覆寫。

4. **更新索引與日誌**：

   * 更新 `wiki/index.md`，加入新頁面的分類連結與單行摘要。

   * 在 `wiki/log.md` 頂部或底部依時間順序追加一筆紀錄（格式：`## [YYYY-MM-DD] ingest | <標題>`）。

### 4.2 Query（查詢與綜合）

當使用者針對微縮甜點知識提問或規劃新內容時：

1. **優先查閱 `wiki/index.md`**：先透過目錄定位相關頁面，再讀取該頁面內容，避免盲目搜尋整個專案。

2. **有根據的回答**：回答必須引用 `wiki/` 中的條目與 `raw/` 來源。

3. **知識沉澱**：若查詢產生了有價值的綜合比較（例如「三種奶油土的收縮率與透光性比較」），詢問或主動將其整理為新的 `wiki/concepts/` 或 `wiki/materials/` 頁面，並更新 `index.md` 與 `log.md`。

### 4.3 Lint（健康檢查與同步稽核）

定期或於大型改動後執行全庫檢查：

1. **連結完整性**：檢查 `wiki/` 內是否有斷裂連結（Broken Links）或沒有任何頁面連入的孤兒頁面（Orphan Pages）。

2. **目錄一致性**：比對 `wiki/index.md` 與 `wiki/` 實際檔案清單是否完全同步。

3. **前後端資料同步**：檢查 `wiki/desserts/`、`wiki/tutorials/` 與 `src/data/` 中的 JSON 資料是否一致，並驗證是否符合 `desserts.schema.json` 與 `tutorials.schema.json`。

4. **紀錄稽核結果**：於 `wiki/log.md` 追加一筆 `## [YYYY-MM-DD] lint | <檢查摘要>`。

## 5. Markdown 文件前置元資料規範（Frontmatter）

所有位於 `wiki/`（`index.md` 與 `log.md` 除外）的知識條目，頂部必須包含 YAML Frontmatter，以確保結構一致且易於程式化讀取：

```
---
id: "unique-kebab-case-id"
title: "條目繁體中文名稱"
category: "concept | material | tool | technique | tutorial | dessert"
tags: ["法式甜點", "樹脂黏土", "1:12"]
status: "draft | verified | published"
updated: "YYYY-MM-DD"
sources:
  - "raw/workshop-notes/example.md"
related:
  - "materials/resin-clay.md"
---

```

## 6. 未來擴充規範（新增頁面、作品與教學）

為確保專案隨時間成長仍保持整潔，未來新增項目時請遵循以下標準程序：

### 6.1 新增「甜點作品」（Dessert Entry）

1. 在 `wiki/desserts/<dessert-id>.md` 建立知識條目（含材料清單、比例尺、製作難度、靈感來源與相關技法連結）。

2. 將對應圖片放入 `assets/images/desserts/<dessert-id>/`（建議命名：`cover.webp`、`detail-01.webp`）。

3. 在 `src/data/desserts.json`（若尚未建立則依 `src/data/desserts.schema.json` 建立）新增一筆物件，確保 `id` 與圖片路徑正確。

4. 更新 `wiki/index.md` 與 `wiki/log.md`。

### 6.2 新增「教學內容」（Tutorial）

1. 若有原始筆記或參考資料，先存於 `raw/workshop-notes/` 或 `raw/articles/`。

2. 在 `wiki/tutorials/<tutorial-id>.md` 撰寫結構化教學（包含：成品簡介、所需材料連結、工具清單連結、分步驟說明、常見失敗排除）。

3. 步驟圖片放入 `assets/images/tutorials/<tutorial-id>/`。

4. 同步更新 `src/data/tutorials.json`（依 `src/data/tutorials.schema.json` 驗證）。

5. 更新 `wiki/index.md` 與 `wiki/log.md`。

### 6.3 新增「網站頁面」（Web Page）

1. 確認新頁面符合「法式復古甜點店 × 微縮童話屋」視覺系統，且一律引用 `src/styles/tokens.css` 中的 CSS 變數，禁止寫死色碼（Hardcoded Hex）。

2. 在 `src/pages/` 建立頁面檔案，共用元件放至 `src/components/`。

3. 確保頁面支援響應式設計（RWD）與無障礙語意化標籤（Semantic HTML）。

4. 在 `wiki/log.md` 紀錄頁面新增與架構異動（`## [YYYY-MM-DD] build | 新增 <頁面名稱>`）。

## 7. 程式碼與開發約定

* **語言與命名**：

  * 檔案與資料夾命名一律使用 `kebab-case`（小寫英文加連字號，如 `strawberry-tart.md`）。

  * 所有對使用者顯示的文案、註解與知識庫文件一律使用**繁體中文（台灣常用詞彙）**。

* **輕量與零過度設計**：

  * 在未明確引入大型框架前，優先保持語意化 HTML、模組化 CSS（搭配 `tokens.css`）與原生 ES Modules JavaScript，確保高可讀性與低維護成本。

  * 個人收藏與製作紀錄（Craft Log）初期採用瀏覽器 `localStorage` 實作，並預留清晰的資料儲存介面以便未來接軌後端 API。

* **誠實與可追溯原則**：

  * 不可編造不存在的圖片路徑、材料數據或外部參考連結；若資源尚未準備完成，明確標記為待補（Placeholder / Draft）並記錄於日誌中。