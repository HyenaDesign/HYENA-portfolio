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
