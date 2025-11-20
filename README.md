# Projeto Messenger — Chat em Tempo Real

Aplicação completa de chat em tempo real, utilizando WebSockets, autenticação JWT, PostgreSQL e integração entre frontend (React + Vite) e backend (Node.js + Express + Socket.io).

Frontend online:  
https://projeto-messeger-frontend.vercel.app

---

## Tecnologias Utilizadas

### Frontend
- React + Vite  
- TypeScript  
- TailwindCSS  

### Backend
- Node.js / Express  
- Socket.io  
- Prisma ORM  
- JWT para autenticação  
- TypeScript  

### Infraestrutura
- PostgreSQL  
- Render (Backend)  
- Vercel (Frontend)  

---

## Estrutura do Projeto

### Backend
/src
/controllers
/services
/routes
/sockets
/prisma
server.ts

### Frontend
/src
/components
/contexts
/hooks
/services
/pages


---

## Como Rodar o Projeto Localmente

### 1. Criar uma pasta e clonar os repositórios
```bash
git clone https://github.com/daniel-gapinski/projeto-messeger-backend.git
git clone https://github.com/daniel-gapinski/projeto-messeger-frontend.git

2. Instalar dependências
Execute dentro de cada pasta:
npm install

3. Criar o banco de dados PostgreSQL
Você pode criar o banco utilizando:
PostgreSQL local
Neon (recomendado)
Railway
Render
Exemplo de URL de conexão:
postgresql://user:password@host:5432/database


4. Configurar Variáveis de Ambiente
4.1 Backend
Pasta: projeto-messeger-backend
Renomeie o arquivo:
.env.example → .env

4.2 Preencha com suas credenciais:
DATABASE_URL="sua_url_postgres"
JWT_SECRET="sua_chave_MD5"
PORT=3333

Gerar chave MD5:
https://www.md5hashgenerator.com/

Observação sobre Prisma (versões recentes)
O Prisma 7 não aceita mais a propriedade url dentro do arquivo schema.prisma.
Crie o arquivo prisma.config.ts na raiz do projeto:

import { defineConfig } from '@prisma/cli';

export default defineConfig({
  database: {
    url: process.env.DATABASE_URL!,
  },
});

E no arquivo schema.prisma deixe:

datasource db {
  provider = "postgresql"
}

4.2 Frontend
Renomeie:
.env.example → .env

Preencha com a URL do backend:
VITE_API_URL="http://localhost:3333/"

Se estiver usando Render:
VITE_API_URL="https://seu-backend.onrender.com/"

5. Gerar Prisma Client (OBRIGATÓRIO)
Dentro da pasta do backend, execute:

npx prisma generate

Sem este comando o backend não inicia.

6. Rodar o Backend
npm run dev

7. Rodar o Frontend
npm run dev

O frontend abrirá automaticamente em:
http://localhost:5173/

Funcionamento do WebSocket (Socket.io)
O usuário conecta ao websocket enviando um token JWT.
Principais eventos utilizados:
sendMessage
receiveMessage
sendFriendRequest
notifyFriendRequest
connect
disconnect
Cada socket é autenticado e vinculado ao ID do usuário extraído do token JWT.


Autor
Daniel Augusto Gapinski
LinkedIn: https://linkedin.com/in/daniel-augusto-gapinski-7935b918b/
