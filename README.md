# 🏪 Drogaria Poupe Já – E-commerce de Farmácia

Plataforma completa de e-commerce para farmácias com painel administrativo, login de usuários, carrinho, cálculo de frete com Correios e gestão de pedidos, produtos e clientes.

---

## 🧾 Resumo do Projeto

| Parte            | Tecnologias/Serviços                     |
| ---------------- | ---------------------------------------- |
| **Frontend**     | React (CRA), React Router, Axios, Vercel |
| **Backend**      | Node.js, Express.js, Mongoose, Render    |
| **Banco**        | MongoDB Atlas (nuvem)                    |
| **Autenticação** | JWT, Bcrypt                              |
| **Frete**        | API dos Correios (correios-brasil)       |
| **Design**       | Figma                                    |

---

## 🧱 Estrutura das Telas

| Tipo       | Tela                         | Rota              | Acesso         |
| ---------- | ---------------------------- | ----------------- | -------------- |
| 🏠 Público | Home (produtos)              | `/`               | Todos          |
| 🔍 Público | Detalhes do Produto          | `/produto/:id`    | Todos          |
| 🔐 Público | Login                        | `/login`          | Todos          |
| 📝 Público | Cadastro de Usuário          | `/cadastro`       | Todos          |
| 🛒 Privado | Pedido / Carrinho + Frete    | `/pedido`         | Usuário logado |
| 📦 Privado | Meus Pedidos                 | `/meus-pedidos`   | Usuário logado |
| 👤 Privado | Perfil (com botão sair)      | `/perfil`         | Usuário logado |
| 🛠️ Admin   | Painel do Administrador      | `/admin`          | Apenas admin   |
| 📊 Admin   | Relatório de Pedidos         | `/admin/pedidos`  | Apenas admin   |
| 📁 Admin   | Relatório de Produtos Ativos | `/admin/produtos` | Apenas admin   |
| 👥 Admin   | Relatório de Clientes        | `/admin/clientes` | Apenas admin   |

---

## 📁 Estrutura de Diretórios

### Backend

\`\`\`
backend/
├── models/
│ ├── Usuario.js
│ ├── Produto.js
│ └── Pedido.js
├── routes/
│ ├── usuarioRoutes.js
│ ├── produtoRoutes.js
│ ├── pedidoRoutes.js
│ └── freteRoutes.js
├── middlewares/
│ └── authMiddleware.js
├── index.js
└── .env
\`\`\`

### Frontend

\`\`\`
frontend/
├── public/
├── src/
│ ├── pages/
│ ├── components/
│ ├── services/
│ ├── App.js
│ └── index.js
└── .env
\`\`\`

---

## 📝 Detalhamento do Código

### Backend

- **index.js** carrega variáveis de ambiente com `dotenv`, conecta ao MongoDB e registra as rotas de usuários, produtos, pedidos, administração e cálculo de frete.
- **models/** define os esquemas Mongoose de `Usuario`, `Produto` e `Pedido`, estabelecendo como os dados são armazenados no banco.
- **middlewares/authMiddleware.js** verifica o token JWT para proteger rotas privadas e valida se o usuário é administrador quando necessário.
- **routes/** concentra as rotas da API: registro e login em `usuarioRoutes`, operações de produto em `produtoRoutes`, fluxo de pedidos em `pedidoRoutes`, painel de administração em `adminRoutes` e integração de frete via `freteRoutes`.

### Frontend

- Construído com React e React Router em `src/App.js`, responsável por mapear as páginas da aplicação.
- A pasta `pages/` contém cada tela do sistema, enquanto `components/` reúne elementos reutilizáveis da interface.
- Em `services/` ficam as chamadas à API, feitas com Axios para autenticação, consulta de produtos e criação de pedidos.

Este arranjo separa responsabilidades, facilitando a manutenção e a expansão do projeto.

## 🔐 Variáveis de Ambiente

### Backend – `.env`

\`\`\`
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<senha>@cluster.mongodb.net/BancoDrogariaPoupeJa
JWT_SECRET=chaveultrasecreta
\`\`\`

### Frontend – `.env`

\`\`\`
REACT_APP_API_URL=https://ecommercefarmacia.onrender.com/api
\`\`\`

---

## 🚀 Executando o projeto localmente

### 1. Backend

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### 2. Frontend

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

---

## ☁️ Deploy

### Frontend (Vercel)

- Hospedado automaticamente via GitHub
- Reconhecido como projeto CRA
- Produzido via `npm run build`

### Backend (Render)

- Conectado ao MongoDB Atlas
- Expõe as rotas em: `https://ecommercefarmacia.onrender.com/api`

---

## 📦 API dos Correios

Cálculo de frete implementado via biblioteca:
\`\`\`
correios-brasil
\`\`\`

Utilizado no backend, retornando valor e prazo de entrega com base no CEP de destino.

---

## 👨‍💻 Autor

Jerfesson Melo  
📧 jerfessonmelo123@gmail.com  
🔗 GitHub: [JerfessonMelo](https://github.com/JerfessonMelo)

---

## ✅ Status

🚧 Projeto em desenvolvimento — funcionalidades principais completas  
📦 Em fase de testes e integração final com deploy

---
