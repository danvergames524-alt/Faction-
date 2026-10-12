const defaultStaff = [
  {id:"leader",name:"Leader",role:"Глава клана",description:"Стратегия, развитие и ключевые решения Faction.",rank:"◆"},
  {id:"advisor",name:"Recriver",role:"Главный советник",description:"Помощь руководству и развитие внутренних систем.",rank:"✦"},
  {id:"moderator",name:"Moderator",role:"Модератор",description:"Порядок в сообществе и поддержка участников.",rank:"⚔"}
];
const STORAGE_KEY = "faction-minecraft-staff-v1";
const $ = id => document.getElementById(id);
let staff = loadStaff();

function loadStaff(){
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : [...defaultStaff]; }
  catch { return [...defaultStaff]; }
}
function saveStaff(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(staff)); }
function escapeHtml(value=""){ return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
function renderStaff(){
  const grid = $("staffGrid");
  if(!staff.length){ grid.innerHTML = '<div class="empty-staff">Состав пока пуст. Добавь первого участника через редактор ниже.</div>'; return; }
  grid.innerHTML = staff.map((person,index)=>`
    <article class="staff-card">
      <div class="staff-card-top">
        <div class="staff-avatar" aria-hidden="true">${escapeHtml(person.rank || "✦")}</div>
        <div><div class="staff-name">${escapeHtml(person.name)}</div><div class="staff-role">${escapeHtml(person.role)}</div></div>
      </div>
      <p class="staff-desc">${escapeHtml(person.description || "Участник команды Faction.")}</p>
      <div class="staff-bottom"><span>FACTION PERSONNEL / ${(index+1).toString().padStart(2,"0")}</span>
        <span class="staff-actions"><button class="mini-action" data-edit="${escapeHtml(person.id)}" type="button">Изменить</button><button class="mini-action" data-delete="${escapeHtml(person.id)}" type="button" aria-label="Удалить ${escapeHtml(person.name)}">×</button></span>
      </div>
    </article>`).join("");
}
function toast(message){ const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600); }
function resetForm(){ $("staffId").value=""; $("staffForm").reset(); $("staffSubmit").innerHTML='Добавить участника <span>+</span>'; $("cancelEdit").classList.add("hidden"); }
$("staffForm").addEventListener("submit", event=>{
  event.preventDefault();
  const id=$("staffId").value;
  const person={id:id || `staff-${Date.now()}`,name:$("staffName").value.trim(),role:$("staffRole").value.trim(),description:$("staffDescription").value.trim(),rank:$("staffRank").value};
  if(!person.name || !person.role) return;
  if(id){ staff=staff.map(item=>item.id===id?person:item); toast("Карточка участника обновлена."); }
  else { staff.push(person); toast("Участник добавлен в состав."); }
  saveStaff(); renderStaff(); resetForm();
});
$("staffGrid").addEventListener("click",event=>{
  const edit=event.target.closest("[data-edit]"); const del=event.target.closest("[data-delete]");
  if(edit){
    const person=staff.find(item=>item.id===edit.dataset.edit); if(!person)return;
    $("staffId").value=person.id; $("staffName").value=person.name; $("staffRole").value=person.role; $("staffDescription").value=person.description||""; $("staffRank").value=person.rank||"✦";
    $("staffSubmit").innerHTML='Сохранить изменения <span>✓</span>'; $("cancelEdit").classList.remove("hidden");
    $("staff-tools").scrollIntoView({behavior:"smooth",block:"center"}); $("staffName").focus();
  }
  if(del){
    const person=staff.find(item=>item.id===del.dataset.delete); if(!person)return;
    if(confirm(`Удалить участника «${person.name}»?`)){staff=staff.filter(item=>item.id!==person.id);saveStaff();renderStaff();resetForm();toast("Карточка удалена.");}
  }
});
$("cancelEdit").addEventListener("click",resetForm);
$("resetStaff").addEventListener("click",()=>{
  if(confirm("Вернуть демонстрационный состав? Текущие карточки будут заменены.")){staff=defaultStaff.map(p=>({...p}));saveStaff();renderStaff();resetForm();toast("Демо-состав восстановлен.");}
});
$("exportData").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({staff},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="faction-site-data.json";a.click();URL.revokeObjectURL(url);toast("Резервная копия подготовлена.");
});
$("importData").addEventListener("change",async event=>{
  const file=event.target.files[0];if(!file)return;
  try{const data=JSON.parse(await file.text());const incoming=Array.isArray(data)?data:data.staff;if(!Array.isArray(incoming))throw new Error("bad data");
    staff=incoming.map((p,i)=>({id:String(p.id||`import-${Date.now()}-${i}`),name:String(p.name||"Участник").slice(0,30),role:String(p.role||"Персонал").slice(0,45),description:String(p.description||"").slice(0,120),rank:String(p.rank||"✦").slice(0,3)}));
    saveStaff();renderStaff();resetForm();toast("Данные импортированы.");
  }catch{toast("Не удалось прочитать JSON-файл.");}finally{event.target.value="";}
});
$("menuToggle").addEventListener("click",()=>{
  const open=$("nav").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));$("menuToggle").textContent=open?"×":"☰";
});
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>{$("nav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");$("menuToggle").textContent="☰";document.querySelectorAll(".nav-link").forEach(item=>item.classList.remove("active"));link.classList.add("active");}));
const sections=[...document.querySelectorAll("main section[id]")];
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.id;document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.getAttribute("href")===`#${id}`));}}),{rootMargin:"-35% 0px -55% 0px"});sections.forEach(section=>observer.observe(section));}
$("year").textContent=new Date().getFullYear();
renderStaff();
