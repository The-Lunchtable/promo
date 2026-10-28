(function(){
'use strict';
const L=LT,FX=LT.FX,{rnd,pick,flash,shake,confetti,burst,shatter,vw,vh,vmin}=L;
const page=()=>document.getElementById('page');
const DISP="Anton,Impact,'Arial Narrow Bold',sans-serif";
const TYPE="'Bungee Inline','Arial Black',sans-serif";

/* 1. NICK: the main main character --------------------------------- */
FX.nick=async c=>{
  L.persist.stripes(true);
  flash('#fff');shake(page(),700);
  const dark=c.mk('fxfull',{background:'radial-gradient(ellipse at center,rgba(0,0,0,0) 0%,rgba(0,0,0,.25) 35%,rgba(0,0,0,.85) 100%)',opacity:0});
  c.go(dark,[{opacity:0},{opacity:1}],{duration:500});
  const mask='radial-gradient(circle,#000 0%,transparent 55%)';
  const rays=c.mk('',{position:'absolute',left:'50%',top:'42%',width:'150vmax',height:'150vmax',marginLeft:'-75vmax',marginTop:'-75vmax',
    background:'repeating-conic-gradient(from 0deg,rgba(255,227,77,.6) 0 6deg,rgba(255,79,163,0) 6deg 18deg)',borderRadius:'50%',opacity:0,
    WebkitMaskImage:mask,maskImage:mask});
  c.go(rays,[{opacity:0,transform:'rotate(0deg) scale(.4)'},{opacity:1,transform:'rotate(30deg) scale(1)',offset:.15},
    {opacity:1,transform:'rotate(300deg) scale(1)'}],{duration:8000,easing:'linear'});
  const name=c.mk('',{position:'absolute',left:'50%',top:'40%',fontFamily:DISP,fontSize:'min(32vw,40vh)',lineHeight:'.85',color:'#ffe34d',
    WebkitTextStroke:'.035em #070b1c',textShadow:'0 .06em 0 #ff4fa3,0 .12em 0 #070b1c,0 0 .5em rgba(255,255,255,.7)',whiteSpace:'nowrap',opacity:0});
  name.textContent='NICK';
  await c.ani(name,[{opacity:0,transform:'translate(-50%,-50%) scale(7) rotate(-12deg)'},
    {opacity:1,transform:'translate(-50%,-50%) scale(.92) rotate(2deg)',offset:.7},
    {opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-1deg)'}],{duration:800,easing:'cubic-bezier(.2,.8,.3,1)'});
  shake(page(),500);flash('#ffe34d',350);
  c.go(name,[{transform:'translate(-50%,-50%) scale(1) rotate(-1deg)'},{transform:'translate(-50%,-50%) scale(1.05) rotate(1deg)'},
    {transform:'translate(-50%,-50%) scale(1) rotate(-1deg)'}],{duration:900,iterations:6});
  const sub=c.mk('',{position:'absolute',left:'50%',top:'64%',transform:'translateX(-50%)',fontFamily:TYPE,fontSize:'clamp(16px,4.2vw,44px)',
    letterSpacing:'.1em',color:'#fff',background:'#070b1c',padding:'.3em .8em',whiteSpace:'nowrap',opacity:0,border:'3px solid #ffe34d'});
  sub.textContent='THE MAIN MAIN CHARACTER';
  await c.ani(sub,[{opacity:0,transform:'translateX(-50%) scaleX(0)'},{opacity:1,transform:'translateX(-50%) scaleX(1)'}],{duration:450,easing:'ease-out'});
  const lines=['EVERY PROMO: NICK','EVERY BIG IDEA: NICK','THE CAMERA, THE CUT, THE SOUND: NICK','THIS WEBSITE: ALSO NICK'];
  for(let i=0;i<lines.length;i++){
    const t=c.mk('',{position:'absolute',left:'50%',top:(73+i*5.6)+'%',transform:'translateX(-50%)',fontFamily:"'Special Elite','Courier New',monospace",
      fontSize:'clamp(12px,2.8vw,26px)',color:'#070b1c',background:i%2?'#ffe34d':'#ff4fa3',padding:'.15em .7em',whiteSpace:'nowrap',opacity:0});
    t.textContent=lines[i];
    const dir=i%2?1:-1;
    await c.ani(t,[{opacity:0,transform:`translateX(calc(-50% + ${dir*60}vw))`},{opacity:1,transform:'translateX(-50%)'}],{duration:420,easing:'cubic-bezier(.2,.9,.3,1)'});
    await c.sleep(160);
  }
  await c.sleep(1700);
  const all=[dark,rays,name,sub,...Array.from(L.fx.children).filter(e=>!([dark,rays,name,sub].includes(e)))];
  await Promise.all(all.map(e=>L.ani(e,[{opacity:1},{opacity:0}],{duration:900})));
};

/* 2. EVAN: confetti and a crown ------------------------------------ */
FX.evan=async c=>{
  confetti(150);
  const box=c.mk('fxfull',{display:'grid',placeItems:'center'});
  const wrap=c.mk('',{display:'flex',flexDirection:'column',alignItems:'center',gap:'2vmin',opacity:0},box);
  wrap.innerHTML='<svg viewBox="0 0 200 140" style="width:min(62vw,60vh,420px);overflow:visible;filter:drop-shadow(0 0 22px rgba(255,220,90,.85))" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset=".5" stop-color="#f4c24f"/><stop offset="1" stop-color="#b9831a"/></linearGradient></defs>'+
    '<path d="M12 118L8 38L56 80L100 12L144 80L192 38L188 118Z" fill="url(#gC)" stroke="#070b1c" stroke-width="5" stroke-linejoin="round"/>'+
    '<rect x="10" y="116" width="180" height="20" rx="4" fill="url(#gC)" stroke="#070b1c" stroke-width="5"/>'+
    '<circle cx="8" cy="36" r="9" fill="#ff4fa3" stroke="#070b1c" stroke-width="4"/><circle cx="100" cy="11" r="10" fill="#3fd0ff" stroke="#070b1c" stroke-width="4"/>'+
    '<circle cx="192" cy="36" r="9" fill="#ff4fa3" stroke="#070b1c" stroke-width="4"/>'+
    '<circle cx="50" cy="126" r="5" fill="#ff4fa3"/><circle cx="100" cy="126" r="5" fill="#3fd0ff"/><circle cx="150" cy="126" r="5" fill="#ff4fa3"/></svg>';
  const txt=c.mk('',{fontFamily:TYPE,fontSize:'clamp(20px,5.4vw,56px)',color:'#fff',textAlign:'center',letterSpacing:'.04em',lineHeight:'1.1',
    textShadow:'0 4px 0 #070b1c,0 0 20px rgba(255,220,90,.9)',WebkitTextStroke:'1px #070b1c',padding:'0 3vw'},wrap);
  txt.textContent='Evan da king beh beh';
  await c.ani(wrap,[{opacity:0,transform:'translateY(-40px) scale(.7)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1400,easing:'ease-out'});
  await c.sleep(1200);confetti(90);
  await c.sleep(2600);
  await c.ani(wrap,[{opacity:1},{opacity:0,transform:'translateY(-20px)'}],{duration:900});
};

/* 3. NOEL: smash a guitar, tint the screen green ------------------- */
function guitar(){
  return '<svg viewBox="0 0 120 320" style="display:block;width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M50 4H72L70 44H52Z" fill="#3a2314" stroke="#070b1c" stroke-width="3"/>'+
    '<circle cx="55" cy="14" r="3" fill="#ddd"/><circle cx="67" cy="14" r="3" fill="#ddd"/><circle cx="55" cy="28" r="3" fill="#ddd"/><circle cx="67" cy="28" r="3" fill="#ddd"/>'+
    '<rect x="52" y="40" width="16" height="130" fill="#7a4a22" stroke="#070b1c" stroke-width="3"/>'+
    '<path d="M52 70H68M52 100H68M52 130H68M52 158H68" stroke="#d8d2c0" stroke-width="2"/>'+
    '<path d="M60 150C95 150 100 180 88 205C112 220 118 262 100 292C80 316 40 316 20 292C2 262 8 220 32 205C20 180 25 150 60 150Z" fill="#d9531e" stroke="#070b1c" stroke-width="4"/>'+
    '<circle cx="60" cy="245" r="17" fill="#1a0c06"/><rect x="42" y="276" width="36" height="9" rx="2" fill="#3a2314"/>'+
    '<path d="M56 42V278M60 42V278M64 42V278" stroke="#eee" stroke-width="1.2" opacity=".9"/></svg>';
}
FX.noel=async c=>{
  const H=Math.min(vh()*.7,520),W=H*120/320;
  const base={position:'absolute',left:'50%',top:'50%',width:W+'px',height:H+'px',marginLeft:-W/2+'px',marginTop:-H/2+'px'};
  const whole=c.html(guitar(),Object.assign({opacity:0},base));
  await c.ani(whole,[{opacity:1,transform:`translate(${vw()*.45}px,${-vh()*.8}px) rotate(120deg)`},
    {opacity:1,transform:`translate(${vw()*.05}px,${-vh()*.15}px) rotate(20deg)`,offset:.8},
    {opacity:1,transform:'translate(0,0) rotate(-6deg)'}],{duration:650,easing:'cubic-bezier(.6,0,1,.7)'});
  /* impact */
  whole.remove();
  flash('#fff',350);shake(page(),600);
  const jagTop='polygon(0 0,100% 0,100% 62%,84% 66%,70% 61%,56% 68%,40% 62%,24% 67%,10% 62%,0 66%)';
  const jagBot='polygon(0 66%,10% 62%,24% 67%,40% 62%,56% 68%,70% 61%,84% 66%,100% 62%,100% 100%,0 100%)';
  const top=c.html(guitar(),Object.assign({clipPath:jagTop,transform:'rotate(-6deg)'},base));
  const bot=c.html(guitar(),Object.assign({clipPath:jagBot,transform:'rotate(-6deg)'},base));
  burst(vw()/2,vh()/2,['#d9531e','#7a4a22','#3a2314','#fff','#eee'],40,vmin()*.55,[4,14]);
  /* cracks */
  let d='';
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2+rnd(-.2,.2);let x=0,y=0,p='M0 0';
    for(let k=0;k<5;k++){const len=rnd(30,90);x+=Math.cos(a+rnd(-.5,.5))*len;y+=Math.sin(a+rnd(-.5,.5))*len;p+=`L${x.toFixed(0)} ${y.toFixed(0)}`;}
    d+=p;
  }
  const cr=c.html('<svg viewBox="-360 -360 720 720" style="width:min(90vw,90vh);display:block;overflow:visible"><path d="'+d+'" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="#070b1c" stroke-width="2"/></svg>',
    {position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',opacity:0});
  c.go(cr,[{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:1600});
  L.persist.tint(true);
  c.go(top,[{transform:'rotate(-6deg) translate(0,0)',opacity:1},{transform:`rotate(-70deg) translate(${-vw()*.3}px,${vh()*.9}px)`,opacity:1}],{duration:1500,easing:'cubic-bezier(.4,0,.9,.6)'});
  await c.ani(bot,[{transform:'rotate(-6deg) translate(0,0)',opacity:1},{transform:`rotate(85deg) translate(${vw()*.28}px,${vh()*.9}px)`,opacity:1}],{duration:1500,easing:'cubic-bezier(.4,0,.9,.6)'});
  await c.sleep(400);
};

/* 4. MICAH: wiggling glasses that shatter ------------------------- */
FX.micah=async c=>{
  const box=c.mk('fxfull',{display:'grid',placeItems:'center'});
  const g=c.mk('',{width:'min(74vw,540px)',opacity:0},box);
  g.innerHTML='<svg viewBox="0 0 260 110" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<g fill="rgba(160,215,255,.38)" stroke="#070b1c" stroke-width="9"><circle cx="70" cy="58" r="44"/><circle cx="190" cy="58" r="44"/></g>'+
    '<path d="M114 52Q130 36 146 52" fill="none" stroke="#070b1c" stroke-width="9" stroke-linecap="round"/>'+
    '<path d="M27 46L4 30M233 46L256 30" stroke="#070b1c" stroke-width="9" stroke-linecap="round"/>'+
    '<path d="M44 40Q58 26 78 28M164 40Q178 26 198 28" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".8"/></svg>';
  await c.ani(g,[{opacity:0,transform:'scale(.2) rotate(-30deg)'},{opacity:1,transform:'scale(1) rotate(0)'}],{duration:500,easing:'cubic-bezier(.3,1.5,.5,1)'});
  await c.ani(g,[{transform:'translateX(0) rotate(0)'},{transform:'translateX(-9vw) rotate(-9deg)'},{transform:'translateX(0) rotate(0)'},
    {transform:'translateX(9vw) rotate(9deg)'},{transform:'translateX(0) rotate(0)'}],{duration:720,iterations:4,fill:'none',easing:'ease-in-out'});
  const svg=g.firstElementChild;
  const r=svg.getBoundingClientRect();
  flash('#fff',250);
  shatter(svg,{cols:9,rows:4,gravity:vh()*.9});
  g.style.visibility='hidden';
  burst(r.left+r.width/2,r.top+r.height/2,['#bfe6ff','#fff','#7fc4ff'],40,vmin()*.4,[3,10]);
  await c.sleep(2000);
};

/* 5. JACE: gangster ---------------------------------------------- */
FX.jace=async c=>{
  const pin=c.mk('fxfull',{opacity:0,background:'repeating-linear-gradient(90deg,#0b0b10 0 26px,#17171f 26px 28px)'});
  c.go(pin,[{opacity:0},{opacity:.93}],{duration:700});
  const spot=c.mk('fxfull',{opacity:0,background:'radial-gradient(ellipse 45% 55% at 50% 48%,rgba(255,225,140,.4),rgba(0,0,0,0) 70%)'});
  c.go(spot,[{opacity:0},{opacity:1}],{duration:900});
  const bills=[];
  for(let i=0;i<46;i++){
    const b=c.mk('',{position:'absolute',left:rnd(0,vw())+'px',top:'-60px',width:'64px',height:'30px',background:'#3a9a52',border:'2px solid #14502a',
      borderRadius:'3px',color:'#d6ffd9',font:"700 18px "+DISP,display:'grid',placeItems:'center'});
    b.textContent='$';
    bills.push(b);
    c.go(b,[{transform:'translate(0,0) rotate(0deg)'},{transform:`translate(${rnd(-120,120)}px,${vh()+90}px) rotate(${rnd(-540,540)}deg)`}],
      {duration:rnd(2200,4000),delay:900+rnd(0,2600),easing:'ease-in'});
  }
  const box=c.mk('fxfull',{display:'grid',placeItems:'center'});
  const stack=c.mk('',{position:'relative',textAlign:'center'},box);
  const word=c.mk('',{fontFamily:DISP,fontSize:'min(36vw,42vh)',lineHeight:'.9',letterSpacing:'.03em',opacity:0,
    background:'linear-gradient(180deg,#fff3b0 0%,#f4c24f 45%,#a8730f 100%)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent',
    WebkitTextStroke:'2px #3a2606',filter:'drop-shadow(0 6px 0 #000) drop-shadow(0 0 24px rgba(244,194,79,.6))'},stack);
  word.textContent='JACE';
  await c.ani(word,[{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'scale(1.06)',offset:.7},{opacity:1,transform:'scale(1)'}],{duration:700,easing:'ease-out'});
  c.go(word,[{opacity:1},{opacity:.55},{opacity:1},{opacity:.8},{opacity:1}],{duration:600,delay:300});
  /* fedora drops on the J */
  const hat=c.mk('',{position:'absolute',left:'-6%',top:'-24%',width:'46%',opacity:0},stack);
  hat.innerHTML='<svg viewBox="0 0 220 120" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="110" cy="86" rx="104" ry="24" fill="#111" stroke="#000" stroke-width="3"/>'+
    '<path d="M52 82C50 40 66 12 110 12C154 12 170 40 168 82Z" fill="#17171b" stroke="#000" stroke-width="3"/>'+
    '<path d="M92 14C100 30 120 30 128 14" fill="none" stroke="#000" stroke-width="5"/>'+
    '<path d="M52 70H168V84H52Z" fill="#9a1020"/></svg>';
  await c.ani(hat,[{opacity:1,transform:'translateY(-90vh) rotate(-30deg)'},{opacity:1,transform:'translateY(0) rotate(-12deg)',offset:.7},
    {opacity:1,transform:'translateY(-18px) rotate(-14deg)',offset:.85},{opacity:1,transform:'translateY(0) rotate(-12deg)'}],{duration:800,easing:'ease-in'});
  shake(page(),300);
  /* gold chain */
  const chain=c.mk('',{width:'min(70vw,520px)',margin:'0 auto'},stack);
  chain.innerHTML='<svg viewBox="0 0 300 70" style="display:block;width:100%;overflow:visible"><path id="chp" d="M10 6C40 70 260 70 290 6" fill="none" stroke="#f4c24f" stroke-width="9" stroke-linecap="round" stroke-dasharray="14 7" pathLength="100" style="stroke-dashoffset:100;filter:drop-shadow(0 3px 0 #000)"/>'+
    '<circle cx="150" cy="58" r="12" fill="#f4c24f" stroke="#000" stroke-width="3"/></svg>';
  const path=chain.querySelector('#chp');
  path.setAttribute('stroke-dasharray','100');
  await c.ani(path,[{strokeDashoffset:100},{strokeDashoffset:0}],{duration:700,easing:'ease-out'});
  const tag=c.mk('',{fontFamily:"'Special Elite','Courier New',monospace",fontSize:'clamp(16px,3.6vw,34px)',color:'#f4c24f',letterSpacing:'.12em',
    marginTop:'1.4vmin',opacity:0,textShadow:'0 2px 0 #000'},stack);
  tag.textContent='THIS IS MY TABLE.';
  await c.ani(tag,[{opacity:0,letterSpacing:'.5em'},{opacity:1,letterSpacing:'.12em'}],{duration:900});
  await c.sleep(2200);
  await Promise.all([pin,spot,box,...bills].map(e=>L.ani(e,[{opacity:1},{opacity:0}],{duration:800})));
};
})();
