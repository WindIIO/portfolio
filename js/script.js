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
  "Je suis peut-être développeur par passion, mais surtout par flemme.",
  "Si une tâche est répétitive, elle a probablement déjà été automatisée.",
  "Transformer 30 clics en 1 clic est une philosophie de vie.",
  "Mon objectif : travailler intelligemment avant de travailler longtemps.",
  "L'automatisation est mon sport favori.",
  "Pourquoi faire simple quand on peut automatiser ?",
  "Parce que cliquer 300 fois n'est pas une compétence.",
  "Je collectionne les gains de temps.",
  "J'aime comprendre comment les choses fonctionnent... puis les améliorer.",
  "Construire, automatiser, améliorer... puis recommencer.",
  "Bienvenue dans mon laboratoire d'idées.",
  "Des projets, des scripts et beaucoup de Redbull.",
  "Quand une idée me plaît, elle finit souvent sur GitHub.",
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

const projectJourney = document.querySelector("[data-project-journey]");
const projectReduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (projectJourney && !projectReduceMotion) {
  const projectStage = projectJourney.querySelector(
    ".project-journey__stage",
  );
  const projectCards = Array.from(
    projectJourney.querySelectorAll(".project-journey__card"),
  );
  const projectSteps = Array.from(
    projectJourney.querySelectorAll(".project-journey__step"),
  );
  const projectStatus = projectJourney.querySelector(
    "[data-project-status]",
  );

  if (
    projectStage &&
    projectStatus &&
    projectCards.length > 0 &&
    projectSteps.length === projectCards.length
  ) {
    projectJourney.style.setProperty(
      "--project-count",
      String(projectCards.length),
    );
    projectJourney.classList.add("is-spatial");

    let activeProjectIndex = -1;
    let scrollFrame = 0;

    function activateProject(index) {
      if (index === activeProjectIndex) {
        return;
      }

      activeProjectIndex = index;
      projectCards.forEach((card, cardIndex) => {
        const isActive = cardIndex === index;
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-hidden", String(!isActive));
        card.setAttribute("aria-current", String(isActive));
        card.inert = !isActive;
      });

      const activeCard = projectCards[index];
      projectStatus.textContent =
        `Projet ${index + 1} sur ${projectCards.length} : ${activeCard.dataset.projectCategory}`;
    }

    function updateProjectFromScroll() {
      scrollFrame = 0;
      const firstStep = projectSteps[0].getBoundingClientRect();
      const stepHeight = firstStep.height;
      if (stepHeight === 0) {
        return;
      }

      const progress =
        (window.innerHeight / 2 - firstStep.top) / stepHeight;
      const journeyProgress = Math.max(
        0,
        Math.min(projectCards.length - 1, progress - 0.5),
      );
      const hasTransitions = projectCards.length > 1;
      const transitionStart = hasTransitions
        ? Math.min(projectCards.length - 2, Math.floor(journeyProgress))
        : 0;
      const transitionProgress = journeyProgress - transitionStart;
      const transitOpacity =
        hasTransitions
          ? Math.pow(Math.sin(Math.PI * transitionProgress), 1.25)
          : 0;
      const activeIndex = Math.max(
        0,
        Math.min(
          projectCards.length - 1,
          Math.floor(progress + 0.001),
        ),
      );

      projectStage.style.setProperty(
        "--transit-progress",
        String(transitionProgress),
      );
      projectStage.style.setProperty(
        "--transit-opacity",
        String(transitOpacity),
      );
      projectStage.style.setProperty(
        "--transit-scale",
        String(1.3 + transitOpacity * 0.55),
      );
      projectStage.style.setProperty(
        "--transit-animation-state",
        transitOpacity > 0.04 ? "running" : "paused",
      );
      projectStage.classList.toggle("is-transitioning", transitOpacity > 0.04);

      projectCards.forEach((card, index) => {
        const distance = index + 0.5 - progress;
        const absoluteDistance = Math.abs(distance);
        const isOutgoing = distance < 0;
        const depth = Math.min(
          2200,
          Math.pow(absoluteDistance, 1.32) * 920 + (isOutgoing ? 180 : 0),
        );
        const scale = Math.max(
          0.08,
          1 - absoluteDistance * 0.32 - (isOutgoing ? 0.08 : 0),
        );
        const opacity = Math.max(
          0,
          1 - absoluteDistance * (isOutgoing ? 1.1 : 0.68),
        );
        const detailOpacity = Math.max(
          0,
          Math.min(
            1,
            1 -
              Math.max(0, absoluteDistance - 0.12) /
                (isOutgoing ? 0.3 : 0.48),
          ),
        );
        const satelliteOpacity = Math.max(
          0,
          1 - Math.max(0, absoluteDistance - 0.12) / 0.28,
        );
        const satelliteScale = Math.max(
          0.72,
          1 - Math.max(0, absoluteDistance - 0.12) * 0.35,
        );
        const silhouetteOpacity =
          distance > 0.08
            ? Math.min(
                1,
                Math.max(0, (distance - 0.08) / 0.32),
                Math.max(0, (1.35 - distance) / 0.35),
              )
            : 0;
        const rotation = Math.max(-28, Math.min(28, distance * -11));
        const verticalOffset = Math.max(
          -110,
          Math.min(110, distance * 48),
        );

        card.style.setProperty("--station-z", `${-depth}px`);
        card.style.setProperty("--station-scale", String(scale));
        card.style.setProperty("--station-opacity", String(opacity));
        card.style.setProperty(
          "--station-detail-opacity",
          String(detailOpacity),
        );
        card.style.setProperty(
          "--station-detail-visibility",
          detailOpacity > 0.01 ? "visible" : "hidden",
        );
        card.style.setProperty(
          "--station-satellite-opacity",
          String(satelliteOpacity),
        );
        card.style.setProperty(
          "--station-satellite-visibility",
          satelliteOpacity > 0.01 ? "visible" : "hidden",
        );
        card.style.setProperty(
          "--station-satellite-scale",
          String(satelliteScale),
        );
        card.style.setProperty(
          "--station-silhouette-opacity",
          String(silhouetteOpacity),
        );
        card.style.setProperty(
          "--station-rotation",
          `${rotation}deg`,
        );
        card.style.setProperty("--station-y", `${verticalOffset}px`);
        card.style.setProperty(
          "--station-blur",
          `${Math.min(8, absoluteDistance * 2.2)}px`,
        );
        card.style.zIndex = String(
          100 - Math.round(absoluteDistance * 10),
        );
        card.style.setProperty(
          "--station-visibility",
          absoluteDistance > 2.5 ? "hidden" : "visible",
        );
      });

      projectStage.style.setProperty(
        "--camera-drift",
        `${-progress * 36}px`,
      );
      activateProject(activeIndex);
      projectCards.forEach((card, index) => {
        card.inert = transitOpacity > 0.04 || index !== activeIndex;
      });
    }

    function scheduleProjectUpdate() {
      if (scrollFrame) {
        return;
      }

      scrollFrame = document.hidden
        ? window.setTimeout(updateProjectFromScroll, 16)
        : window.requestAnimationFrame(updateProjectFromScroll);
    }

    window.addEventListener("scroll", scheduleProjectUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleProjectUpdate);
    updateProjectFromScroll();

    projectStage.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const bounds = projectStage.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      const normalizedX = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      const normalizedY = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
      );

      projectStage.style.setProperty("--field-x", `${normalizedX * -9}px`);
      projectStage.style.setProperty("--field-y", `${normalizedY * -9}px`);

      projectCards.forEach((card) => {
        card.querySelectorAll(".project-satellite").forEach(
          (satellite, satelliteIndex) => {
            const depth = 3 + (satelliteIndex % 3) * 1.5;
            satellite.style.setProperty(
              "--satellite-parallax-x",
              `${normalizedX * depth}px`,
            );
            satellite.style.setProperty(
              "--satellite-parallax-y",
              `${normalizedY * depth}px`,
            );
          },
        );
      });
    });

    projectStage.addEventListener("pointerleave", () => {
      projectStage.style.setProperty("--field-x", "0px");
      projectStage.style.setProperty("--field-y", "0px");

      projectCards.forEach((card) => {
        card.querySelectorAll(".project-satellite").forEach((satellite) => {
          satellite.style.setProperty("--satellite-parallax-x", "0px");
          satellite.style.setProperty("--satellite-parallax-y", "0px");
        });
      });
    });
  }
}

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
