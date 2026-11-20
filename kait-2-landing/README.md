# КАЙТ 2.0 — лонгрід «Автономна далекобійна зброя РФ» (версія 2)

Код анімацій і відео для сторінки у Webflow-проєкті «КАЙТ 2.0». Текст статті у репозиторії **не зберігається** (репозиторій публічний) — він лише у Webflow.

- `webflow/style.css` — CSS класів для Webflow (дублюється у Designer, щоб макет був видимий без скриптів).
- `css/app.css` — стани анімацій, HUD-рамки відео, приціл, діаграма, графік (Embed у `<head>`).
- `js/app.js` — анімації за `data-` атрибутами (Embed унизу сторінки). Знаходить елементи лише за атрибутами, тому редактори вільно правлять текст і фото.
- `video/`, `poster/` — три відео повної тривалості (зі звуком) і постери. Скрипт сам підставляє `src`/`poster` відносно свого шляху.

## Атрибути
`data-terrain` (перший екран), `data-anim="redact|words|reveal|scrub"`, `data-count`, `data-bar`, `data-img`, `data-marquee`, `data-scene` + `data-diagram`/`data-step`, `data-video` (+`data-name`, `data-ratio`), `data-target` (приціл-курсор).

## Підключення (Embed)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tfe896/ain_hata@<COMMIT>/kait-2-landing/css/app.css">
<script src="https://cdn.jsdelivr.net/gh/tfe896/ain_hata@<COMMIT>/kait-2-landing/js/app.js" defer></script>
```
Оновлення: коміт → новий хеш у двох посиланнях → Publish.

## Правила
Фото й відео ніколи не обрізаються (`height:auto` / `aspect-ratio`), відео показуються повним кадром і повної тривалості. `prefers-reduced-motion` вимикає рух. Усі кроки скрипта ізольовані; помилки — у консоль як `[kait2]`.
