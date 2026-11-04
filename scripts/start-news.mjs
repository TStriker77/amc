import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
const local='http://127.0.0.1:11434/api/tags';
const ready=async()=>{try{return (await fetch(local,{signal:AbortSignal.timeout(1500)})).ok;}catch{return false;}};
if(!await ready()){
 const candidates=process.platform==='win32'?[join(process.env.LOCALAPPDATA||'','Programs','HorizonteOllama','ollama.exe'),join(process.env.LOCALAPPDATA||'','Programs','Ollama','ollama.exe')]:[];
 const executable=candidates.find(existsSync)||'ollama';
 const child=spawn(executable,['serve'],{detached:true,windowsHide:true,stdio:'ignore',env:{...process.env,OLLAMA_HOST:'127.0.0.1:11434',OLLAMA_NO_CLOUD:'1'}});
 let error;child.on('error',e=>error=e);child.unref();
 for(let i=0;i<30&&!await ready();i++){if(error)break;await new Promise(r=>setTimeout(r,500));}
 if(!await ready()){console.error('Não foi possível iniciar a IA local. Verifique a instalação do Ollama.');process.exit(1);}
}
await import('./update-news.mjs');
