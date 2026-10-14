# Site Dra. Bruna Molina — Odontologia

Projeto web institucional + painel administrativo para a cirurgiã-dentista **Dra. Bruna Naiara Molina** (CRO-SP 145594).

> **Status atual**: Etapa 1 (arquitetura) concluída. Etapas 2 (frontend), 3 (backend) e 4 (deploy) em implementação neste repositório. Nenhum deploy foi executado.

## Visão geral

Monorepositório com:

- `frontend/` — SPA Angular 18 + Tailwind CSS, hospedada na Vercel.
- `backend/` — ASP.NET Core 8 Web API + PostgreSQL, hospedada em serviço compatível com .NET.
- `docs/` — arquitetura, deploy e analytics.
- `.github/workflows/` — CI (lint, build, testes).

A arquitetura completa, decisões técnicas e versões exatas estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Dados oficiais da profissional

Fonte única de verdade. Centralizados em [`frontend/src/app/core/config/site.config.ts`](frontend/src/app/core/config/site.config.ts).

| Campo | Valor |
|---|---|
| Nome | Dra. Bruna Naiara Molina |
| Título | Cirurgiã-Dentista |
| Registro | CRO-SP 145594 |
| WhatsApp | (16) 99750-2033 — [wa.me/5516997502033](https://wa.me/5516997502033) |
| Instagram | [@drabrunamolina](https://www.instagram.com/drabrunamolina/) |
| Linktree | [linktr.ee/drabrunamolina](https://linktr.ee/drabrunamolina) |
| Endereço | R. Voluntários da Pátria, 2411 — Jardim Nova America, Araraquara/SP, 14801-320 |

Biografia, horários de funcionamento, lista final de serviços e eventual lista de diferenciais **não foram inventados** — ficam como campos editáveis com `TODO: validar com a profissional`.

## Pré-requisitos

| Ferramenta | Versão |
|---|---|
| Node.js | **20.17.x LTS** |
| npm | 10.x |
| .NET SDK | **8.0.x LTS** |
| PostgreSQL | **16.x** |
| Angular CLI (opcional) | 18.2.x |

Verifique com:

```bash
node -v
npm -v
dotnet --list-sdks
psql --version
```

## Instalação local

```bash
# clonar
git clone https://github.com/<user>/SiteDentista.git
cd SiteDentista

# copiar e preencher env
cp .env.example .env

# ----- frontend -----
cd frontend
npm ci
npm start        # http://localhost:4200

# ----- backend -----
cd ../backend
dotnet restore
dotnet ef database update --project BrunaMolina.Infrastructure --startup-project BrunaMolina.Api
dotnet run --project BrunaMolina.Api   # http://localhost:5080 — Swagger em /swagger
```

## Build de produção

```bash
# frontend
cd frontend
npm run build       # artefato em frontend/dist/

# backend
cd ../backend
dotnet publish BrunaMolina.Api -c Release -o ./publish
```

## Testes

```bash
# frontend
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless

# backend
cd ../backend
dotnet test
```

## Lint & formatação

```bash
# frontend
cd frontend
npm run lint
npm run format
```

## Scripts úteis

| Comando | O que faz |
|---|---|
| `npm start` (frontend) | Dev server Angular |
| `npm run build` (frontend) | Build de produção |
| `npm run build:ssr` (frontend) | Build com prerender das rotas públicas |
| `npm test` (frontend) | Testes Jasmine/Karma |
| `dotnet run --project BrunaMolina.Api` | Executa a API |
| `dotnet ef migrations add <Name>` | Nova migration EF Core |
| `dotnet test` | Testes xUnit |

## Deploy

**Receita oficial (free, auto-deploy):** [`docs/HOSTING.md`](docs/HOSTING.md) — tudo na Render.com via Blueprint ([`render.yaml`](render.yaml)) + GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). CI roda build+testes; só se tudo passar, dispara os Deploy Hooks da Render.

Guia detalhado alternativo (Vercel + Azure) em [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Segurança

- Senhas armazenadas apenas como hash (ASP.NET Identity / PBKDF2).
- Autenticação por cookie HttpOnly `Secure` `SameSite=Lax`.
- CORS restrito a origens explícitas (nunca `*`).
- Rate limiting em `/api/analytics/events` e `/api/auth/login`.
- Nenhum segredo neste repositório. Todas as credenciais vêm de variáveis de ambiente.

## Analytics

Detalhes em [`docs/ANALYTICS.md`](docs/ANALYTICS.md). Resumo: eventos de clique no WhatsApp são enviados para `/api/analytics/events`; o dashboard consome a API própria. Vercel Web Analytics é complementar e opcional.

## Licença

Projeto proprietário da Dra. Bruna Naiara Molina. Uso restrito.
