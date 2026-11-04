const $ = (id) => document.getElementById(id);
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem("veyzen_" + key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem("veyzen_" + key, JSON.stringify(value)); }
};
let currentPage = "home";
let toastTimer;
function toast(message) { const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2100); }
function setTheme(theme) {
  document.body.dataset.theme = theme === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "minimal" : "veyzen") : theme;
  document.documentElement.style.setProperty("--custom-accent", store.get("accent", "#38bdf8"));
  store.set("theme", theme);
  document.querySelectorAll("[data-theme]").forEach(b=>b.classList.toggle("active",b.dataset.theme===theme));
}
function showPage(page) {
  currentPage=page;
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
  document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("selected",b.classList.contains("nav-item") && b.dataset.page===page));
  closeDrawer();
  if(page==="study") renderNotes();
  if(page==="gaming") renderGames();
  if(page==="planner") renderTasks();
}
function openDrawer(){ $("drawer").classList.add("open"); $("scrim").classList.add("show"); }
function closeDrawer(){ $("drawer").classList.remove("open"); $("scrim").classList.remove("show"); }
function enterApp(){ $("welcome").classList.add("hidden"); $("app").classList.remove("hidden"); $("helloName").textContent=store.get("displayName","Raikuro"); showPage("home"); updateNetwork(); }
function updateNetwork(){ $("networkStatus").textContent=navigator.onLine?"Online":"Offline"; }
function renderNotes(){const notes=store.get("notes",[]);$("noteCount").textContent=notes.length+" NOTES";$("notesList").innerHTML=notes.length?notes.map((n,i)=>`<article class="note-item"><b>${escapeHtml(n.title)}</b><p>${escapeHtml(n.body)}</p></article>`).join(""):'<div class="empty">No notes yet. Create your first one above.</div>';}
function renderGames(){const games=store.get("games",[]);$("gamesList").innerHTML=games.length?games.map(g=>`<div class="note-item"><b>🎮 ${escapeHtml(g)}</b></div>`).join(""):'<div class="empty">Your saved games will appear here.</div>';}
function renderTasks(){const tasks=store.get("tasks",[]);$("tasksList").innerHTML=tasks.length?tasks.map((t,i)=>`<div class="task-item ${t.done?'done':''}"><input type="checkbox" data-task="${i}" ${t.done?'checked':''}><span>${escapeHtml(t.text)}</span><button data-delete="${i}" aria-label="Delete task">×</button></div>`).join(""):'<div class="empty">No tasks yet. Add one to get started.</div>';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("guestBtn").addEventListener("click",()=>{store.set("displayName","Raikuro");store.set("mode","guest");enterApp();});
$("loginBtn").addEventListener("click",()=>toast("Account login will be enabled after secure backend setup."));
$("switchUser").addEventListener("click",()=>{$("app").classList.add("hidden");$("welcome").classList.remove("hidden");});
$("menuBtn").addEventListener("click",openDrawer);$("closeDrawer").addEventListener("click",closeDrawer);$("scrim").addEventListener("click",closeDrawer);
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("profileBtn").addEventListener("click",()=>showPage("settings"));
$("saveNote").addEventListener("click",()=>{const title=$("noteTitle").value.trim(),body=$("noteBody").value.trim();if(!title||!body){toast("Add a title and note first.");return;}const notes=store.get("notes",[]);notes.unshift({title,body});store.set("notes",notes);$("noteTitle").value="";$("noteBody").value="";renderNotes();toast("Note saved on this device.");});
document.querySelectorAll(".add-game").forEach(b=>b.addEventListener("click",()=>{const games=store.get("games",[]);if(!games.includes(b.dataset.game)){games.push(b.dataset.game);store.set("games",games);renderGames();toast("Added to your collection.");}else toast("Already in your collection.");}));
$("addTask").addEventListener("click",()=>{const text=$("taskInput").value.trim();if(!text)return;const tasks=store.get("tasks",[]);tasks.push({text,done:false});store.set("tasks",tasks);$("taskInput").value="";renderTasks();});
$("taskInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("addTask").click();});
$("tasksList").addEventListener("click",e=>{const i=e.target.dataset.delete;if(i!==undefined){const tasks=store.get("tasks",[]);tasks.splice(Number(i),1);store.set("tasks",tasks);renderTasks();}});
$("tasksList").addEventListener("change",e=>{const i=e.target.dataset.task;if(i!==undefined){const tasks=store.get("tasks",[]);tasks[Number(i)].done=e.target.checked;store.set("tasks",tasks);renderTasks();}});
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>{setTheme(b.dataset.theme);toast("Theme updated.");}));
$("accentPicker").value=store.get("accent","#38bdf8");$("accentPicker").addEventListener("input",e=>{store.set("accent",e.target.value);setTheme("custom");});
window.addEventListener("online",updateNetwork);window.addEventListener("offline",updateNetwork);
$("dateText").textContent=new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric"}).format(new Date());
setTheme(store.get("theme","veyzen"));
setTimeout(()=>{$("splash").style.opacity="0";setTimeout(()=>{$("splash").classList.add("hidden");$("welcome").classList.remove("hidden");},500);},2100);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
}
