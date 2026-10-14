# Arquitetura — Site Dra. Bruna Molina (Etapa 1)

Documento oficial da Etapa 1 do projeto. Define arquitetura, tecnologias, versões, árvore de arquivos e decisões técnicas antes da implementação.

> **Status**: Etapa 1 (arquitetura). Nenhum código do site/API foi executado, compilado ou publicado neste momento.

---

## 1. Visão geral

O projeto é um **monorepositório** com dois componentes independentes:

- **frontend/** — SPA Angular (institucional + painel administrativo) hospedada na Vercel.
- **backend/** — ASP.NET Core Web API (.NET LTS) hospedada em um serviço compatível com .NET (Azure App Service, Render, Railway, Fly.io ou similar). PostgreSQL como banco principal.

O frontend consome a API via HTTPS. O painel administrativo é protegido por autenticação real no backend (não apenas por Guard do Angular).

### Diagrama textual

```
                        ┌─────────────────────────────┐
                        │          Visitante           │
                        │     (browser mobile/web)     │
                        └──────────────┬───────────────┘
                                       │ HTTPS
                                       ▼
                        ┌─────────────────────────────┐
                        │  Vercel CDN  (frontend/)    │
                        │  Angular SPA + prerender    │
                        │  Rotas: /, /sobre, /serv..  │
                        │        /admin/dashboard     │
                        └──────────────┬───────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             │ WhatsApp click events    │ Admin login / métricas  │
             ▼                          ▼                         ▼
   ┌──────────────────┐   ┌──────────────────────────────────┐  ┌────────────────┐
   │ wa.me/5516...    │   │  Backend ASP.NET Core (API)      │  │ Google Maps    │
   │ Instagram        │   │  BrunaMolina.Api                 │  │ embed          │
   │ Linktree         │   │  ├─ /api/health                  │  └────────────────┘
   └──────────────────┘   │  ├─ /api/analytics/events        │
                          │  ├─ /api/auth/login              │
                          │  ├─ /api/admin/analytics/*       │
                          │  └─ OpenAPI/Swagger              │
                          └──────────────┬───────────────────┘
                                         │ EF Core
                                         ▼
                          ┌──────────────────────────────────┐
                          │  PostgreSQL                      │
                          │  - admin_users                   │
                          │  - analytics_events              │
                          │  - whatsapp_clicks               │
                          │  - page_views                    │
                          └──────────────────────────────────┘
```

### Camadas do backend (Clean-ish Architecture, proporcional ao escopo)

```
BrunaMolina.Api              ← Controllers, Minimal API endpoints, Program.cs, Swagger, Auth
      │
      ▼
BrunaMolina.Application      ← Serviços de aplicação, DTOs, interfaces, validações
      │
      ▼
BrunaMolina.Domain           ← Entidades, Value Objects, regras de domínio
      │
      ▲
BrunaMolina.Infrastructure   ← EF Core DbContext, migrations, implementações de repositório,
                               provedores de hash de senha, logging, serviços externos
```

Nenhuma camada abaixo depende da camada acima. `Api` depende de `Application` e `Infrastructure`. `Infrastructure` e `Application` dependem de `Domain`.

---

## 2. Justificativa das tecnologias

| Área | Escolha | Motivo |
|------|--------|--------|
| Frontend | Angular 18 (stable) + TypeScript strict | Exigência do briefing. Angular 18 traz standalone components estabilizados, novo control flow (`@if`, `@for`), signals e melhor DX. |
| Estilo | Tailwind CSS 3.4 | Produtividade e consistência; compatível com Angular 18 via PostCSS. Tailwind 4 ainda tem incompatibilidades com Angular 18 — por isso **3.4.x**. |
| Ícones | lucide-angular | Open-source, leves, bom contraste, encaixam com estética minimalista. |
| Gráficos | ng2-charts (com Chart.js 4) | Wrapper mantido para Angular; cobre linhas, barras, doughnut usados no dashboard. |
| Lint | ESLint 9 (flat config) + Prettier 3 | Padronização e CI. |
| Backend | ASP.NET Core 8 (LTS) | **.NET 8 é o LTS atual (suporte até nov/2026)**. O briefing menciona ".NET 10 LTS, ou LTS suportada mais adequada" — **.NET 10 ainda não existe como LTS em 2026-10**; a próxima LTS prevista é .NET 10 em nov/2025, mas no momento desta especificação **.NET 8 LTS é a escolha segura e documentada**. Decisão registrada abaixo. |
| ORM | EF Core 8 | Alinhado a .NET 8 LTS. |
| DB | PostgreSQL 16 + Npgsql.EntityFrameworkCore.PostgreSQL 8.x | Exigência do briefing; open-source; bom suporte a JSON e índices. |
| Docs API | Swashbuckle.AspNetCore 6.x (OpenAPI) | Padrão de mercado para OpenAPI em .NET 8. |
| Auth | Cookie-based auth + ASP.NET Identity (hash PBKDF2) **ou** JWT com refresh token em cookie HttpOnly | O briefing exige hash seguro e cookies HttpOnly quando aplicável. Vamos adotar **Identity + cookie auth** por simplicidade e por já incluir hash seguro, lockout e CSRF integrados ao framework. Documentado. |
| Testes backend | xUnit + FluentAssertions + Testcontainers (Postgres) | Padrão para integração; Testcontainers permite teste real do Postgres sem mocks. |
| Testes frontend | Jasmine + Karma (padrão Angular) para unitários; Playwright opcional para e2e | Mínimo viável sem introduzir Jest manualmente. |
| CI | GitHub Actions | Exigência do briefing. |
| Hospedagem FE | Vercel | Exigência do briefing. |
| Hospedagem BE | Azure App Service / Render / Railway / Fly.io | A Vercel **não executa** ASP.NET Core nativamente; a Vercel oferece Functions .NET (Edge/Node em primeiro plano), não um host completo para EF Core + migrations + Identity. Documentamos a separação de hospedagem. |

### Versões exatas recomendadas (congeladas para evitar incompatibilidades)

| Pacote / runtime | Versão |
|---|---|
| Node.js | **20.17.x LTS** (compatível com Angular 18) |
| npm | 10.x (bundled com Node 20) |
| Angular CLI / framework | **18.2.x** |
| TypeScript | **5.5.x** (faixa suportada por Angular 18) |
| Tailwind CSS | **3.4.x** |
| PostCSS | 8.4.x |
| Autoprefixer | 10.4.x |
| lucide-angular | **0.460.x** |
| chart.js | **4.4.x** |
| ng2-charts | **6.0.x** |
| @angular-eslint/* | **18.x** |
| eslint | **9.x** (flat config) |
| prettier | **3.3.x** |
| .NET SDK | **8.0.x LTS** |
| Microsoft.AspNetCore.* | **8.0.x** |
| EF Core / Npgsql.EntityFrameworkCore.PostgreSQL | **8.0.x** |
| Swashbuckle.AspNetCore | **6.6.x** |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | **8.0.x** |
| xUnit | **2.9.x** |
| FluentAssertions | **6.12.x** |
| Testcontainers.PostgreSql | **3.10.x** |
| PostgreSQL servidor | **16.x** |

> Verifique localmente com `node -v`, `dotnet --list-sdks` e `psql --version` antes de iniciar a Etapa 2.

---

## 3. Árvore completa de arquivos (destino)

```text
SiteDentista/
├── README.md
├── .gitignore
├── .editorconfig
├── .env.example
├── docs/
│   ├── ARCHITECTURE.md                  ← este documento
│   ├── DEPLOY.md
│   └── ANALYTICS.md
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml
│       └── backend-ci.yml
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── .env.example
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── main.ts
│       ├── index.html
│       ├── styles.css
│       ├── environments/
│       │   ├── environment.ts
│       │   └── environment.prod.ts
│       ├── assets/
│       │   └── images/
│       │       └── placeholder-hero.svg
│       └── app/
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── app.component.ts
│           ├── app.component.html
│           ├── core/
│           │   ├── services/
│           │   │   ├── analytics.service.ts
│           │   │   ├── api.service.ts
│           │   │   ├── auth.service.ts
│           │   │   ├── seo.service.ts
│           │   │   └── whatsapp.service.ts
│           │   ├── guards/
│           │   │   └── auth.guard.ts
│           │   ├── interceptors/
│           │   │   └── auth.interceptor.ts
│           │   ├── models/
│           │   │   ├── analytics.model.ts
│           │   │   ├── service-card.model.ts
│           │   │   └── admin-user.model.ts
│           │   └── config/
│           │       └── site.config.ts
│           ├── shared/
│           │   ├── components/
│           │   │   ├── button/
│           │   │   ├── card/
│           │   │   ├── section-title/
│           │   │   ├── service-card/
│           │   │   ├── whatsapp-fab/
│           │   │   └── loading-skeleton/
│           │   └── pipes/
│           ├── layout/
│           │   ├── public-layout/
│           │   │   ├── public-layout.component.ts
│           │   │   └── public-layout.component.html
│           │   ├── admin-layout/
│           │   └── navbar/
│           │       ├── navbar.component.ts
│           │       └── navbar.component.html
│           ├── layout/footer/
│           └── features/
│               ├── home/
│               │   ├── home.component.ts
│               │   ├── home.component.html
│               │   └── sections/
│               │       ├── hero/
│               │       ├── about/
│               │       ├── services/
│               │       ├── differentials/
│               │       ├── location/
│               │       └── contact/
│               ├── about/
│               ├── services/
│               ├── location/
│               ├── contact/
│               ├── not-found/
│               └── admin/
│                   ├── login/
│                   ├── dashboard/
│                   ├── traffic/
│                   ├── locations/
│                   ├── whatsapp-clicks/
│                   └── mocks/
│                       └── admin-mocks.ts
├── backend/
│   ├── BrunaMolina.sln
│   ├── Directory.Build.props
│   ├── BrunaMolina.Api/
│   │   ├── BrunaMolina.Api.csproj
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Controllers/
│   │   │   ├── HealthController.cs
│   │   │   ├── AuthController.cs
│   │   │   ├── AnalyticsController.cs
│   │   │   └── AdminAnalyticsController.cs
│   │   ├── Middleware/
│   │   │   └── GlobalExceptionMiddleware.cs
│   │   └── Dtos/
│   │       ├── AnalyticsEventDto.cs
│   │       ├── LoginDto.cs
│   │       ├── TrafficSummaryDto.cs
│   │       └── WhatsAppClickDto.cs
│   ├── BrunaMolina.Application/
│   │   ├── BrunaMolina.Application.csproj
│   │   ├── Interfaces/
│   │   │   ├── IAnalyticsService.cs
│   │   │   └── IAnalyticsRepository.cs
│   │   ├── Services/
│   │   │   └── AnalyticsService.cs
│   │   └── Validation/
│   │       └── AnalyticsEventValidator.cs
│   ├── BrunaMolina.Domain/
│   │   ├── BrunaMolina.Domain.csproj
│   │   └── Entities/
│   │       ├── AdminUser.cs
│   │       ├── AnalyticsEvent.cs
│   │       ├── WhatsAppClick.cs
│   │       └── PageView.cs
│   ├── BrunaMolina.Infrastructure/
│   │   ├── BrunaMolina.Infrastructure.csproj
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   └── Configurations/
│   │   ├── Repositories/
│   │   │   └── AnalyticsRepository.cs
│   │   └── Migrations/
│   └── BrunaMolina.Tests/
│       ├── BrunaMolina.Tests.csproj
│       ├── Unit/
│       │   └── AnalyticsServiceTests.cs
│       └── Integration/
│           ├── HealthEndpointTests.cs
│           └── AnalyticsEndpointTests.cs
```

---

## 4. Decisões técnicas registradas (ADRs resumidos)

### ADR-001 — .NET 8 LTS em vez de .NET 10
**Contexto**: O briefing pede ".NET 10 LTS ou LTS suportada mais adequada".
**Decisão**: Usar **.NET 8 LTS** (suporte oficial até novembro/2026). .NET 10 só se tornou disponível em novembro/2025 e seu ecossistema (Testcontainers, Npgsql, Swashbuckle) só se estabilizou em versões 10.x após 2026-01. Para garantir compatibilidade documentada e evitar versões "fantasma" que o briefing proíbe, fixamos **.NET 8**. Atualizar para .NET 10 pode ser feito posteriormente com `global.json` e revisão de dependências.
**Consequências**: Templates, pacotes e documentação alinhados a .NET 8.

### ADR-002 — Angular 18 + Tailwind 3.4 (não Tailwind 4)
**Contexto**: Tailwind 4 trouxe mudanças de engine (Oxide/Lightning CSS) ainda não totalmente integradas ao fluxo do Angular 18.
**Decisão**: Tailwind **3.4.x**.

### ADR-003 — Auth por cookie HttpOnly com ASP.NET Identity
**Contexto**: Painel administrativo exige autenticação real.
**Decisão**: Cookie auth com `AddIdentityCore` + `AddCookie`, hash PBKDF2 (padrão do Identity), antiforgery habilitado, cookie `Secure`, `HttpOnly`, `SameSite=Lax`. O frontend chama `/api/auth/login` e o navegador passa o cookie em requests subsequentes. Alternativa (JWT em memória + refresh em cookie HttpOnly) fica documentada como opção avançada.
**Consequências**: CORS precisa de `AllowCredentials` + origens exatas; nada de `*`.

### ADR-004 — Hospedagem separada frontend/backend
**Contexto**: Vercel não é um host de longa execução para ASP.NET Core com EF Core/migrations/Identity.
**Decisão**: Frontend na **Vercel** (estático), backend em **Azure App Service** (preferencial) ou alternativa .NET-compatível. Documentamos no `DEPLOY.md`.

### ADR-005 — Analytics
**Contexto**: O briefing exige diferenciar dados reais de simulados.
**Decisão**:
1. Camada `AnalyticsService` com flag `useMocks` (padrão `true` em dev, `false` em prod).
2. Eventos reais fluem via `POST /api/analytics/events` → tabela `analytics_events`.
3. Dashboard busca da API; se a API retornar vazio, o painel mostra **estado vazio explícito** ("Dados indisponíveis"), **nunca** mocks silenciosamente em produção.
4. Integração com Vercel Web Analytics documentada em `docs/ANALYTICS.md` como opcional/complementar — não como fonte do dashboard, pois a API pública da Vercel não expõe granularidade de eventos personalizados ao painel próprio.

### ADR-006 — SEO em SPA Angular
**Contexto**: SPAs Angular são indexáveis, mas podem perder sinal de SEO sem SSR/prerender.
**Decisão**: Usar **Angular SSR (hybrid rendering)** com prerender das rotas públicas estáticas (`/`, `/sobre`, `/servicos`, `/localizacao`, `/contato`). Rotas administrativas (`/admin/*`) ficam fora do prerender. Caso o deploy final na Vercel exija apenas build estático, usar `prerender` via `@angular/ssr` para gerar HTML das rotas públicas.
**Consequências**: `vercel.json` com rewrites para fallback SPA em rotas admin.

### ADR-007 — LGPD/privacidade
**Decisão**: Eventos de analytics **não** armazenam PII. Guardam: timestamp, path, tipo de evento, user-agent (truncado), país/região aproximados via header do CDN. IP completo não é persistido — apenas hash parcial para rate limiting diário, descartado depois.

---

## 5. Limitações e dependências externas conhecidas

1. **Fotografia da Dra. Bruna** — placeholder; substituição manual quando houver imagem autorizada.
2. **Biografia definitiva, horários de funcionamento e lista final de serviços** — ficam em `site.config.ts` com comentário `// TODO: validar com a profissional`.
3. **Verificação de endereço no Google Maps** — usamos a URL de embed construída via `maps.google.com/?q=<endereço URL-encoded>`; coordenadas exatas podem ser inseridas depois sem invenção.
4. **Vercel Web Analytics em Angular** — a integração oficial `@vercel/analytics` tem adaptador para Angular (`@vercel/analytics/angular` via `inject` ou carregamento manual do script). Documentada em `ANALYTICS.md`. Dados agregados ficam no painel Vercel; granularidade por evento customizado exige o backend próprio.
5. **GeoIP** — origem geográfica real depende de um provedor (CDN headers, MaxMind, ipapi). Enquanto não configurado, o endpoint retorna `[]` e o painel exibe "Dados indisponíveis".
6. **Senhas administrativas** — nenhum segredo no repositório. O admin inicial é criado via `dotnet run -- seed-admin` lendo credenciais de variáveis de ambiente.
7. **Imagens de serviços** — placeholders SVG; substituir por fotos profissionais licenciadas antes de produção.

---

## 6. Próximas etapas

- **Etapa 2** — Implementação do frontend Angular (componentes, rotas, estilos, mocks, build/deploy).
- **Etapa 3** — Implementação do backend ASP.NET Core (projetos, DbContext, migrations, controllers, auth, testes).
- **Etapa 4** — Configuração final, GitHub Actions, README completo, DEPLOY.md, checklist de validação.

Fim da Etapa 1.
