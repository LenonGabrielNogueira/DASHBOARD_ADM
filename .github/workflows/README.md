# Workflow CI — revisado localmente, execução remota pendente

`ci.yml` foi criado no escopo ampliado de **T1.2**, conforme autorização do usuário. Node 24; job `quality` com `npm ci`, lint, typecheck da aplicação/tooling, Vitest e build. Job `e2e` separado, após quality, instala Chromium e valida a página pública contra o build de produção. Não usa secrets ou banco e desativa geração automática Prisma no postinstall. A instalação de pacotes/navegador exige rede; as suítes não dependem de serviços externos.

O workflow ainda não foi executado no GitHub. Os checks locais, o dry-run de `npm ci` e suas limitações estão no README da raiz. T1.3 preserva a revisão da CI sem exigir uma implementação duplicada. Artefatos de teste não são publicados pelo workflow e permanecem ignorados localmente.

T1.2.1 repetiu com sucesso lint, typecheck, quatro testes Vitest, build e dois testes Chromium e registrou a infraestrutura em `e631a49`. O Playwright iniciou e encerrou o servidor local de produção. A aprovação local não substitui a execução dos jobs Linux com Node 24 e instalação limpa de pacotes/Chromium no GitHub Actions. Não houve push ou disparo remoto nesta tarefa.
