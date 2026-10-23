const videos=[
{id:1,title:"A little moment of nature",kind:"short",category:"Nature",language:"Universal",duration:"00:06",description:"A sample short clip demonstrating video playback.",type:"mp4",src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",accent:"#e84935",badge:"SAMPLE CLIP"},
{id:2,title:"Tamil movie trailers",kind:"short",category:"Movies",language:"Tamil",duration:"Shorts",description:"Discover official Tamil movie teasers and trailers.",type:"search",query:"Tamil movie official teaser trailer"},
{id:3,title:"Islamic reminders",kind:"short",category:"Islamic",language:"Tamil / Arabic",duration:"Shorts",description:"Find short Islamic reminders from publishers and channels.",type:"search",query:"Tamil Islamic short reminder official"},
{id:4,title:"Funny moments",kind:"short",category:"Comedy",language:"Universal",duration:"Shorts",description:"Search for funny short videos from creators.",type:"search",query:"funny short videos official creators"},
{id:5,title:"Learn something new",kind:"short",category:"Education",language:"Universal",duration:"Shorts",description:"Quick educational videos and explainers.",type:"search",query:"educational shorts official"},
{id:6,title:"Music moments",kind:"short",category:"Music",language:"Universal",duration:"Shorts",description:"Discover official music clips and performances.",type:"search",query:"official music shorts performances"},
{id:7,title:"Big Buck Bunny",kind:"full",category:"Animation",language:"English",duration:"~10 min",description:"A freely available animated short film from the Blender Open Movie project. Sample full-video player.",type:"youtube",videoId:"aqz-KE-bpKQ",accent:"#f0b42d",badge:"OPEN MOVIE"},
{id:8,title:"Tamil full-length films",kind:"full",category:"Movies",language:"Tamil",duration:"Full videos",description:"Search for films published by authorized channels and rights holders.",type:"search",query:"Tamil full movie official authorized channel"},
{id:9,title:"Documentaries",kind:"full",category:"Documentary",language:"English",duration:"Full videos",description:"Discover documentaries from official and public-domain sources.",type:"search",query:"full documentary official channel public domain"},
{id:10,title:"Educational lectures",kind:"full",category:"Education",language:"Universal",duration:"Full videos",description:"Long-form lessons and educational videos.",type:"search",query:"full educational lecture official channel"},
{id:11,title:"Islamic lectures",kind:"full",category:"Islamic",language:"Tamil / Arabic",duration:"Full videos",description:"Find complete talks and lectures published by their owners.",type:"search",query:"Tamil Islamic full lecture official channel"},
{id:12,title:"Live music & performances",kind:"full",category:"Music",language:"Universal",duration:"Full videos",description:"Concerts and performances from authorized publishers.",type:"search",query:"full live music performance official channel"}
];
const shortGrid=document.getElementById("shortsGrid"),fullGrid=document.getElementById("fullGrid"),searchInput=document.getElementById("searchInput");
let activeKind="all",activeCategory="",query="";
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function openVideo(id){
 const v=videos.find(x=>x.id===Number(id));if(!v)return;
 let modal=document.getElementById("videoPlayerModal");
 if(!modal){modal=document.createElement("div");modal.id="videoPlayerModal";modal.className="video-player-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-label","Video player");document.body.appendChild(modal);}
 let player="";
 if(v.type==="youtube")player='<iframe src="https://www.youtube-nocookie.com/embed/'+safe(v.videoId)+'?autoplay=1&rel=0" title="'+safe(v.title)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
 else if(v.type==="mp4")player='<video controls autoplay playsinline src="'+safe(v.src)+'">Your browser does not support video playback.</video>';
 else player='<div class="external-video"><span>▶</span><h3>'+safe(v.title)+'</h3><p>Open the source platform to find videos from official channels and authorized publishers.</p><a class="button button-primary" href="https://www.youtube.com/results?search_query='+encodeURIComponent(v.query)+'" target="_blank" rel="noopener noreferrer">Find videos on YouTube ↗</a></div>';
 modal.innerHTML='<div class="player-backdrop" data-close-player></div><section class="player-dialog"><button class="player-close" data-close-player aria-label="Close player">×</button><div class="player-frame">'+player+'</div><div class="player-caption"><div class="section-overline">'+safe(v.category)+' · '+safe(v.language)+'</div><h2>'+safe(v.title)+'</h2><p>'+safe(v.description)+'</p></div></section>';
 document.body.classList.add("player-open");modal.querySelector(".player-close").focus();
}
function closePlayer(){const m=document.getElementById("videoPlayerModal");if(m){m.remove();document.body.classList.remove("player-open")}}
function card(v,short){
 const icon=short?"▣":"▶";
 return '<article class="'+(short?"short-card":"full-card")+'"><button class="'+(short?"short-thumb":"full-thumb")+'" data-play="'+v.id+'" style="--video-accent:'+safe(v.accent||"#ed3b35")+'" aria-label="Play '+safe(v.title)+'"><span class="thumb-icon">'+icon+'</span><span class="thumb-label">'+safe(v.badge||v.category.toUpperCase())+'</span><span class="thumb-play">▶</span><span class="thumb-duration">'+safe(v.duration)+'</span></button><div class="video-card-info"><div class="video-category">'+safe(v.category)+' <span>·</span> '+safe(v.language)+'</div><h3>'+safe(v.title)+'</h3><p>'+safe(v.description)+'</p><button class="watch-now" data-play="'+v.id+'">▶ '+(v.type==="search"?"Find videos":"Play video")+' <span>↗</span></button></div></article>';
}
function render(){
 const filtered=videos.filter(v=>(activeKind==="all"||v.kind===activeKind)&&(!activeCategory||v.category.toLowerCase()===activeCategory.toLowerCase())&&(!query||[v.title,v.category,v.language,v.description].join(" ").toLowerCase().includes(query)));
 shortGrid.innerHTML=filtered.filter(v=>v.kind==="short").map(v=>card(v,true)).join("");
 fullGrid.innerHTML=filtered.filter(v=>v.kind==="full").map(v=>card(v,false)).join("");
 document.querySelectorAll(".video-section").forEach(section=>{section.classList.remove("section-dimmed");section.hidden=(activeKind==="short"&&section.id==="full-videos")||(activeKind==="full"&&section.id==="shorts");});
 let no=document.getElementById("videoEmpty");if(!no){no=document.createElement("p");no.id="videoEmpty";no.className="video-empty";no.textContent="No videos match your search. Try another keyword or category.";document.querySelector(".video-tabs").after(no)}
 no.hidden=filtered.length>0;
 document.getElementById("categories").hidden=!!activeCategory||!!query||activeKind!=="all";
}
document.querySelectorAll("[data-kind]").forEach(b=>b.addEventListener("click",()=>{activeKind=b.dataset.kind;document.querySelectorAll("[data-kind]").forEach(x=>x.classList.toggle("active",x===b));render();document.getElementById(activeKind==="short"?"shorts":activeKind==="full"?"full-videos":"home").scrollIntoView({behavior:"smooth",block:"start"})}));
document.addEventListener("click",e=>{
 const play=e.target.closest("[data-play]");if(play){openVideo(play.dataset.play);return}
 if(e.target.closest("[data-close-player]"))closePlayer();
 const see=e.target.closest("[data-show-kind]");if(see){activeKind=see.dataset.showKind;document.querySelectorAll("[data-kind]").forEach(x=>x.classList.toggle("active",x.dataset.kind===activeKind));render();document.getElementById(activeKind==="short"?"shorts":"full-videos").scrollIntoView({behavior:"smooth"});return}
 const cat=e.target.closest("[data-category]");if(cat){activeCategory=activeCategory===cat.dataset.category?"":cat.dataset.category;activeKind="all";document.querySelectorAll("[data-kind]").forEach(x=>x.classList.toggle("active",x.dataset.kind==="all"));document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("category-selected",x===cat&&!!activeCategory));render();document.querySelector(".video-tabs").scrollIntoView({behavior:"smooth"});}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePlayer()});
searchInput.addEventListener("input",()=>{query=searchInput.value.trim().toLowerCase();render()});
document.getElementById("clearSearch").addEventListener("click",()=>{searchInput.value="";query="";activeCategory="";activeKind="all";document.querySelectorAll("[data-kind]").forEach(x=>x.classList.toggle("active",x.dataset.kind==="all"));document.querySelectorAll("[data-category]").forEach(x=>x.classList.remove("category-selected"));render();searchInput.focus()});
document.getElementById("searchToggle").addEventListener("click",()=>{searchInput.focus();document.getElementById("searchPanel").scrollIntoView({behavior:"smooth",block:"center"})});
const menuToggle=document.getElementById("menuToggle"),mainNav=document.getElementById("mainNav");
if(menuToggle&&mainNav){menuToggle.addEventListener("click",()=>{const open=mainNav.classList.toggle("menu-open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu")});mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mainNav.classList.remove("menu-open");menuToggle.setAttribute("aria-expanded","false")}))}
document.querySelectorAll(".mobile-bottom-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelectorAll(".mobile-bottom-nav a").forEach(x=>x.classList.toggle("bottom-active",x===a))));
document.getElementById("year").textContent=new Date().getFullYear();
// If an embedded source blocks playback, offer its official YouTube page.
document.addEventListener("error",e=>{if(e.target&&e.target.tagName==="IFRAME"){const frame=e.target;const fallback=document.createElement("a");fallback.className="button button-primary";fallback.href=frame.src.replace("https://www.youtube-nocookie.com/embed/","https://www.youtube.com/watch?v=").split("?")[0];fallback.target="_blank";fallback.rel="noopener noreferrer";fallback.textContent="Open video on YouTube ↗";frame.parentNode.replaceChild(fallback,frame)}},true);
render();