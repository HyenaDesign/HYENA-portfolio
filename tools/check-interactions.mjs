import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { root } from './serve.mjs';

class Element {
  constructor(tag='div') { this.tag=tag; this.children=[]; this.events={}; this.attributes={}; this.dataset={}; this.hidden=false; this.disabled=false; const classes=new Set(); this.classList={add:(x)=>classes.add(x),remove:(x)=>classes.delete(x),contains:(x)=>classes.has(x)}; }
  append(...items) { this.children.push(...items); }
  set innerHTML(value) { this.children=[]; }
  setAttribute(key,value) { this.attributes[key]=value; }
  addEventListener(type,fn) { (this.events[type]??=[]).push(fn); }
  removeEventListener(type,fn) { this.events[type]=(this.events[type]||[]).filter(f=>f!==fn); }
  emit(type,event={}) { for(const fn of this.events[type]||[]) fn(event); }
  contains(element) { return this.children.includes(element); }
  focus() { this.focused=true; }
}
function harness(reduced=false) {
  const document=new Element(); document.body=new Element(); document.hidden=false;
  document.createElement=tag=>new Element(tag); document.querySelector=()=>null; document.querySelectorAll=()=>[];
  const motion=new Element(); motion.matches=reduced;
  const timers=new Map(); let id=0;
  const errors=[];
  const context={document,window:{matchMedia:()=>motion},console:{error:e=>errors.push(e)},setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id},clearTimeout:id=>timers.delete(id)};
  return {document,motion,timers,errors,context};
}
async function carouselCase(projects,reduced=false) {
  const h=harness(reduced), carousel=new Element(), container=new Element(), controls=new Element(), status=new Element();
  controls.hidden=true;
  carousel.querySelector=s=>({'#project-slides':container,'.carousel-controls':controls,'.carousel-status':status})[s];
  h.document.querySelector=s=>s==='.bento-card--project'?carousel:null;
  h.context.fetch=async()=>({ok:true,json:async()=>projects});
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/main.js'),'utf8'),h.context);
  await new Promise(resolve=>setImmediate(resolve));
  return {...h,carousel,container,controls,status};
}
const projects=JSON.parse(fs.readFileSync(path.join(root,'projects.json'),'utf8'));
const h=await carouselCase(projects);
assert.equal(h.container.children.length,projects.length);
assert.equal(h.container.children.filter(s=>!s.hidden).length,1);
assert.equal(h.timers.size,1); assert.equal([...h.timers.values()][0].ms,5000);
[...h.timers.values()][0].fn(); assert.equal(h.status.textContent,`2 / ${projects.length}`);
h.carousel.emit('pointerenter',{pointerType:'mouse'}); assert.equal(h.timers.size,0);
h.carousel.emit('pointerleave'); assert.equal(h.timers.size,1);
h.carousel.emit('focusin'); assert.equal(h.timers.size,0);
h.carousel.emit('focusout',{relatedTarget:null}); assert.equal(h.timers.size,1);
h.document.hidden=true;h.document.emit('visibilitychange');assert.equal(h.timers.size,0);
h.document.hidden=false;h.document.emit('visibilitychange');assert.equal(h.timers.size,1);
h.controls.emit('click',{target:{closest:()=>({dataset:{direction:'-1'}})}});assert.equal(h.status.textContent,`1 / ${projects.length}`);
for (const [index,project] of projects.entries()) {
  const caption=h.container.children[index].children[1];
  assert.equal(caption.children[2].children[1].children[1].children.length,project.techStack.length);
  if(project.url) assert.equal(caption.children.at(-1).href,project.url);
}
h.motion.matches=true;h.motion.emit('change');assert.equal(h.timers.size,0);
assert.equal((await carouselCase(projects,true)).timers.size,0);
const bad=await carouselCase([{title:'broken'}]);assert.equal(bad.container.children[0].attributes.role,'alert');
const empty=await carouselCase([]);assert.match(empty.container.children[0].textContent,/Add projects/);

for (const reduced of [false,true]) {
  const h=harness(reduced), anchor=new Element(), button=new Element('button'), target=new Element('a');
  anchor.dataset.focusTarget='#about';button.dataset.stickerName='Good Mood';button.closest=()=>anchor;
  h.document.activeElement=button;h.document.querySelector=()=>target;h.document.querySelectorAll=()=>[button];
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/stickers.js'),'utf8'),h.context);
  button.emit('click');assert(button.disabled);assert(target.focused);
  if(!reduced){assert(anchor.classList.contains('is-scraping'));button.emit('animationend',{target:button,animationName:'sticker-scrape'});}
  assert(anchor.classList.contains('is-scraped'));assert.equal(button.attributes['aria-hidden'],'true');assert.equal(h.timers.size,0);
  button.emit('click');assert.equal(h.timers.size,0);
}
console.log('PASS: carousel loading, tags, links, five-second timer, navigation, pause states, reduced motion, errors, and sticker removal/focus.');

// Drag scrolling must distinguish intentional drags from clicks and controls.
{
  const document = new Element(), window = new Element(), root = new Element();
  const captures = new Set(), scrolls = [];
  document.documentElement = root;
  root.setPointerCapture = id => captures.add(id);
  root.hasPointerCapture = id => captures.has(id);
  root.releasePointerCapture = id => captures.delete(id);
  window.scrollY = 400;
  root.scrollHeight = 3000; window.innerHeight = 800;
  window.matchMedia = () => ({matches:true, addEventListener(){}});
  window.scrollTo = options => scrolls.push(options);
  window.getSelection = () => ({removeAllRanges() {}});
  vm.runInNewContext(fs.readFileSync(path.join(rootPath(),'js/drag-scroll.js'),'utf8'), {document, window, performance:{now:()=>0}, cancelAnimationFrame(){}});
  function event(overrides={}) {
    return {pointerType:'mouse', button:0, buttons:1, isPrimary:true, pointerId:1,
      clientY:200, target:{closest:()=>null}, preventDefault(){this.prevented=true},
      stopImmediatePropagation(){this.stopped=true}, ...overrides};
  }
  for (const overrides of [{pointerType:'touch'}, {button:2}, {shiftKey:true}, {target:{closest:()=>({})}}]) {
    document.emit('pointerdown',event(overrides));
    document.emit('pointermove',event({clientY:100}));
    assert.equal(scrolls.length,0);
  }
  document.emit('pointerdown',event());
  document.emit('pointermove',event({clientY:197}));
  assert.equal(scrolls.length,0);
  document.emit('pointerup',event());
  const click=event(); document.emit('click',click); assert(!click.prevented);
  document.emit('pointerdown',event());
  document.emit('pointermove',event({clientY:150}));
  assert.equal(scrolls.at(-1).top,450);
  assert.equal(scrolls.at(-1).behavior,'instant');
  assert(root.classList.contains('is-drag-scrolling')); assert(captures.has(1));
  document.emit('pointerup',event());
  assert(!root.classList.contains('is-drag-scrolling')); assert.equal(captures.size,0);
  const afterDrag=event(); document.emit('click',afterDrag); assert(afterDrag.prevented && afterDrag.stopped);
  document.emit('pointerdown',event());
  document.emit('pointermove',event({clientY:250}));
  assert.equal(scrolls.at(-1).top,350);
  window.emit('blur'); assert.equal(captures.size,0);
  document.emit('pointerdown',event());
  document.emit('pointermove',event({clientY:100}));
  document.emit('pointercancel',event()); assert.equal(captures.size,0);
  console.log('PASS: drag scrolling threshold, direction, control/touch exclusions, click suppression and cancellation.');
}

function rootPath() { return root; }

for (const reduced of [false,true]) {
  const h=harness(reduced);
  h.context.fetch=async()=>({ok:true,json:async()=>projects});
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/featured-projects.js'),'utf8'),h.context);
  await new Promise(resolve=>setImmediate(resolve));
  const groups=h.context.groupFeaturedProjects(projects);
  assert.equal(Object.values(groups).flat().length,projects.length);
  for(const [group,initial] of [['ui','Promptly'],['motion','SWEAR 3D Shoe Configurator'],['graphic','The Lost Regiment']]) {
    const card=new Element(), image=new Element(), title=new Element(), description=new Element();
    const link=new Element('a'), label=new Element(), credit=new Element(), more=new Element(), body=new Element();
    image.style={}; title.textContent=initial; link.querySelector=()=>label;
    card.querySelector=s=>({'.selected-work-image img':image,'h2':title,'.card-content > p':description,
      '.card-cta':link,'.project-credit':credit,'.project-more':more,'.card-content':body})[s];
    h.context.setupFeaturedCarousel(card,groups[group]);
    assert.equal(title.textContent,initial);
    const controls=body.children[0], [previous,status,next]=controls.children;
    assert.equal(controls.children.length,3);
    assert(more.hidden);
    if(!reduced) {
      const timer=[...h.timers.values()].at(-1);
      assert.equal(timer.ms,5000); timer.fn();
      assert.notEqual(title.textContent,initial);
      card.emit('pointerenter',{pointerType:'mouse'});
      const before=h.timers.size; card.emit('pointerleave'); assert.equal(h.timers.size,before+1);
    }
    next.emit('click');
    const active=groups[group].find(project=>project.title===title.textContent);
    assert.equal(link.href,active.url || active.thumbnail);
    assert.equal(image.src,active.thumbnail);
    assert.equal(credit.hidden,active.title!==initial);
    previous.emit('click'); assert(status.textContent.includes('/'));
    card.emit('focusin'); const before=h.timers.size;
    card.emit('focusout',{relatedTarget:null});
    assert.equal(h.timers.size,before+(reduced?0:1));
  }
  h.document.hidden=true; h.document.emit('visibilitychange'); assert.equal(h.timers.size,0);
}
console.log('PASS: service-matched project rotation, five-second interval, navigation, credits, pause and reduced motion.');


{
  const document = new Element(), window = new Element(), surface = new Element();
  const frames = new Map(), captures = new Set();
  let now = 0, id = 0;
  document.documentElement = surface;
  surface.scrollHeight = 3000; window.innerHeight = 800; window.scrollY = 400;
  surface.setPointerCapture = id => captures.add(id);
  surface.hasPointerCapture = id => captures.has(id);
  surface.releasePointerCapture = id => captures.delete(id);
  window.matchMedia = () => ({matches:false, addEventListener(){}});
  window.getSelection = () => ({removeAllRanges(){}});
  window.scrollTo = ({top}) => {window.scrollY = Math.max(0,Math.min(2200,top));};
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/drag-scroll.js'),'utf8'), {
    document, window, performance:{now:()=>now},
    requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},
    cancelAnimationFrame:id=>frames.delete(id),
  });
  const event = y => ({pointerType:'mouse',button:0,buttons:1,isPrimary:true,pointerId:1,
    clientY:y,target:{closest:()=>null},preventDefault(){}});
  function tick() {
    now += 16;
    const pending=[...frames.values()]; frames.clear();
    pending.forEach(fn=>fn(now));
  }
  document.emit('pointerdown',event(200)); now+=16;
  document.emit('pointermove',event(140)); tick();
  assert(window.scrollY>400 && window.scrollY<460,'Drag eases toward the pointer');
  document.emit('pointerup',event(140));
  for(let i=0;i<100;i++) tick();
  assert(window.scrollY>750 && window.scrollY<900,'Release adds noticeable but bounded momentum');
  assert.equal(frames.size,0,'Momentum settles');
  document.emit('pointerdown',event(200)); now+=16;
  document.emit('pointermove',event(140)); tick();
  now+=100; document.emit('pointerup',event(140));
  const pausedTarget=window.scrollY;
  for(let i=0;i<100;i++) tick();
  assert(window.scrollY-pausedTarget<60,'Pausing before release removes momentum');
  document.emit('pointerdown',event(200)); now+=16;
  document.emit('pointermove',event(100)); tick(); document.emit('pointerup',event(100));
  window.emit('wheel'); assert.equal(frames.size,0,'Wheel immediately cancels momentum');
  window.scrollY=2190;
  document.emit('pointerdown',event(200)); now+=16;
  document.emit('pointermove',event(0)); document.emit('pointerup',event(0));
  for(let i=0;i<100;i++) tick();
  assert.equal(window.scrollY,2200); assert.equal(frames.size,0);
  console.log('PASS: smooth dragging, bounded momentum, stale velocity, interruption and page boundaries.');
}
