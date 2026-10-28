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
