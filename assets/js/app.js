(() => {
 const gate=document.getElementById("ageGate"), yes=document.getElementById("ageYes"), no=document.getElementById("ageNo");
 const showGate=()=>{gate.hidden=false;document.body.classList.add("gated");yes.focus()};
 const hideGate=()=>{gate.hidden=true;document.body.classList.remove("gated")};
 showGate(); yes.addEventListener("click",hideGate); no.addEventListener("click",()=>{window.location.href="https://www.google.com/"});
 const search=document.getElementById("sourceSearch"), cards=[...document.querySelectorAll(".source-card")], filters=[...document.querySelectorAll("[data-filter]")], count=document.getElementById("sourceCount"), empty=document.getElementById("emptyState");
 let filter="all";
 function updateSources(){const q=search.value.trim().toLowerCase();let visible=0;cards.forEach(card=>{const matches=(card.dataset.name+" "+card.textContent).toLowerCase().includes(q);const category=filter==="all"||card.dataset.category===filter;card.hidden=!(matches&&category);if(matches&&category)visible++});count.textContent=String(visible).padStart(2,"0");empty.hidden=visible>0}
 search.addEventListener("input",updateSources);filters.forEach(btn=>btn.addEventListener("click",()=>{filter=btn.dataset.filter;filters.forEach(b=>b.classList.toggle("active",b===btn));updateSources()}));
 document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.focus()}});
 document.getElementById("year").textContent=new Date().getFullYear();

 const grid=document.getElementById("rssGrid"), status=document.getElementById("rssStatus"), videoCount=document.getElementById("videoCount"), videoSearch=document.getElementById("videoSearch");
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const https=v=>{try{const u=new URL(v);return u.protocol==="https:"?u.href:""}catch{return ""}};
 const date=v=>{if(!v)return "RECENT";const d=new Date(v);return Number.isNaN(d.getTime())?"RECENT":d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})};
 let allItems=[];
 function renderVideos(){
   const q=videoSearch.value.trim().toLowerCase();
   const items=allItems.filter(x=>(x.title+" "+x.description+" "+(x.categories||[]).join(" ")).toLowerCase().includes(q));
   videoCount.textContent=String(items.length).padStart(2,"0");
   if(!items.length){grid.innerHTML='<div class="rss-empty">No video entries are available yet. Configure a working RSS feed in GitHub repository Variables, then run “Refresh LOOP RSS feed” in Actions. Some publishers do not offer RSS or allow embedded playback.</div>';return}
   grid.innerHTML=items.map(item=>{
     const url=https(item.url), image=https(item.image), embed=https(item.embedUrl);
     if(!url)return "";
     const embedAllowed=embed&&/youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com/i.test(new URL(embed).hostname);
     const visual=embedAllowed?'<div class="video-frame"><iframe src="'+esc(embed)+'" title="'+esc(item.title)+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>':(image?'<a class="video-thumb" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer nofollow"><img src="'+esc(image)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'"><span>OPEN SOURCE ↗</span></a>':'<a class="video-placeholder" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer nofollow"><span>▶</span><small>OPEN ORIGINAL VIDEO</small></a>');
     return '<article class="video-card">'+visual+'<div class="video-card-body"><div class="rss-card-meta">'+esc((item.categories||[]).slice(0,2).join(" · ")||"CONNECTED SOURCE")+' · '+date(item.published)+'</div><h3>'+esc(item.title)+'</h3><p>'+esc(item.description||"Open the publisher to view the original entry.")+'</p><a class="video-open" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer nofollow">Open original source ↗</a></div></article>';
   }).join("");
 }
 videoSearch.addEventListener("input",renderVideos);
 fetch("data/rss-feed.json?v="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("catalogue unavailable");return r.json()}).then(data=>{
   allItems=Array.isArray(data.items)?data.items:[];
   status.textContent=allItems.length?("Showing "+allItems.length+" entries · refreshed "+date(data.updatedAt)):(data.message||"No feed entries yet — feed setup required.");
   renderVideos();
 }).catch(()=>{status.textContent="Catalogue not available";videoCount.textContent="00";grid.innerHTML='<div class="rss-empty">Could not load the catalogue. Check that data/rss-feed.json exists and the GitHub Pages deployment has finished.</div>'});
})();