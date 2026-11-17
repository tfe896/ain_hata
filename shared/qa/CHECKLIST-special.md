# Чекліст редакції AIN для спешалів (special.ain.ua): як ми його виконуємо

Джерело: таблиця «Що і як має бути у спешалі», яку редакція передала 17.11.2026 (файл `.xlsx` у чаті, аркуші «checklist», «код гугл тег менеджера», «плагіни», «задачі по спешелам»). Редакція перевіряє сторінку плагінами Chrome **SEO Meta in One Click** і **Dofollow Detector**, тому закладаємо вимоги з початку, а не лишаємо на кінець.

Автоматична перевірка живої сторінки: `URL=<адреса> node shared/qa/seo_check.js` (друкує ✓ / ✗ / ⚠). Нижче: що вимагає редакція, як виконуємо ми і де це видно.

| Вимога редакції | Як виконуємо (Webflow API, без Designer) | Перевіряє |
|---|---|---|
| **Open Graph** (og:title, og:description, og:image) | `update_page_settings` → `openGraph` (title, description, `imageAssetId`). Картинка JPG 1200×630 до 100 КБ | `seo_check.js` |
| **meta title + description** | `update_page_settings` → `seo` | `seo_check.js` |
| **Один h1, ієрархія h1→h2→h3** без пропусків | `data_element_tool` → `set_heading_level`; h-теги лише для структури, не для вигляду | `seo_check.js` |
| **Актуальний футер AIN** (© 1999–рік, соцмережі) | `shared/ain-footer/`, не міняємо | `seo_check.js` |
| **alt і title у всіх зображень** | alt у розмітці (`data_whtml_builder`) або alt файлу в Assets (`update_asset` → `alt_text`); `title` через `set_attributes` (`alt` через `set_attributes` не пишеться, API дає помилку) | `seo_check.js` |
| **Картинки до 100 КБ, без PNG** | `shared/webflow-tools/optimize_images.py` (WebP; логотипи без втрат), `shared/webflow-tools/svg_compact.py` для SVG-карт; потім `create_asset` + `wfup.py` + `set_image_asset` | `seo_check.js` (рахує вагу відповідей Network) |
| **Немає посилань «#»** і зайвих символів у посиланнях | кожна кнопка має справжній URL; не знаємо URL — питаємо, плейсхолдер `#` не лишаємо | `seo_check.js` |
| **Чужі посилання в тексті — nofollow**, посилання на AIN і її піддомени/соцмережі — dofollow | зовнішнім посиланням додаємо `rel="nofollow noopener"` (`set_attributes`) | `seo_check.js` (Dofollow Detector дивиться очима) |
| **Слеш у кінці внутрішніх посилань** (ain.ua/adv/, /about/…) | у `cards.json` і футері всі внутрішні URL зі слешем | `seo_check.js` |
| **Schema.org Article + автор** | `bulk_update_pages_schema_markup` (об'єкт `@graph`: Organization AIN + Article). `jsonLdSchema` у `update_page_settings` НЕ зберігається, використовувати лише `bulk_update_pages_schema_markup`. Автор: якщо ім'я невідоме, `author` = Organization AIN, ім'я авторки питаємо; видимий автор на сторінці теж потрібен | `seo_check.js` + очима |
| **`<html lang>`** (uk/en/ru/pl) | Webflow сам не виводить; `build_files.py --lang uk` ставить з файлу стилів у head. У кінцевій збірці на special.ain.ua код сторінки теж має мати lang | `seo_check.js` |
| **Canonical** самоканонічний, зі слешем: `https://special.ain.ua/<url>/` | API не дає: ставиться в коді сторінки при вивантаженні на special.ain.ua (потрібен кінцевий URL) | ⚠ `seo_check.js` |
| **`<meta name="robots" content="index,follow">`** | те саме: у код сторінки при експорті | ⚠ `seo_check.js` |
| **GTM** `GTM-K4F6Q5PN` (head + noscript після `<body>`) | код і контейнер лежать в аркуші «код гугл тег менеджера». API не пише довільний head-код, ставиться при експорті. На тестовому домені webflow.io GTM не додаємо, щоб не засмічувати аналітику | ⚠ `seo_check.js` |
| **Архів спешалу до 15 МБ** | рахується на експорті Webflow; відео й карта в Assets (Mazda: hero 1,7 МБ + мобільне 0,45 МБ + карта 0,09 МБ) | вручну |
| **Блок перелінковки** над футером, кожен спешал має ≥ 1 посилання з іншого | наш кінцевий блок «Читайте також» (`shared/ain-footer/`); вхідне посилання на новий спешал додає редакція | `seo_check.js` + очима |
| **Код читається по рядках** (правка редакції 17.11.2026: кожен тег `<meta>`, `<link>`, `<script>` у head з нового рядка, як у експорті Webflow) | наші `-style`/`-anim` файли без мінімізації (`build_files.py --readable`). Мінімізує сам Webflow при публікації: Site settings → Publishing → Advanced publishing options → вимкнути **Minify HTML** (і за потреби CSS/JS), потім Publish. Налаштування сайтове, API його не міняє. Перевірка: `curl -s <адреса> \| head -c 600` має показати теги на окремих рядках | вручну |
| **Адаптивність, «поплив» тексту, биті картинки** | `shared/qa/` (мобільна й десктопна перевірка) | `mobile_desktop_check.js` |
| **Немає 404 у Network**, посилання ведуть прямо (без редіректів) | перевіряємо відповіді | `seo_check.js` |
| **Мовна папка** (укр: `/native-ua/`, англ: `/en/…`, рос: `/ru/…`), **hreflang** для багатомовних, переклад SEO-параметрів | вирішує приймальник при завантаженні; для багатомовного спешалу заздалегідь узгодити | вручну |
| **Немає технічних дублів** (index.html, .html) | перевіряє приймальник | вручну |

## Що лишається людині (не робиться через API)
1. Кінцевий URL спешала (для canonical, `mainEntityOfPage`, `datePublished` у Schema.org).
2. Canonical, robots, GTM, lang у коді сторінки при вивантаженні на special.ain.ua.
3. Видимий автор і ім'я авторки для Schema.org.
4. Переклад SEO-параметрів і hreflang для багатомовних спешалів.
