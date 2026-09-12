import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(resolve(root,'upstream/components.json'),'utf8'));
const pkg=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
const rewrite = content => content
  .replaceAll('@ziioapp/ui/components/', './')
  .replaceAll('@ziioapp/ui/hooks/', './')
  .replaceAll('@ziioapp/ui/lib/', './');
const files=manifest.map(item=>({path:`ui/${item.name}.tsx`,target:`~/src/components/ziio-ui/${item.name}.tsx`,type:'registry:file',content:rewrite(readFileSync(resolve(root,item.output),'utf8'))}));
files.push({path:'hooks/use-mobile.ts',target:'~/src/components/ziio-ui/use-mobile.ts',type:'registry:file',content:readFileSync(resolve(root,'src/shadcn/hooks/use-mobile.ts'),'utf8')});
files.push({path:'lib/utils.ts',target:'~/src/components/ziio-ui/utils.ts',type:'registry:file',content:readFileSync(resolve(root,'src/lib/utils.ts'),'utf8')});
files.push({path:'styles/ziio-ui.css',target:'src/styles/ziio-ui.css',type:'registry:file',content:readFileSync(resolve(root,'dist/styles.css'),'utf8')});
files.push({path:'lib/official-themes.ts',target:'~/src/components/ziio-ui/official-themes.ts',type:'registry:file',content:readFileSync(resolve(root,'src/lib/official-themes.ts'),'utf8')});
const item={
  $schema:'https://ui.shadcn.com/schema/registry-item.json',name:'ziio-ui',type:'registry:ui',
  title:'Ziio official runtime UI',description:'All Base UI components, eight runtime styles and official color palettes. Import src/styles/ziio-ui.css and set body.style-mira before first paint.',
  dependencies:Object.entries(pkg.dependencies).filter(([name])=>name!=='tailwindcss'&&name!=='tw-animate-css').map(([name,version])=>`${name}@${version}`),
  files,
};
const output=resolve(root,'dist/registry');mkdirSync(output,{recursive:true});
writeFileSync(resolve(output,'ziio-ui.json'),JSON.stringify(item,null,2)+'\n');
writeFileSync(resolve(output,'registry.json'),JSON.stringify({$schema:'https://ui.shadcn.com/schema/registry.json',name:'ziio-ui',homepage:'https://github.com/ziioai/ziioapp-ui',items:[{...item,$schema:undefined}]},null,2)+'\n');
console.log(`Generated local registry: ${files.length} files; no remote publication`);
