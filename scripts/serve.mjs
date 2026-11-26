import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const root = resolve('dist');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
 try {
  const path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(path !== root && !path.startsWith(root+'/')) {res.writeHead(403).end();return;}
  const file=path===root?path+'/index.html':path;
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(data);
 }catch{res.writeHead(404).end('No encontrado');}
}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log('IRONQUEST http://localhost:4173'));
