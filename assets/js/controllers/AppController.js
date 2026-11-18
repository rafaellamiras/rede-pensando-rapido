/** Coordenador principal MVC: navegação, evento global e renderização de views. */
import {DatabaseModel} from '../models/DatabaseModel.js';
import {UserModel} from '../models/UserModel.js';
import {AuthView} from '../views/AuthView.js';
import {DashboardView} from '../views/DashboardView.js';
import {SmartwatchView} from '../views/SmartwatchView.js';
import {MapView} from '../views/MapView.js';
import {AiReportView} from '../views/AiReportView.js';
import {AdminView} from '../views/AdminView.js';
import {AuthController} from './AuthController.js';
import {SimulationController} from './SimulationController.js';
class AppController {
  static page='dashboard';static titles={dashboard:['Visão geral','Uma visão clara da rotina e dos alertas.'],watch:['Smartwatch','Simule interações diretamente no dispositivo.'],map:['Mapa e cerca virtual','Localização e rede de apoio fictícias em Jaú, SP.'],reports:['Relatórios','Resumo organizado para apoiar conversas em consulta.'],admin:['Gestão da plataforma','Dados locais, métricas e reset da demonstração.']};
  static async start(){await DatabaseModel.init();AuthController.start(()=>this.login());SimulationController.init();
    document.addEventListener('click',async e=>{
      const action=e.target.closest('[data-action]');if(action){SimulationController.handle(action.dataset.action);return;}
      const page=e.target.closest('[data-page]');if(page){this.navigate(page.dataset.page);return;}
      if(e.target.closest('#resetDemoBtn')){if(confirm('Resetar todos os dados demonstrativos deste navegador, inclusive usuários cadastrados?')){await DatabaseModel.reset();AuthView.show(false);this.page='dashboard';AuthView.toast('Demonstração restaurada.');}}
    });
    document.getElementById('themeToggle').addEventListener('click',()=>{const dark=document.documentElement.getAttribute('data-bs-theme')==='dark';const next=dark?'light':'dark';document.documentElement.setAttribute('data-bs-theme',next);localStorage.setItem('rpr-theme',next);this.updateThemeIcon();DashboardView.render();});
    document.getElementById('fenceRadius').addEventListener('input',e=>{const value=Number(e.target.value);document.getElementById('radiusValue').textContent=value;DatabaseModel.update(db=>{db.location.radius=value;const a=db.location.home;const b=db.location.position;const distance=Math.hypot((a[0]-b[0])*111320,(a[1]-b[1])*103000);db.location.inside=distance<=value;});});
    document.getElementById('generateReport').addEventListener('click',()=>{AiReportView.generate();AuthView.toast('Resumo local gerado com dados sintéticos.');});
    document.getElementById('printReport').addEventListener('click',()=>{if(!document.getElementById('reportOutput').querySelector('h3'))AiReportView.generate();window.print();});
    window.addEventListener('rpr:changed',()=>{if(DatabaseModel.getCurrentUser())this.render();});
    this.updateThemeIcon();DatabaseModel.getCurrentUser()?this.login():AuthView.show(false);
    setInterval(()=>{if(DatabaseModel.getCurrentUser())SmartwatchView.render();},60000);
  }
  static updateThemeIcon(){const dark=document.documentElement.getAttribute('data-bs-theme')==='dark';document.querySelector('#themeToggle i').className=dark?'bi bi-sun':'bi bi-moon-stars';}
  static login(){const user=DatabaseModel.getCurrentUser();if(!user){AuthView.show(false);return;}AuthView.show(true);document.getElementById('adminNav').classList.toggle('d-none',!UserModel.isAdmin());document.getElementById('sideUser').textContent=`${user.name} • ${user.role==='admin'?'Administrador':user.role==='profissional'?'Profissional':'Familiar cuidador'}`;this.navigate(this.page==='admin'&&!UserModel.isAdmin()?'dashboard':this.page);}
  static navigate(page){if(!(page in this.titles))return;if(page==='admin'&&!UserModel.isAdmin())return;this.page=page;document.querySelectorAll('.app-page').forEach(el=>el.classList.toggle('d-none',el.id!==`${page}Page`));document.querySelectorAll('#mainNav [data-page]').forEach(el=>{const active=el.dataset.page===page;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});document.getElementById('pageTitle').textContent=this.titles[page][0];document.getElementById('pageSubtitle').textContent=this.titles[page][1];this.render();if(page==='map')MapView.reveal();}
  static render(){if(!DatabaseModel.getCurrentUser())return;DashboardView.render();SmartwatchView.render();MapView.render();if(UserModel.isAdmin())AdminView.render();}
}
AppController.start().catch(error=>{console.error('Falha ao iniciar a demonstração:',error);AuthView.toast('Não foi possível iniciar o ambiente demonstrativo. Verifique o navegador.','danger');});
