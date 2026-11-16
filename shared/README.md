# shared: спільні інструменти й блоки для всіх лендінгів

Загальні правила й порядок етапів — у кореневому `CLAUDE.md`. Тут лежить те, що не залежить від клієнта.

| Папка / файл | Що це |
|---|---|
| `SETUP.md` | як дати новому середовищу доступ до Figma (токен), Webflow і потрібних хостів |
| `figma-tools/figma_read.py` | читання Figma: структура файлу, коментарі з координатами, рендери вузлів |
| `webflow-tools/build_files.py` | збирає з `js/*.js` і `css/anim.css` проєкту два файли для Webflow Assets: `<name>-style-vN.js` (head) і `<name>-anim-vN.js` (кінець body) |
| `webflow-tools/wfup.py` | завантажує файл у сховище Webflow за даними `create_asset` (потрібна змінна `WEBFLOW_SITE_ID`) |
| `qa/` | Playwright-перевірки: мобільна версія й паралакс, заставка, трясіння завіси, жива сторінка (див. `qa/README.md`) |
| `ain-footer/` | кінцевий блок усіх лендінгів: титри, «Читайте також», футер AIN; змінюються лише картки в `cards.json` |
| `client-template/`, `new_client.py` | стартова структура нового клієнта |

## Нова сторінка у Webflow: швидкий шлях коду
1. `python3 shared/new_client.py <name> <prefix> "<Назва>"` → `<name>-landing/` зі шаблонами `CLAUDE.md`, `README.md`, `site/css/anim.css`, `site/js/<name>.js`.
2. Писати анімації на GSAP + ScrollTrigger за контрактом і «Стилем коду анімацій» із кореневого `CLAUDE.md` (блок НАЛАШТУВАННЯ зверху, одна функція на анімацію, блок ЗАПУСК).
3. `python3 shared/webflow-tools/build_files.py --name <name> --prefix <prefix> --title "<Назва>" --src <name>-landing/site --js js/<name>.js --version v1 --readable [--font <Google Fonts url>] --out <name>-landing/site/webflow/standalone`
4. Webflow: `create_asset` (`file_name`, md5 файлу) ×2 → `WEBFLOW_SITE_ID=<id> python3 -I shared/webflow-tools/wfup.py upload.txt` (рядки: `шлях asset_id ім'я xAmzDate xAmzSignature contentType`; значення з відповіді `create_asset`) → `curl` CDN і звірити md5/sha384 → `register_hosted_script` (hostedUrl, SRI `sha384-<base64>`) ×2 → `set_page_scripts` (style у header; `gsap3125`, `scrolltrigger3125`, anim у footer, саме в такому порядку) → `publish_site`. GSAP 3.12.5 і ScrollTrigger з cdnjs на сайті Mazda/Godlike вже зареєстровані; на новому сайті Webflow зареєструвати їх раз (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`, SRI `sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt`; `…/ScrollTrigger.min.js`, SRI `sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d`).
5. Кінцевий блок: `ain-footer/` (оновити `cards.json`, `python3 build_footer.py`, вставити в кінець сторінки).
6. Перевірки: `shared/qa/`.

## Приклад повного проєкту
`mazda-landing/` (див. його `README.md`): макет у Figma, збірка сторінки, версії v1–v5 (з v5 — GSAP), кінцевий блок.
