# Pocket Sweets Studio — 知識庫與專案操作日誌（Wiki Log）

> 本檔案為唯增式（Append-only）時間軸紀錄，追蹤所有 `ingest`（資料攝取）、`query`（綜合查詢）、`lint`（健康檢查）與 `build`（網站開發）操作。
> 格式約定：`## [YYYY-MM-DD] <operation> | <簡短標題>`

## \[2026-11-17\] build | 初始化 Pocket Sweets Studio 專案架構與 AGENTS.md

* 建立專案三層式目錄結構（`raw/`、`wiki/`、`src/`、`assets/`）。

* 參照 Andrej Karpathy LLM Wiki 模式，撰寫繁體中文 `AGENTS.md` 作為全專案開發與知識維護規範。

* 建立 `wiki/index.md`、`wiki/log.md`、`src/styles/tokens.css`（法式復古 × 微縮童話屋設計變數）與 `src/data/*.schema.json` 資料結構定義。

## \[2026-11-17\] build | 完成網站架構與視覺設計規格規劃

* 依更新後的 `AGENTS.md` 與「法式復古微縮甜點店（深色雕花木質、淡粉色櫃檯、黃銅玻璃展示櫃、暖黃色燈光）」視覺方向，建立 `wiki/concepts/site-architecture.md`。

* 更新 `src/styles/tokens.css`，補充淡粉色櫃檯（`--color-counter-pink`）與暖黃色燈光（`--color-warm-light`）變數。

* 新增 `src/data/craft-log.schema.json`（個人製作紀錄結構）與 `assets/images/manifest.template.json`（對應 `Background/`、`Declaration/`、`Process/` 素材清單範本）。

* 備註：目前工作環境尚未讀取到 `Background/`、`Declaration/`、`Process/` 實際圖片檔，已於規格中預留對接結構，待素材路徑確認後即可直接掛載。
## [2026-11-17] ingest | 第一批圖片素材檢查與暫存（封存 2.zip，共 11 張）
- 已解壓縮並留存於 `assets/source/`，未更動原始檔名與內容：
  - `decorations/`（對應 `Declaration` 分類，共 8 張 PNG）：`IMG_8296.PNG`、`IMG_8310.PNG`、`IMG_8311.PNG`、`IMG_8312.PNG`、`IMG_8313.PNG`、`IMG_8314.PNG`、`IMG_8315.PNG`、`IMG_8316.PNG`
  - `process/`（對應 `Process` 分類，共 3 張）：`IMG_8317.WEBP`、`IMG_8318.PNG`、`IMG_8319.PNG`
- 待第二批圖片（含 `Background` 等）上傳後，再一併建立完整 `assets/images/manifest.json` 並進入網站頁面實作。

## [2026-11-17] build | 完成全部 43 張素材盤點、Manifest 建立與五大網站頁面實作
- **圖片清單**：已建立 `assets/images/manifest.json`，完整收錄 `backgrounds/`（10 張）、`decorations/`（8 張）、`process/`（3 張）與 `desserts/`（22 張），共 43 張現有素材，未重製或刪除任何原圖。
- **資料與樣式**：建立 `src/data/desserts.json`（12 款甜點）、`src/data/tutorials.json`（3 篇步驟教學）、`src/data/encyclopedia.json`（7 項材料與工具）與 `src/styles/main.css`。
- **互動程式與頁面**：完成 `src/scripts/storage.js`、`components.js`、`app.js` 及五大頁面（`src/pages/index.html`、`gallery.html`、`tutorials.html`、`encyclopedia.html`、`studio-log.html`）。

## [2026-11-17] refactor | 移除教學入口，改為完整 22 件甜點作品展示區
- 已移除 `src/pages/tutorials.html`、導覽列「製作教學」連結、Hero 次要教學按鈕與首頁底部手作過程區塊。
- `src/data/desserts.json` 已完整收錄 `assets/source/desserts/` 全部 **22 張**微縮甜點與實景作品，並於 `index.html` 底部新增「櫥窗與午茶實景展示」區。

## [2026-11-17] build | 新增「甜點製作日誌」（process-log.html）並更新全站導覽列
- 已從 `封存.zip` 與 `封存 2.zip` 完整解壓縮 4 個製作過程資料夾至 `assets/source/process-logs/`：
  - `01_Strawberry_Cake/`（6 張：`IMG_8325.PNG`–`IMG_8330.PNG`）
  - `02_Fruit_Tart/`（3 張：`IMG_8331.PNG`–`IMG_8333.PNG`）
  - `03_Macaron/`（3 張：`IMG_8334.PNG`–`IMG_8336.PNG`）
  - `04_Croissant/`（3 張：`IMG_8337.PNG`–`IMG_8339.PNG`）
- 全站導覽列已將「材料工具」替換為「甜點製作日誌」（`process-log.html`），並保留首頁、甜點展示櫃與我的工作檯既有功能。
