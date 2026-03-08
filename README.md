🚀 Tecnologias Utilizadas

🟢 Node.js

⚡ Express.js

🐘 PostgreSQL

🔐 JSON Web Token

📬 Postman para testes de API

🧠 JavaScript

📁 Estrutura do Projeto

 ├── controllers
 │    ├── orderController.js
 │    └── userController.js
 ├── db
 │    └── connection.js
 │
 ├── models
 │    └── orderModel.js
 │
 ├── routes
 │    ├── orderRoutes.js
 │
 ├── auth.js
 └── app.js
 
🔐 Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Token).

Antes de acessar as rotas de pedidos, é necessário obter um token através da rota de login.

Obter Token
POST /login

Body da requisição:

{
  "usuario": "admin",
  "senha": "123456"
}

Resposta:

{
  "token": "seu_token_jwt"
}

Para acessar as rotas protegidas, envie o token no header:

Authorization: Bearer seu_token_jwt
📦 Rotas da API
Pedidos
📄 Listar pedidos
GET /pedidos
➕ Criar pedido
POST /pedidos

Exemplo de Body:

{
"numeroPedido": "v10089015vdb-01", "valorTotal": 10000,
"dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
"items": [
{
"idItem": "2434",
"quantidadeItem": 1,
"valorItem": 1000
}
]
}

✏️ Atualizar pedido
PUT /pedidos/:id
❌ Deletar pedido
DELETE /pedidos/:id
🧪 Testes da API

Os testes das rotas foram realizados utilizando o Postman, organizados em duas collections:

Collection 1 – Pedidos

Criar pedido

Listar pedidos

Atualizar pedido

Deletar pedido

Collection 2 – Login

Obter Token 

⚙️ Como Executar o Projeto
1️⃣ Clonar o repositório
git clone https://github.com/seuusuario/seu-repositorio.git
2️⃣ Entrar na pasta
cd nome-do-projeto
3️⃣ Instalar dependências
npm install
4️⃣ Configurar conexão com o banco

Edite o arquivo:

db/connection.js

Com as credenciais do seu PostgreSQL.

5️⃣ Executar o projeto
npm start

ou

node app.js
🧠 Funcionalidades

✔️ Autenticação com JWT
✔️ CRUD completo de pedidos
✔️ Integração com PostgreSQL
✔️ Estrutura MVC
✔️ Uso de transações no banco de dados
✔️ Organização em controllers, models e routes

👨‍💻 Autor

Daniel de Abreu Oliveira

📍 Brasília - DF
📧 danielabreuoliveira@hotmail.com
