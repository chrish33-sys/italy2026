
(function(){
 const slides=[
  {src:'questionnaire_result_view_2.png',caption:'Result view 2 of 5'},
  {src:'questionnaire_result_view_3.png',caption:'Result view 3 of 5'},
  {src:'questionnaire_result_view_4.png',caption:'Result view 4 of 5'},
  {src:'questionnaire_result_view_5.png',caption:'Result view 5 of 5'}
 ];
 let idx=0;const img=document.getElementById('resultSlideImage'),cap=document.getElementById('resultSlideCaption'),prev=document.getElementById('prevResultSlide'),next=document.getElementById('nextResultSlide');
 function render(){if(!img||!cap)return;img.src=slides[idx].src;cap.textContent=slides[idx].caption;}
 if(prev)prev.addEventListener('click',()=>{idx=(idx-1+slides.length)%slides.length;render();});
 if(next)next.addEventListener('click',()=>{idx=(idx+1)%slides.length;render();});render();
})();
