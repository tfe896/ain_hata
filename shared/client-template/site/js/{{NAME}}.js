/* =====================================================================================
   {{TITLE}} — анімації лендінгу (GSAP + ScrollTrigger)

   ЯК ПРАВИТИ РУКАМИ
   • Швидкість, затримки, відстані, плавність — у блоці «1. НАЛАШТУВАННЯ» одразу нижче.
     Решту файлу для цього чіпати не треба.
   • Тексти, цифри, фото й посилання міняються у Webflow Designer: скрипт шукає елементи
     лише за data-атрибутами та класами {{PREFIX}}-*, тому від правок контенту нічого не ламається.
   • Кожна анімація — окрема функція (див. зміст). Щоб вимкнути анімацію, закоментуйте
     її рядок у блоці «ЗАПУСК» наприкінці файлу.
   • Нова анімація = новий розділ у НАЛАШТУВАННЯХ + нова функція init…() + рядок у «ЗАПУСКУ»
     + рядок у змісті. Зразок повного проєкту: mazda-landing/site/js/mazda.js.

   ЗМІСТ
   1. Налаштування
   2. Помічники
   3. Поява блоків            data-anim="reveal"
   4. Лічильники              data-count
   ЗАПУСК

   Підключення на сторінці (кінець body, саме в такому порядку):
   gsap.min.js → ScrollTrigger.min.js → цей файл.
   Якщо GSAP не завантажився або в людини ввімкнено «менше руху», сторінка просто
   показується без анімацій. Скрол ніколи не блокується.
   ===================================================================================== */
(function () {
  "use strict";
  var W = window, D = document, H = D.documentElement;
  if (W.__{{NAME}}Ready) return;
  W.__{{NAME}}Ready = true; // знак для запобіжника в head: скрипт запустився

  /* ===================================================================================
     1. НАЛАШТУВАННЯ (можна міняти руками)
     Час у секундах, відстані в пікселях. Плавність (ease) — назви GSAP:
     https://gsap.com/docs/v3/Eases  ("none" — рівномірно, "expo.out" — швидко й м'яко
     гальмує, "back.out(1.4)" — з легким перельотом).
     Старт "top 88%" означає: анімація починається, коли верх блока доходить до 88%
     висоти екрана (тобто блок щойно з'явився знизу).
     =================================================================================== */
  var SETTINGS = {
    // Поява блоків: data-anim="reveal"
    reveal: {
      offset: 44,          // на скільки пікселів блок піднімається знизу
      offsetTouch: 24,     // те саме на телефонах і планшетах
      duration: 1,
      ease: "expo.out",
      start: "top 88%"
    },

    // Лічильники: data-count="120" (необов'язково data-suffix="+")
    counter: { duration: 1.5, ease: "power4.out", start: "top 88%" }
  };

  /* ===================================================================================
     2. ПОМІЧНИКИ
     =================================================================================== */
  var gsap = W.gsap, ScrollTrigger = W.ScrollTrigger;
  var REDUCED = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH = W.matchMedia && W.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)").matches;
  if (TOUCH) H.classList.add("{{PREFIX}}-touch");

  function $$(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }

  // Кожен крок ізольований: помилка в одному не ламає решту
  function step(name, fn) {
    try { return fn(); } catch (e) { console.error("[{{NAME}}]", name, e); }
  }

  /* ===================================================================================
     3. ПОЯВА БЛОКІВ: data-anim="reveal"
     =================================================================================== */
  function initReveal() {
    var S = SETTINGS.reveal;
    $$('[data-anim="reveal"]').forEach(function (block) {
      gsap.fromTo(block,
        { opacity: 0, y: TOUCH ? S.offsetTouch : S.offset },
        {
          opacity: 1, y: 0, duration: S.duration, ease: S.ease,
          scrollTrigger: { trigger: block, start: S.start, once: true }
        });
    });
  }

  /* ===================================================================================
     4. ЛІЧИЛЬНИКИ: data-count
     =================================================================================== */
  function initCounters() {
    var S = SETTINGS.counter;
    $$("[data-count]").forEach(function (node) {
      var target = parseFloat(node.getAttribute("data-count")) || 0;
      var suffix = node.getAttribute("data-suffix") || "";
      var state = { value: 0 };
      node.textContent = "0" + suffix;
      gsap.to(state, {
        value: target, duration: S.duration, ease: S.ease,
        scrollTrigger: { trigger: node, start: S.start, once: true },
        onUpdate: function () { node.textContent = Math.round(state.value) + suffix; }
      });
    });
  }

  /* ===================================================================================
     ЗАПУСК
     Щоб вимкнути анімацію, закоментуйте її рядок.
     =================================================================================== */
  if (!gsap || !ScrollTrigger || REDUCED) {
    H.classList.remove("{{PREFIX}}-js"); // без GSAP або з «менше руху» все одразу видно
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // iOS: адресний рядок не смикає анімації

  step("поява блоків", initReveal);
  step("лічильники", initCounters);
})();
