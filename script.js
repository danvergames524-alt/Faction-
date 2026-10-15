/*
  FACTION — данные и логика сайта.
  Чтобы изменить персонал, отредактируйте массив staffMembers ниже:
  name — никнейм, role — должность, description — описание обязанностей.
  Чтобы изменить новости, редактируйте newsItems:
  date — дата, category — категория, title — заголовок, description — текст, icon — символ.
  Это статический сайт: новые публикации сохраняются после изменения файла и повторной загрузки на GitHub.
*/

const staffMembers = [
  { name: "YourLeader", role: "Лидер", description: "Определяет направление развития клана, принимает ключевые решения и объединяет команду." },
  { name: "PresidentName", role: "Президент", description: "Координирует внутренние процессы и помогает воплощать общие планы в жизнь." },
  { name: "ModeratorName", role: "Модератор", description: "Следит за порядком, помогает решать спорные ситуации и поддерживает комфортную атмосферу." },
  { name: "HelperName", role: "Helper", description: "Помогает участникам, отвечает на вопросы и знакомит новичков с правилами сообщества." },
  { name: "DiplomatName", role: "Дипломат", description: "Поддерживает связь с другими командами, ведёт переговоры и укрепляет союзные отношения." },
  { name: "CuratorName", role: "Куратор", description: "Сопровождает участников, помогает организовать активности и следит за выполнением договорённостей." }
];

const newsItems = [
  { date: "Пример даты", category: "Сообщество", title: "Начинаем новую главу", description: "Здесь можно рассказать о планах клана, новых целях и направлениях развития команды.", icon: "✦" },
  { date: "Пример даты", category: "Событие", title: "Командная активность", description: "Добавьте детали ближайшего события: формат, время проведения и что нужно подготовить участникам.", icon: "◇" },
  { date: "Пример даты", category: "Объявление", title: "Информация для участников", description: "Используйте эту публикацию для важных напоминаний, изменений правил или внутренних объявлений.", icon: "▤" }
];

document.addEventListener("DOMContentLoaded", () => {
  // Переключение оформления сохраняется в этом браузере.
  const themeButtons = [...document.querySelectorAll("[data-set-theme]")];
  const applyTheme = theme => {
    const safeTheme = theme === "crimson" ? "crimson" : "purple";
    document.body.dataset.theme = safeTheme;
    themeButtons.forEach(button => {
      const active = button.dataset.setTheme === safeTheme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const themeColor = safeTheme === "crimson" ? "#080708" : "#0B0812";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
    try { localStorage.setItem("faction-site-theme", safeTheme); } catch (_) { /* Тема действует до закрытия страницы. */ }
  };
  let savedTheme = "purple";
  try { savedTheme = localStorage.getItem("faction-site-theme") || "purple"; } catch (_) {}
  applyTheme(savedTheme);
  themeButtons.forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.setTheme)));
  const welcomeScreen = document.getElementById("welcomeScreen");
  const welcomeEnter = document.getElementById("welcomeEnter");
  if (welcomeScreen && welcomeEnter) {
    document.body.classList.add("welcome-active");
    const enterSite = () => {
      welcomeScreen.classList.add("is-leaving");
      document.body.classList.remove("welcome-active");
    };
    const returnToWelcome = () => {
      welcomeScreen.classList.remove("is-leaving");
      document.body.classList.add("welcome-active");
      window.scrollTo({ top: 0, behavior: "auto" });
      closeMenuIfAvailable();
    };
    function closeMenuIfAvailable() {
      const navElement = document.getElementById("primaryNav");
      const toggleElement = document.getElementById("menuToggle");
      navElement?.classList.remove("open");
      toggleElement?.setAttribute("aria-expanded", "false");
      toggleElement?.setAttribute("aria-label", "Открыть меню");
    }
    welcomeEnter.addEventListener("click", enterSite);
    document.addEventListener("keydown", event => {
      // Ctrl+F возвращает пользователя на экран приветствия вместо стандартного поиска браузера.
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        if (welcomeScreen.classList.contains("is-leaving")) returnToWelcome();
      }
    });
  }

  // Скроллбар скрывается после паузы и появляется при прокрутке или движении к правому краю.
  let scrollbarIdleTimer;
  const showScrollbar = () => {
    document.documentElement.classList.remove("scrollbar-idle");
    window.clearTimeout(scrollbarIdleTimer);
    scrollbarIdleTimer = window.setTimeout(() => {
      document.documentElement.classList.add("scrollbar-idle");
    }, 1100);
  };
  window.addEventListener("scroll", showScrollbar, { passive: true });
  window.addEventListener("pointermove", event => {
    if (event.clientX >= window.innerWidth - 24) showScrollbar();
  }, { passive: true });
  showScrollbar();
  // Кастомный профиль игрока: локальные данные без подключения к боту.
  const profileTrigger = document.getElementById("profileTrigger");
  const profileOverlay = document.getElementById("playerProfile");
  const profileClose = document.getElementById("profileClose");
  const profileBackdrop = document.getElementById("profileBackdrop");
  const nicknameInput = document.getElementById("playerNickname");
  const saveNickname = document.getElementById("savePlayerNickname");
  const profileInitials = document.getElementById("profileInitials");
  const profileAvatarLarge = document.getElementById("profileAvatarLarge");
  const nicknameStorageKey = "faction-custom-player-nickname";
  const getInitials = value => {
    const parts = String(value || "Игрок Faction").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)).toLocaleUpperCase("ru-RU");
  };
  const updateProfileName = value => {
    const clean = String(value || "").trim().slice(0, 24) || "Игрок Faction";
    nicknameInput.value = clean;
    profileInitials.textContent = getInitials(clean);
    profileAvatarLarge.textContent = getInitials(clean);
    return clean;
  };
  try {
    const savedNickname = localStorage.getItem(nicknameStorageKey);
    if (savedNickname) updateProfileName(savedNickname);
  } catch (_) { /* Локальное сохранение может быть отключено настройками браузера. */ }
  const openProfile = () => {
    profileOverlay.hidden = false;
    document.body.classList.add("profile-open");
    window.setTimeout(() => nicknameInput?.focus(), 40);
  };
  const closeProfile = () => {
    profileOverlay.hidden = true;
    document.body.classList.remove("profile-open");
    profileTrigger?.focus();
  };
  profileTrigger?.addEventListener("click", openProfile);
  profileClose?.addEventListener("click", closeProfile);
  profileBackdrop?.addEventListener("click", closeProfile);
  saveNickname?.addEventListener("click", () => {
    const clean = updateProfileName(nicknameInput.value);
    try { localStorage.setItem(nicknameStorageKey, clean); } catch (_) { /* Имя останется до перезагрузки страницы. */ }
    saveNickname.textContent = "Сохранено";
    window.setTimeout(() => { saveNickname.textContent = "Сохранить"; }, 1300);
  });
  nicknameInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") saveNickname?.click();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && profileOverlay && !profileOverlay.hidden) closeProfile();
  });


  // Dashboard shortcuts open the existing custom profile; economy remains a local demo.
  const openProfileButton = document.getElementById("dashboardEditProfile");
  const openProfileButton2 = document.getElementById("dashboardEditProfile2");
  [openProfileButton, openProfileButton2].forEach(button => button?.addEventListener("click", () => profileTrigger?.click()));
  document.getElementById("shortcutEconomy")?.addEventListener("click", () => {
    profileTrigger?.click();
    const note = document.querySelector(".profile-integration-note p");
    if (note) note.textContent = "Экономика пока демонстрационная. Баланс FacCoins и фонд не синхронизируются с ботом.";
  });
  const dashboardName = document.getElementById("dashboardPlayerName");
  const playerNameInput = document.getElementById("playerNickname");
  const syncDashboardName = () => { if (dashboardName && playerNameInput) dashboardName.textContent = playerNameInput.value || "Игрок"; };
  syncDashboardName();
  document.getElementById("savePlayerNickname")?.addEventListener("click", () => window.setTimeout(syncDashboardName, 0));
  playerNameInput?.addEventListener("input", syncDashboardName);
  const siteSearch = document.getElementById("siteSearch");
  siteSearch?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const query = siteSearch.value.trim().toLocaleLowerCase("ru-RU");
    if (!query) return;
    const searchable = [
      { terms: "главная faction о нас сообщество экономика", route: "home" },
      { terms: "персонал руководство команда лидер модератор helper дипломат куратор участники", route: "staff" },
      { terms: "новости события объявления обновление", route: "news" },
      { terms: "сообщество telegram discord связь", route: "community" }
    ];
    const match = searchable.find(item => item.terms.includes(query) || query.split(/\s+/).some(word => item.terms.includes(word)));
    if (match) { window.location.hash = match.route; siteSearch.blur(); }
    else { siteSearch.setCustomValidity("Ничего не найдено. Попробуйте: персонал, новости или сообщество."); siteSearch.reportValidity(); }
  });
  siteSearch?.addEventListener("input", () => siteSearch.setCustomValidity(""));

  const nav = document.getElementById("primaryNav");
  const menuToggle = document.getElementById("menuToggle");
  const pages = [...document.querySelectorAll("[data-page]")];
  const navLinks = [...document.querySelectorAll("[data-route]")];

  // Экранируем пользовательские значения перед вставкой в HTML.
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const initials = (name) => {
    const cleaned = String(name || "?").trim();
    return cleaned.slice(0, 2).toUpperCase();
  };

  const staffGrid = document.getElementById("staffGrid");
  if (staffGrid) {
    staffGrid.innerHTML = staffMembers.map((person, index) => `
      <article class="staff-card reveal">
        <div class="staff-card-head">
          <div class="staff-avatar" aria-hidden="true">${escapeHTML(initials(person.name))}</div>
          <div><div class="staff-role">${escapeHTML(person.role)}</div><div class="staff-name">${escapeHTML(person.name)}</div></div>
        </div>
        <p class="staff-description">${escapeHTML(person.description)}</p>
        <div class="staff-card-foot"><span>FACTION PERSONNEL</span><span>${String(index + 1).padStart(2, "0")}</span></div>
      </article>`).join("");
  }

  const newsGrid = document.getElementById("newsGrid");
  if (newsGrid) {
    newsGrid.innerHTML = newsItems.map(item => `
      <article class="news-card reveal">
        <div class="news-meta"><span>${escapeHTML(item.date)}</span><span class="news-category">${escapeHTML(item.category)}</span></div>
        <div class="news-symbol" aria-hidden="true">${escapeHTML(item.icon || "✦")}</div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="news-card-foot"><span>FACTION / UPDATE</span><span>↗</span></div>
      </article>`).join("");
  }

  function currentRoute() {
    const route = (window.location.hash || "#home").slice(1);
    return ["home", "staff", "news", "community"].includes(route) ? route : "home";
  }

  function showRoute(route) {
    pages.forEach(page => {
      const active = page.dataset.page === route;
      page.hidden = !active;
      page.classList.toggle("active", active);
    });
    navLinks.forEach(link => {
      const active = link.dataset.route === route;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    closeMenu();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    observeReveals();
  }

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    nav?.classList.toggle("open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
  });

  navLinks.forEach(link => link.addEventListener("click", () => {
    // Hash меняется обычным способом; событие hashchange переключит раздел.
    closeMenu();
  }));

  window.addEventListener("hashchange", () => showRoute(currentRoute()));
  document.getElementById("currentYear")?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));

  let observer = null;
  function observeReveals() {
    const revealItems = document.querySelectorAll(".page-section.active .reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(item => item.classList.add("is-visible"));
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });
  }

  showRoute(currentRoute());
});