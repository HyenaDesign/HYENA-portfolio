import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../js/preloader.js', import.meta.url), 'utf8');
for (const mode of ['ready', 'slow', 'timeout', 'pagehide', 'reduced']) {
  const events = {}, timers = new Map(), classes = new Set();
  let id = 0, resolveFont, resolveImage;
  const classList = {add: x => classes.add(x), remove: x => classes.delete(x)};
  const dialog = {classList, setAttribute(){}, append(){}, addEventListener(){},
    showModal(){this.open=true;}, close(){this.open=false;}, remove(){this.removed=true;}};
  const image = {getBoundingClientRect:()=>({top:0,bottom:100,width:100,height:100}),
    decode:()=>new Promise(resolve=>{resolveImage=resolve;})};
  const offscreen = {getBoundingClientRect:()=>({top:2000,bottom:2100,width:100,height:100}),
    decode:()=>{throw new Error('Offscreen images must not block entry');}};
  const document = {documentElement:{classList},body:{append(){}},images:[image,offscreen],
    createElement:tag=>tag==='dialog'?dialog:{},readyState:'loading',
    fonts:{ready:new Promise(resolve=>{resolveFont=resolve;})},querySelectorAll:()=>[],
    addEventListener:(name,fn)=>{events[name]=fn;}};
  const window = {innerHeight:800,matchMedia:()=>({matches:mode==='reduced'}),
    addEventListener:(name,fn)=>{events[name]=fn;}};
  vm.runInNewContext(source,{document,window,
    setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id)});
  assert(dialog.open);
  assert(!events.load,'Analytics and full-page load must not gate the loader');
  events.DOMContentLoaded();
  await new Promise(resolve=>setImmediate(resolve));
  assert(dialog.open,'Visible images and fonts must finish first');
  if (mode==='timeout') [...timers.values()].find(t=>t.ms===4000).fn();
  else if (mode==='pagehide') events.pagehide();
  else {
    if (mode==='slow') {
      [...timers.values()].find(t=>t.ms===3000).fn();
      await new Promise(resolve=>setImmediate(resolve));
      assert(!classes.has('is-leaving') && dialog.open, 'Three seconds alone must not bypass asset loading');
    }
    resolveFont(); resolveImage();
    await new Promise(resolve=>setImmediate(resolve));
    if (mode!=='slow') {
      assert(!classes.has('is-leaving') && dialog.open, 'Ready content must still wait three seconds');
      [...timers.values()].find(t=>t.ms===3000).fn();
      await new Promise(resolve=>setImmediate(resolve));
    }
  }
  for (const timer of timers.values()) if (timer.ms===240) timer.fn();
  await window.siteReady;
  assert(dialog.removed && !dialog.open && !classes.has('is-loading'));
}
console.log('PASS: three-second minimum, slower asset readiness, no full-page load gate, timeout, reduced motion and navigation cleanup.');
