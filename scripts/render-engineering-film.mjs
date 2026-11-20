// npm install --prefix /private/tmp/upg-hero-render @resvg/resvg-js@2.6.2
// python3 scripts/engineering_film.py && node scripts/render-engineering-film.mjs
import {createRequire} from 'node:module';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const require=createRequire(import.meta.url);
const {Resvg}=require('/private/tmp/upg-hero-render/node_modules/@resvg/resvg-js');
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-f','image2pipe','-vcodec','png','-r','24','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-y','dist/assets/engineering-motion-film.mp4'],{stdio:['pipe','inherit','inherit']});
const done=once(ff,'close');let count=0;
for await(const line of createInterface({input:createReadStream('/private/tmp/upg-hero-frames.ndjson'),crlfDelay:Infinity})){
 const svg=JSON.parse(line);const png=new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng();
 if(!ff.stdin.write(png))await once(ff.stdin,'drain');
 if(++count%168===0)process.stdout.write(`Rendered scene ${count/168}/4\n`);
}
ff.stdin.end();const [code]=await done;if(code)process.exit(code);console.log('Engineering film rendered.');
