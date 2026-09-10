# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Portfólio pessoal de Bruno De Masi, publicado em https://demasi.dev (redireciona para https://www.demasi.dev/). A solicitação atual é reconstruí-lo como uma experiência WebGL viva, mantendo a copy e os dados reais. Sucesso desejado pelo usuário: despertar exploração, revisita durante o scroll e compartilhamento espontâneo.

## Users

Visitantes do portfólio em desktop e dispositivos móveis. Público prioritário de contratação, colaboração ou clientes ainda não especificado; não presumir uma mudança de posicionamento.

## Capabilities and Constraints

- Arqueologia e três direções verbais entregues. Em seguida, o usuário autorizou implementar as três direções completas, cada uma em sua própria worktree, para escolher depois de experimentá-las.
- Implementações em worktrees independentes: Next.js App Router, TypeScript, React Three Fiber, drei, postprocessing, shaders GLSL próprios e Lenis. Tailwind apenas para layout e UI 2D.
- Jornada solicitada: Superfície (hero), Corrente (sobre), Recife (projetos), Espectro (stack), Portal (contato).
- Projetos devem abrir detalhes dentro da experiência. O site atual oferece descrições curtas e links externos, sem cases internos completos; não inventar narrativa, resultados, clientes ou responsabilidades.
- Meta de 60 fps em notebook médio, redução adaptativa de efeitos e complexidade, e Lighthouse 90+ com atenção especial à performance. Resultados sintéticos e limites de validação devem permanecer em docs/verification.md de cada alternativa; não equivalem a medições em aparelho físico.
- A entrega inclui estrutura de pastas, shaders comentados, código completo e análise dos cortes para metade do orçamento de performance nos READMEs de cada alternativa, além de previews de produção acessíveis pela LAN.

## Brand Commitments

- Manter o nome e a copy real em inglês; não traduzir nem gerar nova bio sem solicitação.
- Derivar a paleta da identidade publicada: preto quase absoluto e verde, levando-a à iridescência.
- Organismo que respira, percebe o visitante e se reorganiza com a profundidade; câmera contínua, cursor com inércia, grotesca variável de grande escala e mono técnica pequena.
- Sinapse líquida, Abisso e Membrana foram implementadas em worktrees separadas para comparação. Em 10 de setembro de 2026, o usuário preferiu Sinapse líquida e pediu nela a marca `bdm.` de Abisso. Sinapse é a direção escolhida para os próximos refinamentos; as outras alternativas e o aplicativo original permanecem preservados.

## Evidence on Hand

- Inspeção de produção em 9 de setembro de 2026: HTML, CSS computado, metadados, links, hover de projetos e endpoint de insights; capturas desktop escuro/claro e viewport móvel de 390 px.
- Inventário integral e limites das fontes em docs/archaeology.md.
- Código existente em src/app e src/components; dados do GitHub e geração opcional de bio em src/lib/github.ts.
- A bio e os insights do site existente podem ser gerados por IA; a arqueologia registra o que foi servido, sem tratar essas frases como novas afirmações verificadas.
- previews/ contém experimentos preexistentes do usuário. Não representa aprovação da reconstrução pedida nesta conversa.

## Accessibility & Inclusion

Semântica HTML, texto legível, contraste real, foco visível e navegação por teclado. Nenhum conteúdo essencial dependente de hover ou WebGL. Mobile com interação ao alcance do polegar. prefers-reduced-motion deve oferecer uma versão estática editorial completa, mantendo a identidade. Loader narrativo sem bloquear a leitura do conteúdo.
