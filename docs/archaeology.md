# Arqueologia de demasi.dev

Inspeção: 9 de setembro de 2026, aproximadamente 19:34 UTC.

## Escopo e fontes

Página efetivamente aberta no navegador: [https://www.demasi.dev/](https://www.demasi.dev/), HTTP 200. O domínio [demasi.dev](https://demasi.dev/) redireciona para www.

Foram lidos o documento completo, os metadados, o CSS publicado, os links, os campos e estados previstos do formulário, os tooltips e os insights dos projetos. Foram inspecionados o desktop escuro e claro e o viewport móvel de 390 × 844. A captura mobile verifica o layout estreito; não equivale a teste físico de alcance do polegar. O formulário não foi enviado.

O [sitemap publicado](https://www.demasi.dev/sitemap.xml) lista apenas a raiz; os links da página não apontam para outras páginas internas. Os projetos abrem destinos externos. [robots.txt](https://www.demasi.dev/robots.txt) também foi lido. O código do workspace complementa as informações de estados e integrações que não se devem testar enviando mensagens.

Uma primeira leitura via ferramenta de busca retornou dados anteriores (5.503 commits, três organizações e outra bio). Esses valores foram descartados em favor da inspeção direta de produção documentada abaixo. Todos os contadores e textos dinâmicos são um retrato da visita, não constantes a perpetuar.

Capturas da sessão: [desktop escuro](/tmp/demasi-archaeology-jZrEFj/desktop-dark.png), [desktop claro](/tmp/demasi-archaeology-jZrEFj/desktop-light.png), [mobile escuro](/tmp/demasi-archaeology-jZrEFj/mobile-dark.png).

## 1. Copy principal, transcrição literal

Idioma publicado: inglês; `<html lang="en">`.

### Identidade

Nome:

> Bruno De Masi

Bio visível:

> I'm Bruno De Masi, a software engineer specializing in diverse languages like Rust and TypeScript. I enjoy crafting tools that streamline workflows, like my CLI for managing git worktrees.

Título do documento, Open Graph e Twitter:

> Bruno De Masi — Senior Software Engineer

Descrição SEO, Open Graph e Twitter:

> Senior software engineer from Belém, Brazil. MSc in Software Architecture, building with TypeScript, Rust, Web3, and cloud-native infrastructure.

Os metadados dizem “Belém” e “MSc in Software Architecture”; os blocos visíveis dizem “Brazil” e “Computer Science”. São textos existentes em contextos diferentes. A arqueologia não acrescenta nem valida uma nova qualificação.

Dados estruturados: tipo Person; jobTitle “Senior Software Engineer”; knowsAbout: TypeScript, JavaScript, Rust, Python, Web3. Avatar: [imagem usada pelo site](https://avatars.githubusercontent.com/u/26263398?v=4).

### Blocos e contadores

| Copy literal | Contexto |
| --- | --- |
| `7,600` + `commits` | Contador agregado do GitHub |
| `99` + `repositories` | Repositórios públicos |
| `Brazil` | Localização visível |
| `Computer Science` | Formação visível |
| `Web3` + `5 projects` | Classificação de repositórios |
| `12` + `languages` | Linguagens dos repositórios próprios |
| `organizations` | Rótulo, renderizado em maiúsculas |
| `2,821 contributions` | Cabeçalho do calendário |
| `peak: 204 on Thu, Sep 3` | Pico do calendário mostrado |
| `Jun`, `Jul`, `Aug`, `Sep` | Meses mostrados |
| `Mon`, `Wed`, `Fri` | Rótulos de dias |
| `get in touch` | Rótulo, renderizado em maiúsculas |

Tooltip do calendário no componente: `{n} contribution — {dia da semana}, {mês} {dia}` no singular; `{n} contributions — {dia da semana}, {mês} {dia}` nos demais casos. Os valores e datas vêm de cada célula. Não são medidas de proficiência ou impacto comercial.

### Stack e skills explicitamente presentes

Tooltip “languages”, na ordem publicada:

C, C#, HTML, Java, JavaScript, Lua, Nix, PHP, Python, Rust, Shell, TypeScript.

A bio destaca Rust e TypeScript. A descrição SEO acrescenta Web3 e “cloud-native infrastructure”. Os dados estruturados acrescentam o agrupamento TypeScript, JavaScript, Rust, Python, Web3.

A lista é derivada da linguagem principal dos repositórios não-fork. Não há uma matriz editorial de frameworks e ferramentas nem níveis declarados de domínio. Docker, Kubernetes, Redis, PostgreSQL, Hardhat e outros nomes nos logs decorativos não devem virar novas skills pessoais por inferência.

### Organizações e links

- [show-karma](https://github.com/show-karma)
- [WormLayer](https://github.com/WormLayer)
- [orqbase](https://github.com/orqbase)
- [The-RFP-Hub](https://github.com/The-RFP-Hub)

A seção declara associação visual por listagem de organizações. Ela não declara cargo, vínculo empregatício, cliente ou tempo de participação.

### Projetos

| Nome literal | Rótulo | Descrição literal | Destino |
| --- | --- | --- | --- |
| Buggy | TypeScript | Bug tracking platform with built-in exception catcher to auto-open issues and allow developers to work with it | [GitHub](https://github.com/brunodmsi/Buggy) |
| wt | Shell | CLI tool for managing git worktrees with tmux integration, automatic port allocation, and per-project setup automation | [GitHub](https://github.com/brunodmsi/wt) |
| pi-platform | TypeScript | Não há descrição no card. | [GitHub](https://github.com/brunodmsi/pi-platform) |
| Flight Tracker | Travel | Real-time flight tracking and travel planning tool | [iastravel.com](https://iastravel.com/) |

As quatro entradas não são quatro cases publicados. Não há textos de problema, papel do autor, processo, resultados, datas ou imagens de produto na página. “Travel” é categoria, não uma linguagem.

Buggy, wt e pi-platform são os três repositórios selecionados dinamicamente por contagem de commits no código atual; Flight Tracker é uma entrada fixa.

### Links sociais

- [GitHub](https://github.com/brunodmsi)
- [LinkedIn](https://linkedin.com/in/brunodemasi)
- [Twitter](https://twitter.com/brunodmsi)

O rótulo publicado é “Twitter”; não foi renomeado para “X” nesta transcrição. Todos os links de projetos, organizações e redes abrem outra aba.

## 2. Copy dinâmica de hover

O código atual pode gerar bio e insights por IA. Isto explica a variabilidade; transcrever um insight servido não o transforma em comprovação independente das características do projeto.

A bio acima foi conferida tanto no navegador quanto em uma requisição HTTP direta. Para a reconstrução, manter essa copy como fonte editorial estável é compatível com “o texto é meu”; não criar novas versões automaticamente.

Rótulo transitório: `analyzing...`.

### Buggy

Tags retornadas em produção: `bug tracking`, `open source`, `exception handling`.

> Buggy is a bug tracking platform that automatically opens issues through an integrated exception catcher. Its most interesting technical aspect is the seamless integration of error handling with issue management for developers.

Fonte: hover do card, resposta HTTP 200 de [repo-insight?repo=Buggy](https://www.demasi.dev/api/repo-insight?repo=Buggy).

### wt

Tags retornadas em produção: `CLI tool`, `DevOps`, `open source`.

O texto contém backticks literais ao redor de wt:

```text
`wt` is a CLI tool that simplifies managing git worktrees with features like tmux integration and automatic port allocation. Its most interesting technical aspect is the ability to automate project setup and service management within tmux sessions.
```

Fonte: hover do card, resposta HTTP 200 de [repo-insight?repo=wt](https://www.demasi.dev/api/repo-insight?repo=wt).

### pi-platform

O hover não trouxe texto durante a janela de observação. A consulta direta ao endpoint existente retornou:

Tags: `API`, `TypeScript`, `open source`.

> The pi-platform is a TypeScript-based application designed for managing and integrating various APIs. Its most interesting technical aspect is the use of advanced TypeScript features for type safety and API interaction.

Fonte: [repo-insight?repo=pi-platform](https://www.demasi.dev/api/repo-insight?repo=pi-platform). A descrição principal do card continua vazia. Esse insight automático e genérico não deve ser usado para inventar um case ou substituir silenciosamente a descrição ausente.

Flight Tracker não possui esse componente de insight.

## 3. Contato e microcopy

### Interface pública

- Rótulo: `get in touch`.
- Nome, opcional: `// name`.
- E-mail, obrigatório: `// email *`.
- Mensagem, obrigatória: `// message *`.
- Botão inicial: `send`.
- Estado pendente: `transmitting...`.
- Botão após sucesso: `sent`.
- Mensagem após sucesso: `message transmitted successfully.`.

Os textos de estados foram conferidos no [bundle público do formulário](https://www.demasi.dev/_next/static/chunks/9ae8fae526ff4b2d.js) e no componente local. Não houve envio de formulário, portanto a entrega real de e-mail não foi testada.

Não há link público `mailto:` no DOM. Há um formulário e os três links sociais.

### Mensagens do servidor no código local

Transcrição de `src/app/actions.ts`; não foram provocadas em produção:

- `Email and message are required.`
- `Invalid email address.`
- `Message too long.`
- `Name too long.`
- `Please complete the captcha.`
- `Captcha verification failed.`
- `Failed to send message.`

Integração local: Cloudflare Turnstile e Resend. Destinatário configurado: `bruno@demasi.dev`; remetente: `Portfolio <portfolio@demasi.dev>`. Esses endereços vêm do código do servidor, não de um contato exposto na página. Não se presume que as credenciais ou a entrega estejam operacionais em produção.

Copy do e-mail no código: assunto `Portfolio contact from {name || "Anonymous"}`; corpo inicia com `From: {name || "Anonymous"} <{email}>`, seguido da mensagem.

### Controle de tema

Rótulos acessíveis existentes:

- `Switch to light mode`
- `Switch to dark mode`

O controle fica fixo no canto inferior direito e usa preferência salva, ou a preferência de cor do sistema quando não existe escolha salva.

## 4. Arquitetura de informação atual

Uma página, sem navegação global, sem seções ancoradas e sem páginas internas de case:

1. Avatar, nome e bio.
2. Contadores de commits e repositórios.
3. Localização, formação, Web3 e linguagens.
4. Organizações.
5. Três projetos do GitHub e Flight Tracker.
6. Calendário de contribuições.
7. Links sociais.
8. Formulário de contato.
9. Controle flutuante de tema, transversal à página.

Composição: grade compacta de cards, largura máxima de 896 px, quatro colunas em desktop e duas abaixo do breakpoint de 1024 px. Perfil e projetos ocupam duas colunas; organizações e contato ocupam toda a largura disponível. Em mobile, os projetos ficam um abaixo do outro.

Semântica observada: um `main`, um `h1` e quatro `h3`; não há `h2`, `section`, `article`, `nav` ou `footer` nessa hierarquia. O formulário tem campos HTML nativos, mas usa placeholders em vez de labels explícitos.

Interações existentes: entrada em fade, elevação de cards, expansão de insights ao passar o mouse, tooltip de linguagens, tooltip por dia de contribuição, troca de tema, fundo que reage ao mouse e scroll. Não há canvas/WebGL no portfólio publicado inspecionado.

## 5. Paleta existente

Valores principais verificados no CSS computado publicado; RGBA preservado abaixo conforme o código-fonte:

| Papel | Escuro | Claro |
| --- | --- | --- |
| Fundo | #050505 | #f5f5f0 |
| Texto base | #f0f0f0 | #1a1a1a |
| Texto principal | #ffffff | #111111 |
| Texto secundário | #b0b8c4 | #4b5563 |
| Texto muted | #9ca3af | #6b7280 |
| Acento | #22c55e | #16a34a |
| Cards | rgba(10, 10, 10, 0.82) | rgba(255, 255, 255, 0.75) |
| Placeholder | #555555 | #999999 |

Acentos efetivamente visíveis nos projetos: TypeScript #3178c6 e Shell #89e051. Glitches do fundo: vermelho #ff143c e ciano #00ffc8, ambos com alpha 0,04. Calendário usa o verde do tema com intensidades de 20%, 40%, 65% e 90%; células vazias usam a borda do card.

A família cromática existente é preto, verde e cinzas; o ciano já aparece discretamente no fundo. Ela oferece uma origem concreta para a iridescência pedida.

### Tokens completos dos dois temas

Transcrição do CSS local, cujos valores centrais foram confrontados com o CSS servido em produção. No bundle publicado, valores RGBA também aparecem como hexadecimal de oito dígitos.

```css
:root,
[data-theme="dark"] {
  --background: #050505;
  --foreground: #f0f0f0;
  --card: rgba(10, 10, 10, 0.82);
  --card-border: rgba(34, 197, 94, 0.08);
  --card-border-hover: rgba(34, 197, 94, 0.22);
  --muted: #9ca3af;
  --accent: #22c55e;
  --accent-dim: rgba(34, 197, 94, 0.08);
  --accent-glow: rgba(34, 197, 94, 0.04);
  --text-primary: #ffffff;
  --text-secondary: #b0b8c4;
  --input-bg: rgba(5, 5, 5, 0.7);
  --input-border: rgba(34, 197, 94, 0.1);
  --input-border-focus: rgba(34, 197, 94, 0.35);
  --input-placeholder: #555;
  --btn-bg: rgba(34, 197, 94, 0.1);
  --btn-border: rgba(34, 197, 94, 0.25);
  --btn-bg-hover: rgba(34, 197, 94, 0.18);
  --btn-border-hover: rgba(34, 197, 94, 0.4);
  --shadow-card: 0 0 20px rgba(34, 197, 94, 0.03), 0 8px 32px rgba(0, 0, 0, 0.3);
  --bracket-opacity: 0.15;
  --bracket-hover-opacity: 0.45;
  --bg-effects-opacity: 1;
  --vignette-opacity: 1;
  --scanline-color: rgba(0, 0, 0, 0.02);
  --scanline-opacity: 1;
  --scrollbar: rgba(34, 197, 94, 0.15);
  --scrollbar-hover: rgba(34, 197, 94, 0.3);
}

[data-theme="light"] {
  --background: #f5f5f0;
  --foreground: #1a1a1a;
  --card: rgba(255, 255, 255, 0.75);
  --card-border: rgba(34, 197, 94, 0.1);
  --card-border-hover: rgba(34, 197, 94, 0.3);
  --muted: #6b7280;
  --accent: #16a34a;
  --accent-dim: rgba(22, 163, 74, 0.06);
  --accent-glow: rgba(22, 163, 74, 0.03);
  --text-primary: #111111;
  --text-secondary: #4b5563;
  --input-bg: rgba(255, 255, 255, 0.5);
  --input-border: rgba(22, 163, 74, 0.12);
  --input-border-focus: rgba(22, 163, 74, 0.4);
  --input-placeholder: #999;
  --btn-bg: rgba(22, 163, 74, 0.08);
  --btn-border: rgba(22, 163, 74, 0.2);
  --btn-bg-hover: rgba(22, 163, 74, 0.15);
  --btn-border-hover: rgba(22, 163, 74, 0.35);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.06);
  --bracket-opacity: 0.18;
  --bracket-hover-opacity: 0.5;
  --bg-effects-opacity: 0.35;
  --vignette-opacity: 0;
  --scanline-color: rgba(0, 0, 0, 0.045);
  --scanline-opacity: 0.8;
  --scrollbar: rgba(22, 163, 74, 0.12);
  --scrollbar-hover: rgba(22, 163, 74, 0.25);
}
```

Fonte publicada: [CSS da página](https://www.demasi.dev/_next/static/chunks/fd0ec2371dc7572c.css).

## 6. Tipografia existente

Duas famílias locais via Next/font: Geist e Geist Mono. O CSS publicado declara peso variável 100–900 e `font-display: swap` para ambas.

| Aplicação medida | Família | Tamanho / entrelinha | Peso |
| --- | --- | --- | --- |
| Nome (h1) | Geist | 20 / 28 px | 600 |
| Bio | Geist | 14 / 20 px | 400 |
| Nome do projeto | Geist | 16 / 24 px | 500 |
| Descrição do projeto | Geist | 12 px / leading-relaxed | 400 |
| Contadores principais | Geist Mono | 30 / 36 px | 700 |
| Rótulos técnicos | Geist Mono | geralmente 9–11 px | variável por elemento |
| Inputs e botão | Geist Mono | 14 px | 400 / 500 |

Nome e títulos usam tracking negativo; números tabulares têm tracking -0,04em. Hoje a escala é compacta: os contadores são maiores que o próprio nome. A nova escala escultórica será uma mudança de composição, não uma característica já presente.

## 7. Tratamento visual existente

Fundo quase preto, três grades verdes em parallax, quatro colunas de logs em baixa opacidade, circuito SVG revelado perto do mouse, scanlines, flashes vermelho/ciano e vinheta. Cards translúcidos com blur de 14 px, bordas verdes, raio de 20 px e marcas nos cantos. Avatar circular com halo verde. A variante clara preserva os mesmos elementos e reduz a intensidade do fundo.

Os logs são strings estáticas decorativas, duplicadas para movimento contínuo. Não comprovam testes, cobertura, carga, atividade em produção, deploys ou domínio de ferramentas. O apêndice abaixo os preserva como decoração preexistente.

## 8. Limites editoriais para a reconstrução

- Reutilizar a bio transcrita e o posicionamento “Senior Software Engineer”, já existente nos metadados.
- Preservar idioma, nomes, descrições, contatos e destinos reais.
- Não acrescentar skills a partir de logs decorativos ou da stack escolhida para reconstruir o site.
- Não promover a seção de organizações a lista de clientes/empregadores.
- Não inferir relações de dependência ou níveis de habilidade para o grafo orbital.
- Apresentar detalhes internos dos projetos apenas até onde há conteúdo verificado; casos completos não existem nesta fonte.
- Tratar métricas como dados datados e com origem, não como copy permanente.
- Novos nomes poéticos de direção e metáforas visuais são propostas de design; não são novas alegações sobre Bruno.
- Nenhum arquivo da aplicação ou dependência foi alterado nesta etapa. A escolha de conceito antecede a implementação.

## Apêndice — copy decorativa completa

Cada sequência é transcrita uma vez; o componente repete cada uma duas vezes para produzir scroll contínuo.

### S1

```text
[14:32:01] git push origin main
[14:32:03] → Enumerating objects: 47, done.
[14:32:04] → Compressing objects: 100% (23/23)
[14:32:05] → Writing objects: 100% (47/47)
[14:32:06] → Total 47 (delta 19), reused 0
[14:32:08] docker build -t app:latest .
[14:32:09] Step 1/12 : FROM node:20-alpine
[14:32:10] Step 2/12 : WORKDIR /app
[14:32:11] Step 3/12 : COPY package*.json ./
[14:32:13] Step 4/12 : RUN npm ci --production
[14:32:15] npm run build
[14:32:16] ✓ Compiled successfully in 1.34s
[14:32:17] ✓ Generating static pages (6/6)
[14:32:19] ✓ Finalizing page optimization
[14:32:20] kubectl apply -f deployment.yaml
[14:32:21] deployment.apps/api configured
[14:32:22] service/api-svc unchanged
[14:32:23] pod/api-7d4b8c Running
[14:32:25] CPU: 12% | MEM: 234MB / 512MB
[14:32:27] eth0: rx 1.2GB tx 890MB
[14:32:29] uptime: 47d 12h 33m
[14:32:31] commit a1b2c3d (HEAD → main)
[14:32:33] Author: brunodmsi
[14:32:35] feat: update portfolio layout
```

### S2

```text
$ ssh deploy@prod-01
Last login: Mon Feb 24 08:12:33
$ systemctl status nginx
● nginx.service — active (running)
  Main PID: 1234 (nginx)
$ tail -f /var/log/app.log
INFO  GET /api/health 200 12ms
INFO  Cache hit ratio: 94.2%
DEBUG Pool: 8/20 connections active
INFO  WebSocket clients: 142
$ redis-cli info memory
used_memory_human: 12.4M
mem_fragmentation_ratio: 1.02
$ pg_stat_activity
active: 23 | idle: 7 | waiting: 0
$ cargo build --release
Compiling api v0.1.0 (/app)
Finished release [optimized]
$ hardhat compile
Compiled 12 Solidity files
$ k9s — CONTEXT: prod-cluster
NAMESPACE: default
PODS: 14 running, 0 pending
```

### S3

```text
GET  /api/repos     200  45ms
GET  /api/user      200  23ms
POST /api/contact   201  89ms
CACHE HIT /repos [ttl:3600]
DNS api.github.com resolved
TLS handshake (23ms)
X-RateLimit: 4832 remaining
Content-Type: application/json
WORKER pid=2847 mem=45.2MB
GC pause: 1.2ms (minor)
Event loop lag: 0.3ms avg
▲ Next.js 16.1.6 (Turbopack)
Creating optimized build...
✓ Compiled in 1.5s
Route /  revalidate: 1h
○ (Static) prerendered
$ git log --oneline -5
a1b2c3d feat: contact form
e4f5g6h fix: org visibility
i7j8k9l refactor: use lucide
m0n1o2p feat: bento grid
q3r4s5t init: nextjs project
```

### S4

```text
λ bun install v1.2.3
+ next@16.1.6
+ react@19.2.3
+ lucide-react@0.447.0
147 packages [2.1s]
PASS tests/api.test.ts
✓ fetch user data (120ms)
✓ fetch repos (89ms)
✓ language stats (12ms)
✓ org endpoint (34ms)
Tests: 12 passed, 12 total
Time: 2.3s
Coverage: 94% statements
  branches: 87%
  functions: 96%
  lines: 94%
tsconfig paths resolved ✓
eslint: 0 errors, 0 warnings
prettier: all formatted
→ route / 200 in 145ms
→ route /api 200 in 23ms
→ sitemap.xml 200 in 3ms
```
