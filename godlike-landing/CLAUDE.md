# Godlike.host × AIN: проєктні дані

Загальні правила, етапи й інструменти — у кореневому `CLAUDE.md` та `shared/`. Тут лише специфіка цього клієнта. Це перший проєкт за схемою «Figma → Webflow → анімації з коду»; його Embed зафіксований на коміті, **працюючий лендінг не ламати**.

## Ключові дані
- Webflow: сайт `6aec9fbcb1bc39fcfd02af09`, сторінка `/godlike-native` (нативна, робоча), `/godlike` (стара, один Embed).
- Figma: файл «Godlike × AIN — лендінг (дизайн-концепт під Webflow)» у Drafts, зібраний плагіном (`figma-plugin/` у корені).
- Відкрито: Gilroy ще не завантажений у Webflow Fonts (Designer показує інший шрифт); клас `gt` у Designer відображається плашкою (Clipping → Clip background to text вручну). На сайті все коректно.

## Технічний контракт анімацій (Godlike)
- `js/webflow-native.js` — адаптер: перетворює звичайний текст з Webflow на розмітку анімацій (літери, слова, лічильники, бігучі рядки, меню, полотна фігур). Кожен крок ізольований, помилки пишуться в консоль як `[godlike]`.
- `js/app.js` + `js/shaders.js` — анімації й WebGL-фігури. Плавний скрол колесом вмикається лише поки працює головний цикл (скрол ніколи не блокується).
- Атрибути: `data-anim="letters|words|scrub|reveal"`, `data-count`, `data-scene="N"`, `data-stream`, `data-marquee="l|r"`, `data-menu="Назва"`, `data-fallback` (у картинок).
- Градієнтні слова — `<span class="gt">` всередині тексту.
- Оновлення коду (старий спосіб, Embed на jsDelivr): коміт → новий хеш у п'яти посиланнях Code Embed → Publish.
- Інструменти: `webflow/mknative.js` (чиста розмітка з HTML), `webflow/build_webflow.py` (секції + CSS для класів Webflow), `native-test.html` (локальна перевірка), `../figma-plugin/` (генератор макета у Figma).
