const fallbackMovies = [
 {id:1,title:"Vikram",year:2022,language:"Tamil",genre:"Action",rating:"8.3",symbol:"வ",accent:"#a94740",overview:"A special investigator uncovers a dangerous network in this high-energy action thriller.",trailer:"https://www.youtube.com/results?search_query=Vikram+official+trailer"},
 {id:2,title:"Jai Bhim",year:2021,language:"Tamil",genre:"Drama",rating:"8.7",symbol:"நீதி",accent:"#bd8951",overview:"A lawyer fights for justice for a marginalized community in a powerful courtroom drama.",trailer:"https://www.youtube.com/results?search_query=Jai+Bhim+official+trailer"},
 {id:3,title:"Interstellar",year:2014,language:"English",genre:"Sci-Fi",rating:"8.7",symbol:"✦",accent:"#527da8",overview:"Explorers travel beyond this galaxy to secure humanity's future.",trailer:"https://www.youtube.com/results?search_query=Interstellar+official+trailer"},
 {id:4,title:"Inception",year:2010,language:"English",genre:"Sci-Fi",rating:"8.8",symbol:"∞",accent:"#536f9f",overview:"A skilled thief enters dreams to steal secrets—and attempts an impossible task.",trailer:"https://www.youtube.com/results?search_query=Inception+official+trailer"},
 {id:5,title:"Premam",year:2015,language:"Malayalam",genre:"Drama",rating:"8.3",symbol:"പ്രേമം",accent:"#bb6e76",overview:"A young man's life and loves unfold across different stages of growing up.",trailer:"https://www.youtube.com/results?search_query=Premam+official+trailer"},
 {id:6,title:"RRR",year:2022,language:"Telugu",genre:"Action",rating:"7.8",symbol:"RRR",accent:"#a65d2f",overview:"Two legendary revolutionaries cross paths in a fictional tale of friendship and courage.",trailer:"https://www.youtube.com/results?search_query=RRR+official+trailer"},
 {id:7,title:"3 Idiots",year:2009,language:"Hindi",genre:"Comedy",rating:"8.4",symbol:"तीन",accent:"#4e9b8a",overview:"Three engineering students challenge expectations and rediscover what learning means.",trailer:"https://www.youtube.com/results?search_query=3+Idiots+official+trailer"},
 {id:8,title:"Spider-Man: Into the Spider-Verse",year:2018,language:"English",genre:"Animation",rating:"8.4",symbol:"SPIDER",accent:"#bd3e51",overview:"A Brooklyn teenager meets other Spider-heroes from alternate dimensions.",trailer:"https://www.youtube.com/results?search_query=Into+the+Spider-Verse+official+trailer"},
 {id:9,title:"Drishyam",year:2013,language:"Malayalam",genre:"Thriller",rating:"8.3",symbol:"ദൃശ്യം",accent:"#637c5e",overview:"A family man goes to extraordinary lengths to protect his family.",trailer:"https://www.youtube.com/results?search_query=Drishyam+Malayalam+official+trailer"},
 {id:10,title:"The Dark Knight",year:2008,language:"English",genre:"Action",rating:"9.0",symbol:"KNIGHT",accent:"#6b7182",overview:"Batman faces a criminal mastermind who plunges Gotham into chaos.",trailer:"https://www.youtube.com/results?search_query=The+Dark+Knight+official+trailer"},
 {id:11,title:"Super Deluxe",year:2019,language:"Tamil",genre:"Drama",rating:"8.2",symbol:"சூப்பர்",accent:"#8e4b9a",overview:"Four unusual stories collide over one event in an inventive ensemble drama.",trailer:"https://www.youtube.com/results?search_query=Super+Deluxe+official+trailer"},
 {id:12,title:"Coco",year:2017,language:"English",genre:"Animation",rating:"8.4",symbol:"♪",accent:"#c77c32",overview:"A music-loving boy journeys into the Land of the Dead to learn about his family.",trailer:"https://www.youtube.com/results?search_query=Coco+official+trailer"}
];
const grid=document.getElementById("movieGrid"), searchInput=document.getElementById("searchInput"), empty=document.getElementById("emptyState");
let movies=fallbackMovies, activeGenre="All", activeLanguage="", query="", saved=new Set(JSON.parse(localStorage.getItem("moviesHubSaved")||"[]"));
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function render(){
 const shown=movies.filter(m=>(activeGenre==="All"||m.genre===activeGenre)&&(!activeLanguage||m.language.toLowerCase()===activeLanguage.toLowerCase())&&(!query||[m.title,m.language,m.genre,String(m.year)].join(" ").toLowerCase().includes(query)));
 grid.innerHTML=shown.map((m,i)=>'<article class="movie-card" style="animation-delay:'+Math.min(i*35,250)+'ms"><div class="movie-poster"><div class="poster-placeholder" style="--poster-accent:'+safe(m.accent||"#466c9d")+'"><span class="symbol">'+safe(m.symbol||"✦")+'</span><strong>'+safe(m.title)+'</strong><small>'+safe(m.language)+' · '+safe(m.year)+'</small></div><span class="movie-badge">'+safe(m.genre||"Movie").toUpperCase()+'</span><button class="save-button '+(saved.has(m.id)?"saved":"")+'" data-save="'+safe(m.id)+'" aria-label="'+(saved.has(m.id)?"Remove from":"Add to")+' watchlist">'+(saved.has(m.id)?"♥":"♡")+'</button></div><div class="movie-meta"><div class="movie-title-row"><h3 class="movie-title">'+safe(m.title)+'</h3><span class="movie-year">'+safe(m.year)+'</span></div><div class="movie-sub"><span class="movie-rating">★ '+safe(m.rating||"—")+'</span><span>·</span><span>'+safe(m.language)+'</span></div><div class="movie-sub"><a class="text-link" href="'+safe(m.trailer||("https://www.youtube.com/results?search_query="+encodeURIComponent(m.title+" official trailer")))+'" target="_blank" rel="noopener noreferrer">Watch trailer ↗</a></div></div></article>').join("");
 empty.hidden=shown.length!==0;
 if(!shown.length)grid.innerHTML="";
}
document.getElementById("filterRow").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeGenre=b.dataset.filter;activeLanguage="";document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("selected",x===b));document.querySelectorAll(".language-card").forEach(x=>x.classList.remove("selected"));render()});
searchInput.addEventListener("input",()=>{query=searchInput.value.trim().toLowerCase();render()});
document.getElementById("searchToggle").addEventListener("click",()=>{searchInput.focus();document.getElementById("searchPanel").scrollIntoView({behavior:"smooth",block:"center"})});
document.querySelectorAll(".language-card").forEach(b=>b.addEventListener("click",()=>{activeLanguage=activeLanguage===b.dataset.language?"":b.dataset.language;activeGenre="All";document.querySelectorAll(".language-card").forEach(x=>x.classList.toggle("selected",x===b&&!!activeLanguage));document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("selected",x.dataset.filter==="All"));document.getElementById("trending").scrollIntoView({behavior:"smooth"});render()}));
grid.addEventListener("click",e=>{const b=e.target.closest("[data-save]");if(!b)return;const id=Number(b.dataset.save);if(saved.has(id))saved.delete(id);else saved.add(id);localStorage.setItem("moviesHubSaved",JSON.stringify([...saved]));render()});
fetch("data/movies.json").then(r=>r.ok?r.json():Promise.reject()).then(data=>{if(Array.isArray(data)&&data.length)movies=data;render()}).catch(()=>render());
document.getElementById("year").textContent=new Date().getFullYear();
render();
/* Accessible compact mobile menu */
const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
if(menuToggle&&mainNav){
 menuToggle.addEventListener("click",()=>{
  const open=mainNav.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");
 });
 mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  mainNav.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded","false");
 }));
}
document.querySelectorAll(".mobile-bottom-nav a").forEach(link=>link.addEventListener("click",()=>{
 document.querySelectorAll(".mobile-bottom-nav a").forEach(x=>x.classList.toggle("bottom-active",x===link));
}));
