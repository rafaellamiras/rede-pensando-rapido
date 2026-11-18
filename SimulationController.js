/** Orquestra eventos artificiais; não envia SMS, WhatsApp, push nem ligações. */
import {DatabaseModel} from '../models/DatabaseModel.js';
import {DeviceModel} from '../models/DeviceModel.js';
import {MapView} from '../views/MapView.js';
import {SmartwatchView} from '../views/SmartwatchView.js';
import {AuthView} from '../views/AuthView.js';
export class SimulationController {
  static callStart=0;static timer=null;static modal=null;
  static init(){this.modal=new bootstrap.Modal(document.getElementById('callModal'));document.getElementById('endCallBtn').addEventListener('click',()=>this.endCall());document.getElementById('callModal').addEventListener('hidden.bs.modal',()=>this.endCall(false));}
  static handle(action){switch(action){case 'medication':this.medication();break;case 'confirmMedication':this.confirm();break;case 'sos':this.sos();break;case 'alerts':this.notifications('Teste manual');break;case 'call':this.startCall();break;case 'safeWalk':this.walk(false);break;case 'exitFence':this.walk(true);break;case 'pharmacy':this.pharmacy();break;}}
  static medication(){DeviceModel.remind();SmartwatchView.render();SmartwatchView.vibrate();AuthView.toast('Lembrete exibido no smartwatch virtual.');this.tone();}
  static confirm(){if(DeviceModel.confirm())AuthView.toast('Medicação marcada como confirmada no histórico.');else AuthView.toast('Não há lembrete pendente.','warning');}
  static tone(){try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;const ctx=new Context();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.frequency.value=620;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.22);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.22);osc.onended=()=>ctx.close();}catch{/* Sem áudio, a notificação visual permanece. */}}
  static sos(){DeviceModel.setMode('sos');DatabaseModel.log('sos','SOS acionado','Botão do relógio • evento artificial');this.notifications('SOS do smartwatch');this.startCall('SOS acionado • ligação simulada');AuthView.toast('SOS simulado: contatos e chamada exibidos.','warning');}
  static notifications(reason){
    const channels=['Push Notification no App','Mensagem WhatsApp','SMS de Emergência','Alerta para Ponto de Apoio Local'];
    const at=new Date().toISOString();const latencies=[790,1450,2120,2840];
    DatabaseModel.update(db=>{channels.forEach((channel,i)=>db.notifications.unshift({id:crypto.randomUUID(),channel,reason,at,status:'Entregue (simulado)',latencyMs:latencies[i]}));db.audits.unshift({id:crypto.randomUUID(),reason,at,latencyMs:Math.max(...latencies)});db.activities.unshift({id:crypto.randomUUID(),type:'notification',title:'Mensagens multicanal simuladas',detail:`${reason} • quatro canais • sem envio real`,at});});
    AuthView.toast('4 canais registrados como entregues (simulação).');
  }
  static startCall(reason='Chamada Viva-Voz Conectada ao Smartwatch'){
    this.endCall(false);this.callStart=Date.now();document.getElementById('callStatus').textContent=reason;const paint=()=>{const s=Math.floor((Date.now()-this.callStart)/1000);document.getElementById('callTimer').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;};paint();this.timer=setInterval(paint,1000);DatabaseModel.log('call','Ligação iniciada','Canal bidirecional apenas visual (demo)');this.modal.show();
  }
  static endCall(hide=true){if(this.timer){clearInterval(this.timer);this.timer=null;DatabaseModel.log('call','Ligação encerrada','Chamada simulada finalizada');}if(hide)this.modal?.hide();}
  static walk(outside){const home=DatabaseModel.read().location.home;const radius=DatabaseModel.read().location.radius;const meters=outside?radius+250:Math.min(120,radius*.35);const lat=home[0]+(meters/111320);const lng=home[1]+(meters/(111320*Math.cos(home[0]*Math.PI/180)))*.3;DatabaseModel.update(db=>{db.location.position=[lat,lng];db.location.inside=!outside;db.activities.unshift({id:crypto.randomUUID(),type:'location',title:outside?'Saída do perímetro detectada':'Caminhada segura simulada',detail:outside?'Fora da cerca virtual fictícia':'Posição dentro da área segura',at:new Date().toISOString()});});MapView.zoomToPerson();if(outside){this.notifications('Saída da cerca virtual');this.startCall('Alerta de cerca • ligação simulada');AuthView.toast('Saída da cerca virtual detectada na simulação.','warning');}else AuthView.toast('Caminhada dentro do perímetro registrada.');}
  static pharmacy(){const db=DatabaseModel.read();const pos=db.location.position;const distance=p=>Math.hypot((p.lat-pos[0])*111320,(p.lng-pos[1])*103000);const nearest=[...db.partners].sort((a,b)=>distance(a)-distance(b))[0];if(!nearest)return;DatabaseModel.log('partner','Ponto de apoio selecionado',`${nearest.name} • solicitação fictícia, sem contato externo`);AuthView.toast(`${nearest.name}: acionamento apenas demonstrativo.`);if(MapView.map){MapView.map.flyTo([nearest.lat,nearest.lng],16,{duration:.7});}}
}
