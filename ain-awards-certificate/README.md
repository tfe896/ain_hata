# AIN Awards 2026 — сертифікати Molfar Intelligence (Figma-плагін)

Локальний плагін, який за один запуск збирає у Figma **три окремі сертифікати** (A4 landscape, 1754×1240) на призи партнера Molfar Intelligence:
**Background check**, **Курс з OSINT**, **Місяць доступу до Minos**.

Оформлення сертифікатне: подвійна рамка з ромбами, мікротекст по краях, гільйошна розетка як захисна сітка,
«Цим підтверджується, що…» + ім’я серифним курсивом, назва призу й партнер, опис призу, печатка зі знаком AIN
та два підписи (організатор і партнер). Від візуалу події взято лише кольори: чорний, червоні відблиски, кремовий, персиковий акцент.
Логотип AIN — справжній (обведений у вектор з `godlike-landing/assets/ain-white.png`).

## Запуск (≈1 хвилина, не витрачає ліміт Figma MCP)
1. Створіть **порожній** файл у **Figma Desktop**.
2. **Plugins → Development → Import plugin from manifest…** → `manifest.json` (поруч має лежати `code.js`; обидва файли є в `ain-awards-certificate-plugin.zip`).
3. **Plugins → Development → AIN Awards 2026 — сертифікати Molfar**. Три макети зʼявляться праворуч від наявного вмісту.

Шрифти: заголовки й текст — **Basis Grotesque Pro**, моно-мітки — **JetBrains Mono** (або Roboto Mono / IBM Plex Mono),
імʼя — **Cormorant Garamond Italic** (є у Figma за замовчуванням, Google Fonts). Якщо шрифту немає, плагін підставить Inter і напише про це.

## Що вписувати на кожного отримувача
Ім’я Прізвище, «Сертифікат №», «Видано», «Активувати до» — це звичайні текстові шари.

## Редагування тексту й дизайну
Тексти — `COPY` і `PRIZES` на початку `spec.js`. Після змін: `python3 build.py` (оновить `code.js`) і запустіть плагін знову.
`preview.html` — ті самі макети в браузері для швидкої перевірки (`preview-1..3.png` — знімки).

## Як це влаштовано
`spec.js` — єдиний опис сцени → `figma-render.js` (Figma API) і `html-render.js` (прев’ю). `logo-data.js` — вектор логотипа AIN.
`build.py` склеює `logo-data.js` + `spec.js` + `figma-render.js` у `code.js`.
