/* {{TITLE}}: анімації лендінгу. Знаходить елементи лише за data-атрибутами й класами розмітки,
   тому тексти, цифри, фото й посилання можна вільно міняти у Webflow. Кожен крок ізольований
   (помилка пишеться в консоль як [{{NAME}}] і не ламає решту). Скрол ніколи не блокується. */
(function () {
  "use strict";
  var W = window, D = document, H = D.documentElement;
  if (W.__{{NAME}}Ready) return;
  W.__{{NAME}}Ready = true; // завантажувач у head знімає клас {{PREFIX}}-js, якщо цього прапорця немає за 5 с

  var RM = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH = W.matchMedia && W.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)").matches;
  if (TOUCH) H.classList.add("{{PREFIX}}-touch");
  function $$(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
  function step(name, fn) { try { return fn(); } catch (e) { console.error("[{{NAME}}]", name, e); } }

  if (RM) { H.classList.remove("{{PREFIX}}-js"); return; } // без анімацій усе одразу видно

  step("поява", function () {
    if (!("IntersectionObserver" in W)) { $$("[data-anim]").forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    $$('[data-anim="reveal"]').forEach(function (e) { io.observe(e); });
  });
})();
