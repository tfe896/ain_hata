# shared: спільні інструменти й блоки для всіх лендінгів

Загальні правила й порядок етапів — у кореневому `CLAUDE.md`. Тут лежить те, що не залежить від клієнта.

| Папка / файл | Що це |
|---|---|
| `webflow-tools/build_files.py` | збирає з `js/*.js` і `css/anim.css` проєкту два файли для Webflow Assets: `<name>-style-vN.js` (head) і `<name>-anim-vN.js` (кінець body) |
| `webflow-tools/wfup.py` | завантажує файл у сховище Webflow за даними `create_asset` (потрібна змінна `WEBFLOW_SITE_ID`) |
| `qa/` | Playwright-перевірки: мобільна версія й паралакс, заставка, трясіння завіси, жива сторінка (див. `qa/README.md`) |
| `ain-footer/` | кінцевий блок усіх лендінгів: титри, «Читайте також», футер AIN; змінюються лише картки в `cards.json` |
| `client-template/`, `new_client.py` | стартова структура нового клієнта |

## Нова сторінка у Webflow: швидкий шлях коду
1. `python3 shared/new_client.py <name> <prefix> "<Назва>"` → `<name>-landing/` зі шаблонами `CLAUDE.md`, `README.md`, `site/css/anim.css`, `site/js/<name>.js`.
2. Писати анімації за контрактом із кореневого `CLAUDE.md`.
3. `python3 shared/webflow-tools/build_files.py --name <name> --prefix <prefix> --title "<Назва>" --src <name>-landing/site --js js/<name>.js --version v1 [--font <Google Fonts url>] --out <name>-landing/site/webflow/standalone`
4. Webflow: `create_asset` (`file_name`, md5 файлу) ×2 → `WEBFLOW_SITE_ID=<id> python3 -I shared/webflow-tools/wfup.py upload.txt` (рядки: `шлях asset_id ім'я xAmzDate xAmzSignature contentType`; значення з відповіді `create_asset`) → `curl` CDN і звірити md5/sha384 → `register_hosted_script` (hostedUrl, SRI `sha384-<base64>`) ×2 → `set_page_scripts` (style у header, anim у footer) → `publish_site`.
5. Кінцевий блок: `ain-footer/` (оновити `cards.json`, `python3 build_footer.py`, вставити в кінець сторінки).
6. Перевірки: `shared/qa/`.

## Приклад повного проєкту
`mazda-landing/` (див. його `README.md`): макет у Figma, збірка сторінки, версії v1–v4, кінцевий блок.
