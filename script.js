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

  // FAQ-помощник с заранее подготовленными ответами. Работает без API и сервера.
  const assistantLauncher = document.getElementById("assistantLauncher");
  const assistantPanel = document.getElementById("assistantPanel");
  const assistantClose = document.getElementById("assistantClose");
  const assistantAnswer = document.getElementById("assistantAnswer");
  const assistantAnswers = [
    { title: "Как вступить в Faction?", text: "Чтобы узнать актуальные условия вступления, открой раздел «Сообщество» и свяжись с персоналом через доступные площадки. Требования могут меняться, поэтому окончательные условия уточняй у представителей клана." },
    { title: "Как узнать правила клана?", text: "Актуальные правила следует уточнять у персонала Faction или в официальных сообщениях клана. Если правила опубликованы в Telegram или Discord, используй ссылки в разделе «Сообщество»." },
    { title: "Что такое FacCoins?", text: "FacCoins (FC) — внутренняя валюта экономики Faction. В зависимости от действующих функций бота её можно использовать для доступных клановых возможностей, например аукционов и наград. Актуальные команды и цены проверяй в боте клана." },
    { title: "Как связаться с персоналом?", text: "Открой раздел «Персонал», чтобы ознакомиться с командой и ролями. Для связи также доступны Telegram и Discord в разделе «Сообщество»." },
    { title: "Где смотреть новости?", text: "Открой вкладку «Новости» на сайте. Важные объявления и обновления также могут публиковаться в Telegram-канале Faction." },
    { title: "Где найти Telegram и Discord?", text: "Открой вкладку «Сообщество». Там размещены отдельные карточки Telegram и Discord с кнопками перехода." }
  ];
  const closeAssistant = () => {
    if (!assistantLauncher || !assistantPanel) return;
    assistantPanel.hidden = true;
    assistantLauncher.setAttribute("aria-expanded", "false");
  };
  assistantLauncher?.addEventListener("click", () => {
    const willOpen = assistantPanel?.hidden ?? false;
    if (!assistantPanel) return;
    assistantPanel.hidden = !willOpen;
    assistantLauncher.setAttribute("aria-expanded", String(willOpen));
  });
  assistantClose?.addEventListener("click", closeAssistant);
  document.querySelectorAll("#assistantQuestions [data-question]").forEach(button => {
    button.addEventListener("click", () => {
      const item = assistantAnswers[Number(button.dataset.question)];
      if (!item || !assistantAnswer) return;
      assistantAnswer.replaceChildren();
      const label = document.createElement("span");
      label.className = "assistant-answer-label";
      label.textContent = item.title.toUpperCase();
      const paragraph = document.createElement("p");
      paragraph.textContent = item.text;
      assistantAnswer.append(label, paragraph);
      document.querySelectorAll("#assistantQuestions button").forEach(question => question.setAttribute("aria-pressed", String(question === button)));
    });
  });

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