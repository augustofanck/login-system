# Login System (Spring Boot + JWT)

API simples de autenticação e autorização com **JWT (HMAC/HS256)** e **controle de acesso por role** (USER/ADMIN).  
Feita para servir como base de estudo / teste técnico: endpoints enxutos, Swagger ligado e banco H2 em memória para rodar em minutos.

## Stack
- Java 21
- Spring Boot (WebMVC, Validation, Data JPA)
- Spring Security (Resource Server + JWT)
- H2 (in-memory) + Spring Data JPA
- OpenAPI/Swagger UI (springdoc)

## Funcionalidades
- ✅ Registrar usuário (`/auth/register`)
- ✅ Login e geração de token JWT (`/auth/login`)
- ✅ Endpoint protegido de perfil (`/me`)
- ✅ Troca de senha (`/me/change-password`)
- ✅ Rotas admin:
  - Listar usuários (`/admin/users`)
  - Excluir usuário por id (`/admin/users/{id}`) — bloqueia auto-exclusão
- ✅ Swagger UI + OpenAPI JSON
- ✅ Seed inicial com usuário ADMIN e USER

## Rotas (visão rápida)
| Método | Rota | Auth | Regra |
|-------:|------|------|------|
| POST | `/auth/register` | Não | Cria usuário |
| POST | `/auth/login` | Não | Retorna `{ token }` |
| GET | `/me` | Sim | Qualquer usuário logado |
| POST | `/me/change-password` | Sim | Qualquer usuário logado |
| GET | `/admin/users` | Sim | Apenas `ADMIN` |
| DELETE | `/admin/users/{id}` | Sim | Apenas `ADMIN` |
| GET | `/home` | Sim | Rota protegida “Hello World” |

## Como rodar (dev)
### Pré-requisitos
- Java 21 instalado

### Subir a aplicação
**Linux/macOS:**
```bash
./mvnw spring-boot:run
````

**Windows (PowerShell/CMD):**

```powershell
.\mvnw.cmd spring-boot:run
```

A API sobe em:

* `http://localhost:8080`

## Swagger / OpenAPI

* Swagger UI: `http://localhost:8080/swagger-ui/index.html`
* OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Como usar o token no Swagger

1. Faça login em `/auth/login` e copie o `token`.
2. Clique em **Authorize** (cadeado).
3. Cole no formato:

    * `Bearer SEU_TOKEN_AQUI`

## Usuários seed (prontos pra usar)

Ao iniciar, se não existirem no banco, a aplicação cria:

* **ADMIN**

    * email: `admin@local.dev`
    * senha: `Admin@123`

* **USER**

    * email: `user@local.dev`
    * senha: `User@123`

## Banco H2 (dev)

Console:

* `http://localhost:8080/h2-console`

Config padrão:

* JDBC URL: `jdbc:h2:mem:loginsystem;DB_CLOSE_DELAY=-1`
* User: `sa`
* Password: (vazio)

> Observação: H2 console é ferramenta de desenvolvimento. Evite habilitar isso em produção.

## Exemplos (cURL)

### Registrar

```bash
curl -X POST "http://localhost:8080/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Fulano",
    "email":"fulano@exemplo.com",
    "password":"Senha@123",
    "cpf":"12345678901",
    "role":"USER"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8080/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.dev","password":"Admin@123"}'
```

Resposta:

```json
{ "token": "..." }
```

### /me (com token)

```bash
curl "http://localhost:8080/me" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Trocar senha

```bash
curl -X POST "http://localhost:8080/me/change-password" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword":"Admin@123",
    "newPassword":"NovaSenha@123",
    "confirmNewPassword":"NovaSenha@123"
  }'
```

### Admin: listar usuários

```bash
curl "http://localhost:8080/admin/users" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

### Admin: excluir usuário

```bash
curl -i -X DELETE "http://localhost:8080/admin/users/2" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

## Script útil

### Exportar OpenAPI para `docs/swagger.json` (PowerShell)

Com a API rodando:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\export-openapi.ps1
```