window.LT=(function(){
'use strict';
const fx=document.getElementById('fx');
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const CANCEL={cancelled:true};
let token=0;

function mk(cls,css,parent,tag){
  const e=document.createElement(tag||'div');
  if(cls)e.className=cls;
  if(css)Object.assign(e.style,css);
  (parent||fx).appendChild(e);
  return e;
}
function html(markup,css,parent){const e=mk('',css,parent);e.innerHTML=markup;return e;}
function ani(e,frames,opts){
  return new Promise(res=>{
    const a=e.animate(frames,Object.assign({fill:'forwards'},opts));
    a.onfinish=()=>{try{a.commitStyles();}catch(_){} res();};
    a.oncancel=res;
  });
}
function ctx(){
  const my=++token;
  return {
    ok:()=>my===token,
    sleep:async ms=>{await sleep(ms);if(my!==token)throw CANCEL;},
    ani:async(e,f,o)=>{await ani(e,f,o);if(my!==token)throw CANCEL;},
    go:(e,f,o)=>{ani(e,f,o);},
    mk,html
  };
}
function cancel(){token++;}
function clearFx(){fx.innerHTML='';}
function vw(){return window.innerWidth;}
function vh(){return window.innerHeight;}

/* quick effects --------------------------------------------------- */
function shake(el,ms){
  if(reduce)return;
  el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');
  setTimeout(()=>el.classList.remove('shake'),ms||520);
}
function flash(color,ms){
  if(reduce)return;
  const f=mk('fxfull',{background:color||'#fff',opacity:0});
  ani(f,[{opacity:.95},{opacity:0}],{duration:ms||450,easing:'ease-out'}).then(()=>f.remove());
}
function confetti(n){
  const cols=['#ff4fa3','#ffe34d','#3fd0ff','#7dff5a','#ff7a1a','#b36bff','#fff'];
  for(let i=0;i<n;i++){
    const w=rnd(8,16),h=rnd(10,22);
    const p=mk('',{position:'absolute',left:rnd(0,vw())+'px',top:'-30px',width:w+'px',height:h+'px',background:pick(cols),
      borderRadius:Math.random()<.3?'50%':'2px'});
    const dx=rnd(-160,160),fall=vh()+80;
    ani(p,[{transform:'translate(0,0) rotate(0deg)'},{transform:`translate(${dx}px,${fall}px) rotate(${rnd(-900,900)}deg)`}],
      {duration:rnd(1800,3800),delay:rnd(0,1400),easing:'cubic-bezier(.3,.6,.5,1)'}).then(()=>p.remove());
  }
}
/* smoke / poof: a cluster of soft blurred circles */
function poof(x,y,color,n,size,spread){
  n=n||14;size=size||90;spread=spread||110;
  for(let i=0;i<n;i++){
    const s=rnd(size*.5,size*1.2);
    const p=mk('',{position:'absolute',left:(x-s/2)+'px',top:(y-s/2)+'px',width:s+'px',height:s+'px',borderRadius:'50%',
      background:color,filter:'blur(10px)',opacity:0});
    const a=rnd(0,Math.PI*2),d=rnd(spread*.2,spread);
    ani(p,[{opacity:0,transform:'translate(0,0) scale(.3)'},{opacity:.9,offset:.25},
      {opacity:0,transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-spread*.5}px) scale(${rnd(1.4,2.4)})`}],
      {duration:rnd(900,1500),delay:rnd(0,160),easing:'ease-out'}).then(()=>p.remove());
  }
}
/* bits flying outward */
function burst(x,y,colors,n,speed,sizeRange){
  sizeRange=sizeRange||[6,16];
  for(let i=0;i<n;i++){
    const s=rnd(sizeRange[0],sizeRange[1]);
    const p=mk('',{position:'absolute',left:(x-s/2)+'px',top:(y-s/2)+'px',width:s+'px',height:s+'px',background:pick(colors),
      borderRadius:Math.random()<.5?'50%':'2px'});
    const a=rnd(0,Math.PI*2),d=rnd(speed*.3,speed);
    ani(p,[{transform:'translate(0,0) rotate(0)',opacity:1},
      {transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+rnd(40,260)}px) rotate(${rnd(-540,540)}deg)`,opacity:0}],
      {duration:rnd(700,1500),easing:'cubic-bezier(.2,.7,.4,1)'}).then(()=>p.remove());
  }
}
function boom(x,y,big){
  const r=big||vmin()*.5;
  const ring=mk('',{position:'absolute',left:(x-r/2)+'px',top:(y-r/2)+'px',width:r+'px',height:r+'px',borderRadius:'50%',
    background:'radial-gradient(circle,#fff 0%,#ffe34d 30%,#ff7a1a 60%,rgba(255,60,0,0) 72%)'});
  ani(ring,[{transform:'scale(.05)',opacity:1},{transform:'scale(1.6)',opacity:0}],{duration:700,easing:'ease-out'}).then(()=>ring.remove());
  burst(x,y,['#ffe34d','#ff7a1a','#ff3b1a','#fff','#222'],36,r*1.1,[6,22]);
  flash('#fff6d0',420);
}
function vmin(){return Math.min(vw(),vh());}

/* shatter an element into falling glass-like shards (clones with clip-paths) */
function shatter(node,o){
  o=o||{};
  const r=node.getBoundingClientRect();
  const cols=o.cols||7,rows=o.rows||5;
  const wrap=mk('',{position:'absolute',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',overflow:'visible'});
  const pts=[];
  for(let j=0;j<=rows;j++){pts[j]=[];for(let i=0;i<=cols;i++){
    const jx=(i>0&&i<cols)?rnd(-.35,.35):0,jy=(j>0&&j<rows)?rnd(-.35,.35):0;
    pts[j][i]=[(i+jx)/cols*r.width,(j+jy)/rows*r.height];}}
  const tris=[];
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const a=pts[j][i],b=pts[j][i+1],c=pts[j+1][i+1],d=pts[j+1][i];
    tris.push([a,b,c],[a,c,d]);
  }
  const gravity=o.gravity||vh()*.9;
  tris.forEach(t=>{
    const cl=node.cloneNode(true);
    cl.removeAttribute('id');
    Object.assign(cl.style,{position:'absolute',left:'0',top:'0',width:r.width+'px',height:r.height+'px',margin:'0',
      transform:'none',animation:'none',transition:'none',
      clipPath:'polygon('+t.map(p=>p[0].toFixed(1)+'px '+p[1].toFixed(1)+'px').join(',')+')'});
    wrap.appendChild(cl);
    const cx=(t[0][0]+t[1][0]+t[2][0])/3-r.width/2,cy=(t[0][1]+t[1][1]+t[2][1])/3-r.height/2;
    const dx=cx*rnd(.5,1.8)+rnd(-40,40),dy=cy*rnd(.2,.9)+rnd(gravity*.4,gravity);
    const hold=o.hold||0;
    ani(cl,[{transform:'translate(0,0) rotate(0)',opacity:1,offset:0},
      {transform:'translate(0,0) rotate(0)',opacity:1,offset:hold?hold/1400:0},
      {transform:`translate(${dx}px,${dy}px) rotate(${rnd(-260,260)}deg)`,opacity:.9}],
      {duration:rnd(1000,1700)+hold,delay:rnd(0,180),easing:'cubic-bezier(.5,0,.9,.6)'});
  });
  setTimeout(()=>wrap.remove(),3200);
  return wrap;
}
/* rip a scene down the middle like paper */
function rip(node){
  const r=node.getBoundingClientRect();
  const w=r.width,h=r.height;
  const zig=[];
  const steps=9;
  for(let i=0;i<=steps;i++){zig.push([(w/2+(i%2?rnd(8,26):-rnd(8,26))),h*i/steps]);}
  const left='polygon(0 0,'+zig.map(p=>p[0].toFixed(0)+'px '+p[1].toFixed(0)+'px').join(',')+',0 '+h+'px)';
  const right='polygon('+w+'px 0,'+zig.map(p=>p[0].toFixed(0)+'px '+p[1].toFixed(0)+'px').join(',')+','+w+'px '+h+'px)';
  const wrap=mk('',{position:'absolute',left:r.left+'px',top:r.top+'px',width:w+'px',height:h+'px'});
  const mkHalf=(poly,dir)=>{
    const cl=node.cloneNode(true);cl.removeAttribute('id');
    Object.assign(cl.style,{position:'absolute',left:'0',top:'0',width:w+'px',height:h+'px',margin:'0',transform:'none',
      animation:'none',transition:'none',clipPath:poly});
    wrap.appendChild(cl);
    ani(cl,[{transform:'translate(0,0) rotate(0)',opacity:1},
      {transform:`translate(${dir*w*.35}px,${h*.5}px) rotate(${dir*28}deg)`,opacity:0}],
      {duration:1300,easing:'cubic-bezier(.5,0,.9,.5)'});
  };
  mkHalf(left,-1);mkHalf(right,1);
  setTimeout(()=>wrap.remove(),1600);
}
/* sample a parabola into keyframes: from (x0,y0) to (x1,y1) peaking `lift` px above the higher end */
function arcFrames(x0,y0,x1,y1,lift,spins,extra){
  const f=[],n=24;
  for(let i=0;i<=n;i++){
    const t=i/n;
    const x=x0+(x1-x0)*t;
    const y=y0+(y1-y0)*t-4*lift*t*(1-t);
    f.push(Object.assign({transform:`translate(${x}px,${y}px) rotate(${spins*360*t}deg)`,offset:t},extra?extra(t):{}));
  }
  return f;
}

/* shared drawings ---------------------------------------------------- */
const art={};
art.stick=function(pose,col,w){
  col=col||'#000';
  const P={
    stand:'<path d="M50 36V82M50 48L24 70M50 48L76 70M50 82L32 128M50 82L68 128"/>',
    flail:'<path d="M50 36V82M50 48L22 18M50 48L78 16M50 82L30 114M50 82L74 120"/>',
    tuck:'<path d="M50 36V80M50 48L36 68L46 88M50 48L64 68L54 88M50 80L36 98L56 112M50 80L66 98L48 112"/>',
    sit:'<path d="M50 36V92M50 52L26 72M50 52L74 72"/>',
    eat:'<path d="M50 36V92M50 52L30 62L42 34M50 52L70 70"/>'
  };
  return '<svg viewBox="0 0 100 140" width="'+(w||100)+'" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="'+col+
    '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="22" r="14" fill="#fff"/>'+P[pose]+'</g></svg>';
};
art.trash=function(){
  return '<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;overflow:visible">'+
    '<g class="lidg"><rect x="6" y="12" width="108" height="16" rx="7" fill="#17171b"/><rect x="46" y="2" width="28" height="13" rx="6" fill="#26262c"/>'+
    '<rect x="12" y="14" width="96" height="3" rx="2" fill="rgba(255,255,255,.22)"/></g>'+
    '<path d="M13 30H107L97 163Q96 168 90 168H30Q24 168 23 163Z" fill="#0f0f12"/>'+
    '<path d="M38 42L42 160M60 42V160M82 42L78 160" stroke="#2b2b34" stroke-width="5" stroke-linecap="round" fill="none"/>'+
    '<path d="M18 36L26 150" stroke="rgba(255,255,255,.2)" stroke-width="4" stroke-linecap="round" fill="none"/></svg>';
};
art.cloudSet=function(){return null;};

return {fx,rnd,pick,sleep,reduce,CANCEL,mk,html,ani,ctx,cancel,clearFx,vw,vh,vmin,shake,flash,confetti,poof,burst,boom,shatter,rip,arcFrames,art,FX:{}};
})();

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

(function(){
'use strict';
const L=LT,FX=LT.FX,{rnd,pick,flash,shake,shatter,poof,burst,rip,arcFrames,art,vw,vh,vmin}=L;
const page=()=>document.getElementById('page');
const DISP="Anton,Impact,'Arial Narrow Bold',sans-serif";
const TYPE="'Bungee Inline','Arial Black',sans-serif";
const HAND="'Special Elite','Courier New',monospace";
const INK='#070b1c';

/* 7. THE LUNCHTABLE: a lunch table, laughing stick figures, rips like paper */
function laugh(svg){
  return svg.replace('</svg>','<g fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round"><path d="M41 19Q44 15 47 19M53 19Q56 15 59 19"/></g>'+
    '<path d="M42 26Q50 40 58 26Z" fill="#000"/></svg>');
}
FX.thelunchtable=async c=>{
  const W=Math.min(vw()*.92,880);
  const card=c.mk('',{position:'absolute',left:'50%',top:'50%',width:W+'px',aspectRatio:'16/10',marginLeft:-W/2+'px',marginTop:-(W*.625)/2+'px',
    background:'#fffdf2',border:'5px solid '+INK,boxShadow:'10px 10px 0 '+INK,overflow:'hidden'});
  /* figures */
  const figs=[];
  for(let i=0;i<5;i++){
    const f=c.mk('',{position:'absolute',left:(5+i*18.5)+'%',top:'9%',width:'17%'},card);
    f.innerHTML=laugh(art.stick('sit','#000','100%'));
    f.firstChild.style.width='100%';
    figs.push(f);
  }
  /* table */
  const top=c.mk('',{position:'absolute',left:'2%',right:'2%',top:'54%',height:'14%',background:'#d9a15f',border:'4px solid '+INK,borderRadius:'6px'},card);
  c.mk('',{position:'absolute',left:'6%',top:'68%',width:'3%',height:'26%',background:'#8a5a2b',border:'3px solid '+INK},card);
  c.mk('',{position:'absolute',right:'6%',top:'68%',width:'3%',height:'26%',background:'#8a5a2b',border:'3px solid '+INK},card);
  const foods=['#e63946','#ffd166','#06d6a0','#ff8fab','#8ecae6'];
  for(let i=0;i<5;i++){
    c.mk('',{position:'absolute',left:(8+i*18.5)+'%',top:'49%',width:'9%',aspectRatio:'1',borderRadius:'50%',background:foods[i],border:'3px solid '+INK},card);
  }
  const bubbles=[];
  await c.ani(card,[{transform:'translateX(-120vw) rotate(-6deg)'},{transform:'translateX(3vw) rotate(1deg)',offset:.8},{transform:'translateX(0) rotate(0)'}],
    {duration:900,easing:'cubic-bezier(.3,.7,.4,1)'});
  figs.forEach((f,i)=>c.go(f,[{transform:'translateY(0)'},{transform:'translateY(-3.5%)'},{transform:'translateY(0)'}],
    {duration:340+i*40,iterations:Infinity,delay:i*70}));
  /* eating + ha ha */
  for(let n=0;n<10;n++){
    figs.forEach((f,i)=>{f.innerHTML=laugh(art.stick(n%2?'eat':'sit','#000','100%'));f.firstChild.style.width='100%';});
    if(n%2===0){
      const i=Math.floor(rnd(0,5));
      const b=c.mk('',{position:'absolute',left:(8+i*18.5)+'%',top:'4%',fontFamily:TYPE,fontSize:Math.round(W*.04)+'px',color:INK,opacity:0},card);
      b.textContent=pick(['HA','HAHA','HEH','LOL']);
      c.go(b,[{opacity:1,transform:'translateY(0) rotate(-8deg)'},{opacity:0,transform:'translateY(-40px) rotate(10deg)'}],{duration:900});
    }
    await c.sleep(360);
  }
  rip(card);
  card.style.visibility='hidden';
  await c.sleep(1500);
};

/* 8. TABLE TOPICS: four squares, a cross in the gaps, pink smoke ---- */
FX.tabletopics=async c=>{
  const s=Math.min(vmin()*.24,200),gap=Math.min(vmin()*.07,56);
  const box=c.mk('fxfull',{display:'grid',placeItems:'center'});
  const grid=c.mk('',{display:'grid',gridTemplateColumns:`${s}px ${s}px`,gap:gap+'px'},box);
  const sq=[];
  for(let i=0;i<4;i++){sq.push(c.mk('',{width:s+'px',height:s+'px',background:'#000',opacity:0,boxShadow:'0 0 0 2px rgba(255,255,255,.15)'},grid));}
  const order=[0,1,3,2];
  for(const i of order){
    await c.ani(sq[i],[{opacity:0,transform:'scale(.2) rotate(-25deg)'},{opacity:1,transform:'scale(1.08) rotate(3deg)',offset:.7},{opacity:1,transform:'scale(1) rotate(0)'}],
      {duration:420,easing:'ease-out'});
    await c.sleep(260);
  }
  await c.sleep(1100);
  const rects=sq.map(e=>e.getBoundingClientRect());
  const fog=c.mk('fxfull',{background:'radial-gradient(circle at center,rgba(255,79,163,.55),rgba(255,79,163,0) 60%)',opacity:0});
  c.go(fog,[{opacity:0},{opacity:1,offset:.3},{opacity:0}],{duration:2000});
  rects.forEach(r=>poof(r.left+r.width/2,r.top+r.height/2,'#ff4fa3',16,s*.9,s*1.1));
  rects.forEach(r=>poof(r.left+r.width/2,r.top+r.height/2,'#ffb3d9',8,s*.7,s*.8));
  await Promise.all(sq.map(e=>L.ani(e,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.35)'}],{duration:260})));
  await c.sleep(1800);
};

/* 9. CAT STRAT: a note, click it, a cat jumps out and walks off ----- */
function catSVG(){
  return '<svg viewBox="0 0 170 110" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M28 68C0 62 0 30 20 20" fill="none" stroke="#f39a3d" stroke-width="12" stroke-linecap="round"/>'+
    '<g class="leg" style="transform-box:fill-box;transform-origin:50% 0"><path d="M44 84L40 106" stroke="#d97f22" stroke-width="11" stroke-linecap="round"/></g>'+
    '<g class="leg" style="transform-box:fill-box;transform-origin:50% 0"><path d="M62 84L66 106" stroke="#d97f22" stroke-width="11" stroke-linecap="round"/></g>'+
    '<ellipse cx="72" cy="68" rx="46" ry="26" fill="#f39a3d"/>'+
    '<path d="M44 52Q54 44 62 54M72 48Q82 42 88 52" stroke="#d97f22" stroke-width="5" fill="none" stroke-linecap="round"/>'+
    '<g class="leg" style="transform-box:fill-box;transform-origin:50% 0"><path d="M92 84L88 106" stroke="#f39a3d" stroke-width="11" stroke-linecap="round"/></g>'+
    '<g class="leg" style="transform-box:fill-box;transform-origin:50% 0"><path d="M108 82L114 106" stroke="#f39a3d" stroke-width="11" stroke-linecap="round"/></g>'+
    '<path d="M110 40L112 18L128 32Z M140 32L152 16L156 42Z" fill="#f39a3d"/>'+
    '<circle cx="134" cy="52" r="26" fill="#f39a3d"/>'+
    '<circle cx="125" cy="48" r="4" fill="#070b1c"/><circle cx="145" cy="48" r="4" fill="#070b1c"/>'+
    '<path d="M131 56L135 60L139 56Z" fill="#ff7aa8"/>'+
    '<path d="M122 60L102 56M122 64L102 66M148 60L168 56M148 64L168 66" stroke="#070b1c" stroke-width="2" stroke-linecap="round"/></svg>';
}
FX.catstrat=async c=>{
  const nw=Math.min(vw()*.55,300);
  const cx=vw()/2,cy=vh()/2;
  const note=c.mk('clickable',{position:'absolute',left:(cx-nw/2)+'px',top:(cy-nw*.45)+'px',width:nw+'px',height:nw*.9+'px',
    background:'#fff6a8',border:'3px solid '+INK,boxShadow:'6px 8px 0 rgba(0,0,0,.35)',display:'grid',placeItems:'center',
    fontFamily:HAND,fontSize:Math.round(nw*.1)+'px',color:INK,textAlign:'center',lineHeight:'1.25',padding:'0 8%'});
  note.innerHTML='psst...<br>open me<span style="position:absolute;right:0;bottom:0;width:18%;aspect-ratio:1;background:linear-gradient(135deg,#e0d27a 50%,#fff 50%);border-top:3px solid '+INK+';border-left:3px solid '+INK+'"></span>';
  await c.ani(note,[{opacity:1,transform:`translate(${vw()*.6}px,${vh()*.7}px) rotate(40deg)`},{opacity:1,transform:'translate(-14px,-6px) rotate(-8deg)',offset:.75},
    {opacity:1,transform:'translate(0,0) rotate(-3deg)'}],{duration:800,easing:'cubic-bezier(.2,.8,.3,1)'});
  c.go(note,[{transform:'translate(0,0) rotate(-3deg)'},{transform:'translate(0,-6px) rotate(2deg)'},{transform:'translate(0,0) rotate(-3deg)'}],{duration:900,iterations:Infinity});
  await new Promise(res=>note.addEventListener('click',res,{once:true}));
  if(!c.ok())throw L.CANCEL;
  /* cat jumps out */
  const cw=Math.min(vw()*.32,230),ch=cw*110/170;
  const cat=c.mk('',{position:'absolute',left:'0',top:'0',width:cw+'px',opacity:0});
  cat.innerHTML=catSVG();
  const bob=c.mk('',{},cat);bob.appendChild(cat.firstChild);
  const x0=cx-cw/2,y0=cy-ch/2,x1=vw()*.2,y1=vh()*.62;
  await c.ani(note,[{transform:'translate(0,0) rotate(-3deg) scale(1)'},{transform:'translate(0,0) rotate(0) scale(1.12,.6)'},{transform:'translate(0,0) rotate(0) scale(1)'}],{duration:260});
  const jump=arcFrames(x0,y0,x1-cw/2,y1,vh()*.32,0,t=>({opacity:1}));
  await c.ani(cat,jump,{duration:700,easing:'linear'});
  /* walk off to the right, hearts trailing */
  const legs=Array.from(bob.querySelectorAll('.leg'));
  legs.forEach((g,i)=>c.go(g,[{transform:`rotate(${i%2?28:-28}deg)`},{transform:`rotate(${i%2?-28:28}deg)`}],{duration:240,iterations:Infinity,direction:'alternate',fill:'none'}));
  c.go(bob,[{transform:'translateY(0)'},{transform:'translateY(-7px)'}],{duration:240,iterations:Infinity,direction:'alternate',fill:'none'});
  const dur=3600,start=performance.now(),xa=x1-cw/2,xb=vw()+40;
  c.go(cat,[{transform:`translate(${xa}px,${y1}px)`},{transform:`translate(${xb}px,${y1}px)`}],{duration:dur,easing:'linear'});
  const hearts=setInterval(()=>{
    if(!c.ok()){clearInterval(hearts);return;}
    const t=Math.min(1,(performance.now()-start)/dur);
    const hx=xa+(xb-xa)*t-rnd(10,50),hy=y1-rnd(0,cw*.5);
    const h=c.mk('',{position:'absolute',left:hx+'px',top:hy+'px',color:pick(['#ff4fa3','#ff2d6f','#ff8fb8']),fontSize:Math.round(rnd(18,36))+'px',opacity:0,fontFamily:'Arial,sans-serif'});
    h.textContent='♥';
    L.ani(h,[{opacity:1,transform:'translate(0,0) scale(.6)'},{opacity:0,transform:`translate(${rnd(-30,10)}px,${-rnd(60,110)}px) scale(1.1)`}],{duration:1100}).then(()=>h.remove());
  },170);
  await c.sleep(dur-200);
  clearInterval(hearts);
  await Promise.all([note,cat].map(e=>L.ani(e,[{opacity:1},{opacity:0}],{duration:600})));
};

/* 10. BACKFLIP ----------------------------------------------------- */
FX.backflip=async c=>{
  const h=Math.min(vh()*.38,300);
  const box=c.mk('fxfull',{display:'grid',placeItems:'end center',paddingBottom:'18vh'});
  const wrap=c.mk('',{position:'relative',width:h*.72+'px',height:h+'px'},box);
  c.mk('',{position:'absolute',left:'-20%',right:'-20%',bottom:'-6px',height:'8px',borderRadius:'50%',background:'rgba(0,0,0,.35)',filter:'blur(3px)'},wrap);
  const fig=c.mk('',{position:'absolute',inset:'0'},wrap);
  const stand=c.mk('',{position:'absolute',inset:'0'},fig);stand.innerHTML=art.stick('stand','#000','100%');
  const tuck=c.mk('',{position:'absolute',inset:'0',visibility:'hidden'},fig);tuck.innerHTML=art.stick('tuck','#000','100%');
  [stand,tuck].forEach(e=>{e.firstChild.style.cssText='display:block;width:100%;height:100%';});
  await c.ani(fig,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
  await c.sleep(300);
  await c.ani(fig,[{transform:'translateY(0) scaleY(1)'},{transform:'translateY(8%) scaleY(.82)'}],{duration:260,easing:'ease-out'});
  const up=h*1.0;
  c.go(fig,[{transform:'translateY(8%) scaleY(.82) rotate(0deg)',offset:0},
    {transform:`translateY(${-up*.5}px) scaleY(1) rotate(-180deg)`,offset:.5},
    {transform:'translateY(0) scaleY(1) rotate(-360deg)',offset:1}],{duration:1200,easing:'ease-in-out'});
  await c.sleep(160);stand.style.visibility='hidden';tuck.style.visibility='visible';
  await c.sleep(780);tuck.style.visibility='hidden';stand.style.visibility='visible';
  await c.sleep(270);
  await c.ani(fig,[{transform:'translateY(0) scaleY(1) rotate(0deg)'},{transform:'translateY(9%) scaleY(.8) rotate(0deg)'},{transform:'translateY(0) scaleY(1) rotate(0deg)'}],{duration:300});
  const ta=c.mk('',{position:'absolute',left:'50%',top:'-18%',transform:'translateX(-50%)',fontFamily:TYPE,fontSize:Math.round(h*.16)+'px',color:'#fff',textShadow:'0 3px 0 '+INK,whiteSpace:'nowrap',opacity:0},wrap);
  ta.textContent='10/10';
  await c.ani(ta,[{opacity:0,transform:'translateX(-50%) scale(.3)'},{opacity:1,transform:'translateX(-50%) scale(1)'}],{duration:300,easing:'ease-out'});
  await c.sleep(1100);
  await c.ani(wrap,[{opacity:1},{opacity:0}],{duration:600});
};

/* 11. TRASH CAN: a person is thrown into the can ------------------- */
FX.trashcan=async c=>{
  const fw=Math.min(vmin()*.2,130),cw=Math.min(vw()*.3,170);
  const fig=c.mk('',{position:'absolute',left:'0',top:'0',width:fw+'px',opacity:0});
  fig.innerHTML=art.stick('flail','#000','100%');
  fig.firstChild.style.cssText='display:block;width:100%';
  const canLeft=vw()*.62,canBottom=vh()*.08;
  const can=c.mk('',{position:'absolute',left:canLeft+'px',bottom:canBottom+'px',width:cw+'px'});
  can.innerHTML=art.trash();
  const lid=can.querySelector('.lidg');
  lid.style.transformOrigin='10px 20px';
  c.go(lid,[{transform:'translate(0,-34px) rotate(-38deg)'},{transform:'translate(0,-34px) rotate(-38deg)'}],{duration:10,fill:'forwards'});
  await c.sleep(300);
  const canTop=vh()-canBottom-cw*170/120;
  const tx=canLeft+cw/2-fw/2;
  await c.ani(fig,arcFrames(-fw*1.6,vh()*.28,tx,canTop-fw*.6,vh()*.34,1.5,()=>({opacity:1})),{duration:1100,easing:'linear'});
  /* drop inside; the can body covers the lower part */
  await c.ani(fig,[{transform:`translate(${tx}px,${canTop-fw*.6}px) rotate(0deg)`,opacity:1},
    {transform:`translate(${tx}px,${canTop+fw*1.2}px) rotate(8deg)`,opacity:1}],{duration:300,easing:'ease-in'});
  fig.style.visibility='hidden';
  await c.ani(lid,[{transform:'translate(0,-34px) rotate(-38deg)'},{transform:'translate(0,2px) rotate(0deg)'},{transform:'translate(0,-5px) rotate(0deg)'},{transform:'translate(0,0) rotate(0)'}],{duration:340,easing:'ease-in'});
  shake(can,500);
  const cl=c.mk('',{position:'absolute',left:(canLeft-cw*.2)+'px',top:(canTop-cw*.55)+'px',fontFamily:TYPE,fontSize:Math.round(cw*.24)+'px',color:'#fff',textShadow:'0 3px 0 '+INK,whiteSpace:'nowrap',opacity:0});
  cl.textContent='CLANG!';
  c.go(cl,[{opacity:1,transform:'scale(.4) rotate(-10deg)'},{opacity:1,transform:'scale(1.1) rotate(-6deg)',offset:.4},{opacity:0,transform:'scale(1.2) rotate(-6deg)'}],{duration:1300});
  c.go(can,[{transform:'rotate(0)'},{transform:'rotate(-3deg)'},{transform:'rotate(3deg)'},{transform:'rotate(0)'}],{duration:420,iterations:2});
  await c.sleep(1800);
  await c.ani(can,[{opacity:1},{opacity:0}],{duration:600});
};
})();

(function(){
'use strict';
const L=LT,FX=LT.FX,{rnd,pick,flash,shake,shatter,poof,burst,boom,art,vw,vh,vmin}=L;
const page=()=>document.getElementById('page');
const DISP="Anton,Impact,'Arial Narrow Bold',sans-serif";
const INK='#070b1c';
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* 6. BRODIE: paint pours into a trash can that explodes ----------- */
FX.brodie=async c=>{
  const W=vw(),H=vh();
  const cw=Math.min(W*.3,170),canBottom=H*.04;
  const cols=['#ff2d95','#ffd400','#18c8ff','#7cff3b','#ff6a00','#9b5cff','#ff3b30'];
  const can=c.mk('',{position:'absolute',left:(W/2-cw/2)+'px',bottom:canBottom+'px',width:cw+'px',zIndex:'3'});
  can.innerHTML=art.trash();
  const lid=can.querySelector('.lidg');lid.style.transformOrigin='10px 20px';
  const step=Math.max(34,Math.min(58,W/22));
  const n=Math.ceil(W/step)+1;
  const drips=[];
  for(let i=0;i<n;i++){
    const w=rnd(step*.55,step*.95);
    const d=c.mk('',{position:'absolute',left:(i*step+rnd(-6,6))+'px',top:'-4px',width:w+'px',height:'0px',background:cols[i%cols.length],
      borderRadius:'0 0 '+(w/2)+'px '+(w/2)+'px',zIndex:'2',boxShadow:'inset -5px 0 0 rgba(255,255,255,.25)'});
    drips.push(d);
    c.go(d,[{height:'0px'},{height:(H*rnd(.18,.85))+'px'}],{duration:rnd(1600,2800),delay:i*55,easing:'cubic-bezier(.25,.7,.35,1)'});
  }
  await c.sleep(1500);
  /* the thick stream into the can */
  const canTop=H-canBottom-cw*170/120;
  const sw=cw*.5;
  const stream=c.mk('',{position:'absolute',left:(W/2-sw/2)+'px',top:'0',width:sw+'px',height:'0px',zIndex:'2',
    background:'linear-gradient(90deg,#ff2d95,#ffd400,#18c8ff,#7cff3b)',backgroundSize:'100% 100%',borderRadius:'0 0 12px 12px'});
  c.go(lid,[{transform:'translate(0,-30px) rotate(-34deg)'}],{duration:300});
  await c.ani(stream,[{height:'0px'},{height:(canTop+10)+'px'}],{duration:900,easing:'ease-in'});
  const spl=setInterval(()=>{
    if(!c.ok()){clearInterval(spl);return;}
    burst(W/2,canTop,cols,8,cw*1.1,[5,13]);
  },140);
  c.go(can,[{transform:'translate(0,0) rotate(0)'},{transform:'translate(-4px,0) rotate(-2deg)'},{transform:'translate(4px,0) rotate(2deg)'},{transform:'translate(0,0) rotate(0)'}],
    {duration:160,iterations:16});
  await c.sleep(2400);
  clearInterval(spl);
  /* kaboom */
  const r=can.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  can.style.visibility='hidden';
  boom(cx,cy,vmin()*.7);
  shake(page(),700);
  shatter(can,{cols:5,rows:6,gravity:H*.5});
  burst(cx,cy,cols,70,vmin()*.9,[8,26]);
  c.go(stream,[{opacity:1},{opacity:0}],{duration:300});
  await Promise.all(drips.map(d=>L.ani(d,[{opacity:1},{opacity:0}],{duration:1100,delay:rnd(0,500)})));
};

/* 12. CEREAL: rings fill the screen, 3 seconds, milk washes them out */
FX.cereal=async c=>{
  const W=vw(),H=vh();
  const s=Math.max(36,Math.min(60,W/15));
  const nc=Math.ceil(W/s)+1,nr=Math.ceil(H/s)+1;
  const tones=['#e0a040','#d68f2c','#e8b052','#c97f22'];
  const rings=[];
  for(let row=0;row<nr;row++){
    for(let col=0;col<nc;col++){
      const sz=s*rnd(.95,1.2);
      const x=col*s-(row%2?s*.5:0)+rnd(-5,5),y=H-(row+1)*s*.86+rnd(-6,6);
      const t=pick(tones);
      const e=c.mk('',{position:'absolute',left:x+'px',top:'0',width:sz+'px',height:sz+'px',borderRadius:'50%',
        background:'radial-gradient(circle,rgba(0,0,0,0) 0 27%,'+t+' 29% 100%)',boxShadow:'inset 0 -4px 0 rgba(120,60,0,.35),inset 0 3px 0 rgba(255,235,170,.45)',
        opacity:0});
      rings.push(e);
      c.go(e,[{opacity:1,transform:`translateY(${-sz*2}px) rotate(${rnd(-90,90)}deg)`},{opacity:1,transform:`translateY(${y}px) rotate(${rnd(-30,30)}deg)`}],
        {duration:rnd(700,1000),delay:row*(2800/nr)+rnd(0,350),easing:'cubic-bezier(.5,0,.9,.6)'});
    }
  }
  await c.sleep(2800+1100);
  shake(page(),300);
  await c.sleep(3000);
  /* milk */
  const milk=c.mk('',{position:'absolute',left:'0',top:'0',width:'100%',height:'100%',zIndex:'5',
    background:'linear-gradient(180deg,#ffffff,#eef2fb 60%,#e3e9f7)'});
  milk.innerHTML='<svg viewBox="0 0 1200 80" preserveAspectRatio="none" style="position:absolute;left:0;top:-78px;width:100%;height:80px;display:block"><path d="M0 80V40Q75 0 150 40T300 40T450 40T600 40T750 40T900 40T1050 40T1200 40V80Z" fill="#ffffff"/></svg>';
  const drops=[];
  for(let i=0;i<14;i++){
    const b=c.mk('',{position:'absolute',left:rnd(0,100)+'%',top:rnd(10,90)+'%',width:rnd(10,40)+'px',height:rnd(10,40)+'px',borderRadius:'50%',background:'rgba(255,255,255,.9)',boxShadow:'inset 0 -3px 0 #d3dcf0'},milk);
    drops.push(b);
  }
  await c.ani(milk,[{transform:`translateY(${H+90}px)`},{transform:'translateY(0)'}],{duration:1900,easing:'cubic-bezier(.45,.05,.4,1)'});
  rings.forEach(e=>e.remove());
  await c.ani(milk,[{transform:'translateY(0)'},{transform:`translateY(${-H-90}px)`}],{duration:1500,easing:'cubic-bezier(.5,0,.8,.7)'});
};

/* 13. BLONDE: suits and wigs, then blonde poofs ------------------- */
function suitSVG(){
  return '<svg viewBox="0 0 100 130" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M30 8L50 22L70 8L92 24L98 74L84 76L82 126H18L16 76L2 74L8 24Z" fill="#1b2a4a" stroke="#070b1c" stroke-width="3" stroke-linejoin="round"/>'+
    '<path d="M30 8L50 22L70 8L58 62L50 52L42 62Z" fill="#f4f6fa" stroke="#070b1c" stroke-width="2.5" stroke-linejoin="round"/>'+
    '<path d="M44 24L56 24L53 34L58 66L50 74L42 66L47 34Z" fill="#d1242f" stroke="#070b1c" stroke-width="2.5" stroke-linejoin="round"/>'+
    '<path d="M50 74V126M30 8L42 62M70 8L58 62" stroke="#070b1c" stroke-width="2.5" fill="none"/><circle cx="45" cy="92" r="2.4" fill="#f4c24f"/><circle cx="45" cy="108" r="2.4" fill="#f4c24f"/></svg>';
}
function wigSVG(){
  return '<svg viewBox="0 0 100 100" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset="1" stop-color="#e5b232"/></linearGradient></defs>'+
    '<path d="M50 4C18 4 6 34 12 62C16 80 10 92 4 98C26 96 34 88 40 80C46 74 54 74 60 80C66 88 74 96 96 98C90 92 84 80 88 62C94 34 82 4 50 4Z" fill="url(#bw)" stroke="#8a6410" stroke-width="3" stroke-linejoin="round"/>'+
    '<path d="M50 6C44 30 38 50 28 70M50 6C58 30 64 48 74 68M50 6C50 34 50 52 50 74" stroke="#c99a22" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
}
FX.blonde=async c=>{
  const W=vw(),H=vh();
  const gc=W<600?3:5,gr=W<600?4:3;
  const cw=W/gc,ch=H/gr,sz=Math.min(cw,ch)*.82;
  const cells=[];
  for(let r=0;r<gr;r++)for(let q=0;q<gc;q++)cells.push([q,r]);
  shuffle(cells);
  const items=[];
  for(let i=0;i<cells.length;i++){
    const [q,r]=cells[i];
    const suit=i%2===0;
    const w=suit?sz*.8:sz*.9;
    const x=q*cw+cw/2+rnd(-cw*.1,cw*.1),y=r*ch+ch/2+rnd(-ch*.1,ch*.1);
    const e=c.mk('',{position:'absolute',left:(x-w/2)+'px',top:(y-w*(suit?1.3:1)/2)+'px',width:w+'px',opacity:0,filter:'drop-shadow(0 5px 0 rgba(0,0,0,.3))'});
    e.innerHTML=suit?suitSVG():wigSVG();
    items.push({e,x,y,w});
  }
  for(const it of items){
    c.go(it.e,[{opacity:0,transform:'scale(.1) rotate(-30deg)'},{opacity:1,transform:'scale(1.15) rotate(6deg)',offset:.65},{opacity:1,transform:'scale(1) rotate('+rnd(-8,8)+'deg)'}],
      {duration:420,easing:'ease-out'});
    await c.sleep(110);
  }
  await c.sleep(1300);
  const hair=['#ffe27a','#f6d35a','#fff0a0','#e5b232'];
  for(const it of items){
    poof(it.x,it.y,pick(hair),10,it.w*.9,it.w*.9);
    burst(it.x,it.y,hair,12,it.w*1.1,[5,14]);
    c.go(it.e,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.5)'}],{duration:220});
    await c.sleep(70);
  }
  const fog=c.mk('fxfull',{background:'radial-gradient(circle,rgba(255,226,122,.45),rgba(255,226,122,0) 65%)',opacity:0});
  await c.ani(fog,[{opacity:0},{opacity:1,offset:.3},{opacity:0}],{duration:1500});
};

/* 14. TREEHOUSE: it burns down to bits, ashes blow away ------------ */
function treehouseSVG(){
  return '<svg viewBox="0 0 400 420" style="display:block;width:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M170 420C176 330 168 250 180 160L224 160C232 250 222 330 238 420Z" fill="#6b4220" stroke="#070b1c" stroke-width="5" stroke-linejoin="round"/>'+
    '<path d="M222 230C260 214 290 190 318 160" stroke="#6b4220" stroke-width="18" fill="none" stroke-linecap="round"/>'+
    '<g fill="#2f8f3a" stroke="#070b1c" stroke-width="4"><circle cx="90" cy="120" r="64"/><circle cx="200" cy="64" r="76"/><circle cx="318" cy="118" r="66"/><circle cx="140" cy="170" r="50"/><circle cx="268" cy="176" r="50"/></g>'+
    '<rect x="96" y="226" width="216" height="16" fill="#a0693a" stroke="#070b1c" stroke-width="4"/>'+
    '<rect x="116" y="148" width="176" height="80" fill="#c98a4b" stroke="#070b1c" stroke-width="5"/>'+
    '<path d="M116 170H292M116 194H292M116 214H292" stroke="#8a5a2b" stroke-width="3"/>'+
    '<path d="M104 150L204 84L304 150Z" fill="#b3202c" stroke="#070b1c" stroke-width="5" stroke-linejoin="round"/>'+
    '<rect x="136" y="166" width="38" height="36" fill="#9fd8ff" stroke="#070b1c" stroke-width="4"/><path d="M155 166V202M136 184H174" stroke="#070b1c" stroke-width="3"/>'+
    '<rect x="222" y="172" width="42" height="56" fill="#5b3716" stroke="#070b1c" stroke-width="4"/>'+
    '<path d="M110 242V344M126 242V344M110 262H126M110 286H126M110 310H126M110 334H126" stroke="#d8c8a0" stroke-width="4" fill="none"/></svg>';
}
FX.treehouse=async c=>{
  const W=vw(),H=vh();
  const tw=Math.min(W*.8,H*.62,460);
  const box=c.mk('fxfull',{display:'grid',placeItems:'center'});
  const th=c.mk('',{width:tw+'px',opacity:0},box);
  th.innerHTML=treehouseSVG();
  await c.ani(th,[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],{duration:700});
  await c.sleep(600);
  const r0=th.getBoundingClientRect();
  /* flames spread */
  const flames=[];
  const spots=[[.45,.5],[.62,.45],[.3,.42],[.5,.28],[.7,.3],[.2,.3],[.55,.66],[.4,.62],[.66,.22],[.35,.2],[.5,.4],[.8,.4]];
  for(let i=0;i<spots.length;i++){
    const fs=tw*rnd(.16,.26);
    const f=c.mk('',{position:'absolute',left:(r0.left+r0.width*spots[i][0]-fs/2)+'px',top:(r0.top+r0.height*spots[i][1]-fs)+'px',width:fs+'px',height:fs*1.4+'px',
      background:'radial-gradient(ellipse at 50% 80%,#fff3a0 0%,#ffb21a 35%,#ff4a12 70%,rgba(255,60,0,0) 100%)',borderRadius:'50% 50% 50% 50%/65% 65% 35% 35%',
      opacity:0,filter:'blur(1px)',transformOrigin:'50% 100%'});
    flames.push(f);
    c.go(f,[{opacity:0,transform:'scale(.2)'},{opacity:.95,transform:'scale(1)',offset:.25},{opacity:.9,transform:'scale(1.15,1.3)',offset:.6},{opacity:.95,transform:'scale(.95,1.1)'}],
      {duration:1000,delay:i*140});
    c.go(f,[{transform:'scale(1,1)'},{transform:'scale(.9,1.2) skewX(6deg)'},{transform:'scale(1.05,.95) skewX(-6deg)'}],{duration:220,iterations:Infinity,delay:i*140+1000,direction:'alternate'});
  }
  c.go(th,[{filter:'brightness(1)'},{filter:'brightness(.28) sepia(.7)'}],{duration:2400,delay:300});
  const sparks=setInterval(()=>{
    if(!c.ok()){clearInterval(sparks);return;}
    burst(r0.left+r0.width*rnd(.25,.75),r0.top+r0.height*rnd(.2,.55),['#ffb21a','#ff4a12','#ffe27a'],4,tw*.5,[3,8]);
  },120);
  await c.sleep(2900);
  clearInterval(sparks);
  /* crumble into bits */
  shatter(th,{cols:10,rows:10,gravity:H*.45});
  th.style.visibility='hidden';
  flames.forEach(f=>c.go(f,[{opacity:.9},{opacity:0}],{duration:500}));
  burst(r0.left+r0.width/2,r0.top+r0.height*.5,['#3b2a1a','#6b4220','#ffb21a','#222'],50,tw*.7,[5,16]);
  await c.sleep(1200);
  /* ashes blow away */
  const gy=r0.top+r0.height*.9;
  const ash=[];
  for(let i=0;i<150;i++){
    const s=rnd(4,12);
    const a=c.mk('',{position:'absolute',left:(r0.left+r0.width*rnd(.1,.9))+'px',top:(gy-rnd(0,r0.height*.18))+'px',width:s+'px',height:s*rnd(.6,1)+'px',
      background:pick(['#2d2d2d','#444','#666','#8a8a8a','#bbb']),borderRadius:Math.random()<.5?'50%':'1px',opacity:0});
    ash.push(a);
    c.go(a,[{opacity:1,transform:'translate(0,0) rotate(0deg)'},{opacity:1,offset:.2},
      {opacity:0,transform:`translate(${W*rnd(.6,1.1)}px,${rnd(-H*.4,H*.1)}px) rotate(${rnd(-720,720)}deg)`}],{duration:rnd(1800,3000),delay:rnd(0,1400),easing:'cubic-bezier(.4,0,.9,.7)'});
  }
  for(let i=0;i<9;i++){
    const wl=c.mk('',{position:'absolute',left:'-30vw',top:rnd(r0.top,r0.top+r0.height)+'px',width:rnd(20,40)+'vw',height:'3px',background:'rgba(255,255,255,.55)',borderRadius:'2px',opacity:0});
    c.go(wl,[{opacity:0,transform:'translateX(0)'},{opacity:1,offset:.2},{opacity:0,transform:'translateX(150vw)'}],{duration:1600,delay:200+i*160,easing:'ease-in'});
  }
  await c.sleep(4200);
};

/* 15. ROOM: electrical gear, then a giant O.C.S stamp ------------- */
const E={
  breaker:'<rect x="14" y="8" width="72" height="84" rx="4" fill="#aab2bd" stroke="#070b1c" stroke-width="4"/><rect x="22" y="16" width="56" height="68" fill="#d7dde5" stroke="#070b1c" stroke-width="3"/><g fill="#070b1c"><rect x="30" y="24" width="16" height="10"/><rect x="54" y="24" width="16" height="10"/><rect x="30" y="42" width="16" height="10"/><rect x="54" y="42" width="16" height="10"/><rect x="30" y="60" width="16" height="10"/><rect x="54" y="60" width="16" height="10"/></g><g fill="#fff"><rect x="30" y="24" width="16" height="4"/><rect x="54" y="42" width="16" height="4"/><rect x="30" y="60" width="16" height="4"/></g>',
  junction:'<rect x="12" y="14" width="76" height="66" rx="3" fill="#9aa3ad" stroke="#070b1c" stroke-width="4"/><g fill="#5b636d" stroke="#070b1c" stroke-width="2"><circle cx="22" cy="24" r="4"/><circle cx="78" cy="24" r="4"/><circle cx="22" cy="70" r="4"/><circle cx="78" cy="70" r="4"/></g><circle cx="50" cy="47" r="12" fill="#6e7681" stroke="#070b1c" stroke-width="3"/><path d="M50 80C50 94 70 90 70 100" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>',
  outlet:'<rect x="22" y="8" width="56" height="84" rx="8" fill="#f3efe4" stroke="#070b1c" stroke-width="4"/><g fill="#070b1c"><rect x="36" y="20" width="4" height="12"/><rect x="60" y="20" width="4" height="12"/><circle cx="50" cy="38" r="3.5"/><rect x="36" y="58" width="4" height="12"/><rect x="60" y="58" width="4" height="12"/><circle cx="50" cy="76" r="3.5"/></g>',
  switch:'<rect x="26" y="10" width="48" height="80" rx="6" fill="#f3efe4" stroke="#070b1c" stroke-width="4"/><rect x="42" y="32" width="16" height="36" rx="3" fill="#fff" stroke="#070b1c" stroke-width="3"/><circle cx="50" cy="19" r="2.5" fill="#070b1c"/><circle cx="50" cy="81" r="2.5" fill="#070b1c"/>',
  bulb:'<circle cx="50" cy="40" r="28" fill="#fff2a0" stroke="#070b1c" stroke-width="4"/><rect x="38" y="66" width="24" height="20" rx="3" fill="#8b9199" stroke="#070b1c" stroke-width="3"/><path d="M38 76H62M40 40L46 52L50 36L54 52L60 40" stroke="#070b1c" stroke-width="3" fill="none"/>',
  spool:'<circle cx="50" cy="50" r="38" fill="#e0852b" stroke="#070b1c" stroke-width="4"/><circle cx="50" cy="50" r="24" fill="#222"/><circle cx="50" cy="50" r="10" fill="#fff" stroke="#070b1c" stroke-width="3"/><path d="M28 50A22 22 0 0 1 72 50M32 62A20 20 0 0 0 68 62" stroke="#ffd166" stroke-width="3" fill="none"/>',
  warning:'<path d="M50 8L94 88H6Z" fill="#ffd23a" stroke="#070b1c" stroke-width="5" stroke-linejoin="round"/><path d="M56 32L40 56H52L46 76L64 50H52Z" fill="#070b1c"/>',
  fuse:'<rect x="12" y="34" width="76" height="32" rx="10" fill="rgba(190,230,255,.7)" stroke="#070b1c" stroke-width="4"/><rect x="8" y="30" width="20" height="40" rx="4" fill="#c9a24a" stroke="#070b1c" stroke-width="3"/><rect x="72" y="30" width="20" height="40" rx="4" fill="#c9a24a" stroke="#070b1c" stroke-width="3"/><path d="M28 50H72" stroke="#070b1c" stroke-width="2"/>',
  conduit:'<rect x="4" y="38" width="92" height="24" rx="12" fill="#6b7380" stroke="#070b1c" stroke-width="4"/><rect x="24" y="32" width="10" height="36" fill="#aab2bd" stroke="#070b1c" stroke-width="3"/><rect x="66" y="32" width="10" height="36" fill="#aab2bd" stroke="#070b1c" stroke-width="3"/>',
  plug:'<rect x="26" y="40" width="48" height="46" rx="8" fill="#222" stroke="#070b1c" stroke-width="4"/><rect x="36" y="14" width="6" height="28" fill="#cfd5dc" stroke="#070b1c" stroke-width="2"/><rect x="58" y="14" width="6" height="28" fill="#cfd5dc" stroke="#070b1c" stroke-width="2"/><path d="M50 86V100" stroke="#222" stroke-width="8"/>'
};
FX.room=async c=>{
  const W=vw(),H=vh();
  const keys=Object.keys(E);
  const gc=W<600?3:5,gr=W<600?4:3;
  const cw=W/gc,ch=H/gr,sz=Math.min(cw,ch)*.78;
  const cells=[];
  for(let r=0;r<gr;r++)for(let q=0;q<gc;q++)cells.push([q,r]);
  shuffle(cells);
  const wrapAll=c.mk('fxfull');
  const items=[];
  for(let i=0;i<cells.length;i++){
    const [q,r]=cells[i];
    const w=sz*rnd(.85,1.1);
    const e=c.mk('',{position:'absolute',left:(q*cw+cw/2-w/2+rnd(-cw*.08,cw*.08))+'px',top:(r*ch+ch/2-w/2+rnd(-ch*.08,ch*.08))+'px',width:w+'px',opacity:0,
      filter:'drop-shadow(0 5px 0 rgba(0,0,0,.35))'},wrapAll);
    e.innerHTML='<svg viewBox="0 0 100 100" style="display:block;width:100%" xmlns="http://www.w3.org/2000/svg">'+E[keys[i%keys.length]]+'</svg>';
    items.push(e);
  }
  for(const e of items){
    c.go(e,[{opacity:0,transform:'scale(.1) rotate(-25deg)'},{opacity:1,transform:'scale(1.15) rotate(5deg)',offset:.65},{opacity:1,transform:'scale(1) rotate('+rnd(-10,10)+'deg)'}],
      {duration:380,easing:'ease-out'});
    await c.sleep(130);
  }
  await c.sleep(900);
  /* the stamp */
  const sw=Math.min(W*.82,620);
  const stamp=c.mk('',{position:'absolute',left:'50%',top:'50%',width:sw+'px',marginLeft:-sw/2+'px',marginTop:-sw*.2+'px',textAlign:'center',
    fontFamily:DISP,fontSize:sw*.3+'px',lineHeight:'1',letterSpacing:'.06em',color:'#d81f26',border:(sw*.025)+'px solid #d81f26',padding:'.08em 0 .02em',
    background:'rgba(255,255,255,.1)',borderRadius:sw*.025+'px',mixBlendMode:'multiply',opacity:0,textShadow:'0 0 2px rgba(216,31,38,.6)'});
  stamp.textContent='O.C.S';
  await c.ani(stamp,[{opacity:0,transform:'scale(3.4) rotate(-20deg)'},{opacity:1,transform:'scale(.94) rotate(-9deg)',offset:.75},{opacity:.94,transform:'scale(1) rotate(-8deg)'}],
    {duration:420,easing:'cubic-bezier(.6,0,1,.6)'});
  shake(page(),450);flash('#ffffff',220);
  burst(W/2,H/2,['#d81f26','#a1151b','#ff5a5f'],36,sw*.5,[4,12]);
  await c.sleep(1900);
  await Promise.all([wrapAll,stamp].map(e=>L.ani(e,[{opacity:1},{opacity:0}],{duration:900})));
};
})();

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
