(() => {
 const gate=document.getElementById("ageGate");
 const yes=document.getElementById("ageYes");
 const no=document.getElementById("ageNo");
 const showGate=()=>{gate.hidden=false;document.body.classList.add("gated");yes.focus()};
 const hideGate=()=>{gate.hidden=true;document.body.classList.remove("gated")};
 // Show the age notice on every new page load; this is a self-declaration, not age verification.
 showGate();
 yes.addEventListener("click",hideGate);
 no.addEventListener("click",()=>{window.location.href="https://www.google.com/"});
 const search=document.getElementById("sourceSearch");
 const cards=[...document.querySelectorAll(".source-card")];
 const filters=[...document.querySelectorAll("[data-filter]")];
 const count=document.getElementById("sourceCount");
 const empty=document.getElementById("emptyState");
 let filter="all";
 function update(){
  const q=search.value.trim().toLowerCase();let visible=0;
  cards.forEach(card=>{const name=(card.dataset.name+" "+card.textContent).toLowerCase();const matchesText=name.includes(q);const matchesFilter=filter==="all"||card.dataset.category===filter;const show=matchesText&&matchesFilter;card.hidden=!show;if(show)visible++});
  count.textContent=String(visible).padStart(2,"0");empty.hidden=visible>0;
 }
 search.addEventListener("input",update);
 filters.forEach(btn=>btn.addEventListener("click",()=>{filter=btn.dataset.filter;filters.forEach(b=>b.classList.toggle("active",b===btn));update()}));
 document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.focus()}if(e.key==="Escape"&&!gate.hidden){/* Keep the age gate in place until a choice is made. */}});
 document.getElementById("year").textContent=new Date().getFullYear();
})();
