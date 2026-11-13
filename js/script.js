const mobileMenu = document.getElementById("mobile-menu");
const navigation = document.getElementById("main-navigation");
const navbar = document.querySelector(".navbar");

document.documentElement.classList.add("js");

function setMenuOpen(isOpen) {
  navbar.classList.toggle("nav-open", isOpen);
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation",
  );
}

mobileMenu.addEventListener("click", () => {
  const isOpen = mobileMenu.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    mobileMenu.getAttribute("aria-expanded") === "true"
  ) {
    setMenuOpen(false);
    mobileMenu.focus();
  }
});

const revealElements = document.querySelectorAll(".scroll-reveal");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (revealElements.length && "IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
  document.body.classList.add("reveal-ready");
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
