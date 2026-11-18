/** Estado e eventos de um relógio virtual; não representa um hardware real. */
import {DatabaseModel} from './DatabaseModel.js';
export class DeviceModel {
  static remind(){
    const id=crypto.randomUUID();
    DatabaseModel.update(db=>{db.device.mode='medication';db.device.pendingMedicationId=id;db.activities.unshift({id,type:'medication',title:'Lembrete de medicação enviado',detail:`${db.person.medicine} • aguardando confirmação`,at:new Date().toISOString()});});
    return id;
  }
  static confirm(){
    let success=false;
    DatabaseModel.update(db=>{if(db.device.mode!=='medication'||!db.device.pendingMedicationId)return;success=true;db.device.mode='idle';db.device.pendingMedicationId=null;db.activities.unshift({id:crypto.randomUUID(),type:'medication',title:'Medicação confirmada',detail:'Confirmado com um toque no smartwatch',at:new Date().toISOString()});});
    return success;
  }
  static setMode(mode){DatabaseModel.update(db=>db.device.mode=mode);}
}
