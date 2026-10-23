(() => {
 const input=document.getElementById('hubSearch');
 const cards=[...document.querySelectorAll('.category-card')];
 const empty=document.getElementById('emptyState');
 const year=document.getElementById('year');
 if(year) year.textContent=new Date().getFullYear();
 if(input){input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase();let count=0;cards.forEach(card=>{const text=(card.innerText+' '+(card.dataset.search||'')).toLocaleLowerCase();const show=!q||text.includes(q);card.classList.toggle('hidden',!show);if(show)count++;});if(empty)empty.hidden=count!==0;});}
 // Add install control only where browser supports PWA installation.
 const header=document.querySelector('.topbar');
 let installEvent=null;
 const installButton=document.createElement('button');
 installButton.type='button'; installButton.className='install-button'; installButton.textContent='Install App';
 installButton.hidden=true; installButton.setAttribute('aria-label','Install Yaseenis Hub app');
 if(header){const cta=header.querySelector('.top-cta');if(cta)cta.insertAdjacentElement('afterend',installButton);else header.appendChild(installButton);}
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;installButton.hidden=false;});
 installButton.addEventListener('click',async()=>{if(!installEvent){alert('iPhone: Safari → Share → Add to Home Screen. Android: Chrome menu → Install app / Add to Home screen.');return;}installEvent.prompt();await installEvent.userChoice;installEvent=null;installButton.hidden=true;});
 window.addEventListener('appinstalled',()=>{installButton.hidden=true;});
 if('serviceWorker' in navigator && location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();