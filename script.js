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
  const profileAvatarSmall = document.getElementById("profileAvatarSmall");
  const profileAvatarLarge = document.getElementById("profileAvatarLarge");
  const toast = document.getElementById("siteToast");
  const compactMode = document.getElementById("compactMode");
  const reduceMotion = document.getElementById("reduceMotion");
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };
  const nicknameStorageKey = "faction-custom-player-nickname";
  const getInitials = value => {
    const parts = String(value || "Игрок Faction").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)).toLocaleUpperCase("ru-RU");
  };
  const updateProfileName = value => {
    const clean = String(value || "").trim().slice(0, 24) || "Игрок Faction";
    nicknameInput.value = clean;
    if (profileAvatarSmall) profileAvatarSmall.alt = `Аватар ${clean}`;
    if (profileAvatarLarge) profileAvatarLarge.alt = `Аватар ${clean}`;
    const dashboardNickname = document.getElementById("dashboardNickname");
    if (dashboardNickname) dashboardNickname.textContent = clean;
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
  document.getElementById("dashboardEditProfile")?.addEventListener("click", openProfile);
  profileClose?.addEventListener("click", closeProfile);
  profileBackdrop?.addEventListener("click", closeProfile);
  saveNickname?.addEventListener("click", () => {
    const clean = updateProfileName(nicknameInput.value);
    try { localStorage.setItem(nicknameStorageKey, clean); } catch (_) { /* Имя останется до перезагрузки страницы. */ }
    saveNickname.textContent = "Сохранено";
    showToast("Никнейм сохранён в этом браузере");
    window.setTimeout(() => { saveNickname.textContent = "Сохранить"; }, 1300);
  });
  nicknameInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") saveNickname?.click();
  });
  try {
    compactMode.checked = localStorage.getItem("faction-compact-mode") === "1";
    reduceMotion.checked = localStorage.getItem("faction-reduce-motion") === "1";
    document.body.classList.toggle("compact-mode", compactMode.checked);
    document.documentElement.classList.toggle("reduce-motion", reduceMotion.checked);
  } catch (_) {}
  compactMode?.addEventListener("change", () => {
    document.body.classList.toggle("compact-mode", compactMode.checked);
    try { localStorage.setItem("faction-compact-mode", compactMode.checked ? "1" : "0"); } catch (_) {}
    showToast(compactMode.checked ? "Компактный режим включён" : "Компактный режим выключен");
  });
  reduceMotion?.addEventListener("change", () => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion.checked);
    try { localStorage.setItem("faction-reduce-motion", reduceMotion.checked ? "1" : "0"); } catch (_) {}
    showToast(reduceMotion.checked ? "Анимации уменьшены" : "Анимации восстановлены");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && profileOverlay && !profileOverlay.hidden) closeProfile();
  });

  // Косметика и демонстрационный магазин. Сохранение выполняется локально в браузере.
  const cosmeticsBalance = document.getElementById("cosmeticsBalance");
  const cosmeticsGrid = document.getElementById("cosmeticsGrid");
  const cosmeticsPreview = document.getElementById("cosmeticsPreview");
  const cosmeticsPreviewName = document.getElementById("cosmeticsPreviewName");
  const cosmeticsPreviewTitle = document.getElementById("cosmeticsPreviewTitle");
  const cosmeticCatalog = {
    frames: [
      {id:"plain",name:"Стальная",desc:"Чистый металлический контур",price:0,rarity:"Базовая",icon:"◯"},
      {id:"royal",name:"Королевская",desc:"Золото и аметист Faction",price:0,rarity:"Базовая",icon:"♛"},
      {id:"ember",name:"Пылающая",desc:"Жаркое свечение по краю",price:350,rarity:"Редкая",icon:"✦"},
      {id:"dragon",name:"Драконья",desc:"Руническая легендарная рамка",price:900,rarity:"Легендарная",icon:"♜"}
    ],
    backgrounds: [
      {id:"void",name:"Тёмная бездна",desc:"Фирменный фон Faction",price:0,rarity:"Базовая",icon:"◈"},
      {id:"nether",name:"Незер",desc:"Багровые глубины и искры",price:250,rarity:"Редкая",icon:"◆"},
      {id:"end",name:"Край",desc:"Фиолетовая энергия Энда",price:400,rarity:"Редкая",icon:"✧"},
      {id:"royal-hall",name:"Золотой зал",desc:"Премиальный золотой узор",price:750,rarity:"Эпическая",icon:"♛"}
    ],
    effects: [
      {id:"none",name:"Без эффекта",desc:"Минималистичный стиль",price:0,rarity:"Базовая",icon:"—"},
      {id:"spark",name:"Искры",desc:"Мягкие мерцающие частицы",price:300,rarity:"Редкая",icon:"✦"},
      {id:"aura",name:"Аура силы",desc:"Пульсирующее сияние аватара",price:600,rarity:"Эпическая",icon:"✺"},
      {id:"runes",name:"Древние руны",desc:"Медленно вращающиеся знаки",price:850,rarity:"Легендарная",icon:"ᚱ"}
    ],
    titles: [
      {id:"member",name:"Участник Faction",desc:"Стандартный титул",price:0,rarity:"Базовая",icon:"♟"},
      {id:"veteran",name:"Ветеран",desc:"За верность сообществу",price:250,rarity:"Редкая",icon:"⚔"},
      {id:"conqueror",name:"Завоеватель",desc:"Для тех, кто идёт вперёд",price:500,rarity:"Эпическая",icon:"♜"},
      {id:"legend",name:"Легенда клана",desc:"Золотой титул высокого класса",price:1000,rarity:"Легендарная",icon:"✹"}
    ]
  };
  const cosmeticDefaults = {balance:1250, owned:{frames:["plain","royal"],backgrounds:["void"],effects:["none"],titles:["member"]}, equipped:{frames:"royal",backgrounds:"void",effects:"none",titles:"member"}};
  let cosmeticState = JSON.parse(JSON.stringify(cosmeticDefaults));
  const cosmeticStorageKey = "faction-cosmetics-shop-v1";
  try {
    const stored = localStorage.getItem(cosmeticStorageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Number.isFinite(parsed.balance) && parsed.owned && parsed.equipped) cosmeticState = {...cosmeticState,...parsed,owned:{...cosmeticDefaults.owned,...parsed.owned},equipped:{...cosmeticDefaults.equipped,...parsed.equipped}};
    }
  } catch (_) {}
  let cosmeticCategory = "frames";
  let cosmeticPending = {...cosmeticState.equipped};
  const saveCosmeticState = () => { try { localStorage.setItem(cosmeticStorageKey, JSON.stringify(cosmeticState)); } catch (_) {} };
  const getCosmeticItem = (category,id) => (cosmeticCatalog[category] || []).find(item => item.id === id);
  const renderCosmeticPreview = () => {
    if (!cosmeticsPreview) return;
    cosmeticsPreview.dataset.frame = cosmeticPending.frames;
    cosmeticsPreview.dataset.background = cosmeticPending.backgrounds;
    cosmeticsPreview.dataset.effect = cosmeticPending.effects;
    const title = getCosmeticItem("titles",cosmeticPending.titles);
    if (cosmeticsPreviewName) cosmeticsPreviewName.textContent = nicknameInput?.value?.trim() || "Игрок Faction";
    if (cosmeticsPreviewTitle) cosmeticsPreviewTitle.textContent = (title?.name || "Участник Faction").toLocaleUpperCase("ru-RU");
    if (cosmeticsBalance) cosmeticsBalance.innerHTML = `${cosmeticState.balance.toLocaleString("ru-RU")} <small>FC</small>`;
  };
  const renderCosmetics = () => {
    if (!cosmeticsGrid) return;
    cosmeticsGrid.innerHTML = (cosmeticCatalog[cosmeticCategory] || []).map(item => {
      const owned = (cosmeticState.owned[cosmeticCategory] || []).includes(item.id);
      const equipped = cosmeticPending[cosmeticCategory] === item.id;
      const pending = !owned && item.price > cosmeticState.balance;
      const stateLabel = equipped ? "Выбрано" : owned ? "Надеть" : pending ? "Не хватает FC" : `Купить · ${item.price.toLocaleString("ru-RU")} FC`;
      return `<article class="cosmetic-item ${equipped ? "is-selected" : ""} ${owned ? "is-owned" : ""}" data-item-id="${item.id}"><div class="cosmetic-item-art cosmetic-art-${item.id}"><span>${item.icon}</span>${equipped ? '<b class="cosmetic-equipped-mark">✓</b>' : ""}</div><div class="cosmetic-item-meta"><span class="cosmetic-rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span><strong>${item.name}</strong><small>${item.desc}</small></div><button type="button" class="cosmetic-item-action" data-cosmetic-action="${item.id}" ${pending ? "disabled" : ""}>${stateLabel}</button></article>`;
    }).join("");
    renderCosmeticPreview();
  };
  document.querySelectorAll("[data-cosmetic-tab]").forEach(tab => tab.addEventListener("click", () => {
    cosmeticCategory = tab.dataset.cosmeticTab;
    document.querySelectorAll("[data-cosmetic-tab]").forEach(other => { const active = other === tab; other.classList.toggle("active",active); other.setAttribute("aria-selected",String(active)); });
    renderCosmetics();
  }));
  cosmeticsGrid?.addEventListener("click", event => {
    const button = event.target.closest("[data-cosmetic-action]");
    if (!button) return;
    const item = getCosmeticItem(cosmeticCategory,button.dataset.cosmeticAction);
    if (!item) return;
    const owned = (cosmeticState.owned[cosmeticCategory] || []).includes(item.id);
    if (!owned) {
      if (cosmeticState.balance < item.price) { showToast("Недостаточно FacCoins для покупки"); return; }
      cosmeticState.balance -= item.price;
      cosmeticState.owned[cosmeticCategory].push(item.id);
      showToast(`Открыто: ${item.name}`);
    }
    cosmeticPending[cosmeticCategory] = item.id;
    renderCosmetics();
  });
  document.getElementById("applyCosmetics")?.addEventListener("click", () => {
    cosmeticState.equipped = {...cosmeticPending};
    saveCosmeticState();
    document.body.dataset.cosmeticFrame = cosmeticState.equipped.frames;
    document.body.dataset.cosmeticBackground = cosmeticState.equipped.backgrounds;
    document.body.dataset.cosmeticEffect = cosmeticState.equipped.effects;
    renderCosmetics();
    showToast("Оформление профиля применено и сохранено в браузере");
  });
  nicknameInput?.addEventListener("input", renderCosmeticPreview);
  document.body.dataset.cosmeticFrame = cosmeticState.equipped.frames;
  document.body.dataset.cosmeticBackground = cosmeticState.equipped.backgrounds;
  document.body.dataset.cosmeticEffect = cosmeticState.equipped.effects;
  cosmeticPending = {...cosmeticState.equipped};
  renderCosmetics();

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
      <article class="staff-card reveal staff-tier-${index < 1 ? "leader" : index < 2 ? "executive" : "team"}">
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