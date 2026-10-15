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

  // Мастерская косметики: каталог, примерка, избранное, образы и локальное сохранение.
  const cosmeticsBalance = document.getElementById("cosmeticsBalance");
  const cosmeticsGrid = document.getElementById("cosmeticsGrid");
  const cosmeticsPreview = document.getElementById("cosmeticsPreview");
  const cosmeticsPreviewName = document.getElementById("cosmeticsPreviewName");
  const cosmeticsPreviewTitle = document.getElementById("cosmeticsPreviewTitle");
  const cosmeticsSearch = document.getElementById("cosmeticsSearch");
  const cosmeticsRarityFilter = document.getElementById("cosmeticsRarityFilter");
  const cosmeticsFavoritesOnly = document.getElementById("cosmeticsFavoritesOnly");
  const cosmeticsItemCount = document.getElementById("cosmeticsItemCount");
  const cosmeticCatalog = {
    avatars: [
      {id:"default",name:"Знак Faction",desc:"Фирменный аватар сообщества",price:0,rarity:"Базовая",icon:"F",collection:"Faction"},
      {id:"obsidian",name:"Обсидиан",desc:"Тёмный камень с фиолетовым отблеском",price:180,rarity:"Необычная",icon:"⬟",collection:"Бездны"},
      {id:"ember-avatar",name:"Искра Незера",desc:"Образ в цветах раскалённого камня",price:280,rarity:"Редкая",icon:"🔥",collection:"Незер"},
      {id:"end-avatar",name:"Странник Энда",desc:"Холодное сияние далёкого измерения",price:380,rarity:"Редкая",icon:"◉",collection:"Энд"},
      {id:"royal-avatar",name:"Королевский знак",desc:"Аметист и королевское золото",price:550,rarity:"Эпическая",icon:"♛",collection:"Королевская"},
      {id:"frost-avatar",name:"Ледяной страж",desc:"Сдержанный холодный стиль",price:620,rarity:"Эпическая",icon:"❄",collection:"Стихии"},
      {id:"dragon-avatar",name:"Драконья печать",desc:"Редкий знак древней силы",price:950,rarity:"Легендарная",icon:"♜",collection:"Дракон"},
      {id:"void-avatar",name:"Сердце Пустоты",desc:"Мифический символ тёмной энергии",price:1400,rarity:"Мифическая",icon:"✹",collection:"Бездны"}
    ],
    frames: [
      {id:"plain",name:"Стальная",desc:"Чистый металлический контур",price:0,rarity:"Базовая",icon:"◯",collection:"Классика"},
      {id:"royal",name:"Королевская",desc:"Золото и аметист Faction",price:0,rarity:"Базовая",icon:"♛",collection:"Королевская"},
      {id:"ember",name:"Пылающая",desc:"Жаркое свечение по краю",price:250,rarity:"Необычная",icon:"✦",collection:"Стихии"},
      {id:"ice",name:"Ледяная",desc:"Кристаллическая голубая кайма",price:320,rarity:"Редкая",icon:"❄",collection:"Стихии"},
      {id:"toxic",name:"Ядовитая",desc:"Кислотное зелёное свечение",price:390,rarity:"Редкая",icon:"☣",collection:"Незер"},
      {id:"end-frame",name:"Энд-руны",desc:"Фиолетовые древние символы",price:520,rarity:"Эпическая",icon:"ᚱ",collection:"Энд"},
      {id:"dragon",name:"Драконья",desc:"Переливающаяся легендарная рамка",price:850,rarity:"Легендарная",icon:"♜",collection:"Дракон"},
      {id:"celestial",name:"Небесная корона",desc:"Золотая орбита с сиянием",price:1250,rarity:"Мифическая",icon:"✺",collection:"Небесная"}
    ],
    backgrounds: [
      {id:"void",name:"Тёмная бездна",desc:"Фирменный фон Faction",price:0,rarity:"Базовая",icon:"◈",collection:"Бездны"},
      {id:"nether",name:"Незер",desc:"Багровые глубины и искры",price:220,rarity:"Необычная",icon:"◆",collection:"Незер"},
      {id:"end",name:"Край",desc:"Фиолетовая энергия Энда",price:300,rarity:"Редкая",icon:"✧",collection:"Энд"},
      {id:"royal-hall",name:"Золотой зал",desc:"Премиальный золотой узор",price:500,rarity:"Эпическая",icon:"♛",collection:"Королевская"},
      {id:"frost",name:"Ледяная цитадель",desc:"Сине-белое сияние и мороз",price:450,rarity:"Редкая",icon:"❄",collection:"Стихии"},
      {id:"forest",name:"Древний лес",desc:"Изумрудные отблески листвы",price:420,rarity:"Редкая",icon:"♧",collection:"Природа"},
      {id:"storm",name:"Грозовой фронт",desc:"Энергия молний в ночи",price:700,rarity:"Эпическая",icon:"ϟ",collection:"Стихии"},
      {id:"starfall",name:"Звездопад",desc:"Космическая пыль и дальние звёзды",price:1100,rarity:"Легендарная",icon:"✦",collection:"Небесная"}
    ],
    effects: [
      {id:"none",name:"Без эффекта",desc:"Минималистичный стиль",price:0,rarity:"Базовая",icon:"—",collection:"Классика"},
      {id:"spark",name:"Искры",desc:"Мерцающие золотые частицы",price:180,rarity:"Необычная",icon:"✦",collection:"Магия"},
      {id:"aura",name:"Аура силы",desc:"Пульсирующее сияние аватара",price:350,rarity:"Редкая",icon:"✺",collection:"Магия"},
      {id:"runes",name:"Древние руны",desc:"Вращающиеся магические знаки",price:480,rarity:"Эпическая",icon:"ᚱ",collection:"Энд"},
      {id:"flames",name:"Пламя",desc:"Живое тёплое свечение",price:420,rarity:"Редкая",icon:"♨",collection:"Незер"},
      {id:"lightning",name:"Разряд",desc:"Короткие вспышки энергии",price:600,rarity:"Эпическая",icon:"ϟ",collection:"Стихии"},
      {id:"snow",name:"Снежная пыль",desc:"Медленно падающие снежинки",price:520,rarity:"Эпическая",icon:"❄",collection:"Стихии"},
      {id:"cosmos",name:"Космический вихрь",desc:"Мифическая орбита частиц",price:1050,rarity:"Мифическая",icon:"✹",collection:"Небесная"}
    ],
    nickstyles: [
      {id:"classic",name:"Классический",desc:"Чистый светлый никнейм",price:0,rarity:"Базовая",icon:"Aa",collection:"Классика"},
      {id:"gold-nick",name:"Золотой",desc:"Тёплый металлический оттенок",price:180,rarity:"Необычная",icon:"Au",collection:"Королевская"},
      {id:"violet-nick",name:"Аметист",desc:"Фиолетовый градиент",price:220,rarity:"Необычная",icon:"A✦",collection:"Магия"},
      {id:"ice-nick",name:"Ледяной",desc:"Холодное голубое сияние",price:280,rarity:"Редкая",icon:"❄",collection:"Стихии"},
      {id:"fire-nick",name:"Огненный",desc:"Градиент пламени",price:350,rarity:"Редкая",icon:"♨",collection:"Незер"},
      {id:"toxic-nick",name:"Неоновый",desc:"Яркий кислотный контур",price:390,rarity:"Эпическая",icon:"N",collection:"Неон"},
      {id:"prism-nick",name:"Призма",desc:"Переливающиеся цвета",price:620,rarity:"Легендарная",icon:"◇",collection:"Неон"},
      {id:"mythic-nick",name:"Божественный",desc:"Золото и фиолетовая энергия",price:950,rarity:"Мифическая",icon:"✹",collection:"Небесная"}
    ],
    titles: [
      {id:"member",name:"Участник Faction",desc:"Стандартный титул",price:0,rarity:"Базовая",icon:"♟",collection:"Классика"},
      {id:"veteran",name:"Ветеран",desc:"За верность сообществу",price:180,rarity:"Необычная",icon:"⚔",collection:"Ранги"},
      {id:"builder",name:"Мастер строек",desc:"Для создателей миров",price:240,rarity:"Редкая",icon:"▦",collection:"Ранги"},
      {id:"hunter",name:"Охотник за трофеями",desc:"Холодный и точный стиль",price:320,rarity:"Редкая",icon:"⚔",collection:"Ранги"},
      {id:"conqueror",name:"Завоеватель",desc:"Для тех, кто идёт вперёд",price:450,rarity:"Эпическая",icon:"♜",collection:"Ранги"},
      {id:"shadow",name:"Тень Незера",desc:"Титул тёмной коллекции",price:520,rarity:"Эпическая",icon:"◆",collection:"Незер"},
      {id:"legend",name:"Легенда клана",desc:"Золотой титул высокого класса",price:750,rarity:"Легендарная",icon:"✹",collection:"Королевская"},
      {id:"voidlord",name:"Владыка Бездны",desc:"Мифический титул коллекционера",price:1250,rarity:"Мифическая",icon:"♛",collection:"Бездны"}
    ],
    badges: [
      {id:"star-badge",name:"Звезда",desc:"Небольшой знак у аватара",price:0,rarity:"Базовая",icon:"✦",collection:"Классика"},
      {id:"crown-badge",name:"Корона",desc:"Символ королевской коллекции",price:150,rarity:"Необычная",icon:"♛",collection:"Королевская"},
      {id:"sword-badge",name:"Клинок",desc:"Знак боевого духа",price:200,rarity:"Необычная",icon:"⚔",collection:"Ранги"},
      {id:"rune-badge",name:"Руна",desc:"Древний магический символ",price:260,rarity:"Редкая",icon:"ᚱ",collection:"Энд"},
      {id:"flame-badge",name:"Пламя",desc:"Знак огненной коллекции",price:300,rarity:"Редкая",icon:"♨",collection:"Незер"},
      {id:"diamond-badge",name:"Алмаз",desc:"Чистый кристальный акцент",price:380,rarity:"Эпическая",icon:"◆",collection:"Кристалл"},
      {id:"dragon-badge",name:"Дракон",desc:"Редкий знак силы",price:650,rarity:"Легендарная",icon:"♜",collection:"Дракон"},
      {id:"eclipse-badge",name:"Затмение",desc:"Мифический знак Пустоты",price:1000,rarity:"Мифическая",icon:"◉",collection:"Бездны"}
    ],
    themes: [
      {id:"faction",name:"Faction Classic",desc:"Фирменный фиолетовый и золото",price:0,rarity:"Базовая",icon:"F",collection:"Классика"},
      {id:"royal-theme",name:"Королевская",desc:"Глубокий пурпур и золото",price:180,rarity:"Необычная",icon:"♛",collection:"Королевская"},
      {id:"inferno-theme",name:"Инферно",desc:"Багровый огонь и уголь",price:250,rarity:"Редкая",icon:"♨",collection:"Незер"},
      {id:"frost-theme",name:"Мороз",desc:"Лёд, серебро и холодный свет",price:280,rarity:"Редкая",icon:"❄",collection:"Стихии"},
      {id:"toxic-theme",name:"Токсик",desc:"Кислотные неоновые акценты",price:350,rarity:"Эпическая",icon:"☣",collection:"Неон"},
      {id:"end-theme",name:"Энд",desc:"Энергия фиолетового измерения",price:420,rarity:"Эпическая",icon:"◉",collection:"Энд"},
      {id:"celestial-theme",name:"Небесная",desc:"Звёздное сияние и белое золото",price:680,rarity:"Легендарная",icon:"✦",collection:"Небесная"},
      {id:"mythic-theme",name:"Мифическая Пустота",desc:"Чёрный обсидиан и призрачный свет",price:1000,rarity:"Мифическая",icon:"◇",collection:"Бездны"}
    ]
  };
  const cosmeticCategories = Object.keys(cosmeticCatalog);
  const cosmeticDefaults = {
    balance:1250,
    owned:{avatars:["default"],frames:["plain","royal"],backgrounds:["void"],effects:["none"],nickstyles:["classic"],titles:["member"],badges:["star-badge"],themes:["faction"]},
    equipped:{avatars:"default",frames:"royal",backgrounds:"void",effects:"none",nickstyles:"classic",titles:"member",badges:"star-badge",themes:"faction"},
    favorites:[], avatarData:"", loadouts:[null,null,null]
  };
  const cosmeticStorageKey = "faction-cosmetics-shop-v2";
  let cosmeticState = JSON.parse(JSON.stringify(cosmeticDefaults));
  try {
    const stored = localStorage.getItem(cosmeticStorageKey) || localStorage.getItem("faction-cosmetics-shop-v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Number.isFinite(parsed.balance) && parsed.owned && parsed.equipped) {
        cosmeticState = {...cosmeticDefaults,...parsed,owned:{...cosmeticDefaults.owned,...parsed.owned},equipped:{...cosmeticDefaults.equipped,...parsed.equipped},favorites:Array.isArray(parsed.favorites)?parsed.favorites:[],loadouts:Array.isArray(parsed.loadouts)?parsed.loadouts.slice(0,3):[null,null,null]};
        cosmeticCategories.forEach(category => {
          cosmeticState.owned[category] = Array.isArray(cosmeticState.owned[category]) ? cosmeticState.owned[category].filter(id => getCatalogItem(category,id)) : [...cosmeticDefaults.owned[category]];
          if (!getCatalogItem(category,cosmeticState.equipped[category])) cosmeticState.equipped[category] = cosmeticDefaults.equipped[category];
          if (!cosmeticState.owned[category].includes(cosmeticState.equipped[category])) cosmeticState.owned[category].push(cosmeticState.equipped[category]);
        });
      }
    }
  } catch (_) { cosmeticState = JSON.parse(JSON.stringify(cosmeticDefaults)); }
  let cosmeticCategory = "avatars";
  let cosmeticPending = {...cosmeticState.equipped};
  let activeLoadout = 0;
  const cosmeticEscape = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  function getCatalogItem(category,id) { return (cosmeticCatalog[category] || []).find(item => item.id === id); }
  const saveCosmeticState = () => { try { localStorage.setItem(cosmeticStorageKey, JSON.stringify(cosmeticState)); } catch (_) { showToast("Не удалось сохранить данные. Возможно, хранилище браузера заполнено."); } };
  const getAllCosmetics = () => cosmeticCategories.flatMap(category => cosmeticCatalog[category].map(item => ({...item,category})));
  const syncCosmeticAvatar = () => {
    const selectedAvatar = cosmeticPending.avatars || "default";
    const source = cosmeticState.avatarData || "assets/faction-avatar.svg";
    ["profileAvatarSmall","profileAvatarLarge","cosmeticsPreviewAvatar"].forEach(id => { const image = document.getElementById(id); if (image) image.src = source; });
    document.querySelectorAll(".dashboard-avatar img").forEach(image => { image.src = source; });
    if (cosmeticsPreview) cosmeticsPreview.dataset.avatar = selectedAvatar;
    const applied = cosmeticState.equipped || cosmeticDefaults.equipped;
    const wrappers = [document.querySelector(".profile-avatar-large"),document.querySelector(".profile-trigger-ring"),...document.querySelectorAll(".dashboard-avatar")].filter(Boolean);
    wrappers.forEach(wrapper => { wrapper.dataset.frame = applied.frames; wrapper.dataset.avatar = applied.avatars; wrapper.dataset.effect = applied.effects; wrapper.dataset.theme = applied.themes; });
    const nicknameTargets = [document.getElementById("dashboardNickname"),document.querySelector(".profile-trigger-label")].filter(Boolean);
    nicknameTargets.forEach(target => { target.dataset.nick = applied.nickstyles; target.dataset.theme = applied.themes; });
  };
  const renderCosmeticPreview = () => {
    if (!cosmeticsPreview) return;
    cosmeticCategories.forEach(category => { cosmeticsPreview.dataset[category === "nickstyles" ? "nick" : category === "themes" ? "theme" : category === "avatars" ? "avatar" : category === "badges" ? "badge" : category === "frames" ? "frame" : category === "backgrounds" ? "background" : category === "effects" ? "effect" : category] = cosmeticPending[category]; });
    const title = getCatalogItem("titles",cosmeticPending.titles);
    const badge = getCatalogItem("badges",cosmeticPending.badges);
    if (cosmeticsPreviewName) cosmeticsPreviewName.textContent = nicknameInput?.value?.trim() || "Игрок Faction";
    if (cosmeticsPreviewTitle) cosmeticsPreviewTitle.textContent = (title?.name || "Участник Faction").toLocaleUpperCase("ru-RU");
    const badgeEl = document.getElementById("cosmeticAvatarBadge"); if (badgeEl) badgeEl.textContent = badge?.icon || "✦";
    const rarityEl = document.getElementById("cosmeticPreviewRarity"); if (rarityEl) rarityEl.textContent = getCatalogItem("themes",cosmeticPending.themes)?.name || "CUSTOM";
    if (cosmeticsBalance) cosmeticsBalance.innerHTML = `${cosmeticState.balance.toLocaleString("ru-RU")} <small>FC</small>`;
    const profileCoins = document.getElementById("profileCoinsBalance"); if (profileCoins) profileCoins.innerHTML = `${cosmeticState.balance.toLocaleString("ru-RU")} <small>FC</small>`;
    syncCosmeticAvatar();
  };
  const renderCosmetics = () => {
    if (!cosmeticsGrid) return;
    const query = (cosmeticsSearch?.value || "").trim().toLocaleLowerCase("ru-RU");
    const rarity = cosmeticsRarityFilter?.value || "all";
    const favoritesOnly = Boolean(cosmeticsFavoritesOnly?.checked);
    const items = (cosmeticCatalog[cosmeticCategory] || []).filter(item => {
      const matchesQuery = !query || `${item.name} ${item.desc} ${item.collection}`.toLocaleLowerCase("ru-RU").includes(query);
      const matchesRarity = rarity === "all" || item.rarity === rarity;
      const matchesFavorite = !favoritesOnly || cosmeticState.favorites.includes(`${cosmeticCategory}:${item.id}`);
      return matchesQuery && matchesRarity && matchesFavorite;
    });
    if (cosmeticsItemCount) cosmeticsItemCount.textContent = `${items.length} ${items.length === 1 ? "предмет" : items.length < 5 ? "предмета" : "предметов"}`;
    cosmeticsGrid.innerHTML = items.length ? items.map(item => {
      const owned = (cosmeticState.owned[cosmeticCategory] || []).includes(item.id);
      const equipped = cosmeticPending[cosmeticCategory] === item.id;
      const insufficient = !owned && item.price > cosmeticState.balance;
      const favoriteKey = `${cosmeticCategory}:${item.id}`;
      const favorite = cosmeticState.favorites.includes(favoriteKey);
      const actionLabel = equipped ? "✓ На примерке" : owned ? "Надеть" : insufficient ? "Не хватает FC" : `Купить · ${item.price.toLocaleString("ru-RU")} FC`;
      return `<article class="cosmetic-item rarity-card-${item.rarity.toLowerCase().replace(/[^a-zа-яё]/gi,"") } ${equipped ? "is-selected" : ""} ${owned ? "is-owned" : ""}" data-item-id="${cosmeticEscape(item.id)}"><div class="cosmetic-item-art cosmetic-art-${cosmeticEscape(item.id)}" data-category="${cosmeticCategory}"><span>${cosmeticEscape(item.icon)}</span>${equipped ? '<b class="cosmetic-equipped-mark">✓</b>' : ""}<small>${cosmeticEscape(item.collection)}</small></div><div class="cosmetic-item-meta"><span class="cosmetic-rarity rarity-${cosmeticEscape(item.rarity.toLowerCase())}">${cosmeticEscape(item.rarity)}</span><strong>${cosmeticEscape(item.name)}</strong><small>${cosmeticEscape(item.desc)}</small></div><button type="button" class="cosmetic-favorite ${favorite ? "is-favorite" : ""}" data-cosmetic-favorite="${cosmeticEscape(item.id)}" aria-label="${favorite ? "Убрать из избранного" : "Добавить в избранное"}" aria-pressed="${favorite}">♥</button><button type="button" class="cosmetic-item-action" data-cosmetic-action="${cosmeticEscape(item.id)}" ${insufficient || equipped ? "disabled" : ""}>${actionLabel}</button></article>`;
    }).join("") : `<div class="cosmetics-empty"><span>⌕</span><strong>Ничего не найдено</strong><small>Измени запрос или фильтр, чтобы увидеть другие предметы.</small></div>`;
    renderCosmeticPreview();
  };
  document.querySelectorAll("[data-cosmetic-tab]").forEach(tab => tab.addEventListener("click", () => {
    cosmeticCategory = tab.dataset.cosmeticTab;
    document.querySelectorAll("[data-cosmetic-tab]").forEach(other => { const active = other === tab; other.classList.toggle("active",active); other.setAttribute("aria-selected",String(active)); });
    renderCosmetics();
  }));
  cosmeticsSearch?.addEventListener("input", renderCosmetics);
  cosmeticsRarityFilter?.addEventListener("change", renderCosmetics);
  cosmeticsFavoritesOnly?.addEventListener("change", renderCosmetics);
  cosmeticsGrid?.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-cosmetic-favorite]");
    if (favoriteButton) {
      const key = `${cosmeticCategory}:${favoriteButton.dataset.cosmeticFavorite}`;
      cosmeticState.favorites = cosmeticState.favorites.includes(key) ? cosmeticState.favorites.filter(value => value !== key) : [...cosmeticState.favorites,key];
      saveCosmeticState(); renderCosmetics(); return;
    }
    const button = event.target.closest("[data-cosmetic-action]");
    if (!button) return;
    const item = getCatalogItem(cosmeticCategory,button.dataset.cosmeticAction);
    if (!item) return;
    const owned = (cosmeticState.owned[cosmeticCategory] || []).includes(item.id);
    if (!owned) {
      if (cosmeticState.balance < item.price) { showToast("Недостаточно FacCoins для покупки"); return; }
      cosmeticState.balance -= item.price;
      cosmeticState.owned[cosmeticCategory].push(item.id);
      saveCosmeticState();
      showToast(`Предмет приобретён: ${item.name}`);
    }
    cosmeticPending[cosmeticCategory] = item.id;
    renderCosmetics();
  });
  document.getElementById("applyCosmetics")?.addEventListener("click", () => {
    const unavailable = cosmeticCategories.find(category => !cosmeticState.owned[category].includes(cosmeticPending[category]));
    if (unavailable) { showToast("В образе есть закрытые предметы. Купи их перед применением или выбери доступные."); return; }
    cosmeticState.equipped = {...cosmeticPending};
    saveCosmeticState();
    cosmeticCategories.forEach(category => { const key = category === "nickstyles" ? "nick" : category === "themes" ? "theme" : category === "avatars" ? "avatar" : category === "badges" ? "badge" : category === "frames" ? "frame" : category === "backgrounds" ? "background" : "effect"; document.body.dataset[`cosmetic${key[0].toUpperCase()}${key.slice(1)}`] = cosmeticState.equipped[category]; });
    renderCosmetics(); showToast("Оформление профиля применено и сохранено в браузере");
  });
  document.getElementById("resetCosmetics")?.addEventListener("click", () => { cosmeticPending = {...cosmeticState.equipped}; renderCosmetics(); showToast("Примерка сброшена к текущему образу"); });
  document.getElementById("saveLoadout")?.addEventListener("click", () => {
    cosmeticState.loadouts[activeLoadout] = {...cosmeticPending}; saveCosmeticState();
    document.querySelectorAll("[data-loadout]").forEach(button => button.classList.toggle("is-active", Number(button.dataset.loadout) === activeLoadout));
    showToast(`Образ сохранён в слоте ${activeLoadout + 1}`);
  });
  document.querySelectorAll("[data-loadout]").forEach(button => button.addEventListener("click", () => {
    activeLoadout = Number(button.dataset.loadout);
    document.querySelectorAll("[data-loadout]").forEach(other => other.classList.toggle("is-active", other === button));
    const loadout = cosmeticState.loadouts[activeLoadout];
    if (loadout) { cosmeticPending = {...cosmeticState.equipped,...loadout}; showToast("Образ загружен для примерки"); }
    else if (activeLoadout === 1) cosmeticPending = {...cosmeticState.equipped,backgrounds:"nether",frames:"ember",effects:"flames",nickstyles:"fire-nick",themes:"inferno-theme",badges:"flame-badge"};
    else if (activeLoadout === 2) cosmeticPending = {...cosmeticState.equipped,backgrounds:"royal-hall",frames:"dragon",effects:"spark",nickstyles:"gold-nick",themes:"royal-theme",badges:"crown-badge",titles:"legend"};
    else cosmeticPending = {...cosmeticState.equipped};
    renderCosmetics();
    if (Object.keys(cosmeticPending).some(category => !cosmeticState.owned[category].includes(cosmeticPending[category]))) showToast("Пресет можно примерить целиком. Закрытые предметы нужно купить перед применением.");
  }));
  const avatarUpload = document.getElementById("cosmeticAvatarUpload");
  avatarUpload?.addEventListener("change", () => {
    const file = avatarUpload.files?.[0]; if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) { showToast("Выбери PNG, JPG или WebP размером до 5 МБ"); avatarUpload.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image(); image.onload = () => {
        const canvas = document.createElement("canvas"); const size = 256; canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d"); const scale = Math.max(size / image.width, size / image.height); const width = image.width * scale; const height = image.height * scale;
        ctx.drawImage(image,(size-width)/2,(size-height)/2,width,height);
        try { cosmeticState.avatarData = canvas.toDataURL("image/webp",0.82); saveCosmeticState(); syncCosmeticAvatar(); showToast("Аватар загружен и сохранён"); }
        catch (_) { showToast("Не удалось сохранить изображение. Попробуй файл меньшего размера."); }
      }; image.onerror = () => showToast("Не удалось открыть это изображение"); image.src = String(reader.result);
    }; reader.readAsDataURL(file);
  });
  document.getElementById("resetCosmeticAvatar")?.addEventListener("click", () => { cosmeticState.avatarData = ""; saveCosmeticState(); syncCosmeticAvatar(); if (avatarUpload) avatarUpload.value = ""; showToast("Установлен стандартный аватар"); });
  nicknameInput?.addEventListener("input", renderCosmeticPreview);
  cosmeticCategories.forEach(category => { if (!cosmeticState.owned[category].includes(cosmeticState.equipped[category])) cosmeticState.owned[category].push(cosmeticState.equipped[category]); });
  cosmeticPending = {...cosmeticState.equipped};
  cosmeticCategories.forEach(category => { const key = category === "nickstyles" ? "nick" : category === "themes" ? "theme" : category === "avatars" ? "avatar" : category === "badges" ? "badge" : category === "frames" ? "frame" : category === "backgrounds" ? "background" : "effect"; document.body.dataset[`cosmetic${key[0].toUpperCase()}${key.slice(1)}`] = cosmeticState.equipped[category]; });
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