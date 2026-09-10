# Comparação das três experiências

O usuário autorizou implementar as três direções em worktrees próprias e escolher depois. Em 10 de setembro de 2026, preferiu **Sinapse líquida**, com a marca `bdm.` de Abisso no cabeçalho. Depois aprovou O Condutor e suas faíscas colecionáveis, solicitando levar essa versão à `main`. Abisso e Membrana permanecem em suas branches; o aplicativo original está preservado no histórico do Git. Os experimentos preexistentes em `previews/` continuam locais e não fazem parte da entrega.

Este documento registra a comparação inicial, anterior ao jogo. A implementação escolhida e os testes posteriores estão no [README](../README.md), na [verificação do Condutor](condutor-verification.md) e na [verificação das faíscas](sparks-verification.md); os resultados históricos abaixo não são uma nova medição da versão enviada à `main`.

| Direção | Identidade | Worktree / branch | Preview |
| --- | --- | --- | --- |
| Sinapse líquida | Filamentos condutores, prata e fósforo; o contato fecha o circuito | `/workspace/portfolio-sinapse` · `experience/sinapse` | [3101](http://10.58.210.45:3101) |
| Abisso | Organismo de prata com cavidade iluminada; quatro criaturas e um portal | `/workspace/portfolio-abisso` · `experience/abisso` | [3102](http://10.58.210.45:3102) |
| Membrana | Película de petróleo e nácar; o toque deixa marcas que cicatrizam | `/workspace/portfolio-membrana` · `experience/membrana` | [3103](http://10.58.210.45:3103) |

## Acesso pela LAN

Os servidores de produção escutam em `0.0.0.0`, com processos destacados das sessões de implementação. Na interface `enp5s0`, o endereço observado em 9 de setembro de 2026 é `10.58.210.45`:

- [Sinapse líquida](http://10.58.210.45:3101)
- [Abisso](http://10.58.210.45:3102)
- [Membrana](http://10.58.210.45:3103)

As três responderam HTTP 200 usando esse IP na própria máquina. O dispositivo visitante precisa alcançar essa rede; não foi presumido um teste físico a partir de outro aparelho. Esta máquina também anuncia `100.69.190.23` na interface Tailscale, utilizável nas mesmas portas para dispositivos autorizados nessa rede. Não foi feito deploy público nem alteração de firewall.

Use `http`, não `https`, nestes previews locais. O IP pode mudar caso a concessão de rede mude. Os comandos abaixo permitem reiniciar as aplicações após um reboot.

## Executar uma versão

Exemplo para Sinapse líquida; substitua diretório e porta pelos da tabela:

```sh
cd /workspace/portfolio-sinapse
npm ci
npm run dev -- --hostname 0.0.0.0 --port 3101
```

Para comparar builds de produção:

```sh
npm run build
npm run start -- --hostname 0.0.0.0 --port 3101
```

As worktrees têm instalações, builds e alterações independentes. Pare o servidor de desenvolvimento dessa versão antes de iniciar o de produção na mesma porta. Os READMEs de cada branch descrevem seus shaders, estrutura e controles.

## Critérios comuns de comparação

- Primeira tela: presença do organismo, legibilidade do nome e distinção entre os três materiais.
- Movimento: reação ao cursor/toque, continuidade da câmera durante a descida e transformação do mesmo mundo entre conteúdos.
- Projetos: quatro objetos com identidades próprias, detalhes dentro da experiência, abertura pelo teclado e fechamento com retorno de foco.
- Skills: nomes reais, organização espacial e acesso sem depender exclusivamente de hover.
- Contato: links reais e feedback coerente com o material; nunca simular uma mensagem enviada.
- Mobile: navegação e texto a 320–390 px, toque e controles alcançáveis.
- Sobriedade: preferência de movimento reduzido, composição editorial completa e estática.
- Robustez: texto antes do WebGL, queda de qualidade adaptativa e conteúdo acessível quando o contexto gráfico não está disponível.

## Fonte editorial

Todas usam a [arqueologia de produção](archaeology.md). A bio é a transcrição de 9 de setembro de 2026; projetos, organizações, linguagens, contatos e metadados vêm da mesma fonte. A descrição principal de pi-platform não existe no site original e não deve ser inventada.

## Verificação

Build de produção, lint e TypeScript passaram nas três alternativas. As três matrizes preservam a copy, os quatro projetos e links reais; passaram os testes de foco/Escape/retorno nos diálogos, ausência de overflow nos viewports testados, conteúdo sem JavaScript, ausência de WebGL e edição reduzida sem canvas ou animações. axe não detectou violações nas páginas/diálogo/edição reduzida testados. O teste deliberado de sobrecarga confirmou saída do tier mínimo para a edição estática, retry manual e recuperação após perda do contexto inicializado, sem erros. Isso não substitui auditoria humana completa ou aparelho físico.

Lighthouse 13.4.1, Chromium 151 headless, produção em localhost, uma execução final por perfil. WebGL usa SwiftShader: os tiers e o fallback adaptativos permanecem ativos, sem exceções para auditoria. Não se afirma qual tier permaneceu ativo durante toda a coleta.

| Alternativa | Performance desktop | Performance mobile simulada | Acessibilidade / Boas práticas / SEO, ambos | LCP desktop / mobile |
| --- | ---: | ---: | --- | --- |
| Sinapse líquida | 100 | 73 | 100 / 100 / 100 | 0,6 s / 2,4 s |
| Abisso | 65 | 69 | 100 / 100 / 100 | 0,6 s / 2,0 s |
| Membrana | 69 | 72 | 100 / 100 / 100 | 0,5 s / 2,4 s |

Todas as execuções finais terminaram sem erro ou timeout. A meta de performance mobile 90+ **não foi atingida** neste ambiente; 60 fps em notebook médio **não foi certificado**. Os resultados são sintéticos, não Core Web Vitals de visitantes. O próximo teste que depende de hardware é medir ritmo de frames em GPU integrada, Safari/iOS e Android, além do alcance físico dos controles.

A revisão independente registrou as correções S1–S3, A1–A5 e M1–M4 como resolvidas. A disposição `ship` vale para esses fixes nomeados, não para uma recertificação irrestrita da superfície inteira. A direção foi orientada pela skill distinctive-design; a revisão, correções de legibilidade/estados e persistência dos sistemas visuais seguiram impeccable.

| Alternativa | Código e estrutura | Shaders comentados | Sistema visual | Testes e limites |
| --- | --- | --- | --- | --- |
| Sinapse líquida | [README](../../portfolio-sinapse/README.md) | [GLSL](../../portfolio-sinapse/src/components/sinapse/shaders.ts) | [DESIGN](../../portfolio-sinapse/DESIGN.md) | [Verificação](../../portfolio-sinapse/docs/verification.md) |
| Abisso | [README](../../portfolio-abisso/README.md) | [GLSL](../../portfolio-abisso/src/components/abisso/shaders.ts) | [DESIGN](../../portfolio-abisso/DESIGN.md) | [Verificação](../../portfolio-abisso/docs/verification.md) |
| Membrana | [README](../../portfolio-membrana/README.md) | [GLSL](../../portfolio-membrana/src/components/membrana/shaders.ts) | [DESIGN](../../portfolio-membrana/DESIGN.md) | [Verificação](../../portfolio-membrana/docs/verification.md) |

Relatórios HTML/JSON, capturas e metadados de teste ficam em `.impeccable/review/` de cada worktree, ignorados pelo Git. A captura de uma edição estática não comprova aparência ou fluidez do material vivo; os relatórios distinguem esses estados. `DESIGN.md` e `.impeccable/design.json` documentam os sistemas efetivamente implementados. Nenhuma imagem de evidência é artwork publicado.

## Com metade do orçamento de GPU

O primeiro corte comum é DPR 1: em comparação com DPR 1,5, são 44,4% dos pixels nominais. Isso não equivale automaticamente a 55,6% menos tempo de GPU. Em seguida, reduzir passes e detalhe geométrico antes de sacrificar a resposta ao visitante ou o conteúdo.

- **Sinapse:** tier low já usa DPR 1, um simplex por vértice, menos filamentos e nenhum bloom/transmissão. Para cortar além disso, retirar o feixe secundário da bio e reduzir fibras finas, preservando os quatro nós, a câmera e o pulso.
- **Abisso:** geometria balanced, 540 partículas, menos bloom/aberração e duas lamelas internas. Manter a cavidade, a reação de contração e os quatro corpos diferentes. Se ainda necessário, retirar todos os passes de tela e reduzir o detalhe de curl.
- **Membrana:** retirar bloom, reduzir a película de 176 × 112 para 112 × 80 e então 64 × 48, desligando curl no tier mínimo. Preservar os grandes vincos, Fresnel, marcas de toque, abertura do portal e HTML.

Esses cortes já orientam os tiers de cada versão; os READMEs detalham valores e limitações. A edição estática completa é a saída final quando o orçamento não sustenta o movimento.
