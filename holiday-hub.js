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
  {name:'Stresa market',when:'Friday morning, around 8:00–13:00',where:'Piazza Capucci, Stresa',journey:'Local / walkable from the villa',map:'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Piazza+Capucci+Stresa+Italy&travelmode=driving'},
  {name:'Verbania Intra market',when:'Saturday, around 9:00–16:00',where:'Intra, Verbania',journey:'Nearby lake town; car/taxi/boat option depending on plan',map:'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Intra+Verbania+market+Italy&travelmode=driving'},
  {name:'Cannobio market',when:'Sunday morning, around 8:00–13:00',where:'Cannobio lakefront',journey:'Excursion up the lake',map:'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Cannobio+market+Lake+Maggiore+Italy&travelmode=driving'},
  {name:'Luino market',when:'Wednesday, around 9:00–16:00',where:'Luino',journey:'Larger excursion across/around the lake',map:'https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=Luino+market+Lake+Maggiore+Italy&travelmode=driving'}];
 let i=0;const box=document.getElementById('marketCard'),cap=document.getElementById('marketCaption'),prev=document.getElementById('prevMarket'),next=document.getElementById('nextMarket');
 function draw(){if(!box)return;const m=markets[i];box.innerHTML=`<h4>${m.name}</h4><div class="market-row"><b>When</b><span>${m.when}</span><b>Where</b><span>${m.where}</span><b>How far</b><span>${m.journey}</span></div><div class="links"><a class="btn map" href="${m.map}" target="_blank">Directions: ${m.name}</a></div>`;if(cap)cap.textContent=`Market ${i+1} of ${markets.length}`;}
 function prevM(){i=(i-1+markets.length)%markets.length;draw();}
 function nextM(){i=(i+1)%markets.length;draw();}
 if(prev)prev.addEventListener('click',prevM);
 if(next)next.addEventListener('click',nextM);
 draw();
})();
(function(){
 const VOTE_KEY='italy2026_votes_v1';
 function safeRead(){
  try{return JSON.parse(localStorage.getItem(VOTE_KEY)||'{}');}catch(e){return {};}
 }
 function safeWrite(data){
  try{localStorage.setItem(VOTE_KEY,JSON.stringify(data));}catch(e){}
 }
 const state=safeRead();
 document.querySelectorAll('.vote').forEach(function(block){
  const key=block.getAttribute('data-vote-key');
  if(!key)return;
  if(!state[key]) state[key]={up:0,down:0};
  const upCount=block.querySelector('[data-role="up"]');
  const downCount=block.querySelector('[data-role="down"]');
  function render(){
   if(upCount) upCount.textContent=String(state[key].up||0);
   if(downCount) downCount.textContent=String(state[key].down||0);
  }
  block.querySelector('.vote-btn.up')?.addEventListener('click',function(){
   state[key].up=(state[key].up||0)+1;
   safeWrite(state);
   render();
  });
  block.querySelector('.vote-btn.down')?.addEventListener('click',function(){
   state[key].down=(state[key].down||0)+1;
   safeWrite(state);
   render();
  });
  render();
 });
})();
