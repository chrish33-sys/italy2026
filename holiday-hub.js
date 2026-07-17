const SUPABASE_URL = "https://dxfdfqaouzcqdjcfqxpa.supabase.co";
const SUPABASE_KEY = "sb_publishable_HCnmpHVljiBGXPDx2MtvXg_mn7Wvl1-";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
(function(){const slides=[{src:'questionnaire_result_view_2.png',caption:'Result view 2 of 5'},{src:'questionnaire_result_view_3.png',caption:'Result view 3 of 5'},{src:'questionnaire_result_view_4.png',caption:'Result view 4 of 5'},{src:'questionnaire_result_view_5.png',caption:'Result view 5 of 5'}];let idx=0;const img=document.getElementById('resultSlideImage'),cap=document.getElementById('resultSlideCaption'),prev=document.getElementById('prevResultSlide'),next=document.getElementById('nextResultSlide');function render(){if(!img||!cap)return;img.src=slides[idx].src;cap.textContent=slides[idx].caption;}if(prev)prev.addEventListener('click',()=>{idx=(idx-1+slides.length)%slides.length;render();});if(next)next.addEventListener('click',()=>{idx=(idx+1)%slides.length;render();});render();})();
(function(){
const markets=[
{
name:'Stresa market',
when:'Friday morning, around 8:00–13:00',
where:'Piazza Capucci, Stresa',
journey:'Local / walkable from the villa',
map:'https://www.google.com/maps/search/?api=1&query=Piazza+Capucci+Stresa+Italy'
},
{
name:'Verbania Intra market',
when:'Saturday, around 9:00–16:00',
where:'Intra, Verbania',
journey:'Nearby lake town; car/taxi/boat option depending on plan',
map:'https://www.google.com/maps/search/?api=1&query=Intra+Verbania+market+Italy'
},
{
name:'Cannobio market',
when:'Sunday morning, around 8:00–13:00',
where:'Cannobio lakefront',
journey:'Excursion up the lake',
map:'https://www.google.com/maps/search/?api=1&query=Cannobio+market+Lake+Maggiore+Italy'
},
{
name:'Luino market',
when:'Wednesday, around 9:00–16:00',
where:'Luino',
journey:'Larger excursion across/around the lake',
map:'https://www.google.com/maps/search/?api=1&query=Luino+market+Lake+Maggiore+Italy'
}
];

let i=0;

const box=document.getElementById('marketCard');
const cap=document.getElementById('marketCaption');
const prev=document.getElementById('prevMarket');
const next=document.getElementById('nextMarket');

function draw(){
if(!box)return;

const m=markets[i];

box.innerHTML=
'<h4>'+m.name+'</h4>'+
'<div class='+
'<b>When</b><span>'+m.when+'</span>'+
'<b>Where</b><span>'+m.where+'</span>'+
'<b>How far</b><span>'+m.journey+'</span>'+
'</div>'+
'<div class="links">'+
''+m.map+'Map: '+m.name+'</a>'+
'</div>';

if(cap){
cap.textContent='Market '+(i+1)+' of '+markets.length;
}
}

if(prev){
prev.addEventListener('click',function(){
i=(i-1+markets.length)%markets.length;
draw();
});
}

if(next){
next.addEventListener('click',function(){
i=(i+1)%markets.length;
draw();
});
}

draw();
})();
(function(){const activityCards=document.querySelectorAll('.activity');if(!activityCards.length)return;const errorBox=document.getElementById('voteSetupError');if(!supabaseClient){if(errorBox){errorBox.style.display='block';errorBox.textContent='Voting could not load because the Supabase library is missing.';}return;}let currentVoter=localStorage.getItem('italy2026_voter');if(!currentVoter||currentVoter.trim()===''){currentVoter=prompt("Who's voting? Enter your name:");if(!currentVoter||currentVoter.trim()==='')currentVoter='Guest-'+Math.random().toString(36).slice(2,7);currentVoter=currentVoter.trim();localStorage.setItem('italy2026_voter',currentVoter);}const voteState={};function ensure(activity){if(!voteState[activity])voteState[activity]={up:0,down:0,mine:'none'};return voteState[activity];}function renderVotes(){activityCards.forEach(card=>{const activity=card.dataset.activity;const state=ensure(activity);const up=card.querySelector('.up');const down=card.querySelector('.down');if(!up||!down)return;up.querySelector('span').textContent=state.up||0;down.querySelector('span').textContent=state.down||0;up.classList.toggle('active',state.mine==='up');down.classList.toggle('active',state.mine==='down');});}async function loadVoteTotals(){const {data,error}=await supabaseClient.from('vote_totals').select('*');if(error){console.error('Error loading vote totals:',error);if(errorBox){errorBox.style.display='block';errorBox.textContent='Voting totals could not load. Check Supabase permissions.';}return;}activityCards.forEach(card=>{const st=ensure(card.dataset.activity);st.up=0;st.down=0;});if(data)data.forEach(row=>{const st=ensure(row.activity);st.up=Number(row.up_votes||0);st.down=Number(row.down_votes||0);});if(errorBox)errorBox.style.display='none';renderVotes();}async function loadMyVotes(){const {data,error}=await supabaseClient.from('votes').select('activity, vote').eq('voter',currentVoter);if(error){console.error('Error loading my votes:',error);return;}activityCards.forEach(card=>{ensure(card.dataset.activity).mine='none';});if(data)data.forEach(row=>{ensure(row.activity).mine=row.vote||'none';});renderVotes();}async function submitVote(activity,requestedVote){const st=ensure(activity);const nextVote=(st.mine===requestedVote)?'none':requestedVote;const {error}=await supabaseClient.from('votes').upsert({activity:activity,vote:nextVote,voter:currentVoter},{onConflict:'activity,voter'});if(error){console.error('Error submitting vote:',error);alert('Vote could not be saved. Check Supabase setup.');return;}st.mine=nextVote;await loadVoteTotals();await loadMyVotes();}activityCards.forEach(card=>{const activity=card.dataset.activity;const up=card.querySelector('.up');const down=card.querySelector('.down');if(up)up.addEventListener('click',()=>submitVote(activity,'up'));if(down)down.addEventListener('click',()=>submitVote(activity,'down'));});(async()=>{await loadVoteTotals();await loadMyVotes();})();setInterval(loadVoteTotals,15000);})();
