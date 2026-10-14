# Deploy — Site Dra. Bruna Molina

Guia completo para publicar frontend e backend em produção. **Nenhum deploy foi executado por este guia** — ele descreve o passo a passo que precisa ser seguido por uma pessoa com acesso aos painéis.

---

## 1. Pré-requisitos

- Repositório no GitHub com o conteúdo deste monorepositório.
- Conta na Vercel (frontend).
- Hospedagem compatível com .NET 8 para o backend. Opções em ordem de preferência:
  1. **Azure App Service** (plano B1+) — recomendado por integração nativa com .NET.
  2. **Render / Railway / Fly.io** — alternativas simples via Dockerfile.
- Banco **PostgreSQL 16** gerenciado (Azure Flexible Server, Supabase, Neon, Render).
- Domínio próprio (opcional, mas recomendado para SEO/credibilidade).

---

## 2. Frontend na Vercel

### 2.1 Criar o projeto

1. Push do repositório para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. **Root directory**: `frontend`.
4. **Framework preset**: `Other` (o `vercel.json` já define tudo).
5. **Build command**: `npm run build` (preenchido via `vercel.json`).
6. **Output directory**: `dist/bruna-molina-frontend/browser` (preenchido via `vercel.json`).
7. **Install command**: `npm ci`.

### 2.2 Variáveis de ambiente da Vercel

Angular não lê `process.env` em runtime. As variáveis públicas são injetadas em build pelo `src/environments/environment.prod.ts`. Para fluxo profissional, preencha o arquivo com os valores corretos antes do push, ou — alternativa recomendada — adicione um step de substituição no build.

Variáveis sugeridas:

| Chave | Valor (prod) |
|---|---|
| `NG_APP_API_BASE_URL` | `https://api.drabrunamolina.com.br` |
| `NG_APP_SITE_URL` | `https://www.drabrunamolina.com.br` |

Para mapeá-las ao `environment.prod.ts`, edite o arquivo durante o build:

```bash
# em frontend/package.json, script "build" pode se tornar:
"build": "node scripts/inject-env.js && ng build"
```

(opcional — a Etapa 1 deixa `environment.prod.ts` com valores corretos para `drabrunamolina.com.br`; ajuste conforme o domínio real.)

### 2.3 Fallback SPA

Já configurado em `frontend/vercel.json` via rewrite `/(.*)` → `/index.html`. Isso permite recarregar `/admin/dashboard` sem obter 404.

### 2.4 Domínio

No painel da Vercel, adicione o domínio `www.drabrunamolina.com.br` e configure os registros DNS (CNAME para `cname.vercel-dns.com`).

---

## 3. Backend em Azure App Service (recomendado)

### 3.1 Criar recursos

```bash
# Pré-requisito: az CLI logada.
# Valores de exemplo — substitua.
RG=brunamolina-prod
LOC=brazilsouth
APP=brunamolina-api
PLAN=brunamolina-plan
PG=brunamolina-pg

az group create -n $RG -l $LOC

az appservice plan create -n $PLAN -g $RG --sku B1 --is-linux
az webapp create -g $RG -p $PLAN -n $APP --runtime "DOTNETCORE:8.0"

az postgres flexible-server create \
  -g $RG -n $PG -l $LOC \
  --admin-user brunamolina \
  --admin-password "<SENHA_FORTE>" \
  --tier Burstable --sku-name Standard_B1ms \
  --version 16

az postgres flexible-server db create -g $RG -s $PG -d brunamolina
```

### 3.2 Variáveis de ambiente do App Service

| Chave | Exemplo |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__Default` | `Host=<pg>.postgres.database.azure.com;Port=5432;Database=brunamolina;Username=brunamolina;Password=<SENHA>;SSL Mode=Require;Trust Server Certificate=true` |
| `Cors__AllowedOrigins__0` | `https://www.drabrunamolina.com.br` |
| `Cors__AllowedOrigins__1` | `https://brunamolina.vercel.app` |
| `Cookie__Name` | `.BrunaMolina.Auth` |
| `AdminSeed__Enabled` | `true` **apenas no primeiro deploy** |
| `AdminSeed__Email` | `admin@drabrunamolina.com.br` |
| `AdminSeed__Password` | senha forte temporária |

Após o primeiro deploy, remova `AdminSeed__Enabled` ou coloque `false`.

### 3.3 Deploy

```bash
cd backend
dotnet publish BrunaMolina.Api -c Release -o ./publish

# ZIP deploy
cd publish && zip -r ../publish.zip . && cd ..
az webapp deploy -g $RG -n $APP --src-path publish.zip --type zip
```

Alternativa: GitHub Actions com `azure/webapps-deploy@v3` (não incluído por padrão para evitar depender de segredos antes do seu setup).

### 3.4 HTTPS e CORS

- Azure App Service já expõe HTTPS no domínio `*.azurewebsites.net`.
- Para o domínio `api.drabrunamolina.com.br`, adicione *Custom Domain* e certificado gerenciado.
- A lista `Cors__AllowedOrigins` deve conter **o domínio final da Vercel** — nunca `*`.

### 3.5 Verificação

- `GET https://<api>.azurewebsites.net/api/health` → deve responder `{"status":"ok"}`.
- `GET /swagger` só está disponível em `Development`.

---

## 4. Alternativa: Render / Railway / Fly.io

Qualquer host .NET 8 com PostgreSQL serve. Para Render:

1. Crie um "Web Service" apontando para o repo, root `backend`.
2. Build command: `dotnet publish BrunaMolina.Api -c Release -o out`.
3. Start command: `dotnet out/BrunaMolina.Api.dll`.
4. Adicione um PostgreSQL "Internal" ou aponte para um Supabase.
5. Preencha as mesmas variáveis de ambiente da seção 3.2.

---

## 5. Após publicar

- Ative no frontend o `NG_APP_API_BASE_URL` apontando para o backend.
- Teste o login em `/admin/login`.
- Troque imediatamente a senha semeada (criar fluxo de troca de senha é melhoria futura).
- Monitore logs em `az webapp log tail -n $APP -g $RG`.

---

## 6. Checklist de deploy

- [ ] Push para o GitHub.
- [ ] Vercel conectada ao repositório, pasta raiz = `frontend`.
- [ ] Backend publicado e `/api/health` responde 200.
- [ ] PostgreSQL migrado (`dotnet ef database update` ou migrate automático no startup).
- [ ] CORS configurado para o domínio da Vercel.
- [ ] Variáveis de ambiente completas no backend.
- [ ] Admin seed executado, senha trocada.
- [ ] `AdminSeed__Enabled=false` ou removido.
- [ ] HTTPS validado em frontend e backend.
- [ ] Sitemap acessível em `/sitemap.xml`.
- [ ] `robots.txt` presente e desindexando `/admin`.
