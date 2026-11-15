// Optional maintenance task; the normal build uses checked-in fonts and needs no network.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=readdirSync(root+'src').filter(f=>f.endsWith('.ts')).map(f=>readFileSync(root+'src/'+f,'utf8')).join('')+String.fromCharCode(...Array.from({length:95},(_,i)=>32+i));
const chars=[...new Set([...source].filter(c=>/[\u0020-\u007e\u3000-\u9fff\uff00-\uffef]/.test(c)))].sort();
let out='/* Zen Kaku Gothic New, SIL OFL: public/fonts/OFL.txt. Local subsets; no runtime network. */\n';
for(let i=0;i<chars.length;i+=150){
 const group=chars.slice(i,i+150);
 const url='https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&text='+encodeURIComponent(group.join(''));
 const css=await (await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}})).text();
 const matches=[...css.matchAll(/font-weight: (\d+);[\s\S]*?src: url\(([^)]+)\)/g)];
 if(matches.length!==2)throw Error('Unexpected subset at '+i+': '+matches.length);
 for(const [,weight,fontUrl] of matches){
  const res=await fetch(fontUrl);if(!res.ok)throw Error('font '+res.status);
  const bytes=Buffer.from(await res.arrayBuffer());
  const range=group.map(c=>'U+'+c.codePointAt(0).toString(16)).join(',');
  out+=`@font-face{font-family:School Gothic;font-style:normal;font-weight:${weight==='400'?'400 600':'650 900'};font-display:swap;src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2');unicode-range:${range}}\n`;
 }
}
writeFileSync(root+'src/school-font.css',out);
console.log(chars.length+' characters; '+out.length+' CSS bytes');
