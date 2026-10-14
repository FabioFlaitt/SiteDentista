# Hospedagem na Render + Auto-deploy via GitHub Actions

Esta é a receita oficial para publicar o site **sem custo**, com testes obrigatórios antes de cada deploy.

- **Frontend (Angular)** → Render Static Site (free, CDN global).
- **Backend (ASP.NET Core 8)** → Render Web Service (free; adormece após 15 min sem tráfego).
- **PostgreSQL 16** → Render PostgreSQL (free 90 dias; depois migrar para Neon ou Supabase).
- **CI/CD** → GitHub Actions roda build+testes; se tudo passar, dispara Deploy Hooks na Render.

> O workflow está em [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) e o Blueprint em [`render.yaml`](../render.yaml).

---

## Passo 1 — Push para o GitHub

```bash
git add .
git commit -m "feat: inicializa site Dra. Bruna Molina"
git push origin main
```

## Passo 2 — Criar os serviços na Render via Blueprint

1. Acesse https://dashboard.render.com → **New +** → **Blueprint**.
2. Conecte o repositório `SiteDentista`.
3. A Render lê o `render.yaml` e cria 3 recursos:
   - `brunamolina-frontend` (Static Site)
   - `brunamolina-api` (Web Service, .NET)
   - `brunamolina-pg` (PostgreSQL)
4. Confirme a criação.

Os cross-refs (connection string → API, URL do backend → frontend) são preenchidos automaticamente pela Render.

## Passo 3 — Desligar Auto-Deploy em cada serviço

Para que **somente** o GitHub Actions dispare deploys depois da CI verde:

Em cada serviço (`brunamolina-frontend` e `brunamolina-api`):

- Settings → **Auto-Deploy** → mudar para **No**.
- Settings → **Deploy Hook** → copiar a URL única.

Guarde as duas URLs.

## Passo 4 — Primeiro deploy manual (semear admin)

Antes do primeiro deploy, vá em `brunamolina-api` → **Environment** e defina:

| Chave | Valor |
|---|---|
| `AdminSeed__Enabled` | `true` |
| `AdminSeed__Email` | o e-mail da administradora |
| `AdminSeed__Password` | uma senha forte temporária |

Clique **Manual Deploy** → **Deploy latest commit**. Isso aplica as migrations e cria o usuário admin na primeira execução.

**Depois do primeiro deploy bem-sucedido**, volte em Environment e mude `AdminSeed__Enabled` para `false` (e remova a senha). Clique **Save** (não precisa redeploy; a próxima inicialização ignora o seed).

Teste o login em `https://<frontend>.onrender.com/admin/login` e **troque a senha** imediatamente (quando houver tela de troca de senha; por enquanto, isso é feito direto no banco).

## Passo 5 — Configurar segredos no GitHub

Em `Settings → Secrets and variables → Actions` do repositório:

### Secrets (New repository secret)

| Nome | Valor |
|---|---|
| `RENDER_FRONTEND_DEPLOY_HOOK` | URL copiada em Passo 3 (frontend) |
| `RENDER_BACKEND_DEPLOY_HOOK` | URL copiada em Passo 3 (backend) |

### Variables (Variables tab)

| Nome | Valor |
|---|---|
| `FRONTEND_URL` | `https://brunamolina-frontend.onrender.com` (ou seu domínio) |
| `BACKEND_URL` | `https://brunamolina-api.onrender.com` |

A `BACKEND_URL` é usada pelo health-check pós-deploy para confirmar que o serviço subiu.

## Passo 6 — Testar o pipeline

Faça um commit qualquer na `main`:

```bash
git commit --allow-empty -m "chore: trigger deploy"
git push
```

- Actions → o workflow **Build & Deploy** roda os jobs `frontend` + `backend`.
- Se os dois passam, dispara os jobs `deploy-frontend` + `deploy-backend` em paralelo (só os que tiveram mudanças).
- O deploy do backend aguarda `/api/health` responder 200 por até 10 minutos.

Pronto. Qualquer push na `main` que passar nos testes publica automaticamente.

---

## Observações sobre o plano Free

### Sleep do backend (15 min)

Depois de 15 min sem requisições, o Web Service free da Render adormece. A primeira requisição depois disso leva ~30 s para acordar. Para um site institucional de clínica isso é aceitável — mas a página inicial, por ser estática na Render, carrega sempre instantaneamente. Só chamadas à API (login admin, formulários, analytics) sofrem o cold start.

Para evitar o sleep: upgrade do Web Service para **Starter US$ 7/mês** ou use um "pinger" (UptimeRobot gratuito tocando `/api/health` a cada 5 min) — tecnicamente contra os termos da Render, mas comum.

### PostgreSQL após 90 dias

Opções grátis-pra-sempre:

- **Neon** (https://neon.tech) — 3 GB, autoscaling, integração git-branching. **Recomendado.**
- **Supabase** (https://supabase.com) — 500 MB, inclui painel SQL e auth.

Para migrar: criar o banco no provedor novo, exportar `pg_dump` do Render, importar no destino, trocar o env `ConnectionStrings__Default` no Web Service. Nenhuma mudança de código.

---

## Alternativa: Vercel (frontend) + Render (backend) + Neon (DB)

Mesma estrutura, mas o frontend sai da Render e vai pra Vercel (DX melhor para Angular, deploy em segundos, zero sleep). Mudanças necessárias:

1. Importar o repositório na Vercel; root = `frontend/`. O `vercel.json` já está configurado.
2. Remover o serviço `brunamolina-frontend` do `render.yaml`.
3. No workflow `deploy.yml`, trocar o passo `deploy-frontend` por `vercel --prod --token=$VERCEL_TOKEN` (ou usar o auto-deploy da Vercel direto do GitHub, sem GitHub Actions).

Não é mais complexo, só adiciona uma plataforma. Fique com a Render só se preferir um único painel.
