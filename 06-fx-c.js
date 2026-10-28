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
