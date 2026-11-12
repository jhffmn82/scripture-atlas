
// the atlas: zoom presets set the map's view; a religion's checkbox shows or hides its dots; dots and labels keep
// their size on screen whatever the zoom
(function () {
  var map = document.getElementById("atlas-map");
  if (!map) return;
  function show(lon, lat, w) {
    var h = w / 2;
    map.setAttribute("viewBox", [lon + 180 - w / 2, 90 - lat - h / 2, w, h].join(" "));
    var s = w / 330;
    map.querySelectorAll("circle").forEach(function (c) { c.setAttribute("r", (1.4 * s).toFixed(3)); });
  }
  document.querySelectorAll("button.view").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.view.split(",").map(Number);
      show(v[0], v[1], v[2]);
      document.querySelectorAll("button.view").forEach(function (o) { o.classList.toggle("on", o === b); });
    });
  });
  document.querySelectorAll(".religions input").forEach(function (box) {
    box.addEventListener("change", function () {
      map.querySelectorAll('a.ev[data-religion="' + box.value + '"]').forEach(function (a) {
        a.style.display = box.checked ? "" : "none";
      });
    });
  });
  // a dot's label: shown only while the pointer (or keyboard focus) is on the dot, above it, kept inside the map
  var box = map.parentNode, tip = box.querySelector(".atlas-tip");
  function put(a) {
    var c = a.querySelector("circle").getBoundingClientRect(), b = box.getBoundingClientRect();
    tip.textContent = a.dataset.tip;
    tip.hidden = false;
    var x = c.left + c.width / 2 - b.left, half = tip.offsetWidth / 2;
    tip.style.left = Math.max(half + 4, Math.min(b.width - half - 4, x)) + "px";
    tip.style.top = (c.top - b.top) + "px";
    tip.classList.toggle("below", c.top - b.top < tip.offsetHeight + 14);
    if (tip.classList.contains("below")) tip.style.top = (c.bottom - b.top) + "px";
  }
  map.querySelectorAll("a.ev").forEach(function (a) {
    a.addEventListener("pointerenter", function () { put(a); });
    a.addEventListener("focus", function () { put(a); });
    a.addEventListener("pointerleave", function () { tip.hidden = true; });
    a.addEventListener("blur", function () { tip.hidden = true; });
  });
  // the view that holds every dot opens first: the world once religions span it
  var first = document.querySelector("button.view[data-start]") || document.querySelector("button.view");
  if (first) first.click();
})();
