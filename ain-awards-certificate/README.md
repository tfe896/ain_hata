# AIN Awards 2026 — сертифікати Molfar Intelligence (Figma-плагін)

Локальний плагін, який за один запуск збирає у Figma **три окремі сертифікати** (A4 landscape, 1754×1240):
**Background check**, **Курс з OSINT**, **Місяць доступу до Minos**.

На сертифікатах **тільки текст із брифу** (назва, партнер, опис) і **справжній логотип AIN**
(обведений у вектор з `godlike-landing/assets/ain-white.png`). Нічого додаткового немає: ні полів, ні дат, ні печаток.
Стиль — тільки графікою, без слів: чорна основа, світіння й «сонар»-дуги у кольорах AIN Awards 2026, візирні кутики, тонка рамка.

## Запуск (≈1 хвилина, не витрачає ліміт Figma MCP)
1. Створіть **порожній** файл у **Figma Desktop**.
2. **Plugins → Development → Import plugin from manifest…** → `manifest.json` (поруч має лежати `code.js`; обидва файли є в `ain-awards-certificate-plugin.zip`).
3. **Plugins → Development → AIN Awards 2026 — сертифікати Molfar**. Три макети зʼявляться праворуч від наявного вмісту.

Шрифт: **Basis Grotesque Pro** (Medium для назви, Regular для тексту). Якщо його немає, плагін підставить Inter і напише про це.

## Редагування
Тексти — `PRIZES` на початку `spec.js`. Після змін: `python3 build.py` (оновить `code.js`) і запустіть плагін знову.
`preview.html` — ті самі макети в браузері (`preview-1..3.png` — знімки).

## Як це влаштовано
`spec.js` — єдиний опис сцени → `figma-render.js` (Figma API) і `html-render.js` (прев’ю). `logo-data.js` — вектор логотипа AIN. `build.py` склеює їх у `code.js`.
