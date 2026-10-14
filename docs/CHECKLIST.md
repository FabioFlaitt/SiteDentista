# Checklist final de validação

Marque cada item antes de considerar o projeto pronto para a Dra. Bruna revisar.

## Dados oficiais

- [ ] CRO-SP 145594 aparece em: navbar (abaixo do nome), hero, sobre, footer.
- [ ] WhatsApp `(16) 99750-2033` abre em `wa.me/5516997502033` com mensagem pré-preenchida.
- [ ] Instagram `@drabrunamolina` com link funcional.
- [ ] Linktree `linktr.ee/drabrunamolina` presente no footer e no formulário de contato.
- [ ] Endereço completo (R. Voluntários da Pátria, 2411 — Jardim Nova America, Araraquara/SP, 14801-320) usado no mapa e no botão de rota.
- [ ] Nenhum campo biográfico ou especialização inventado. Todos os TODO marcados aguardam confirmação.

## Site público

- [ ] Mobile-first validado em 360px, 414px, 768px, 1024px, 1440px.
- [ ] Navbar sticky, menu mobile funcional.
- [ ] Skip link (acessibilidade) presente.
- [ ] Botão flutuante do WhatsApp em todas as páginas públicas sem encobrir o conteúdo.
- [ ] Página 404 personalizada.
- [ ] Sitemap `/sitemap.xml` acessível.
- [ ] `robots.txt` desindexa `/admin`.
- [ ] Open Graph com título, descrição e URL por rota.
- [ ] Canonical URL atualizado por rota.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Contraste texto/fundo validado (WCAG AA mínimo).
- [ ] Navegação por teclado em todos os botões e links.
- [ ] Nenhuma afirmação de atendimento 24h, Invisalign ou especialização sem confirmação.

## Painel administrativo

- [ ] Rota `/admin/dashboard` responde 401 se não autenticado.
- [ ] Login funcional com cookie HttpOnly SameSite=Lax.
- [ ] Logout limpa a sessão.
- [ ] Dashboard, Tráfego, Localizações e Cliques WhatsApp carregam.
- [ ] Selo "Dados de demonstração" visível quando `isMock=true`.
- [ ] Em produção, nenhum selo de mock aparece.
- [ ] Botão de sair presente.
- [ ] Filtro de período afeta todos os cards/gráficos/tabelas.

## Backend

- [ ] `GET /api/health` responde 200.
- [ ] Swagger disponível em desenvolvimento (`/swagger`).
- [ ] CORS limitado às origens configuradas.
- [ ] Rate limit em `/api/analytics/events` e `/api/auth/login`.
- [ ] Senhas armazenadas via Identity (hash PBKDF2).
- [ ] Nenhum segredo no repositório.
- [ ] `appsettings.Development.json` sem senha real.
- [ ] Testes unitários e de integração passando (`dotnet test`).

## Infraestrutura

- [ ] CI frontend verde (lint + build).
- [ ] CI backend verde (build + testes).
- [ ] Deploy frontend configurado na Vercel.
- [ ] Deploy backend configurado em host .NET-compatível.
- [ ] PostgreSQL com migrations aplicadas.
- [ ] Backup automatizado do banco (configurado no provedor).
- [ ] Logs do backend acessíveis.

## Pendências para a profissional

- [ ] Validar biografia definitiva.
- [ ] Validar lista final de serviços oferecidos.
- [ ] Fornecer fotografia profissional autorizada.
- [ ] Confirmar horários de funcionamento.
- [ ] Confirmar informações sobre estacionamento/acessibilidade.
- [ ] Trocar senha semeada do admin após primeiro login.
