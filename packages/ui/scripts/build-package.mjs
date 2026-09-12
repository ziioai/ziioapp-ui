import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [resolve(root,'scripts/sync-upstream.mjs')], {stdio:'inherit'});
rmSync(resolve(root,'dist'),{recursive:true,force:true});
execFileSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'-p',resolve(root,'tsconfig.dist.json')],{stdio:'inherit'});
cpSync(resolve(root,'src/styles'),resolve(root,'dist/styles'),{recursive:true});
const lock=JSON.parse(readFileSync(resolve(root,'upstream/lock.json'),'utf8'));
const colors=(await import('../src/lib/official-themes.ts')).officialThemeColors;
const baseImports=['@import "./shadcn.css";', '@import "./official/bases/base-zinc.css";'];
const colorImports=[];
for(const kind of ['bases','themes','charts']) {
  for(const file of readdirSync(resolve(root,'src/styles/official',kind))) colorImports.push(`@import "./official/${kind}/${file}";`);
}
const styleImport = style => `@import "./styles/style-${style}.css" layer(base);`;
const sizes={};
async function emit(name, css, scan=true) {
  const result=await compile(css,{base:resolve(root,'src/styles'),onDependency(){}});
  const candidates=scan?new Scanner({sources:result.sources}).scan():[];
  const out=optimize(result.build(candidates),{minify:true}).code;
  const path=resolve(root,'dist',name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,out);
  sizes[name]={bytes:Buffer.byteLength(out),gzipBytes:gzipSync(out).length};
}
await emit('styles.css',[...baseImports,...colorImports,...lock.styles.map(styleImport)].join('\n'));
await emit('base.css',[...baseImports,...colorImports].join('\n'));
for(const style of lock.styles) await emit(`styles/compiled/${style}.css`,`@reference "./shadcn.css";\n${styleImport(style)}`,false);
writeFileSync(resolve(root,'dist/size-report.json'),JSON.stringify({styles:lock.styles,colors,sizes},null,2)+'\n');
console.log(JSON.stringify(sizes,null,2));
