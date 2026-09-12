import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const candidateIndex = args.indexOf('--upstream');
const upstreamRoot = candidateIndex >= 0 ? resolve(args[candidateIndex + 1]) : resolve(root, 'upstream');
if (candidateIndex >= 0 && args.includes('--write')) throw new Error('Review and adopt the candidate upstream directory before writing generated output');
const lock = JSON.parse(readFileSync(resolve(upstreamRoot, 'lock.json'), 'utf8'));
const write = process.argv.includes('--write');
const hash = (text) => createHash('sha256').update(text).digest('hex');
const outputs = new Map();
const components = [];
const header = '// Generated from locked shadcn upstream; edit scripts/sync-upstream.mjs, not this file.\n';
for (const [path, expected] of Object.entries(lock.files)) {
  const raw = readFileSync(resolve(upstreamRoot, 'shadcn', path), 'utf8');
  if (hash(raw) !== expected) throw new Error(`Upstream checksum mismatch: ${path}`);
  if (/\/ui\/[^_][^/]*\.tsx$/.test(path) || /\/hooks\/[^_][^/]*\.ts$/.test(path)) {
    const source = ts.createSourceFile(path, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const edits = [];
    const icons = new Set();
    function visit(node) {
      if (ts.isImportDeclaration(node)) {
        const name = node.moduleSpecifier.text;
        if (name === 'react' && node.importClause?.namedBindings && ts.isNamespaceImport(node.importClause.namedBindings) && (raw.match(/\bReact\b/g) ?? []).length === 1) edits.push([node.getStart(source), node.end, '']);
        else if (name.includes('icon-placeholder')) edits.push([node.getStart(source), node.end, '']);
        else {
          const mapped = name === 'cn' ? '@ziioapp/ui/lib/utils' : name
            .replace('@/registry/bases/base/ui/', '@ziioapp/ui/components/')
            .replace('@/components/ui/', '@ziioapp/ui/components/')
            .replace('@/registry/bases/base/hooks/', '@ziioapp/ui/hooks/');
          if (mapped.startsWith('@/')) throw new Error(`Unknown import ${mapped}`);
          if (mapped !== name) edits.push([node.moduleSpecifier.getStart(source), node.moduleSpecifier.end, JSON.stringify(mapped)]);
        }
      }
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'IconPlaceholder') {
        const attributes = node.attributes.properties;
        const lucide = attributes.find(a => ts.isJsxAttribute(a) && a.name.text === 'lucide');
        if (!lucide?.initializer || !ts.isStringLiteral(lucide.initializer)) throw new Error(`Unmapped icon in ${path}`);
        const icon = lucide.initializer.text;
        icons.add(icon);
        const kept = attributes.filter(a => !ts.isJsxAttribute(a) || !['lucide','tabler','hugeicons','phosphor','remixicon'].includes(a.name.text));
        edits.push([node.getStart(source),node.end,`<${icon} ${kept.map(a=>a.getText(source)).join(' ')} />`]);
        return;
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    let adapted = raw;
    for (const [start,end,text] of edits.sort((a,b)=>b[0]-a[0])) adapted = adapted.slice(0,start)+text+adapted.slice(end);
    if (icons.size) adapted = adapted.replace(/(import )/, `import { ${[...icons].sort().join(', ')} } from "lucide-react"\n\n$1`);
    adapted = adapted.replaceAll("cn-menu-translucent", "");
    const name = path.split('/').at(-1);
    const kind = path.includes('/ui/') ? 'components' : 'hooks';
    const target = `src/shadcn/${kind}/${name}`;
    outputs.set(target, header + adapted);
    if (kind === 'components') components.push({name:name.replace('.tsx',''),classification:'upstream',source:path,sourceSha256:expected,output:target,outputSha256:hash(header+adapted),transforms:['package-imports','lucide-icons','opaque-menus','unused-react-namespace']});
  } else if (/\/styles\/style-.*\.css$/.test(path)) {
    outputs.set(`src/styles/styles/${path.split('/').at(-1)}`, raw);
  } else if (path === 'packages/shadcn/src/tailwind.css') outputs.set('src/styles/shadcn-utilities.css',raw);
}
const themeSource = readFileSync(resolve(upstreamRoot,'shadcn/apps/v4/registry/themes.ts'),'utf8');
const js = ts.transpileModule(themeSource,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const { THEMES } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const bases = ['neutral','stone','zinc','mauve','olive','mist','taupe'];
for(const theme of THEMES) {
  for(const kind of ['themes','charts', ...(bases.includes(theme.name)?['bases']:[])]) {
    const prefix = {themes:'theme',charts:'chart',bases:'base'}[kind];
    const css = ['light','dark'].map(mode=> {
      const values=Object.entries(theme.cssVars[mode]).filter(([key])=>kind!=='charts'||key.startsWith('chart-'));
      const selector = mode==='light'?`.${prefix}-color-${theme.name}`:`.${prefix}-color-${theme.name}.dark`;
      return `${selector} {\n${values.map(([key,value])=>`  --${key}: ${value};`).join('\n')}\n}`;
    }).join('\n');
    outputs.set(`src/styles/official/${kind}/${prefix}-${theme.name}.css`,css+'\n');
  }
}
outputs.set('src/lib/official-themes.ts',header+`export const officialStyles = ${JSON.stringify(lock.styles)} as const;\nexport const officialBaseColors = ${JSON.stringify(bases)} as const;\nexport const officialThemeColors = ${JSON.stringify(THEMES.map(t=>t.name))} as const;\nexport const officialColorOptions = ${JSON.stringify(THEMES.map(t=>({value:t.name,label:t.title})),null,2)} as const;\n`);
outputs.set('src/styles/styles/all.css',lock.styles.map(s=>`@import "./style-${s}.css" layer(base);`).join('\n')+'\n');
outputs.set('upstream/components.json',JSON.stringify(components,null,2)+'\n');
let changes=0;
const oldManifestPath=resolve(root,'upstream/components.json');
const oldComponents=existsSync(oldManifestPath)?JSON.parse(readFileSync(oldManifestPath,'utf8')):[];
for(const old of oldComponents) {
  if(outputs.has(old.output)) continue;
  if(!/^src\/shadcn\/components\/[^/]+\.tsx$/.test(old.output)) throw new Error(`Unsafe obsolete output: ${old.output}`);
  const target=resolve(root,old.output);
  if(!existsSync(target)) continue;
  if(!readFileSync(target,'utf8').startsWith(header)) throw new Error(`Refusing to delete a non-generated component: ${old.output}`);
  changes++;console.log(`removed ${old.output}`);
  if(write)rmSync(target);
}
for(const [path, content] of outputs) {
  const target=resolve(root,path);
  if(existsSync(target)&&readFileSync(target,'utf8')===content) continue;
  changes++; console.log(`${existsSync(target)?'modified':'added'} ${path}`);
  if(write){mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content);}
}
console.log(`${components.length} components; ${lock.styles.length} styles; ${THEMES.length} palettes; ${changes} ${write?'written':'pending'} files`);
if(changes&&!write) process.exitCode=1;
