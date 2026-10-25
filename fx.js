// click + scroll animation engine
document.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  b.classList.remove("clicked"); void b.offsetWidth; b.classList.add("clicked");
});
function spaReveal() {
  const els = document.querySelectorAll(".card, section h2");
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add("vis"); io.unobserve(x.target); }
  }), { threshold: 0.08 });
  els.forEach(el => { el.classList.add("reveal"); io.observe(el); });
}
document.addEventListener("DOMContentLoaded", spaReveal);
