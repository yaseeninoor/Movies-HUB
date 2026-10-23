(() => {
 const input=document.getElementById('hubSearch');
 const cards=[...document.querySelectorAll('.category-card')];
 const empty=document.getElementById('emptyState');
 const year=document.getElementById('year');
 if(year) year.textContent=new Date().getFullYear();
 if(input){input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase();let count=0;cards.forEach(card=>{const text=(card.innerText+' '+(card.dataset.search||'')).toLocaleLowerCase();const show=!q||text.includes(q);card.classList.toggle('hidden',!show);if(show)count++;});if(empty)empty.hidden=count!==0;});}
})();