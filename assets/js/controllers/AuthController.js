/** Controlador de credenciais locais de demonstração. */
import {UserModel} from '../models/UserModel.js';
import {DatabaseModel} from '../models/DatabaseModel.js';
import {AuthView} from '../views/AuthView.js';
export class AuthController {
  static start(onLogin){
    document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();try{await UserModel.login(document.getElementById('loginEmail').value,document.getElementById('loginPassword').value);onLogin();AuthView.toast('Acesso realizado com sucesso.')}catch(err){AuthView.toast(err.message,'danger');}});
    document.getElementById('registerForm').addEventListener('submit',async e=>{e.preventDefault();try{await UserModel.register(document.getElementById('registerName').value,document.getElementById('registerEmail').value,document.getElementById('registerRole').value,document.getElementById('registerPassword').value);onLogin();AuthView.toast('Conta de demonstração criada!')}catch(err){AuthView.toast(err.message,'danger');}});
    document.getElementById('adminQuickBtn').addEventListener('click',async()=>{try{await UserModel.login('admin@redepensandorapido.com.br','Admin@2026');onLogin();AuthView.toast('Admin demo conectado.')}catch(err){AuthView.toast(err.message,'danger');}});
    document.getElementById('logoutBtn').addEventListener('click',()=>{DatabaseModel.clearSession();AuthView.show(false);document.getElementById('loginPassword').value='';AuthView.toast('Sessão encerrada.');});
  }
}
