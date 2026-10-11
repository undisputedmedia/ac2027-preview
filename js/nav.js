// Mobile menu: the "Menu" button toggles the nav below 1100px.
(function(){
  var b=document.querySelector('.navtoggle'), h=document.querySelector('header');
  if(!b||!h) return;
  b.setAttribute('aria-expanded','false');
  b.addEventListener('click',function(){
    var open=h.classList.toggle('navopen');
    b.setAttribute('aria-expanded',open?'true':'false');
    b.textContent=open?'Close':'Menu';
  });
})();
