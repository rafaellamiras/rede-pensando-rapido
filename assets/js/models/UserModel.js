/** Operações de usuários: permissões demonstrativas e validação de cadastro. */
import {DatabaseModel,demoHash} from './DatabaseModel.js';
export class UserModel {
  static async login(email,password){const db=DatabaseModel.read();const hash=await demoHash(password);const user=db.users.find(u=>u.email===email.trim().toLowerCase()&&u.passwordHash===hash);if(!user)throw new Error('E-mail ou senha inválidos.');DatabaseModel.setSession(user);return user;}
  static async register(name,email,role,password){
    name=name.trim();email=email.trim().toLowerCase();
    if(name.length<2||name.length>80)throw new Error('Informe um nome válido.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Informe um e-mail válido.');
    if(!['cuidador','profissional'].includes(role))throw new Error('Perfil inválido.');
    if(password.length<8)throw new Error('Sua senha deve ter pelo menos 8 caracteres.');
    if(DatabaseModel.read().users.some(u=>u.email===email))throw new Error('Este e-mail já foi cadastrado neste navegador.');
    const user={id:crypto.randomUUID(),name,email,role,passwordHash:await demoHash(password),createdAt:new Date().toISOString()};
    if(!DatabaseModel.update(db=>db.users.push(user)))throw new Error('Não foi possível armazenar os dados.');
    DatabaseModel.setSession(user);return user;
  }
  static isAdmin(){return DatabaseModel.getCurrentUser()?.role==='admin';}
}
