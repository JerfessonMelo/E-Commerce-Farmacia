e-commerce de farmácia dividido em **frontend** (React) e **backend** (Node.js/Express).

## Como executar

1. Inicie o backend:
   cd backend
   npm install
   npm run dev

2. Em outra aba, inicie o frontend:
   cd frontend
   npm install
   npm start

O frontend ficará disponível em `http://localhost:3000` e se comunicará com o backend pelas rotas `/api`.

## Deploy em nuvem

Atualmente, o **backend** roda no [Render](https://render.com) e o **frontend** no [Vercel](https://vercel.com).

## Banco de dados

Os dados da aplicação são mantidos no **MongoDB Atlas**, um banco de dados MongoDB hospedado na nuvem, acessado pelo backend via Mongoose.

## Segurança e autenticação

- As senhas dos usuários são criptografadas com **Bcrypt** antes de serem salvas.
- O login gera um **JWT** que é guardado em cookies, mantendo a sessão de forma segura.
