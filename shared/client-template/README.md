# {{TITLE}}

Короткий опис проєкту і стан: що зроблено, що відкладено, де що лежить.

## Структура
- `site/css/anim.css`, `site/js/{{NAME}}.js` — анімації за контрактом із кореневого `CLAUDE.md` (`data-` атрибути, префікс `{{PREFIX}}-`).
- `site/webflow/standalone/` — зібрані файли для Webflow Assets (`python3 shared/webflow-tools/build_files.py …`).
- `figma-plugin/` — генератор макета у Figma (якщо будується плагіном).

## Версії коду на сторінці
| Версія | Що змінилося |
|---|---|

## Оновлення коду
1. Правка `site/js/{{NAME}}.js` / `site/css/anim.css` → перевірка (`shared/qa/`).
2. `python3 shared/webflow-tools/build_files.py --name {{NAME}} --prefix {{PREFIX}} --title "{{TITLE}}" --src {{NAME}}-landing/site --js js/{{NAME}}.js --version vN --out {{NAME}}-landing/site/webflow/standalone`
3. `create_asset` ×2 → `shared/webflow-tools/wfup.py` → звірити md5/sha384 з CDN → `register_hosted_script` ×2 (SRI) → `set_page_scripts` → Publish.
4. Дописати рядок у таблицю версій.
