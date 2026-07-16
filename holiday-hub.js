(function(){
 const slides=[{src:'questionnaire_result_view_2.png',caption:'Result view 2 of 5'},{src:'questionnaire_result_view_3.png',caption:'Result view 3 of 5'},{src:'questionnaire_result_view_4.png',caption:'Result view 4 of 5'},{src:'questionnaire_result_view_5.png',caption:'Result view 5 of 5'}];
 let idx=0;const img=document.getElementById('resultSlideImage'),cap=document.getElementById('resultSlideCaption'),prev=document.getElementById('prevResultSlide'),next=document.getElementById('nextResultSlide');
 function render(){if(!img||!cap)return;img.src=slides[idx].src;cap.textContent=slides[idx].caption;}
 function prevSlide(){idx=(idx-1+slides.length)%slides.length;render();}
 function nextSlide(){idx=(idx+1)%slides.length;render();}
 function bindNav(el,fn){if(!el)return;el.type='button';el.style.touchAction='manipulation';el.addEventListener('click',fn);el.addEventListener('pointerup',function(e){if(e.pointerType==='touch'){e.preventDefault();fn();}});}
 bindNav(prev,prevSlide);bindNav(next,nextSlide);
 render();
})();
(function(){
 const markets=[
  {name:'Stresa market',when:'Friday morning, around 8:00–13:00',where:'Piazza Capucci, Stresa',journey:'Local / walkable from the villa',map:'https://www.google.com/maps/search/?api=1&query=Piazza+Capucci+Stresa+Italy'},
  {name:'Verbania Intra market',when:'Saturday, around 9:00–16:00',where:'Intra, Verbania',journey:'Nearby lake town; car/taxi/boat option depending on plan',map:'https://www.google.com/maps/search/?api=1&query=Intra+Verbania+market+Italy'},
  {name:'Cannobio market',when:'Sunday morning, around 8:00–13:00',where:'Cannobio lakefront',journey:'Excursion up the lake',map:'https://www.google.com/maps/search/?api=1&query=Cannobio+market+Lake+Maggiore+Italy'},
  {name:'Luino market',when:'Wednesday, around 9:00–16:00',where:'Luino',journey:'Larger excursion across/around the lake',map:'https://www.google.com/maps/search/?api=1&query=Luino+market+Lake+Maggiore+Italy'}];
 let i=0;const box=document.getElementById('marketCard'),cap=document.getElementById('marketCaption'),prev=document.getElementById('prevMarket'),next=document.getElementById('nextMarket');
 function draw(){if(!box)return;const m=markets[i];box.innerHTML=`<h4>${m.name}</h4><div class="market-row"><b>When</b><span>${m.when}</span><b>Where</b><span>${m.where}</span><b>How far</b><span>${m.journey}</span></div><div class="links"><a class="btn map" href="${m.map}" target="_blank">Map: ${m.name}</a></div>`;if(cap)cap.textContent=`Market ${i+1} of ${markets.length}`;}
 function prevMarket(){i=(i-1+markets.length)%markets.length;draw();}
 function nextMarket(){i=(i+1)%markets.length;draw();}
 function bindNav(el,fn){if(!el)return;el.type='button';el.style.touchAction='manipulation';el.addEventListener('click',fn);el.addEventListener('pointerup',function(e){if(e.pointerType==='touch'){e.preventDefault();fn();}});}
 bindNav(prev,prevMarket);bindNav(next,nextMarket);
 draw();
})();
(function(){
 const links=document.querySelectorAll('a[href]');
 links.forEach(function(a){
  const href=a.getAttribute('href')||'';
  if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')) return;
  try{
   const u=new URL(href,window.location.href);
   if(u.origin!==window.location.origin){
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener noreferrer');
   }
  }catch(_e){}
 });
})();
