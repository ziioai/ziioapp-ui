import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const components=JSON.parse(readFileSync(resolve(root,'upstream/components.json'),'utf8'));
for(const {name} of components) for(const extension of ['js','d.ts']) {
  const path=resolve(root,`dist/shadcn/components/${name}.${extension}`);
  if(!existsSync(path))throw new Error(`Missing published component: ${path}`);
  if(readFileSync(path,'utf8').includes('@/'))throw new Error(`Unresolved website alias: ${path}`);
}
const css=readFileSync(resolve(root,'dist/styles.css'),'utf8');
if(/@(?:apply|source|theme|reference)\b/.test(css))throw new Error('Uncompiled Tailwind directives in CSS');
for(const style of JSON.parse(readFileSync(resolve(root,'upstream/lock.json'),'utf8')).styles)if(!css.includes(`.style-${style}`))throw new Error(`Missing compiled style ${style}`);
const item=JSON.parse(readFileSync(resolve(root,'dist/registry/ziio-ui.json'),'utf8'));
if(item.files.some(file=>file.content.includes('@ziioapp/ui/')))throw new Error('Registry must be independent of the runtime npm package');
console.log(`Verified ${components.length} JS/type entry pairs, all compiled styles and standalone registry imports`);
