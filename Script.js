(function(){
  var schok=document.getElementById('schok');
  var open=false,klaarOm=0,ctx=null;

  function geluid(){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      var n=ctx.sampleRate*1.2,buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);
      for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
      var ruis=ctx.createBufferSource();ruis.buffer=buf;
      var osc=ctx.createOscillator();osc.type='sawtooth';
      osc.frequency.setValueAtTime(900,ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90,ctx.currentTime+1.1);
      var vol=ctx.createGain();vol.gain.value=0.35;
      ruis.connect(vol);osc.connect(vol);vol.connect(ctx.destination);
      ruis.start();osc.start();osc.stop(ctx.currentTime+1.2);
    }catch(e){}
  }

  function schrik(){
    if(open)return;
    open=true;klaarOm=Date.now()+900;
    schok.classList.remove('flits');void schok.offsetWidth;
    schok.classList.add('aan','flits');
    geluid();
    if(navigator.vibrate)navigator.vibrate([200,80,300]);
  }
  function sluit(){
    if(Date.now()<klaarOm)return;
    schok.classList.remove('aan','flits');open=false;
  }
  schok.addEventListener('click',sluit);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sluit();});

  // Klik op knoppen of kaarten = schrik
  document.querySelectorAll('[data-schrik]').forEach(function(el){
    el.addEventListener('click',schrik);
  });

  // Soms schrikt hij ook bij een gewone klik (1 op 6)
  document.addEventListener('click',function(e){
    if(e.target.closest('nav')||e.target.closest('.schok'))return;
    if(Math.random()<1/6)schrik();
  });

  // Glitch: de pagina schudt af en toe
  setInterval(function(){
    if(open||Math.random()>0.5)return;
    document.body.classList.add('schudden');
    setTimeout(function(){document.body.classList.remove('schudden');},150+Math.random()*250);
  },2500);

  // Kamer-pagina: aftellen, en bewegen = hij komt dichterbij
  var tijd=document.getElementById('tijd');
  if(tijd){
    var sec=30,beweeg=0;
    document.addEventListener('mousemove',function(){
      beweeg++;
      if(beweeg>40){beweeg=0;schrik();}
    });
    setInterval(function(){
      sec--;
      if(sec<=0){schrik();sec=30;}
      tijd.textContent='00:'+(sec<10?'0':'')+sec;
    },1000);
  }
})();