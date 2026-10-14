# Analytics — Site Dra. Bruna Molina

Como coletamos, exibimos e separamos **dados reais** de **dados simulados**.

---

## 1. Princípios

1. **Nunca misturar silenciosamente mocks com produção.** Toda resposta de dashboard carrega a flag `isMock` (`true`/`false`). A UI exibe o selo "Dados de demonstração" sempre que `isMock=true`.
2. **Nenhum dado pessoal identificável (PII)** é persistido pelos eventos. IP completo não é guardado — apenas um hash parcial do user-agent (16 bytes) para deduplicação diária.
3. **Clique no WhatsApp ≠ agendamento confirmado.** O dashboard explica isso em todas as páginas.
4. **LGPD**: um aviso de cookies pode ser adicionado quando a profissional confirmar a necessidade; hoje nenhum cookie além do de autenticação administrativa é definido.

---

## 2. Fonte dos dados

Duas fontes complementares:

### 2.1 Backend próprio (fonte oficial do dashboard)

- Rota pública `POST /api/analytics/events` recebe o payload do SPA.
- O backend infere país/região/cidade a partir de headers do CDN:
  - **Vercel**: `X-Vercel-IP-Country`, `X-Vercel-IP-Country-Region`, `X-Vercel-IP-City`.
  - **Cloudflare**: `CF-IPCountry`, `CF-Region`, `CF-IPCity`.
- Payload é validado por `AnalyticsEventValidator`, inserido na tabela `analytics_events`.
- Rate limit de 60 requisições/minuto por chamador (fixed window) via `AddRateLimiter`.
- Endpoints administrativos (`/api/admin/analytics/*`) consultam a mesma tabela.

### 2.2 Vercel Web Analytics (opcional, complementar)

A Vercel oferece analytics agregados no próprio painel da plataforma, úteis para:

- Pageviews totais.
- Top paths.
- Core Web Vitals.
- Países/dispositivos (agregados).

**Limitação**: a Vercel **não oferece API pública completa** para exportar granularidade de eventos personalizados ao dashboard próprio. O painel próprio continua sendo a fonte de verdade das métricas custom (WhatsApp clicks, serviços de interesse).

### 2.3 Como habilitar o Vercel Web Analytics

1. No painel da Vercel, abra o projeto → aba *Analytics* → ative.
2. No frontend, instale (opcional) o pacote `@vercel/analytics`:
   ```bash
   npm i @vercel/analytics
   ```
3. Adicione o script no `index.html` (ou via um service Angular). Exemplo mínimo:
   ```html
   <script defer src="/_vercel/insights/script.js"></script>
   ```
   A Vercel injeta esse endpoint automaticamente em deployments. Alternativamente, importe no `main.ts`:
   ```ts
   import { inject } from '@vercel/analytics';
   if (environment.enableVercelAnalytics) inject();
   ```
4. Para eventos custom, use `track('whatsapp_click', { path })` do próprio `@vercel/analytics` — isso **complementa** o backend; o painel próprio continua recebendo via `/api/analytics/events`.

### 2.4 Alternativas

Se precisar de granularidade e portabilidade dos dados sem backend próprio:

- **Plausible** (self-host ou cloud): API aberta, LGPD-friendly.
- **Umami** (self-host).
- **PostHog**: eventos custom + feature flags.

A camada `AdminAnalyticsService` no frontend é um ponto único: trocar a fonte é mudar o `environment.useMockAdminData` ou substituir chamadas HTTP, sem reescrever componentes.

---

## 3. Fluxo de clique no WhatsApp

1. Usuário clica em qualquer botão de WhatsApp (navbar, hero, cards de serviço, FAB, formulário).
2. `WhatsAppService.track()` registra o evento com deduplicação de 1,5s (evita cliques repetidos).
3. O browser abre o link `wa.me/<numero>` com a mensagem pré-preenchida.
4. Backend grava `AnalyticsEvent { Type = WhatsAppClick }`.

**Observação**: um clique registra apenas intenção. Ele **não** confirma que o paciente iniciou conversa real nem que agendou.

---

## 4. Diferenciação visual mock vs real

- Componente `app-mock-badge` acima de cada seção quando `isMock=true`.
- Em produção, `environment.useMockAdminData` deve ser `false`. Isso **nunca** é alternável pelo usuário final — é configuração de build.
- Mocks residem em `frontend/src/app/features/admin/mocks/admin-mocks.ts`. Dados que faltam na API retornam array vazio e a UI mostra "Dados indisponíveis" (não mocks).

---

## 5. Validação de eventos

Em desenvolvimento:

```bash
curl -X POST http://localhost:5080/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{"type":"whatsapp_click","path":"/","device":"mobile"}'
# → 202 Accepted
```

Checar no banco:

```sql
SELECT type, path, country, occurred_at
FROM analytics_events
ORDER BY occurred_at DESC
LIMIT 20;
```

---

## 6. Limitações declaradas

- Precisão geográfica depende do CDN. Sem Vercel/Cloudflare na frente, a tabela de localizações volta vazia.
- Deduplicação é best-effort (hash de UA + janela de 1,5s). Mesmo usuário em dois dispositivos conta como dois.
- Comparação com período anterior (`previousPeriodVisits`) só é calculada quando o banco tem dados suficientes; na implementação atual do serviço real, `ComparisonAvailable=false` até refinamento.
- Vercel Web Analytics não permite leitura programática completa dos dados; não substitui o backend próprio para fins de dashboard customizado.
