import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../js/scroll-animations.js', import.meta.url), 'utf8');
for (const reduced of [false, true]) {
  let ready, onEntries, onMotion, onFocus, disconnected = false;
  const observed = new Set();
  function element(kind) {
    return { classList: {contains: value => value === kind}, calls: 0,
      animate() { this.calls++; return this.animation = {cancel(){this.cancelled=true;}}; },
      closest() {return this;} };
  }
  const card = element('card'), sticker = element('sticker-anchor'), profile = element('bento-card--profile');
  const motion = {matches:reduced,addEventListener:(_,fn)=>{onMotion=fn;}};
  class Observer {
    constructor(callback) {onEntries=callback;}
    observe(element) {observed.add(element);}
    unobserve(element) {observed.delete(element);}
    disconnect() {disconnected=true;observed.clear();}
  }
  vm.runInNewContext(source, {
    IntersectionObserver:Observer,
    window:{IntersectionObserver:Observer,matchMedia:()=>motion,
      siteReady:new Promise(resolve=>{ready=resolve;})},
    document:{querySelectorAll:()=>[card,sticker,profile],
      addEventListener:(name,fn)=>{assert.equal(name,'focusin');onFocus=fn;}},
  });
  assert.equal(observed.size,0,'Reveals must wait until the loader closes');
  ready(); await new Promise(resolve=>setImmediate(resolve));
  if (reduced) {assert.equal(observed.size,0);continue;}
  assert.equal(observed.size,2,'Live GPU portrait must not animate');
  onEntries([{target:card,isIntersecting:true}]);
  onEntries([{target:card,isIntersecting:false},{target:card,isIntersecting:true}]);
  assert.equal(card.calls,1,'Scrolling back must not replay reveals');
  onFocus({target:card}); assert(card.animation.cancelled);
  onFocus({target:sticker}); assert.equal(sticker.calls,0,'Focus must skip the reveal');
  motion.matches=true; onMotion(); assert(disconnected);
}
console.log('PASS: reveals wait for the loader, run once, skip the GPU portrait, and respect keyboard focus and reduced motion.');
