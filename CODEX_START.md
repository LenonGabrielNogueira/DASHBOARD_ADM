# Prompt de entrada para o Codex

Copie o texto abaixo no Codex **com o repositório `DASH-ADMIN/BASE-DASH-001` aberto**. Se o projeto estiver em outro diretório, use o diretório real. Este prompt apenas audita: não autoriza implementação.

---

Você está atuando como engenheiro de software no projeto Dashboard ADM.

Leia `AGENTS.md`, `README.md`, `TASKS.md`, `docs/ARCHITECTURE.md`, `docs/FILE_TREE.md`, `docs/DATA_MODEL.md` e `docs/DECISIONS.md` (somente os que existirem). Preserve os documentos reais do repositório e identifique divergências com os de planejamento.

**Tarefa autorizada: T0.1 — auditoria, sem editar código ou arquivos.**

1. Mostre o estado do Git (status, branch e alterações locais), sem descartar alterações.
2. Examine a árvore atual, `package.json`, os scripts, versões instaladas, Next.js, React, TypeScript, Tailwind, Prisma, Clerk, Recharts, Vitest, `src/app` e configuração do banco.
3. Não leia nem mostre conteúdo de `.env*`; informe somente se variáveis esperadas estão documentadas em `.env.example`.
4. Execute comandos de verificação seguros e existentes (`npm run lint`, `npm run typecheck`, `npm run build`, `npm test`) quando aplicáveis; não execute migrações/seed, não conecte à produção, não instale pacotes e não faça commits.
5. Identifique se `npm test` apresenta erro por falta de `vitest` ou por outra causa, com evidência.
6. Compare a estrutura atual com a árvore alvo do `docs/FILE_TREE.md`. Não crie pastas vazias por convenção.
7. Entregue um relatório: estado atual, divergências, riscos, resultado de cada check e plano mínimo proposto para T0.2/T1.1.

**Restrições:** não alterar schema, CSS, autenticação existente, dependências, dados ou configurações sem aprovação. Não implementar tarefas seguintes. Aguarde minha revisão após o relatório.
