# Login System (React + Spring Boot)

Sistema web de autenticação (login/registro) desenvolvido como teste técnico, com **frontend em React (Vite)** e **backend em Java Spring Boot**, incluindo **JWT**, **Spring Security**, **validações**, **troca de senha**, e **área administrativa** para gerenciamento de usuários.

---

## ✅ Requisitos atendidos

- Cadastro de usuário (nome, e-mail, senha, CPF, perfil USER/ADMIN) **sem login prévio**
- Login com JWT e acesso à rota protegida **/home** exibindo **“Hola Mundo”**
- Validação para não permitir criação de usuários com dados duplicados/inválidos
- Troca da própria senha com confirmação (fluxo seguro)
- Usuários ADMIN podem listar usuários e excluir usuários
- Backend com API REST + Spring Security
- Banco **in-memory** (dados reiniciam a cada start)
- Swagger para documentação + **arquivo `.json` versionado no repositório**
- UI com Tailwind (layout consistente nas telas Home / ChangePassword / AdminUsers)

---

## 🧱 Stack

**Backend**
- Java + Spring Boot
- Spring Security
- JWT
- Spring Data (com paginação no endpoint admin)
- Banco in-memory (ex.: H2)

**Frontend**
- React + Vite
- Tailwind CSS
- Context API (AuthContext)
- Fetch client centralizado (`apiFetch`) com token no `localStorage`

---

## 📁 Estrutura do repositório

```

/
├─ backend/                 # Spring Boot API
│  ├─ src/main/java/...
│  ├─ src/main/resources/...
│  └─ ...
├─ frontend/                # React (Vite)
│  ├─ src/
│  ├─ vite.config.js
│  └─ ...
└─ docs/
└─ swagger.json          # Swagger/OpenAPI exportado (versionado)

````

---

## ▶️ Como rodar o projeto localmente

### Pré-requisitos
- Node.js (recomendado 18+)
- Java 17+ (ou conforme configurado no projeto)
- Maven (ou `mvnw`)

---

## 1) Subir o backend (Spring Boot)

Abra um terminal:

```bash
cd backend
./mvnw spring-boot:run
````

Backend por padrão:

* `http://localhost:8080`

> Observação: o banco é in-memory. Ao reiniciar o backend, os dados (exceto seed) não persistem.

---

## 2) Subir o frontend (React)

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend por padrão:

* `http://localhost:5173`

---

## 🔐 Autenticação e sessão

* Após login, o backend retorna um **JWT**.
* O frontend armazena o token em `localStorage` (`TOKEN_KEY=token`) e envia em:

  * `Authorization: Bearer <token>`

### Importante (banco in-memory)

Como o banco reinicia, pode acontecer de:

* você ter um token salvo no navegador
* reiniciar o backend
* o usuário não existir mais no banco

Nessa situação, endpoints protegidos retornam erro de autenticação, e o frontend deve **derrubar a sessão** e redirecionar para `/login` (fluxo de segurança esperado para ambientes in-memory).

---

## 👤 Seed de usuários (contas iniciais)

Ao iniciar o backend, um seeding cria pelo menos 2 usuários padrão (ex.: ADMIN e USER).
Os e-mails e demais campos podem ser conferidos via endpoint admin (quando logado como ADMIN) ou na classe de seeding do backend.

> Como o banco é in-memory, qualquer usuário criado via `/auth/register` some ao reiniciar.

---

## 🧭 Rotas principais (Frontend)

* `/register` → Cadastro
* `/login` → Login
* `/home` → Home protegida (“Hola Mundo” consumido via API)
* `/change-password` → Troca de senha (protegida)
* `/admin/users` → Área Admin (protegida + apenas ADMIN)

---

## 🔌 Endpoints principais (Backend)

> **Obs.:** os caminhos abaixo refletem o padrão implementado no projeto.

### Auth

* `POST /auth/register` → cadastro
* `POST /auth/login` → login (retorna `{ token }`)
* `GET /me` → dados do usuário autenticado

### Home

* `GET /api/hello` → retorna JSON com mensagem (ex.: `{ "hello": "Hola Mundo" }`)

### Troca de senha

* `PUT /me/password` → atualiza senha (exige senha atual + confirmação no frontend)

### Admin (ADMIN only)

* `GET /admin/users?page=0&size=20` → lista paginada (Spring Data `Page<>`)
* `DELETE /admin/users/{id}` → exclui usuário

---

## 🧾 Swagger / OpenAPI (documentação)

### Swagger UI

Após subir o backend, acesse:

* `http://localhost:8080/swagger-ui/index.html`

### JSON OpenAPI

Endpoint padrão (SpringDoc):

* `http://localhost:8080/v3/api-docs`

### Exportar e versionar o JSON no repositório

Com o backend rodando:

```bash
mkdir -p docs
curl http://localhost:8080/v3/api-docs -o docs/swagger.json
```

---

## 🧪 Testes

### Backend

```bash
cd backend
./mvnw test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🛡️ Notas de segurança e UX

* Rotas sensíveis estão protegidas por Spring Security.
* A rota admin exige papel `ADMIN`.
* O frontend exibe mensagens de erro em falhas de credenciais.
* Como o banco reinicia, o app deve lidar com token “órfão”:

  * ao detectar falha de autenticação em chamadas protegidas → remover token e voltar ao login.

---

## 👨‍💻 Autor

Este foi um projeto desenvolvido por como teste técnico.