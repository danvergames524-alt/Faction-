(() => {
  "use strict";
  const DEFAULT_STAFF = [
    {id:"s1",name:"Лидер Faction",role:"Главный лидер",desc:"Стратегия и ключевые решения клана.",tag:"РУКОВОДСТВО"},
    {id:"s2",name:"MrVitamin",role:"Президент клана",desc:"Координация управления и работа с составом.",tag:"РУКОВОДСТВО"},
    {id:"s3",name:"Requiem",role:"Главный советник · Дипломат",desc:"Реформы, управленческие решения и внешние связи.",tag:"ДИПЛОМАТИЯ"},
    {id:"s4",name:"Команда модерации",role:"Модераторы",desc:"Порядок, помощь участникам и ежедневная работа.",tag:"АДМИНИСТРАЦИЯ"}
  ];
  const DEFAULT_NEWS = [
    {date:"ОБНОВЛЕНИЕ",category:"ИНФРАСТРУКТУРА",title:"Faction развивает собственную систему",desc:"Клановая инфраструктура постепенно расширяется: инструменты, процессы и внутренние сервисы становятся удобнее."},
    {date:"ЭКОНОМИКА",category:"ВОЗМОЖНОСТИ",title:"Фонд и аукционы",desc:"Внутренняя экономика помогает поддерживать активность, поощрять вклад и открывать новые возможности участникам."},
    {date:"РАЗВИТИЕ",category:"СОСТАВ",title:"Сильный клан строится командой",desc:"Faction продолжает совершенствовать распределение ролей, коммуникацию и работу с участниками."}
  ];
  const STORAGE_KEY = "factionSiteDataV1";
  const $ = (id) => document.getElementById(id);
  let data = loadData();
  let editingEnabled = false;
  let toastTimer;

  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.staff) && Array.isArray(saved.news)) return saved;
    } catch (e) { /* corrupted local cache: use defaults */ }
    return {staff: structuredCloneSafe(DEFAULT_STAFF), news: structuredCloneSafe(DEFAULT_NEWS)};
  }
  function structuredCloneSafe(value) { return JSON.parse(JSON.stringify(value)); }
  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderStaff();
  }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function initials(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] || "F").slice(0,2)).toUpperCase();
  }
  function renderStaff() {
    const grid = $("staffGrid");
    grid.innerHTML = data.staff.map(person => `
      <article class="staff-card">
        <div class="staff-top"><div class="staff-avatar">${esc(initials(person.name))}</div><span class="staff-tag">${esc(person.tag || "ПЕРСОНАЛ")}</span></div>
        <h3>${esc(person.name)}</h3><p class="staff-role">${esc(person.role)}</p><p class="staff-desc">${esc(person.desc || "")}</p>
        ${editingEnabled ? `<div class="staff-actions"><button type="button" data-edit="${esc(person.id)}">Изменить</button><button type="button" data-delete="${esc(person.id)}">Удалить</button></div>` : ""}
      </article>`).join("");
  }
  function renderNews() {
    $("newsGrid").innerHTML = data.news.map((item, i) => `
      <article class="news-card"><span class="news-number">0${i+1}</span>
      <div class="news-meta"><span>◆</span>${esc(item.date || "FACTION")} <span>/</span> ${esc(item.category || "НОВОСТИ")}</div>
      <h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p></article>`).join("");
  }
  function showToast(message) {
    const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function resetForm() {
    $("staffForm").reset(); $("staffId").value = "";
    $("saveStaff").textContent = "Сохранить участника"; $("cancelEdit").classList.add("hidden");
  }
  function startEdit(id) {
    const person = data.staff.find(p => p.id === id); if (!person) return;
    $("staffId").value = person.id; $("staffName").value = person.name;
    $("staffRole").value = person.role; $("staffDesc").value = person.desc || "";
    $("staffTag").value = person.tag || "ПЕРСОНАЛ";
    $("saveStaff").textContent = "Сохранить изменения"; $("cancelEdit").classList.remove("hidden");
    $("editPanel").scrollIntoView({behavior:"smooth",block:"center"});
  }

  $("editToggle").addEventListener("click", () => {
    editingEnabled = !editingEnabled;
    $("editPanel").classList.toggle("hidden", !editingEnabled);
    $("editToggle").textContent = editingEnabled ? "✓ Редактирование включено" : "✎ Редактировать состав";
    renderStaff();
    if (editingEnabled) $("editPanel").scrollIntoView({behavior:"smooth",block:"nearest"});
  });
  $("closeEditor").addEventListener("click", () => {
    editingEnabled = false; $("editPanel").classList.add("hidden");
    $("editToggle").textContent = "✎ Редактировать состав"; renderStaff();
  });
  $("staffGrid").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-delete]");
    if (edit) startEdit(edit.dataset.edit);
    if (del) {
      const person = data.staff.find(p => p.id === del.dataset.delete);
      if (person && confirm(`Удалить «${person.name}» из состава?`)) {
        data.staff = data.staff.filter(p => p.id !== person.id); saveData(); resetForm(); showToast("Участник удалён.");
      }
    }
  });
  $("staffForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("staffId").value || `s${Date.now()}`;
    const person = {id, name:$("staffName").value.trim(), role:$("staffRole").value.trim(), desc:$("staffDesc").value.trim(), tag:$("staffTag").value};
    if (!person.name || !person.role) return;
    const index = data.staff.findIndex(p => p.id === id);
    if (index >= 0) data.staff[index] = person; else data.staff.push(person);
    saveData(); resetForm(); showToast("Состав сохранён в этом браузере.");
  });
  $("cancelEdit").addEventListener("click", resetForm);
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "faction-data.json"; a.click(); URL.revokeObjectURL(url);
    showToast("JSON экспортирован.");
  });
  $("importData").addEventListener("change", async event => {
    const file = event.target.files && event.target.files[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.staff) || !Array.isArray(parsed.news)) throw new Error("wrong shape");
      data = parsed; localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); renderStaff(); renderNews();
      showToast("Данные импортированы.");
    } catch (e) { showToast("Не удалось прочитать JSON. Проверь файл."); }
    event.target.value = "";
  });
  $("resetData").addEventListener("click", () => {
    if (!confirm("Сбросить локальные изменения к исходному составу и новостям?")) return;
    data = {staff:structuredCloneSafe(DEFAULT_STAFF),news:structuredCloneSafe(DEFAULT_NEWS)};
    localStorage.removeItem(STORAGE_KEY); renderStaff(); renderNews(); resetForm(); showToast("Исходные данные восстановлены.");
  });
  $("menuBtn").addEventListener("click", () => $("nav").classList.toggle("open"));
  $("nav").addEventListener("click", event => { if (event.target.closest("a")) $("nav").classList.remove("open"); });
  $("langBtn").addEventListener("click", () => showToast("Украинская версия интерфейса будет добавлена отдельно."));
  $("year").textContent = new Date().getFullYear();
  renderStaff(); renderNews();
})();