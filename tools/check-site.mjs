import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { root, createSiteServer } from './serve.mjs';

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'tools' || entry.name === 'node_modules') return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [path.relative(root,file).split(path.sep).join('/')];
  });
}
const files = walk(root);
const exactFiles = new Set(files);
const contents = new Map(files.filter(f => /\.(html|css|json|xml)$/.test(f)).map(f => [f,fs.readFileSync(path.join(root,f),'utf8')]));
const ids = new Map([...contents].filter(([f])=>f.endsWith('.html')).map(([f,s])=>[f,new Set([...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
let references = 0;
function checkReference(from, raw) {
  const value = raw.replaceAll('&amp;', '&');
  if (!value || /^(data:|mailto:|tel:|https?:|\/\/)/.test(value)) return;
  const [pathname, hash] = value.split('#');
  const clean = decodeURIComponent(pathname.split('?')[0]);
  const resolved = clean ? path.posix.normalize(clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(from), clean)) : from;
  assert(exactFiles.has(resolved), `${from}: missing file or casing mismatch: ${value} (${resolved})`);
  if (hash && ids.has(resolved)) assert(ids.get(resolved).has(decodeURIComponent(hash)), `${from}: missing anchor ${value}`);
  references++;
}
for (const [file,text] of contents) {
  if (file.endsWith('.html')) {
    for (const match of text.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) checkReference(file,match[1]);
    assert(!/john[.\s_-]*doe|example\.com|Social 0[12]/i.test(text), `${file}: placeholder branding`);
    assert(/<title>[^<]+<\/title>/.test(text), `${file}: missing title`);
  }
  if (file.endsWith('.css') || file.endsWith('.html')) {
    for (const match of text.matchAll(/url\(["']?([^"')]+)["']?\)/g)) checkReference(file,match[1]);
  }
}
const projects = JSON.parse(contents.get('projects.json'));
assert.equal(new Set(projects.map(p=>p.title)).size,projects.length);
for (const project of projects) {
  for (const key of ['title','description','thumbnail']) assert.equal(typeof project[key],'string');
  for (const key of ['categories','techStack']) assert(project[key].length && project[key].every(t=>typeof t==='string' && t.trim()));
  checkReference('projects.json',project.thumbnail);
  if (project.artwork) checkReference('projects.json',project.artwork);
  if (project.url) checkReference('projects.json',project.url);
}
for (const file of files.filter(f=>f.startsWith('warpkit/scenes/') && f.endsWith('.js'))) {
  vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'), {warpkit:{scene(name,scene) {
    for (const layer of scene.layers) if (layer.params?.src) checkReference(file,layer.params.src);
  }}});
}
for (const name of ['design-services','graphic-eq','motion-blur']) checkReference('index.html',`assets/cursors/${name}.svg`);
for (const file of files.filter(f=>f.endsWith('.js'))) {
  const result=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  assert.equal(result.status,0,`${file}: ${result.stderr}`);
}
const server=createSiteServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
  const base=`http://127.0.0.1:${server.address().port}`;
  for (const file of files.filter(f=>!f.endsWith('.md'))) {
    const response=await fetch(`${base}/${file.split('/').map(encodeURIComponent).join('/')}`);
    assert.equal(response.status,200,file);
    assert.equal((await response.arrayBuffer()).byteLength,fs.statSync(path.join(root,file)).size,file);
  }
  assert.equal((await fetch(`${base}/assets/Stickers/GoodMood.png`)).status,404,'Preview must catch Linux casing errors');
  assert.equal((await fetch(`${base}/missing.html`)).status,404);
} finally { await new Promise(resolve=>server.close(resolve)); }
console.log(`PASS: ${projects.length} projects, ${references} local references, JS syntax, and HTTP delivery with case-sensitive paths.`);
