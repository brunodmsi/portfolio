# Verificação — Sinapse líquida

9 de setembro de 2026. Build de produção da branch `experience/sinapse`, servido em `0.0.0.0:3101`. [Abrir pela LAN](http://10.58.210.45:3101).

## Resultado funcional

- Build Next, lint, TypeScript e `git diff --check`: passaram. `npm audit --omit=dev`: zero vulnerabilidades encontradas.
- Bio, nome, posicionamento, quatro projetos, organizações, linguagens e destinos reais preservados. Conteúdo essencial disponível também sem JavaScript; nenhuma descrição inventada para pi-platform.
- Quatro diálogos: abertura, foco inicial interno, Shift+Tab contido, Escape e retorno ao acionador passaram. Buggy também foi aberto por toque a 390 × 844; não houve overflow interno.
- Sem overflow horizontal a 320, 390, 768 e 1440 px. Navegação móvel e controles foram medidos no navegador; alcance físico do polegar não foi certificado.
- axe com WCAG 2 A/AA e 2.1 A/AA: zero violações detectadas na página, no diálogo testado e na edição com movimento reduzido. Isso não substitui uma auditoria humana completa de acessibilidade.
- `prefers-reduced-motion`: zero canvases e zero animações em execução, com conteúdo completo. Sem WebGL: edição estática sem erros. Nenhum erro de página ou de console na travessia comum.

## Recuperação sob falha

Uma injeção deliberada de bloqueio de 110 ms por animation frame, usando WebGL por software, acionou `still-budget` em **1.441 ms**. O canvas foi desmontado e restaram zero animações. `Retry motion` remontou o canvas e chegou a `ready`; a perda provocada do contexto já inicializado retornou ao estado estático, sem erros. Trata-se de um teste de falha, não de uma medição de fps.

O probe de perda de contexto espera o sinal `ready`: acessar um canvas antes de o R3F inicializá-lo criaria um contexto concorrente e não representaria a perda do contexto do aplicativo.

## Lighthouse

Lighthouse 13.4.1, Chromium 151 headless, build de produção, localhost; uma execução desktop e uma mobile com os perfis padrão. O host usa SwiftShader, não uma GPU representativa de notebook/celular. A aplicação mantém seu comportamento adaptativo normal, sem exceções para auditorias.

| Medida | Desktop | Mobile simulado |
| --- | ---: | ---: |
| Performance | 100 | 73 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0,2 s | 0,8 s |
| LCP | 0,6 s | 2,4 s |
| Total Blocking Time | 20 ms | 1.390 ms |
| CLS | 0 | 0 |

As duas execuções terminaram sem erro ou timeout. O Lighthouse fechou sua página antes do probe adicional de estado; portanto não se afirma qual tier permaneceu ativo durante toda a auditoria. O relatório contém seu próprio filme de carregamento. Estes números são sintéticos, não dados de visitantes nem comprovação de 60 fps. A meta de performance mobile 90+ **não foi atingida** neste ambiente.

## Revisão e evidência

A [revisão independente](finish-review.md) foi seguida por um [verdict](finish-verdict.md) que marcou **S1–S3 resolved**, com disposição `ship` estritamente para esses ajustes. Não é uma recertificação da superfície inteira ou da fluidez em hardware real.

As capturas desktop 1440 × 900 e mobile 390 × 844, `verification.json`, `robustness.json` e relatórios HTML/JSON do Lighthouse estão em `.impeccable/review/`, ignorado pelo Git por serem evidência local, não assets publicados. Nenhuma mensagem de contato foi enviada, nenhum serviço externo foi configurado e não houve deploy público.

Ainda requer aparelho real: frame pacing em GPU integrada, Safari/iOS, Android, resposta ao gesto e alcance físico. A primeira redução para metade do orçamento está documentada no [README](../README.md): tier low, DPR 1, sem bloom/transmissão e shader de um simplex por vértice.
