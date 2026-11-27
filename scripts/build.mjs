import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', {recursive:true, force:true});
await mkdir('dist');
for (const path of ['index.html','style.css','app.js','account.js','firebase-config.js','src','manifest.webmanifest','icon.svg','sw.js']) await cp(path, `dist/${path}`, {recursive:true});
console.log('IRONQUEST preparado en dist/');
