export const categories=['CDB','LCI','LCA','CRA','CRI','Tesouro Direto','Debêntures','Fundos','FII','ETF','Outros'];
export const blank=()=>({version:1,profile:{name:'',bio:'',goal:'',photo:''},investments:[],trades:[],dividends:[],watchlist:['PETR4','VALE3','ITUB4','MGLU3']});
export const dateValid=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
export function positions(trades){
 const result={};
 for(const t of [...trades].sort((a,b)=>a.date.localeCompare(b.date)||a.order-b.order)){
  const p=result[t.ticker]??={ticker:t.ticker,quantity:0,cost:0,realized:0};
  if(t.side==='Compra'){p.quantity+=t.quantity;p.cost+=t.quantity*t.price+t.fees;}
  else{if(t.quantity>p.quantity+1e-8)throw Error(`Venda de ${t.ticker} excede a posição em ${t.date}.`);const cost=p.quantity?p.cost/p.quantity*t.quantity:0;p.realized+=t.quantity*t.price-t.fees-cost;p.quantity-=t.quantity;p.cost-=cost;if(p.quantity<1e-8){p.quantity=0;p.cost=0;}}
 }
 return Object.values(result);
}
export function validate(s){
 if(!s||s.version!==1||!s.profile||!Array.isArray(s.investments)||!Array.isArray(s.trades)||!Array.isArray(s.dividends)||!Array.isArray(s.watchlist))throw Error('Formato de backup inválido.');
 const str=(x,n=200)=>typeof x==='string'&&x.length<=n;
 const num=(x,positive=false)=>typeof x==='number'&&Number.isFinite(x)&&(positive?x>0:x>=0)&&x<=1e15;
 const ticker=x=>str(x,12)&&/^[A-Z0-9]{4,12}$/.test(x);
 if(!str(s.profile.name)||!str(s.profile.bio,2000)||!str(s.profile.goal,1000)||!str(s.profile.photo,1800000)||s.profile.photo&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.profile.photo))throw Error('Perfil inválido.');
 const ids=new Set();
 for(const rows of [s.investments,s.trades,s.dividends])for(const r of rows){if(!r||!str(r.id,100)||ids.has(r.id))throw Error('Identificador inválido ou duplicado.');ids.add(r.id);}
 for(const r of s.investments)if(!str(r.name)||!r.name.trim()||!categories.includes(r.category)||!num(r.principal,true)||!num(r.current)||!dateValid(r.date)||r.maturity&&!dateValid(r.maturity)||!str(r.rate)||r.maturity&&r.maturity<r.date)throw Error('Aplicação inválida.');
 for(const r of s.trades)if(!ticker(r.ticker)||!['Compra','Venda'].includes(r.side)||!num(r.quantity,true)||!num(r.price,true)||!num(r.fees)||!dateValid(r.date)||!Number.isSafeInteger(r.order)||r.order<0)throw Error('Operação inválida.');
 for(const r of s.dividends)if(!ticker(r.ticker)||!['Dividendo','JCP','Rendimento'].includes(r.type)||!num(r.amount,true)||!dateValid(r.date))throw Error('Provento inválido.');
 if(s.watchlist.length>20||s.watchlist.some(t=>!ticker(t)))throw Error('Lista de acompanhamento inválida.');
 positions(s.trades);return s;
}
export function parseCSV(text){
 text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0];const sep=first.includes(';')?';':',';const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===sep&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('CSV com aspas não fechadas.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);if(rows.length<2)throw Error('CSV sem registros.');const headers=rows.shift().map(x=>x.trim());if(new Set(headers).size!==headers.length)throw Error('Cabeçalhos duplicados.');return rows.map(r=>{if(r.length!==headers.length)throw Error('Número de colunas inconsistente.');return Object.fromEntries(headers.map((h,i)=>[h,r[i].trim()]));});
}
export function csvRecords(text,start=0){return parseCSV(text).map((r,i)=>{if(!['ticker','side','quantity','price','fees','date'].every(k=>k in r))throw Error('Use o modelo CSV de operações.');const n=x=>Number(x.replace(',','.'));return {id:crypto.randomUUID(),ticker:r.ticker.toUpperCase(),side:r.side,quantity:n(r.quantity),price:n(r.price),fees:n(r.fees),date:r.date,order:start+i};});}
