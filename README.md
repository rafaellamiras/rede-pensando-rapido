# Rede Pensando Rápido — Protótipo assistivo

Aplicação web demonstrativa, responsiva, com arquitetura MVC (ES Modules), sem etapa de build. **Todos os dados e eventos são fictícios.** Foi construída para apresentações de conceito e avaliação da interface, **não para monitoramento real de pessoas**.

## Iniciar localmente

O carregamento de módulos ES exige um servidor HTTP local (não abra o HTML com `file://`).

```bash
cd rede-pensando-rapido
python -m http.server 8000
```

Abra http://localhost:8000. Alternativamente, use a extensão Live Server no VS Code. É necessária conexão com a internet para carregar Bootstrap, ícones, Chart.js, Leaflet e mapas do OpenStreetMap.

## Acesso administrativo de demonstração

- E-mail: `admin@redepensandorapido.com.br`
- Senha: `Admin@2026`
- Ou utilize **Entrar como Admin Demo**.

A conta é criada no primeiro acesso, junto de dados sintéticos de rotina. Contas adicionais são registradas apenas no `localStorage` deste navegador; a sessão usa `sessionStorage`.

## Deploy na Vercel

1. Crie um repositório público no GitHub e envie os arquivos da pasta raiz do projeto. Como o código e o README serão públicos, não adicione dados reais, credenciais pessoais ou segredos.
2. Na Vercel, selecione **Add New → Project**, importe o repositório e deixe o framework como **Other**.
3. Deixe o campo de build command vazio, mantenha o diretório raiz como `.` e faça o deploy.
4. O `vercel.json` já configura URL limpa de `/inicio`, headers básicos e cache temporário dos assets.

Também funciona com `vercel --prod` na pasta, após instalar a CLI, autenticar e vincular o projeto à sua conta.

## Estrutura MVC

- `assets/js/models`: armazenamento local, usuários e relógio virtual.
- `assets/js/views`: autenticação, dashboard e gráficos, smartwatch, mapa, relatório e gestão.
- `assets/js/controllers`: autenticação, simulações e roteamento de telas.
- `assets/css/theme.css`: design system, estilos claros e escuros, responsividade e impressão.

## Limites de segurança e escopo

- **Não é um sistema de saúde em produção**. Não existe backend, login seguro entre dispositivos, controle de acesso no servidor, comunicação remota ou integração com dispositivos reais. O papel de administrador controla apenas a interface local e **não é proteção real** contra acesso aos dados no navegador.
- Dados de cadastro ficam no navegador local e não são sincronizados. O hash de senha demonstrativo não substitui armazenamento seguro com autenticação em backend. **Não use credenciais pessoais.**
- Os botões SOS, WhatsApp, SMS, push, telefone, GPS e parceiros funcionam **apenas como simulação visual/local**. Não avisam emergências nem serviços reais. Latências inferiores a 5 segundos são números artificiais, não medições de rede.
- Os pontos de apoio são inventados, com coordenadas aproximadas. **Não representam farmácias/parceiros reais.**
- O relatório rotulado “com IA” é gerado por regras determinísticas locais; **não utiliza IA generativa** e não faz diagnóstico ou recomendação clínica.
- Medicamentos e doses são somente conteúdo fictício de apresentação, não prescrição.
- Para uso real, são indispensáveis: backend autenticado (ex.: sessões e hash forte), controle por organização/paciente, política LGPD, consentimento apropriado, hospedagem segura, monitoramento de disponibilidade, tratamento e prevenção de alarmes falsos, integrações certificadas, testes com usuários e avaliação regulatória e clínica pertinente.

### Aviso ético

> Aviso Ético e Regulatório: A Rede Pensando Rápido é uma plataforma estritamente assistiva e de organização da rotina. Não realiza diagnóstico médico nem substitui avaliação clínica profissional.
