/** Persistência da demonstração: dados exclusivamente sintéticos no navegador. */
const KEY = 'rpr-demo-database-v1';
const SESSION_KEY = 'rpr-session-v1';
const ORIGIN = [-22.2964, -48.5583];
const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const clone = value => JSON.parse(JSON.stringify(value));

// Hash para evitar senha literal no armazenamento; NÃO é autenticação de produção.
export async function demoHash(value) {
  const bytes = new TextEncoder().encode(`rede-pensando-rapido-demo:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function seedBase(adminHash) {
  const now = new Date().toISOString();
  return {
    version: 1,
    users: [{id:'demo-admin',name:'Administrador Demo',email:'admin@redepensandorapido.com.br',role:'admin',passwordHash:adminHash,createdAt:now}],
    person: {id:'DEMO-IDOSO-001',name:'Maria Oliveira',medicine:'Donepezila 5mg'},
    device: {battery:68,gps:true,mode:'idle',pendingMedicationId:null},
    location: {home:ORIGIN,position:ORIGIN,radius:400,inside:true},
    partners: [
      {id:'p1',name:'Farmácia Amiga Demo - Centro',type:'Farmácia fictícia',lat:-22.2950,lng:-48.5567,status:'Disponível (demo)'},
      {id:'p2',name:'Ponto de Apoio Demo - Praça',type:'Comércio fictício',lat:-22.2981,lng:-48.5596,status:'Disponível (demo)'},
      {id:'p3',name:'Farmácia Amiga Demo - Bairro',type:'Farmácia fictícia',lat:-22.2936,lng:-48.5620,status:'Disponível (demo)'}
    ],
    weekly: days.map((day,i)=>({day,total:2,confirmed:i===5?1:2})),
    responseMinutes:3.8,
    activities:[{id:'init-01',type:'medication',title:'Lembrete confirmado',detail:'Rotina de medicação demonstrativa',at:now},{id:'init-02',type:'location',title:'Localização em área segura',detail:'Cerca virtual ativa',at:now}],
    notifications:[],audits:[],lastReport:null
  };
}
export class DatabaseModel {
  static async init(){
    try { const raw=localStorage.getItem(KEY); if(raw){const data=JSON.parse(raw);if(data?.version===1&&Array.isArray(data.users))return;} } catch { /* Recupera banco danificado. */ }
    localStorage.setItem(KEY,JSON.stringify(seedBase(await demoHash('Admin@2026'))));
  }
  static read(){try{return clone(JSON.parse(localStorage.getItem(KEY)));}catch{return null;}}
  static write(data){try{localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('rpr:changed'));return true;}catch{return false;}}
  static update(transform){const data=this.read();if(!data)return false;transform(data);return this.write(data);}
  static async reset(){localStorage.setItem(KEY,JSON.stringify(seedBase(await demoHash('Admin@2026'))));sessionStorage.removeItem(SESSION_KEY);window.dispatchEvent(new CustomEvent('rpr:changed'));}
  static getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY));}catch{return null;}}
  static setSession(user){sessionStorage.setItem(SESSION_KEY,JSON.stringify({id:user.id}));}
  static clearSession(){sessionStorage.removeItem(SESSION_KEY);}
  static getCurrentUser(){const id=this.getSession()?.id;return this.read()?.users.find(u=>u.id===id)||null;}
  static log(type,title,detail){return this.update(db=>db.activities.unshift({id:crypto.randomUUID(),type,title,detail,at:new Date().toISOString()}));}
  static getWeeklyStats(){const db=this.read();const total=db.weekly.reduce((n,d)=>n+d.total,0);const confirmed=db.weekly.reduce((n,d)=>n+d.confirmed,0);return {total,confirmed,percent:total?confirmed/total*100:0};}
}
