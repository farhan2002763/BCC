const services=[['◈','Advertising Solutions'],['▣','Premium Signage'],['⌘','CNC Routing & Laser Cutting'],['▦','Event Production'],['⚙','Production Services'],['◇','Creative Design']];
const sg=document.getElementById('serviceGrid');
if(sg) services.forEach(([i,t])=>{const e=document.createElement('article');e.className='service';e.innerHTML=`<div class="icon">${i}</div><h3>${t}</h3>`;sg.appendChild(e)});


const projects = Array.isArray(window.BCC_PROJECTS) ? window.BCC_PROJECTS : [];
const track=document.getElementById('projectTrack');
let lightboxIndex=0, zoom=1, dragX=0, dragY=0, imageDragging=false, galleryDown=false, galleryMoved=false, galleryStartX=0, galleryScroll=0;
const lightbox=document.createElement('div');
lightbox.className='project-lightbox';lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');lightbox.setAttribute('aria-label','Project image viewer');
lightbox.innerHTML=`<button class="project-lightbox-close" type="button" aria-label="Close image viewer">×</button><button class="project-lightbox-prev" type="button" aria-label="Previous image">‹</button><button class="project-zoom-out" type="button" aria-label="Zoom out">−</button><button class="project-zoom-in" type="button" aria-label="Zoom in">+</button><img class="project-lightbox-image" alt=""><button class="project-lightbox-next" type="button" aria-label="Next image">›</button><div class="project-lightbox-caption" aria-live="polite"></div>`;
document.body.appendChild(lightbox);
const lbImage=lightbox.querySelector('.project-lightbox-image'), lbCaption=lightbox.querySelector('.project-lightbox-caption');
function setZoom(value){zoom=Math.max(1,Math.min(3,value));lbImage.style.transform=`translate(${dragX}px, ${dragY}px) scale(${zoom})`;lbImage.classList.toggle('is-zoomed',zoom>1);lbImage.style.cursor=zoom>1?'grab':'default';}
function showLightbox(index){lightboxIndex=(index+projects.length)%projects.length;const p=projects[lightboxIndex];zoom=1;dragX=dragY=0;lbImage.style.transform='';lbImage.src=`images/${p.file}`;lbImage.alt=`BCC ${p.title}`;lbImage.classList.remove('is-zoomed');lbCaption.textContent=`${p.title} · ${lightboxIndex+1} / ${projects.length}`;lightbox.classList.add('is-open');document.body.classList.add('lightbox-open');}
function closeLightbox(){lightbox.classList.remove('is-open');document.body.classList.remove('lightbox-open');}
function stepLightbox(direction){showLightbox(lightboxIndex+direction)}
function render(){if(!track)return;track.innerHTML='';projects.forEach((p,idx)=>{const e=document.createElement('article');e.className='project';e.dataset.projectIndex=idx;e.innerHTML=`<img draggable="false" loading="lazy" src="images/${p.file}" alt="BCC ${p.title}"><h4>${p.title}</h4><p>${p.cat}</p>`;e.addEventListener('click',()=>{if(!galleryMoved)showLightbox(idx)});track.appendChild(e)});}
render();
const nextBtn=document.getElementById('next'),prevBtn=document.getElementById('prev');
if(nextBtn)nextBtn.onclick=()=>track?.scrollBy({left:track.clientWidth*.85,behavior:'smooth'});
if(prevBtn)prevBtn.onclick=()=>track?.scrollBy({left:-track.clientWidth*.85,behavior:'smooth'});
lightbox.querySelector('.project-lightbox-close').addEventListener('click',closeLightbox);
lightbox.querySelector('.project-lightbox-prev').addEventListener('click',()=>stepLightbox(-1));
lightbox.querySelector('.project-lightbox-next').addEventListener('click',()=>stepLightbox(1));
lightbox.querySelector('.project-zoom-in').addEventListener('click',()=>setZoom(zoom+.25));
lightbox.querySelector('.project-zoom-out').addEventListener('click',()=>setZoom(zoom-.25));

lightbox.addEventListener('wheel',e=>{if(!lightbox.classList.contains('is-open'))return;e.preventDefault();setZoom(zoom+(e.deltaY<0?.2:-.2));},{passive:false});
lbImage.addEventListener('click',e=>{if(imageDragging)return;setZoom(zoom===1?1.5:1);});
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
lbImage.addEventListener('dblclick',()=>setZoom(zoom===1?2:1));
lbImage.addEventListener('pointerdown',e=>{if(zoom<=1)return;imageDragging=true;dragX-=0;lbImage.dataset.px=e.clientX;lbImage.dataset.py=e.clientY;lbImage.setPointerCapture?.(e.pointerId);lbImage.style.cursor='grabbing'});
lbImage.addEventListener('pointermove',e=>{if(!imageDragging)return;const px=Number(lbImage.dataset.px),py=Number(lbImage.dataset.py);dragX+=e.clientX-px;dragY+=e.clientY-py;lbImage.dataset.px=e.clientX;lbImage.dataset.py=e.clientY;setZoom(zoom)});
const stopImageDrag=()=>{imageDragging=false;if(zoom>1)lbImage.style.cursor='grab'};lbImage.addEventListener('pointerup',stopImageDrag);lbImage.addEventListener('pointercancel',stopImageDrag);
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('is-open'))return;if(e.key==='Escape')closeLightbox();else if(e.key==='ArrowLeft')stepLightbox(-1);else if(e.key==='ArrowRight'||e.key==='ArrowDown')stepLightbox(1);else if(e.key==='ArrowUp')stepLightbox(-1);else if(e.key==='+'||e.key==='=')setZoom(zoom+.25);else if(e.key==='-')setZoom(zoom-.25)});
let touchStartX=0,touchStartY=0;
lightbox.addEventListener('touchstart',e=>{if(e.touches.length===1){touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY}},{passive:true});
lightbox.addEventListener('touchend',e=>{if(!lightbox.classList.contains('is-open')||!e.changedTouches.length||zoom>1)return;const dx=e.changedTouches[0].clientX-touchStartX,dy=e.changedTouches[0].clientY-touchStartY;if(Math.max(Math.abs(dx),Math.abs(dy))>55){const delta=Math.abs(dx)>Math.abs(dy)?dx:dy;stepLightbox(delta<0?1:-1)}},{passive:true});

if(track){track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;galleryDown=true;galleryMoved=false;galleryStartX=e.clientX;galleryScroll=track.scrollLeft;track.classList.add('is-dragging')});track.addEventListener('pointermove',e=>{if(!galleryDown)return;const dx=e.clientX-galleryStartX;if(Math.abs(dx)>5)galleryMoved=true;if(galleryMoved)track.scrollLeft=galleryScroll-dx});const finish=()=>{if(!galleryDown)return;galleryDown=false;track.classList.remove('is-dragging');if(galleryMoved)setTimeout(()=>{galleryMoved=false},100)};track.addEventListener('pointerup',finish);track.addEventListener('pointercancel',finish);}

const hamb=document.getElementById('hamb'),nav=document.getElementById('nav');
if(hamb&&nav)hamb.onclick=()=>{nav.classList.toggle('open');nav.style.display=nav.classList.contains('open')?'flex':'none';nav.style.position='absolute';nav.style.top='68px';nav.style.left='0';nav.style.right='0';nav.style.background='#050505';nav.style.padding='20px';nav.style.flexDirection='column'};
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{if(window.innerWidth<=1050&&nav)nav.style.display='none'});


const glossyCards=document.querySelectorAll('.service-grid>*,.service-details>article,.vision-grid>article,.process-grid>article,.why-grid>article,.about-stats>div,.quality-list>span,.real-world-grid>article,.real-world>article,.real-world-cards>article,#services .service-card,.specials-grid>*,.finish-grid>*,.feature-grid>*,.project-track .project');
glossyCards.forEach(card=>{
 card.addEventListener('pointerdown',()=>card.classList.add('touch-gloss'),{passive:true});
 const clear=()=>card.classList.remove('touch-gloss');
 card.addEventListener('pointerup',clear,{passive:true});card.addEventListener('pointercancel',clear,{passive:true});card.addEventListener('pointerleave',clear,{passive:true});
});
