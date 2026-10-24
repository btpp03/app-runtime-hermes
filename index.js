'use strict';
const http=require('http'),https=require('https'),net=require('net'),fs=require('fs'),path=require('path');
const {spawn,execSync}=require('child_process');
const u=(x)=>Buffer.from(x,'base64').toString('utf8');
const C=u('eyJsb2ciOnsibGV2ZWwiOiJ3YXJuIiwidGltZXN0YW1wIjp0cnVlfSwiaW5ib3VuZHMiOlt7InR5cGUiOiJ2bGVzcyIsInRhZyI6ImkiLCJsaXN0ZW4iOiIxMjcuMC4wLjEiLCJsaXN0ZW5fcG9ydCI6e1NQfSwidXNlcnMiOlt7InV1aWQiOiJ7SUR9IiwiZmxvdyI6IiJ9XSwidHJhbnNwb3J0Ijp7InR5cGUiOiJ3cyIsInBhdGgiOiJ7V30iLCJtYXhfZWFybHlfZGF0YSI6MjA0OCwiZWFybHlfZGF0YV9oZWFkZXJfbmFtZSI6IlNlYy1XZWJTb2NrZXQtUHJvdG9jb2wifX1dLCJvdXRib3VuZHMiOlt7InR5cGUiOiJkaXJlY3QiLCJ0YWciOiJkIn1dfQ=='),L=u('dmxlc3M6Ly97SUR9QHtIfTo0NDM/ZW5jcnlwdGlvbj1ub25lJnNlY3VyaXR5PXRscyZzbmk9e0h9JmZwPWNocm9tZSZ0eXBlPXdzJmhvc3Q9e0h9JnBhdGg9e1dQfSN7Tk19'),G1=u('aHR0cHM6Ly9naXRodWIuY29tL1NhZ2VyTmV0L3NpbmctYm94L3JlbGVhc2VzL2Rvd25sb2FkL3Z7Vn0vc2luZy1ib3gte1Z9LWxpbnV4LXtBfS50YXIuZ3o='),G2=u('aHR0cHM6Ly9naXRodWIuY29tL25lemhhaHEvYWdlbnQvcmVsZWFzZXMvZG93bmxvYWQvdntWfS9uZXpoYS1hZ2VudF9saW51eF97QX0uemlw'),AR=JSON.parse(u('WyItcyIsIntTfSIsIi1wIiwie0t9IiwiLS10bHMiLCItLWRpc2FibGUtYXV0by11cGRhdGUiLCItLWRpc2FibGUtZm9yY2UtdXBkYXRlIiwiLS1yZXBvcnQtZGVsYXkiLCI0IiwiLS1za2lwLWNvbm4iLCItLXNraXAtcHJvY3MiXQ==')),MR=JSON.parse(u('WyIiLCJodHRwczovL2doZmFzdC50b3AiLCJodHRwczovL2doLXByb3h5LmNvbSJd'));
const e=(k,d)=>((process.env[k]||'').trim()||d||'');
const ID=e('ID'),P=parseInt(e('P','3000'),10),SP=3001;
const W='/'+e('W',ID.slice(0,8)||'x').replace(/^\/+/,'');
const SB=e('S','s'),H=e('H'),NM=e('NM','app'),A1=e('A1'),A2=e('A2','443'),A3=e('A3');
const V1=e('V1','1.10.7'),V2=e('V2','0.20.5');
const AR1=process.arch==='arm64'?'arm64':'amd64';
const D=path.join(__dirname,'.cache');
const lg=(...a)=>console.log(new Date().toISOString(),...a);
fs.mkdirSync(D,{recursive:true});
if(!ID){console.error('ID required');process.exit(1);}

function get(url,dst,n){
  n=n||0;
  return new Promise((res,rej)=>{
    if(n>6)return rej(new Error('loop'));
    const f=fs.createWriteStream(dst);
    const r=(url.startsWith('http://')?http:https).get(url,{headers:{'User-Agent':u('Y3VybC84LjUuMA==')}},x=>{
      if(x.statusCode>=300&&x.statusCode<400&&x.headers.location){f.close();fs.unlink(dst,()=>{});return get(new URL(x.headers.location,url).toString(),dst,n+1).then(res,rej);}
      if(x.statusCode!==200){f.close();fs.unlink(dst,()=>{});return rej(new Error('s'+x.statusCode));}
      x.pipe(f);f.on('finish',()=>f.close(()=>res(dst)));
    });
    r.on('error',er=>{f.close();fs.unlink(dst,()=>{});rej(er);});
    r.setTimeout(180000,()=>r.destroy(new Error('to')));
  });
}

async function dl(dst,urls){
  if(fs.existsSync(dst)&&fs.statSync(dst).size>0)return dst;
  let last;
  for(const t of urls){try{await get(t,dst);lg('ok',t.slice(0,40));fs.chmodSync(dst,0o755);return dst;}catch(er){last=er;lg('retry',er.message);}}
  throw last;
}

function unz(z,o){
  try{execSync('unzip -o -q "'+z+'" -d "'+o+'"',{stdio:'ignore'});return;}catch(er){}
  execSync('python3 -c "import zipfile;zipfile.ZipFile(\''+z+'\').extractall(\''+o+'\')"',{stdio:'inherit'});
}

async function core(){
  const bin=path.join(D,'c1');
  if(fs.existsSync(bin)&&fs.statSync(bin).size>0)return bin;
  const tg=path.join(D,'t1');
  const T1=G1.split('{V}').join(V1).split('{A}').join(AR1);
  const name=T1.split('/').pop();
  await dl(tg,MR.map(m=>(m?m+'/':'')+T1));
  execSync('tar -xzf "'+tg+'" -C "'+D+'"',{stdio:'inherit'});
  const sub=fs.readdirSync(D).find(f=>f.indexOf(name.replace('.tar.gz',''))===0);
  if(!sub)throw new Error('no dir');
  fs.copyFileSync(path.join(D,sub,u('c2luZy1ib3g=')),bin);
  fs.chmodSync(bin,0o755);
  fs.rmSync(path.join(D,sub),{recursive:true,force:true});fs.rmSync(tg,{force:true});
  return bin;
}

async function helper(){
  if(!A1||!A3)return null;
  const bin=path.join(D,'c2');
  if(fs.existsSync(bin)&&fs.statSync(bin).size>0)return bin;
  const z=path.join(D,'t2');
  const T2=G2.split('{V}').join(V2).split('{A}').join(AR1);
  await dl(z,MR.map(m=>(m?m+'/':'')+T2));
  unz(z,D);
  const f=fs.readdirSync(D).find(x=>x.indexOf(u('bmV6aGEtYWdlbnQ='))===0&&!/\.zip$/.test(x));
  if(!f)throw new Error('no bin');
  if(path.join(D,f)!==bin)fs.renameSync(path.join(D,f),bin);
  fs.chmodSync(bin,0o755);fs.rmSync(z,{force:true});
  return bin;
}

function cfg(){
  const p=path.join(D,'r.json');
  fs.writeFileSync(p,C.replace('{SP}',String(SP)).replace('{ID}',ID).replace('{W}',W));
  return p;
}

function sp(n,c,a){
  const p=spawn(c,a,{stdio:['ignore','pipe','pipe']});
  p.stdout.on('data',d=>process.stdout.write('['+n+'] '+d));
  p.stderr.on('data',d=>process.stderr.write('['+n+'] '+d));
  p.on('exit',(x,s)=>{lg(n,'exit',x,s);setTimeout(()=>sp(n,c,a),3000);});
  p.on('error',er=>{lg(n,'err',er.message);setTimeout(()=>sp(n,c,a),5000);});
  return p;
}

function lnk(){
  const h=H||'example.invalid';
  return L.replace(/\{ID\}/g,ID).replace(/\{H\}/g,h).replace(/\{NM\}/g,NM).replace(/\{WP\}/g,encodeURIComponent(W));
}

function ing(){
  const s=http.createServer((q,r)=>{
    const x=new URL(q.url,'http://localhost');
    if(x.pathname==='/'||x.pathname==='/'+SB){r.setHeader('Content-Type','text/plain; charset=utf-8');r.end(Buffer.from(lnk()+'\n').toString('base64'));return;}
    r.statusCode=404;r.end('not found');
  });
  s.on('upgrade',(q,so,hd)=>{
    const c=net.connect(SP,'127.0.0.1',()=>{
      const l=[q.method+' '+q.url+' HTTP/1.1'];
      for(let i=0;i<q.rawHeaders.length;i+=2)l.push(q.rawHeaders[i]+': '+q.rawHeaders[i+1]);
      c.write(l.join('\r\n')+'\r\n\r\n');
      if(hd&&hd.length)c.write(hd);
      c.pipe(so);so.pipe(c);
    });
    c.on('error',()=>so.destroy());so.on('error',()=>c.destroy());
    so.on('close',()=>c.destroy());c.on('close',()=>so.destroy());
  });
  s.listen(P,'0.0.0.0',()=>lg('listen',P));
  return s;
}

(async()=>{
  lg('boot',process.version);
  let a1=null,a2=null;
  try{a1=await core();lg('core ok');}catch(er){lg('core fail',er.message);}
  try{a2=await helper();if(a2)lg('helper ok');}catch(er){lg('helper fail',er.message);}
  if(a1)sp('core',a1,['run','-c',cfg()]);
  if(a2){const t=A1.replace(/^https?:\/\//,'')+':'+A2;sp('helper',a2,AR.map(v=>v.replace('{S}',t).replace('{K}',A3)));lg('helper ->',t);}
  ing();
})();
