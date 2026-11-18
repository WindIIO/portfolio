const mobileMenu = document.getElementById("mobile-menu");
const navigation = document.getElementById("main-navigation");
const navbar = document.querySelector(".navbar");
const introPhrase = document.getElementById("intro-phrase");
const introPhrases = [
  "Je suis peut-être paresseux, mais automatiser une tâche est souvent plus rapide que la refaire 100 fois.",
  "Pourquoi faire 10 clics quand un script peut en faire un seul ?",
  "Mon métier : résoudre les problèmes. Mon hobby : éviter qu'ils reviennent.",
  "Je perds souvent du temps à créer des outils pour en gagner plus tard.",
  "Transformer les tâches répétitives en boutons depuis 2024.",
  "Faire travailler l'ordinateur à ma place est une compétence, pas de la flemme.",
  "J'automatise d'abord, je réfléchis ensuite.",
  "Partisan du moindre effort... intelligent.",
  "Je préfère passer 2 heures à automatiser une tâche que 5 minutes à la refaire chaque jour.",
  "Si un processus est pénible, il mérite probablement un script.",
];
const introPhraseStorageKey = "portfolio-intro-phrase-index";
let previousPhraseIndex = -1;

try {
  const storedPhraseIndex = Number.parseInt(
    localStorage.getItem(introPhraseStorageKey),
    10,
  );
  if (Number.isInteger(storedPhraseIndex)) {
    previousPhraseIndex = storedPhraseIndex;
  }
} catch (error) {
  console.warn("Impossible de lire la phrase d'accueil précédente.", error);
}

const availablePhraseIndexes = introPhrases
  .map((_, index) => index)
  .filter((index) => index !== previousPhraseIndex);
const selectedPhraseIndex =
  availablePhraseIndexes[
    Math.floor(Math.random() * availablePhraseIndexes.length)
  ];
introPhrase.textContent = `"${introPhrases[selectedPhraseIndex]}"`;

try {
  localStorage.setItem(introPhraseStorageKey, String(selectedPhraseIndex));
} catch (error) {
  console.warn("Impossible d'enregistrer la phrase d'accueil.", error);
}

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

const skillWheel = document.getElementById("skill-wheel");

if (skillWheel && skillWheel.querySelector(".skill-card")) {
  const skillCards = Array.from(skillWheel.querySelectorAll(".skill-card"));
  const cardCount = skillCards.length;
  const cardAngle = 34;
  let wheelPosition = 0;
  let dragStartX = 0;
  let dragStartPosition = 0;
  let isDragging = false;
  let wheelSettleTimer;

  function wrapWheelPosition(position) {
    return ((position % cardCount) + cardCount) % cardCount;
  }

  function renderSkillWheel() {
    const activeIndex = wrapWheelPosition(Math.round(wheelPosition));
    const wheelRadius = Math.max(
      skillWheel.clientWidth * 0.52,
      skillWheel.clientWidth < 640 ? 340 : 500,
    );

    skillCards.forEach((card, index) => {
      const offset =
        ((index - wheelPosition + cardCount / 2) % cardCount + cardCount) %
          cardCount -
        cardCount / 2;
      const angle = offset * cardAngle;
      const angleRadians = (angle * Math.PI) / 180;
      const distanceFromCenter = Math.abs(offset);
      const isActive = index === activeIndex;
      const wheelX = Math.sin(angleRadians) * wheelRadius;
      const wheelZ = (Math.cos(angleRadians) - 1) * wheelRadius;
      const scale = Math.max(0.58, 1 - distanceFromCenter * 0.18);

      card.style.left = `calc(50% + ${wheelX}px)`;
      card.style.transform = `translate(-50%, -50%) translateZ(${wheelZ}px) rotateY(${-angle}deg) scale(${scale})`;
      card.style.opacity = String(
        Math.max(0.2, 1 - distanceFromCenter * 0.37),
      );
      card.classList.toggle("is-active", isActive);
      card.style.zIndex = isActive ? "2" : "1";

      if (isActive) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }
    });
  }

  function settleSkillWheel() {
    wheelPosition = wrapWheelPosition(Math.round(wheelPosition));
    skillWheel.classList.remove("is-rotating");
    renderSkillWheel();
  }

  skillWheel.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 0 ||
      event.target.closest("a, button, input, textarea, select")
    ) {
      return;
    }

    window.clearTimeout(wheelSettleTimer);
    isDragging = true;
    dragStartX = event.clientX;
    dragStartPosition = wheelPosition;
    skillWheel.classList.add("is-rotating");
    skillWheel.setPointerCapture(event.pointerId);
  });

  skillWheel.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    const dragDistance = event.clientX - dragStartX;
    if (Math.abs(dragDistance) > 3) {
      event.preventDefault();
      wheelPosition =
        dragStartPosition -
        (dragDistance / Math.max(skillWheel.clientWidth, 1)) * cardCount;
      renderSkillWheel();
    }
  });

  function finishWheelDrag() {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    settleSkillWheel();
  }

  skillWheel.addEventListener("pointerup", finishWheelDrag);
  skillWheel.addEventListener("pointercancel", finishWheelDrag);
  skillWheel.addEventListener("lostpointercapture", finishWheelDrag);

  skillWheel.addEventListener(
    "wheel",
    (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!delta) {
        return;
      }

      event.preventDefault();
      skillWheel.classList.add("is-rotating");
      wheelPosition += delta / 180;
      renderSkillWheel();

      window.clearTimeout(wheelSettleTimer);
      wheelSettleTimer = window.setTimeout(settleSkillWheel, 160);
    },
    { passive: false },
  );

  skillWheel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    window.clearTimeout(wheelSettleTimer);
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    wheelPosition = wrapWheelPosition(Math.round(wheelPosition) + direction);
    renderSkillWheel();
  });

  window.addEventListener("resize", renderSkillWheel);
  renderSkillWheel();
}

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
