/** Apresentação da autenticação e mensagens globais da interface. */
export class AuthView {
  static show(isLogged){document.getElementById('authScreen').classList.toggle('d-none',isLogged);document.getElementById('workspace').classList.toggle('d-none',!isLogged);document.getElementById('logoutBtn').classList.toggle('d-none',!isLogged);}
  static toast(message,kind='success'){
    const safe=String(message).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const host=document.getElementById('toastContainer');const el=document.createElement('div');el.className=`toast align-items-center text-bg-${kind==='danger'?'danger':kind==='warning'?'warning':'success'} border-0`;el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML=`<div class="d-flex"><div class="toast-body">${safe}</div><button class="btn-close ${kind==='warning'?'':'btn-close-white'} me-2 m-auto" type="button" data-bs-dismiss="toast" aria-label="Fechar"></button></div>`;host.append(el);el.addEventListener('hidden.bs.toast',()=>el.remove());bootstrap.Toast.getOrCreateInstance(el,{delay:4200}).show();
  }
}
