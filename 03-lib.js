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
