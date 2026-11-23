# Débora Denúbila — Advocacia Familiar & Patrimonial

Site institucional em **HTML, CSS e JavaScript puros**, sem frameworks, sem etapa de build e sem dependências externas em tempo de execução. Basta publicar a pasta em qualquer hospedagem estática.

- **Página principal:** `index.html` (uma página, com âncoras `#solucoes`, `#funciona`, `#sobre`, `#palestras` e `#form`)
- **Página de agradecimento:** `obrigado/index.html` (rota `/obrigado/`, marcada como `noindex`)
- **Páginas legais:** `privacidade/`, `termos/`, `cookies/` e `excluir-dados/`
- **Contato:** formulário que monta uma mensagem e abre o WhatsApp; botão flutuante do WhatsApp
- **Cookies:** aviso de consentimento e preferências; o Google Tag Manager só carrega após autorização de análise

---

## 1. Prévia local

Não é obrigatório, mas recomendado servir a pasta por HTTP para testar o formulário, o manifest e o carregamento do GTM:

```bash
# Opção A — Node (baixa o pacote na primeira execução)
npx serve .

# Opção B — Python
python -m http.server 8080
```

Depois abra `http://localhost:3000` (serve) ou `http://localhost:8080` (Python).

Abrir `index.html` com duplo clique também funciona para conferir o layout, mas links e formulário devem ser testados em um servidor local.

---

## 2. Estrutura de arquivos

```text
debora-denubila-site/
├── index.html                  → página principal
├── obrigado/
│   └── index.html              → página /obrigado/ (noindex)
├── privacidade/                → Política de Privacidade
├── termos/                     → Termos de Uso
├── cookies/                    → Política de Cookies
├── excluir-dados/              → solicitação de exclusão de dados
├── site.webmanifest            → dados do site para "adicionar à tela inicial"
├── robots.txt                  → orientações para buscadores
├── sitemap.xml                 → mapa do site
├── README.md                   → este arquivo
└── assets/
    ├── css/
    │   ├── styles.css          → CSS principal, organizado por seções
    │   └── legal.css           → rodapé legal, páginas jurídicas e cookies
    ├── js/
    │   ├── main.js             → menu, carrossel, animações, máscara e formulário
    │   └── consent.js          → consentimento de cookies e carregamento do GTM
    ├── fonts/
    │   └── roboto-latin.woff2  → fonte Roboto (auto-hospedada)
    ├── img/                    → fotos otimizadas, logos e compartilhamento
    └── icons/                  → favicons e ícones dourados das seções
```

O CSS tem um índice no topo e comentários de seção (`01. Tokens`, `02. Reset`, etc.). O HTML usa comentários como `<!-- ================= HERO ================= -->` para localizar cada bloco.

---

## 3. Como editar

### 3.1 Textos e seções

Abra `index.html` e edite diretamente o texto dentro das tags. Cada seção está comentada na ordem em que aparece na página:

1. Hero em carrossel (slide 1: palestras; slide 2: advocacia)
2. Riscos
3. Soluções
4. Método
5. Inventário
6. Sobre
7. Para quem
8. Palestras
9. Formulário
10. Encerramento

Mantenha a hierarquia de títulos (`h1` único na página; `h2` por seção; `h3` nos cards) para não perder acessibilidade e SEO. O hero tem apenas um `h1` no primeiro slide e um `h2` no segundo. Na página de agradecimento, o título é um `h1` próprio.

O hero é um carrossel com dois slides: **Palestras** (abre primeiro) e **Advocacia**. O slide de palestras usa um painel verde com a foto em arco e a imagem à esquerda; o slide de advocacia mantém o layout claro original, com texto à esquerda e foto à direita. As abas, setas, teclado e swipe são tratados em `main.js`; o texto e as imagens de cada slide ficam no bloco `HERO` do `index.html`. Para trocar a ordem, mova os dois `<article class="hero__slide">` e ajuste os botões `data-slide-to`, os `aria-controls` e os rótulos.

### 3.2 Cores e tipografia

As cores da marca ficam em `assets/css/styles.css`, no bloco `:root`:

| Variável | Valor | Uso |
| --- | --- | --- |
| `--brand` | `#434F47` | verde principal, títulos e textos fortes |
| `--brand-deep` | `#40544A` | fundo da seção do formulário |
| `--brand-soft` | `#4D5850` | cards sobre fundo escuro |
| `--gold` | `#DDB364` | botões e destaques |
| `--gold-deep` | `#C9A35B` | hover dos botões e detalhes decorativos |
| `--gold-text` | `#8A6A2F` | links ativos e textos pequenos em ouro |
| `--gold-title` | `#A67C33` | títulos e números grandes em ouro |
| `--cream` | `#F8F7F6` | fundo de seções claras |
| `--ink` | `#1F1B13` | rodapé e texto dos botões |
| `--muted` | `#6F6F6F` | textos secundários |

A fonte é a **Roboto variável** (arquivo local em `assets/fonts`, pesos 100–900), declarada no `@font-face` no início do CSS. Para trocar a fonte, substitua o `.woff2` e ajuste `--font` e o `@font-face`. Para trocar apenas o peso, edite `font-weight` nos seletores.

> Acessibilidade: os botões dourados usam texto escuro (`--ink`) para atingir contraste AA. Os tons `--gold-text` e `--gold-title` foram calibrados para textos pequenos e grandes sobre fundos claros, respectivamente; mantenha essa distinção ao alterar a paleta.

### 3.3 Imagens

| Arquivo | Onde aparece | Tamanho recomendado |
| --- | --- | --- |
| `palestra-debora-900.webp` / `palestra-debora-1400.webp` | slide 1 do hero (palestras) | 900×1132 e 1400×1761 |
| `palestra-debora-900.jpg` | fallback do slide de palestras | 900×1132 |
| `hero-debora-900.webp` / `hero-debora-1400.webp` | slide 2 do hero (advocacia) | 900×1132 e 1400×1761 |
| `hero-debora-900.jpg` | fallback do slide de advocacia | 900×1132 |
| `palestras-debora-900.webp` / `.jpg` | seção Palestras | 900×1125 |
| `sobre-debora-900.webp` / `sobre-debora-1400.webp` | seção Sobre | 900×1035 e 1400×1610 |
| `sobre-debora-900.jpg` | fallback da seção Sobre | 900×1035 |
| `obrigado-debora.webp` / `.jpg` | página `/obrigado/` | 1000×667 |
| `logo-escura.png` | cabeçalho | 640×199, PNG com transparência |
| `logo-clara.png` | rodapé | 640×199, PNG com transparência |
| `og-debora-denubila.jpg` | compartilhamento em redes sociais | 1200×630 |
| `favicon-32/180/192/512.png` | abas e atalhos | 32, 180, 192 e 512 px |
| `assets/icons/*.png` | ícones dourados das seções | 128×128, PNG com transparência |

Ao trocar uma foto, mantenha a proporção e atualize `width`, `height` e os `srcset` correspondentes no HTML. Para gerar WebP + JPEG a partir de um original, qualquer ferramenta de compressão serve (Squoosh, ImageOptim, Sharp etc.). As fotos originais enviadas pela cliente foram movidas para `C:\Users\henri\Downloads\debora-fotos-originais` e não fazem parte do site publicado; apenas as versões otimizadas ficam em `assets/img`.

Os ícones das seções são decorativos (`alt=""`). Os ícones de interface (setas, escudo, WhatsApp) são um sprite SVG inline no topo do HTML; para adicionar um novo, inclua um `<symbol id="i-nome">` e use `<svg class="icon"><use href="#i-nome"></use></svg>`.

### 3.4 WhatsApp e telefone

O número aparece nos seguintes pontos — busque por `5531999876858` (formato internacional, sem símbolos) e por `+55-31-99987-6858` (JSON-LD):

- `index.html` — dados estruturados (`telephone`), link do `noscript` e botão flutuante
- `obrigado/index.html` — botão flutuante
- `privacidade/`, `termos/`, `cookies/` e `excluir-dados/` — links de contato e privacidade
- `assets/js/main.js` — constante `WHATSAPP_NUMBER`, usada no envio do formulário

Troque **todos** os pontos. O formato do link é sempre `https://wa.me/55DDDNUMERO?text=...`. O rodapé legal também repete o contato da Nextep (`contato@nextepsolutions.com.br` e `(31) 97269-1647`) em todas as páginas; se esses dados mudarem, busque por `nextepsolutions` e `97269`.

### 3.5 Formulário

O formulário **não tem backend** e não armazena dados. Ao enviar:

1. o JavaScript valida nome, telefone (com DDD), e-mail e os três selects;
2. se houver erros, exibe um resumo no topo do formulário com links para cada campo, mantém os erros inline e move o foco para o resumo;
3. monta uma mensagem com os dados preenchidos;
4. abre o WhatsApp (`wa.me`) em uma nova aba;
5. mostra uma mensagem de sucesso com um link alternativo, caso o navegador bloqueie a janela;
6. envia o evento `form_whatsapp` para o `dataLayer` do GTM **somente se a análise tiver sido autorizada**.

**Para onde vão os dados:** o formulário não envia nada para um servidor deste site, não grava em banco e não envia e-mail. Ele abre o WhatsApp da Dra. Débora (`+55 31 99987-6858`) com a mensagem já preenchida; a conversa fica no WhatsApp. A página `/obrigado/` não é acionada automaticamente — ela existe para campanhas ou para um backend futuro.

Os campos e opções ficam em `index.html` (seção `FORMULÁRIO`). As mensagens de erro e os validadores ficam em `main.js` (objeto `validators`). A máscara aceita telefone fixo (10 dígitos) e celular (11 dígitos). O select de necessidade inclui a opção **Quero participar de uma palestra**.

Para trocar o destino do formulário:

- **Outro número de WhatsApp:** altere a constante `WHATSAPP_NUMBER` em `main.js` e os links citados no item 3.4.
- **Backend/CRM (Formspree, Web3Forms, RD Station etc.):** o ponto de integração é o listener de `submit` em `main.js`. Substitua o trecho que monta a URL do WhatsApp por um `fetch` para o endpoint do serviço, mantendo as funções de validação e de status. Se o serviço exigir um `<form action="...">`, acrescente também os campos ocultos necessários no HTML.
- **Redirecionar para `/obrigado/` após enviar:** troque a abertura do WhatsApp por `window.location.href = 'obrigado/'` (ou use o redirecionamento do próprio serviço). A página já existe e está pronta.

Ao usar um backend, revise o aviso de privacidade abaixo do formulário e inclua a base legal/LGPD adequada.

### 3.6 Página de agradecimento

O arquivo `obrigado/index.html` gera a rota `/obrigado/`, igual à do site original. Ela tem `meta robots="noindex, follow"` e não está no menu.

Use essa página como destino de campanhas, redirecionamento pós-envio de um backend ou página de conversão. Para editar, altere o texto e a imagem normalmente; os caminhos usam `../assets/` porque o arquivo está dentro da pasta `obrigado`.

### 3.7 Google Tag Manager e consentimento

O GTM **não é carregado automaticamente**. O container `GTM-N2CGCSJD` fica em `assets/js/consent.js` e só é inserido depois que o visitante aceita a categoria **Análise** no aviso de cookies.

- Para trocar o container, altere a constante `GTM_ID` em `consent.js`.
- Para remover o GTM, apague a constante e a função `loadGtm()` (ou deixe o consentimento sem a categoria de análise).
- O formulário envia `form_whatsapp` (com `form: 'consulta'` e `necessidade`) somente quando a análise está autorizada. Crie o acionador correspondente no GTM.
- O aviso de cookies aparece no primeiro acesso. A escolha fica em `localStorage`, na chave `debora_cookie_consent_v1`. O link **Preferências de cookies** do rodapé reabre o modal.
- Essenciais ficam sempre ativos; análise é opcional. Ao revogar, o script do GTM é removido e os cookies `_ga*` são apagados.

### 3.8 Páginas legais e rodapé Nextep

As páginas `privacidade/`, `termos/`, `cookies/` e `excluir-dados/` são estáticas e usam o mesmo cabeçalho, rodapé e `legal.css`. O rodapé de todas as páginas inclui:

- links para Privacidade, Termos de Uso, Cookies, Excluir meus dados e Preferências de cookies;
- o crédito **Desenvolvido por Nextep Solutions Ltda.**, com e-mail e WhatsApp;
- o aviso de concordância com os Termos e a Política de Privacidade.

O conteúdo jurídico é um **modelo inicial** e deve ser revisado pela advogada responsável antes da publicação, especialmente prazos, bases legais, retenção e dados de contato. Para editar, altere o texto de cada `index.html` nas pastas legais; links e caminhos usam `../`.

### 3.9 SEO e compartilhamento

- `index.html`: título, descrição, canonical, Open Graph, Twitter Card e JSON-LD (`Attorney`).
- `obrigado/index.html`: título próprio e `noindex`.
- Páginas legais: título, descrição, canonical e indexação normal.
- `sitemap.xml` e `robots.txt`: atualize as URLs se o domínio mudar.

Se o site for publicado em outro domínio, busque por `deboradenubila.adv.br` e substitua em todas as páginas, no `sitemap.xml` e no `robots.txt`. As URLs absolutas são necessárias para canonical, Open Graph e sitemap.

---

## 4. Publicação

A pasta inteira é o site; não há build. Envie **todo o conteúdo** mantendo a estrutura de pastas:

- **Netlify / Vercel:** arraste a pasta no painel ou conecte o repositório. Não configure comando de build; o diretório de publicação é a raiz.
- **GitHub Pages:** envie o conteúdo para o repositório e ative o Pages na branch principal. As URLs relativas funcionam em subpastas.
- **cPanel / hospedagem tradicional:** envie o conteúdo para `public_html` (ou a pasta do domínio). O `index.html` da raiz será a home e `obrigado/index.html` responderá em `/obrigado/`.
- **HTTPS:** após publicar, ative o certificado e teste o site em `https://`.

O formulário depende de `assets/js/main.js`; confirme que a pasta `assets` foi enviada e que o servidor entrega `.webp`, `.woff2` e `.webmanifest` com os tipos corretos (a maioria das hospedagens já faz isso).

### Checklist antes de publicar

- [ ] Domínio atualizado em canonical, Open Graph, JSON-LD, `sitemap.xml` e `robots.txt`
- [ ] Telefone/WhatsApp atualizado em todos os pontos do item 3.4
- [ ] Teste do formulário no celular (máscara, validação, resumo de erros e abertura do WhatsApp)
- [ ] Teste do menu móvel e da navegação por teclado (Tab, Esc e links âncora)
- [ ] Teste do carrossel do hero (abas, setas, teclado e swipe no celular)
- [ ] Teste da página `/obrigado/`
- [ ] Teste das páginas legais e do link “Preferências de cookies” (aceitar, recusar e revogar)
- [ ] GTM em modo de visualização: confirmar que só carrega após consentimento e que `form_whatsapp` dispara
- [ ] Fotos e logos carregando em desktop e mobile
- [ ] Favicons e imagem de compartilhamento conferidos
- [ ] Revisão jurídica dos Termos, Privacidade, Cookies e Exclusão de dados
- [ ] Revisão ortográfica dos textos

---

## 5. Observações técnicas

- **Sem dependências:** não há jQuery, Bootstrap, fontes do Google nem ícones externos. O único terceiro é o GTM (opcional e carregado somente após consentimento).
- **Navegadores:** versões atuais de Chrome, Edge, Firefox e Safari. O carrossel usa `inert`; navegadores antigos ainda exibem o primeiro slide. Há fallback para navegadores sem `IntersectionObserver` e suporte a `prefers-reduced-motion`.
- **Acessibilidade:** link "Ir para o conteúdo", foco visível, menu móvel com `aria-expanded`/Esc, carrossel com controles de teclado, swipe e status `aria-live`, rótulos associados aos campos, resumo de erros com links, mensagens inline com `aria-describedby`, `aria-live` no status e contraste AA nos textos e botões.
- **Sem JavaScript:** o hero mostra os dois slides empilhados e os controles do carrossel são ocultados; o formulário exibe o link alternativo do WhatsApp; o banner de cookies não é injetado e o GTM não carrega.
- **Imagens:** WebP com fallback JPEG nas fotos; `width`/`height` declarados para evitar deslocamento de layout; `loading="lazy"` fora da primeira dobra.
- **Fonte:** Roboto, licenciada sob Apache 2.0, auto-hospedada em `assets/fonts`. É a fonte da marca no site original; por isso foi mantida mesmo sendo uma escolha tipográfica comum.
- **Falsos positivos do detector:** `--muted-light` (`.section__lead--light`) e `.form-note` são usados somente sobre fundos verdes escuros, com contraste de 5,5:1 e 5,95:1. O detector automático compara essas cores com branco e pode sinalizá-las incorretamente.

---

## 6. Origem do conteúdo

- Backup original: `C:\Users\henri\Downloads\wetransfer_backup-debora_2026-11-19_1715` (não alterar)
- Fotos originais da cliente: `C:\Users\henri\Downloads\debora-fotos-originais` (não fazem parte do deploy)
- Site de referência: <https://deboradenubila.adv.br>
- Contato: WhatsApp/telefone `+55 31 99987-6858` · Ipatinga, MG
- Desenvolvimento e suporte: Nextep Solutions Ltda. · `contato@nextepsolutions.com.br` · `(31) 97269-1647`
