(function(){
'use strict';
const L=LT,FX=LT.FX,{rnd,pick}=L;
const $=s=>document.querySelector(s);
const page=$('#page'),bgFx=$('#bgFx'),tint=$('#tint');
const input=$('#code'),form=$('#codeForm'),typed=$('#typed'),msg=$('#msg');
const btnC=$('#btnCredits'),btnR=$('#btnRelease');
let lock=true; /* locked until the curtains are open */

/* persistent states: Nick's stripes and Noel's green tint ---------- */
L.persist={
  stripes:on=>bgFx.classList.toggle('on',on),
  tint:on=>tint.classList.toggle('on',on),
  clear(){bgFx.classList.remove('on');tint.classList.remove('on');}
};

/* clouds ---------------------------------------------------------- */
function cloud(w){
  const h=w*.55,d=document.createElement('div');
  d.className='cloud';d.style.width=w+'px';d.style.height=h+'px';
  const n=8;
  for(let i=0;i<n;i++){
    const mid=1-Math.abs(i-(n-1)/2)/((n-1)/2);
    const s=w*(.26+mid*.2)*rnd(.9,1.1);
    const p=document.createElement('div');p.className='puff';
    p.style.width=s+'px';p.style.height=s+'px';
    p.style.left=((i/(n-1))*(w-s)).toFixed(1)+'px';
    p.style.top=(h-s-mid*rnd(h*.15,h*.4)).toFixed(1)+'px';
    d.appendChild(p);
  }
  return d;
}
(function buildSky(){
  const sky=$('#sky');
  const W=window.innerWidth,H=window.innerHeight;
  for(let i=0;i<11;i++){
    const w=rnd(.28,.6)*Math.max(W,500);
    const c=cloud(w);
    c.style.top=rnd(-4,78)+'%';
    const dur=rnd(110,260);
    c.style.animationDuration=dur+'s';
    c.style.animationDelay=(-rnd(0,dur))+'s';
    c.classList.add('drift');
    c.style.opacity=rnd(.85,1);
    sky.appendChild(c);
  }
  /* a cloud bank along the bottom, like the poster */
  const bank=document.createElement('div');
  bank.style.cssText='position:absolute;left:-5%;right:-5%;bottom:-9%;height:30%';
  for(let i=0;i<9;i++){
    const w=rnd(.32,.5)*Math.max(W,500);
    const c=cloud(w);
    c.style.left=(i*11-4)+'%';c.style.bottom='0';c.style.top='auto';
    bank.appendChild(c);
  }
  sky.appendChild(bank);
})();

/* typing mirrors onto the computer screen -------------------------- */
input.addEventListener('input',()=>{typed.textContent=input.value.toUpperCase();});
let msgTimer=0;
function say(t){
  msg.textContent=t;clearTimeout(msgTimer);
  msgTimer=setTimeout(()=>{msg.textContent='ENTER A CODE BELOW';},2400);
}

/* codes ------------------------------------------------------------ */
const CODES={
  'nick':'nick','evan':'evan','noel':'noel','micah':'micah','jace':'jace','brodie':'brodie',
  'the lunchtable':'thelunchtable','lunchtable':'thelunchtable','table topics':'tabletopics','cat strat':'catstrat',
  'backflip':'backflip','trash can':'trashcan','cereal':'cereal','blonde':'blonde','treehouse':'treehouse','room':'room'
};
async function runCode(name){
  const c=L.ctx();
  try{await FX[name](c);}
  catch(e){if(e!==L.CANCEL)console.error(e);}
  if(c.ok())L.clearFx();
}
form.addEventListener('submit',e=>{
  e.preventDefault();
  if(lock)return;
  const key=input.value.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  input.value='';typed.textContent='';
  if(!key)return;
  L.cancel();L.clearFx();L.persist.clear();
  const name=CODES[key];
  if(name){say('RUNNING '+key.toUpperCase());runCode(name);}
  else{
    say('UNKNOWN CODE');
    form.classList.remove('nope');void form.offsetWidth;form.classList.add('nope');
  }
});

/* credits ---------------------------------------------------------- */
const cr=$('#credits'),reel=$('#reel');
function openCredits(){
  if(lock)return;lock=true;
  L.cancel();L.clearFx();
  reel.scrollTop=0;
  cr.querySelectorAll('.rows li').forEach((li,i)=>{li.style.animationDelay=(1.35+i*.17)+'s';});
  cr.querySelector('.c-note').style.animationDelay='3.6s';
  cr.classList.add('on');cr.setAttribute('aria-hidden','false');
  L.flash('#ffffff',600);
  setTimeout(()=>$('#creditsClose').focus({preventScroll:true}),1800);
}
function closeCredits(){
  if(!cr.classList.contains('on'))return;
  cr.classList.remove('on');cr.setAttribute('aria-hidden','true');
  setTimeout(()=>{lock=false;btnC.focus({preventScroll:true});},900);
}
btnC.addEventListener('click',openCredits);
$('#creditsClose').addEventListener('click',closeCredits);
cr.addEventListener('click',e=>{if(e.target===cr||e.target.classList.contains('dim-bg'))closeCredits();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCredits();});

/* release date: the site collapses ---------------------------------- */
const col=$('#collapse'),blackout=col.querySelector('.blackout');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function crackSVG(){
  const W=window.innerWidth,H=window.innerHeight;
  let paths='';
  const cx=W*rnd(.4,.6),cy=H*rnd(.4,.6);
  for(let i=0;i<11;i++){
    const a=i/11*Math.PI*2+rnd(-.25,.25);
    let x=cx,y=cy,d='M'+x.toFixed(0)+' '+y.toFixed(0);
    for(let k=0;k<7;k++){
      const len=rnd(Math.min(W,H)*.08,Math.min(W,H)*.2);
      x+=Math.cos(a+rnd(-.55,.55))*len;y+=Math.sin(a+rnd(-.55,.55))*len;
      d+='L'+x.toFixed(0)+' '+y.toFixed(0);
    }
    paths+='<path d="'+d+'" pathLength="100"/>';
  }
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
  s.setAttribute('viewBox','0 0 '+W+' '+H);
  s.setAttribute('preserveAspectRatio','none');
  s.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  s.innerHTML='<g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#000" stroke-width="9">'+paths+'</g><g stroke="#fff" stroke-width="3.5">'+paths+'</g></g>';
  return s;
}
function growBlack(ms){
  return new Promise(res=>{
    const n=28,W=window.innerWidth,H=window.innerHeight;
    const cx=W/2,cy=H/2,jit=[];
    for(let i=0;i<n;i++)jit.push(rnd(.7,1.3));
    const rmax=Math.hypot(W,H)*.75;
    const t0=performance.now();
    (function f(now){
      const t=Math.min(1,(now-t0)/ms),r=rmax*t*t;
      const pts=[];
      for(let i=0;i<n;i++){
        const a=i/n*Math.PI*2,rr=r*jit[i];
        pts.push((cx+Math.cos(a)*rr).toFixed(0)+'px '+(cy+Math.sin(a)*rr).toFixed(0)+'px');
      }
      blackout.style.clipPath='polygon('+pts.join(',')+')';
      if(t<1)requestAnimationFrame(f);else{blackout.style.clipPath='none';res();}
    })(t0);
  });
}
async function releaseDate(){
  if(lock)return;lock=true;
  L.cancel();L.clearFx();
  input.disabled=true;btnC.disabled=true;btnR.disabled=true;
  const parts=Array.from(page.children);
  const anims=[];
  col.classList.add('on');
  blackout.style.opacity='1';blackout.style.clipPath='polygon(50% 50%,50% 50%,50% 50%)';
  /* 1. cracks run across the page while it shakes */
  const cracks=crackSVG();col.appendChild(cracks);
  const paths=Array.from(cracks.querySelectorAll('path'));
  paths.forEach((p,i)=>{
    p.style.strokeDasharray='100';p.style.strokeDashoffset='100';
    p.animate([{strokeDashoffset:100},{strokeDashoffset:0}],{duration:900,delay:i*70,fill:'forwards',easing:'ease-out'});
  });
  const jitter=[];
  for(let i=0;i<30;i++){const k=i/30;jitter.push({transform:`translate(${rnd(-14,14)*(.3+k)}px,${rnd(-10,10)*(.3+k)}px) rotate(${rnd(-1.2,1.2)*(.3+k)}deg)`});}
  anims.push(page.animate(jitter,{duration:1700,easing:'linear'}));
  anims.push($('#sky').animate([{filter:'hue-rotate(0deg) contrast(1)'},{filter:'hue-rotate(70deg) contrast(1.7) saturate(1.5)'}],{duration:1700,fill:'forwards'}));
  L.shake(page,600);
  await wait(1800);
  /* 2. the pieces fall away and the black spreads from the middle */
  parts.forEach((p,i)=>{
    anims.push(p.animate([{transform:'translate(0,0) rotate(0deg)'},{transform:`translate(${rnd(-60,60)}px,${window.innerHeight*1.2}px) rotate(${rnd(-50,50)}deg)`}],
      {duration:1100,delay:i*170,easing:'cubic-bezier(.5,0,.9,.6)',fill:'forwards'}));
  });
  await growBlack(1700);
  cracks.remove();
  /* 3. the line, slowly */
  const never=document.createElement('div');
  never.className='never';
  never.innerHTML='<span style="white-space:nowrap">'+"YOU'LL NEVER".split('').map(ch=>ch===' '?'<span class="sp"></span>':'<span class="ch">'+ch+'</span>').join('')+
    '</span><br><span style="white-space:nowrap">'+'KNOW...'.split('').map(ch=>'<span class="ch">'+ch+'</span>').join('')+'</span>';
  col.appendChild(never);
  const letters=Array.from(never.querySelectorAll('.ch'));
  await Promise.all(letters.map((s,i)=>L.ani(s,[{opacity:0,filter:'blur(18px)',transform:'translateY(30px) scale(1.6)'},
    {opacity:1,filter:'blur(0px)',transform:'translateY(0) scale(1)'}],{duration:1100,delay:i*150,easing:'ease-out'})));
  const gl=never.animate([{transform:'translate(-50%,-50%)'},{transform:'translate(calc(-50% + 3px),-50%)'},{transform:'translate(calc(-50% - 3px),calc(-50% + 1px))'},
    {transform:'translate(-50%,-50%)'}],{duration:180,iterations:12});
  await wait(1900);
  /* 4. the text breaks and shatters into black */
  gl.cancel();
  L.shake(col,500);
  L.shatter(never,{cols:12,rows:5,gravity:window.innerHeight*.9});
  never.remove();
  await wait(2400);
  /* 5. black screen for a few seconds */
  await wait(3200);
  /* 6. reset the page underneath, then fade the original page back in */
  anims.forEach(a=>{try{a.cancel();}catch(_){}});
  await L.ani(blackout,[{opacity:1},{opacity:0}],{duration:2200,easing:'ease-in-out'});
  col.classList.remove('on');blackout.style.opacity='0';
  input.disabled=false;btnC.disabled=false;btnR.disabled=false;
  lock=false;
}
btnR.addEventListener('click',releaseDate);

/* intro, then curtains --------------------------------------------- */
let skipped=false;
const waiters=new Set();
const W=ms=>skipped?Promise.resolve():new Promise(r=>{const t=setTimeout(()=>{waiters.delete(f);r();},ms);const f=()=>{clearTimeout(t);r();};waiters.add(f);});
$('#skip').addEventListener('click',()=>{skipped=true;waiters.forEach(f=>f());waiters.clear();});

function sweep(ring,ms){
  return new Promise(res=>{
    const t0=performance.now();
    (function f(now){
      const t=Math.min(1,(now-t0)/ms);
      ring.style.setProperty('--a',(t*360).toFixed(1)+'deg');
      if(t<1&&!skipped)requestAnimationFrame(f);else res();
    })(t0);
  });
}
async function intro(){
  const intro=$('#intro'),leader=$('#leader'),ring=$('#ring'),num=$('#leaderNum'),fly=$('#flyby'),flash=$('#flash'),title=$('#introTitle');
  /* clouds for the fly-through */
  const ic=$('#introClouds');
  for(let i=0;i<16;i++){
    const c=cloud(rnd(.25,.6)*Math.max(window.innerWidth,500));
    c.style.left=rnd(-5,85)+'%';c.style.top=rnd(-5,85)+'%';ic.appendChild(c);
  }
  title.innerHTML=['THE','LUNCHTABLE'].map(word=>'<div>'+word.split('').map(ch=>'<span>'+ch+'</span>').join('')+'</div>').join('');
  /* film leader countdown */
  for(const n of [3,2,1]){
    if(skipped)return;
    num.textContent=n;
    leader.animate([{transform:'translate(0,0)'},{transform:'translate(-6px,3px)'},{transform:'translate(5px,-4px)'},{transform:'translate(0,0)'}],{duration:160,iterations:5});
    await sweep(ring,780);
  }
  if(skipped)return;
  /* white cut into the sky */
  await L.ani(flash,[{opacity:0},{opacity:1}],{duration:160});
  leader.style.display='none';fly.style.opacity='1';
  L.ani(flash,[{opacity:1},{opacity:0}],{duration:600});
  $('#introClouds').animate([{transform:'scale(1)'},{transform:'scale(2.6)'}],{duration:4200,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
  title.style.opacity='1';
  const spans=Array.from(title.querySelectorAll('span'));
  spans.forEach((s,i)=>{
    s.animate([{opacity:0,transform:'scale(3.2) translateY(-40px)'},{opacity:1,transform:'scale(.94) translateY(0)',offset:.7},{opacity:1,transform:'scale(1) translateY(0)'}],
      {duration:520,delay:500+i*85,fill:'forwards',easing:'cubic-bezier(.3,.8,.4,1)'});
  });
  await W(500+spans.length*85+520);
  if(skipped)return;
  title.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:110,iterations:3});
  await W(1700);
}
async function start(){
  try{await Promise.race([document.fonts.ready,wait(2000)]);}catch(_){}
  await intro();
  const introEl=$('#intro');
  introEl.classList.add('out');
  await wait(skipped?500:1200);
  introEl.style.display='none';
  const cu=$('#curtains');
  cu.classList.add('open');
  await wait(900);
  page.classList.remove('hide');
  await wait(2100);
  cu.style.display='none';
  lock=false;
}
start();
})();
