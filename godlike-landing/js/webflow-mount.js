/* Mounts the Godlike.host x AIN landing inside a Webflow page.
   Needs: <div id="godlike-landing"></div> on the page and window.GODLIKE_BASE (the URL where this folder is hosted).
   It loads css/style.css, takes the markup from index.html (single source of truth), then starts js/shaders.js and js/app.js. */
(function () {
  var mount = document.getElementById("godlike-landing");
  if (!mount) return;
  var cur = document.currentScript;
  var base =
    window.GODLIKE_BASE ||
    (cur && cur.src ? cur.src.replace(/js\/[^\/]*$/, "") : "/");
  if (!/\/$/.test(base)) base += "/";

  mount.style.visibility = "hidden"; // avoid a flash of un-animated content while scripts load

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "css/style.css";
  document.head.appendChild(css);

  function loadScript(src, done) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = done || function () {};
    s.onerror = function () {
      mount.style.visibility = "visible";
      console.error("Landing: cannot load " + src);
    };
    document.body.appendChild(s);
  }

  fetch(base + "index.html")
    .then(function (r) {
      return r.text();
    })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll("script").forEach(function (s) {
        s.remove();
      });
      mount.innerHTML = doc.body.innerHTML.replace(
        /(["'(])assets\//g,
        "$1" + base + "assets/",
      );
      window.__LOGO_SDF__ = base + "assets/logo_sdf16.png";
      loadScript(base + "js/shaders.js", function () {
        loadScript(base + "js/app.js", function () {
          requestAnimationFrame(function () {
            mount.style.visibility = "visible";
          });
        });
      });
    })
    .catch(function (e) {
      mount.style.visibility = "visible";
      console.error("Landing: cannot load index.html", e);
    });
})();
