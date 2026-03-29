// script.js - Interactions, scroll fluide et animation de révélation

// Scroll fluide sur bouton "Voir mes projets"
const btnProjects = document.getElementById("btn-projects");
btnProjects.addEventListener("click", () => {
  const projectsSection = document.getElementById("projects");
  projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Bouton menu mobile
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.querySelector(".navbar");

mobileMenu.addEventListener("click", () => {
  navbar.classList.toggle("nav-open");
});

// Reveal on scroll pour les cartes
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach((el) => {
    const revealTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (revealTop < windowHeight - revealPoint) {
      el.classList.add("reveal-visible");
    } else {
      el.classList.remove("reveal-visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
