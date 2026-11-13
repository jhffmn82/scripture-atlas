
// the atlas of places: zoom presets set the view; a dot shows while any of its religions is ticked; a dot's tip
// shows while the pointer or keyboard focus is on it; dots keep their size on screen whatever the zoom
(function () {
  var map = document.getElementById("atlas-map");
  if (!map) return;
  function show(lon, lat, w) {
    var h = w / 2;
    map.setAttribute("viewBox", [lon + 180 - w / 2, 90 - lat - h / 2, w, h].join(" "));
    var s = w / 330;
    map.querySelectorAll("circle").forEach(function (c) { c.setAttribute("r", (Number(c.dataset.r) * s).toFixed(3)); });
  }
  document.querySelectorAll("button.view").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.view.split(",").map(Number);
      show(v[0], v[1], v[2]);
      document.querySelectorAll("button.view").forEach(function (o) { o.classList.toggle("on", o === b); });
    });
  });
  var boxes = document.querySelectorAll(".religions input");
  boxes.forEach(function (box) {
    box.addEventListener("change", function () {
      var on = {};
      boxes.forEach(function (b) { on[b.value] = b.checked; });
      map.querySelectorAll("a.ev").forEach(function (a) {
        var any = a.dataset.religions.split(" ").some(function (r) { return on[r]; });
        a.style.display = any ? "" : "none";
      });
    });
  });
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
  var first = document.querySelector("button.view[data-start]") || document.querySelector("button.view");
  if (first) first.click();
})();
