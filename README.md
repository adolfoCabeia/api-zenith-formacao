# 🎓 SoftCentro — Back-end

> Sistema de Gestão para Centro de Formação  
> API RESTful robusta com autenticação JWT, IA integrada e documentação Swagger.

---

##Índice

- [Sobre o Projecto](#-sobre-o-projecto)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Endpoints da API](#-endpoints-da-api)
- [Documentação Swagger](#-documentação-swagger)
- [Autor](#-autor)

---

## Sobre o Projecto

O **SoftCentro** é um software de cadastro e gestão para centros de formação profissional. Permite gerir alunos, cursos, turmas, pagamentos e autenticação de utilizadores, com suporte a IA conversacional integrada.

---

## Tecnologias

| Categoria         | Tecnologias                                           |
|-------------------|-------------------------------------------------------|
| **Runtime**       | Node.js + TypeScript                                  |
| **Framework**     | Express 5                                             |
| **ORM**           | Prisma 7 + PostgreSQL                                 |
| **Autenticação**  | JWT + bcryptjs                                        |
| **Cache / Rate Limit** | Redis + express-rate-limit                       |
| **IA**            | Google Generative AI + OpenAI Agents + MCP SDK        |
| **Upload**        | Multer + Cloudinary                                   |
| **PDF**           | PDFKit                                                |
| **SMS**           | Twilio                                                |
| **Validação**     | Zod                                                   |
| **Segurança**     | Helmet + CORS                                         |
| **Docs**          | Swagger (swagger-jsdoc + swagger-ui-express)          |

---

## Pré-requisitos

Antes de começar, tens de ter instalado:

- [Node.js](https://nodejs.org/) >= 18
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [npm](https://www.npmjs.com/)

---

## Instalação

```bash
# 1. Clona o repositório
git clone https://github.com/seu-usuario/softcentro-backend.git
cd softcentro-backend

# 2. Instala as dependências (o Prisma Client é gerado automaticamente via postinstall)
npm install

# 3. Configura as variáveis de ambiente
cp .env.example .env
# Edita o .env com as tuas credenciais

# 4. Executa as migrations do banco de dados
npx prisma migrate dev

# 5. Inicia em modo desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

Cria um ficheiro `.env` na raiz do projecto com as seguintes variáveis:

```env
# Base de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/softcentro"

# Autenticação
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# Cloudinary (Upload de imagens)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Google Generative AI
GOOGLE_API_KEY=""

# Twilio (SMS)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Servidor
PORT=3000
NODE_ENV="development"
```

> **Nunca commites o ficheiro `.env` com dados reais.** Adiciona-o ao `.gitignore`.

---

## Scripts Disponíveis

| Script            | Descrição                                      |
|-------------------|------------------------------------------------|
| `npm run dev`     | Inicia o servidor em modo desenvolvimento com hot-reload (`tsx watch`) |
| `npm run build`   | Compila o TypeScript para JavaScript (`dist/`) |
| `npm start`       | Inicia o servidor a partir do build compilado  |
| `npm run reset:data` | Reseta os dados do banco via script de serviço |

---

## Estrutura de Pastas

```
back-end/
├── src/
│   ├── app.ts              # Configuração do Express e middlewares
│   ├── server.ts           # Entrada da aplicação
│   ├── config/             # Configurações (DB, Cloudinary, etc.)
│   ├── controllers/        # Lógica de negócio dos endpoints
│   ├── routes/             # Definição das rotas
│   ├── middleware/         # Middlewares (auth, validação, etc.)
│   ├── services/           # Serviços e regras de negócio
│   ├── utils/              # Funções utilitárias
│   ├── mcp/                # Integração com Model Context Protocol
│   └── generated/          # Ficheiros gerados automaticamente
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── dist/                   # Build compilado (gerado pelo tsc)
├── temp/                   # Ficheiros temporários
├── tsconfig.json
├── prisma.config.ts
└── package.json
```

---

## Endpoints da API

Base URL: `http://localhost:3000`

| Prefixo         | Descrição                                 |
|-----------------|-------------------------------------------|
| `/auth`         | Autenticação (login, registo, refresh token) |
| `/alunos`       | Gestão de alunos (CRUD)                   |
| `/cursos`       | Gestão de cursos                          |
| `/turmas`       | Gestão de turmas                          |
| `/pagamentos`   | Controlo de pagamentos                    |
| `/dashboard`    | Estatísticas e métricas gerais            |
| `/api`          | Chat com IA (Google Generative AI / Agents) |

---

## Documentação Swagger

Com o servidor em execução, acede à documentação interactiva em:

```
http://localhost:3000/api-docs
```

---

## Autor

**Adolfo Cabeia**  
Licença: ISC
