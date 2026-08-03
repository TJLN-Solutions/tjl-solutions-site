# BASE4 SYSTEMS — Site institucional

Site de uma empresa com duas frentes de atuação: **loja física de manutenção de
hardware** em Bilac-SP e **software house** que desenvolve sites, sistemas e
automações. Essa dualidade é o fio condutor do site inteiro — da navegação ao
formulário de contato, o visitante é sempre direcionado à frente que atende o
problema dele.

Aplicação de página única, 20 seções, com tema claro e escuro, coreografia de
rolagem na abertura e responsividade validada de 320 a 1920px.

---

## Sumário

- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Estrutura](#estrutura)
- [As 20 seções](#as-20-seções)
- [Sistema de design](#sistema-de-design)
- [Movimento](#movimento)
- [Acessibilidade](#acessibilidade)
- [Responsividade](#responsividade)
- [Conteúdo](#conteúdo)
- [Antes de publicar](#antes-de-publicar)
- [Build e deploy](#build-e-deploy)
- [Convenções de código](#convenções-de-código)
- [Dívidas conhecidas](#dívidas-conhecidas)

---

## Stack

| Camada | Ferramenta |
| --- | --- |
| Interface | React 19 |
| Build | Vite 8 |
| Estilo | Tailwind CSS v4 (plugin `@tailwindcss/vite`) |
| Tipagem | TypeScript 5.7 |
| Ícones | lucide-react |
| Formatação | oxfmt |

Não há biblioteca de animação. Todo o movimento é CSS mais `IntersectionObserver`
e `requestAnimationFrame` — decisão deliberada, explicada em
[Movimento](#movimento).

**Volume:** 31 componentes, 2 hooks, 2.448 linhas de CSS e 610 de conteúdo.
Bundle de produção: **20 KB de CSS** e **82 KB de JavaScript**, comprimidos.

---

## Como rodar

Requer **Node 20+** (desenvolvido em 24) e **pnpm**, que é o gerenciador do
projeto — o `pnpm-lock.yaml` é o lockfile versionado.

```bash
pnpm install
pnpm dev            # servidor em http://localhost:8443
```

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento com recarga automática |
| `pnpm build` | Build de produção em `dist/` |
| `pnpm preview` | Serve o build para conferência local |
| `pnpm format` | Formata o código com oxfmt |

A porta sai de `process.env.PORT` e cai em 8443. O servidor escuta em
`0.0.0.0`, então funciona para testar de outro aparelho na mesma rede.

---

## Estrutura

```
src/
├── App.tsx                 Composição das 20 seções + metadados e JSON-LD
├── data.ts                 Todo o conteúdo do site, em um arquivo só
├── index.css               Sistema de design: tokens, componentes, movimento
├── hooks/
│   ├── useInView.ts        Revelação no scroll, uma vez por elemento
│   └── useScrollProgress.ts Progresso 0→1 dentro de uma seção alta
└── components/
    ├── Navbar.tsx          Barra com 4 entradas e cartões de subseção
    ├── Hero.tsx            Abertura em palco fixo
    ├── OrbStage.tsx        Cena 3D da orbe, comandada pela rolagem
    ├── AmbientExperience.tsx Fundo animado (grade, orbes, feixes, cursor)
    ├── SectionHeader.tsx   Cabeçalho padrão, com revelação própria
    ├── AreaTabs.tsx        Alternador hardware ⇄ software
    ├── Counter.tsx         Números que contam ao entrar na tela
    └── …                   Uma seção por arquivo
```

Três regras de organização:

1. **Conteúdo não mora em componente.** Todo texto exibido sai de `data.ts`, para
   que revisar o site seja editar um arquivo só.
2. **Componente não escreve cor.** Nenhum hex fora dos blocos de token em
   `index.css`. Trocar de tema é redefinir tokens, nunca sobrescrever regras.
3. **Uma seção, um arquivo.** O nome do arquivo é o nome da seção.

---

## As 20 seções

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 01 | Início | `Hero` | Palco fixo com a cena da orbe |
| 02 | Nossas frentes | `Frentes` | Hardware e software lado a lado |
| 03 | Números | `Numeros` | Faixa de prova com contadores |
| 04 | Empresa | `Sobre` | Manifesto, fluxo de trabalho e localização |
| 05 | Equipe | `Equipe` | As quatro pessoas, com a frente de cada uma |
| 06 | BASE4 Charge | `Sistemas` | Produto próprio, com painel de demonstração |
| 07 | Serviços | `Servicos` | Console com três frentes e visual por serviço |
| 08 | Como funciona | `ComoFunciona` | Quatro passos, em duas trilhas |
| 09 | Prazos e garantia | `Prazos` | Tabela por serviço, em duas trilhas |
| 10 | Preços | `Investimento` | Faixas de investimento por frente |
| 11 | Portfólio | `Portfolio` | Projetos entregues, com stack |
| 12 | Antes e depois | `AntesDepois` | Comparador arrastável de limpeza |
| 13 | Tecnologias | `Tecnologias` | Marcas atendidas e stack de trabalho |
| 14 | Depoimentos | `Depoimentos` | O que dizem os clientes |
| 15 | Diferenciais | `Diferenciais` | Quatro módulos conectados |
| 16 | Dicas | `Dicas` | Conteúdo útil, sem venda |
| 17 | Dúvidas frequentes | `Faq` | Oito perguntas em acordeão |
| 18 | Contato | `Contato` | Contato por área e formulário direcionado |
| 19 | Localização | `Localizacao` | Endereço, horário e mapa sob demanda |
| 20 | Pronto para começar | `CtaFinal` | Duas portas de entrada |

A navegação mostra **quatro** entradas, não vinte: Empresa, Serviços, Preços e
Contato — as quatro perguntas de quem chega. Cada uma abre um cartão com as
subseções do assunto. O índice completo vive no menu do celular e no mapa do
rodapé.

---

## Sistema de design

### Tokens semânticos

`index.css` define dois conjuntos de tokens — um por tema — e todo o resto da
folha lê deles. Nenhuma regra de componente conhece uma cor.

```css
:root            { /* tema escuro, padrão */ }
[data-theme="light"] { /* mesma identidade, superfície de papel */ }
```

O alternador escreve `data-theme` no elemento raiz e guarda a escolha em
`localStorage`.

### Paleta

As cores foram amostradas da logo do BASE4 Charge. Cada uma tem uma função, e a
hierarquia é o que sustenta a identidade.

| Papel | Escuro | Claro | Onde aparece |
| --- | --- | --- | --- |
| Base | `#08080A` | `#F1F3F7` | Fundo da página |
| Superfície | `#1B1B1F` | `#FFFFFF` | Cards, painéis, tabelas |
| Texto principal | `#F5F6F8` | `#14161C` | Títulos e corpo |
| Ação (preenchimento) | `#016ADD` | `#0A58C2` | Botão, aba ativa, orbes |
| Ação (texto) | `#58A6FF` | `#0A51B4` | Link, ícone, valor destacado |
| Detalhe | `#FFD60A` | `#7A5D00` | Numeração, foco, estado ativo |

**O preto domina.** O azul é cor de ação, não de ambiente: as linhas de
estrutura são neutras justamente porque `--line-1` aparece 68 vezes na folha e,
tingida de azul, pintava a página inteira.

**O amarelo é terciário e tem regra.** Ele marca a numeração do site e o que
está ativo ou em foco — nunca é cor de área. Aparece na faixa sob a marca (a
citação literal da logo), no código de cada seção, no anel de foco, no marcador
da aba ativa e nos indicadores de vida. Fora disso, sai de cena.

O azul puro `#016ADD` só serve como preenchimento: como texto sobre preto ele
fica em 3,3:1, abaixo do piso legível. Daí a variação clara para texto.

### Tipografia

| Uso | Fonte |
| --- | --- |
| Títulos | Space Grotesk |
| Corpo | Inter |
| Rótulos, códigos e números | IBM Plex Mono |

---

## Movimento

Não há biblioteca de animação, e isso é escolha. Três regras governam tudo:

**1. Só `transform` e `opacity` são animados.** Qualquer outra propriedade força
recálculo de layout a cada quadro.

**2. Conteúdo nunca depende de animação para existir.** Toda entrada é escrita
com `from` no keyframe, para que o estado de repouso seja o visível. Se a
animação não rodar — aba em segundo plano, movimento reduzido, navegador antigo
— o conteúdo aparece, não desaparece.

**3. Duração curta na resposta ao dedo, longa na entrada.** 100–300ms no hover e
no clique, 500–700ms na revelação. Hover lento parece travado; entrada rápida
parece susto.

### Coreografia da abertura

A primeira seção mede 3,4 telas de altura e contém um palco `position: sticky`.
`useScrollProgress` converte a rolagem dentro dela num número de 0 a 1, e esse
número comanda a cena: a gaiola 3D da orbe gira, a superfície de dados corre, a
luz da plataforma acende e os cinco módulos saem da borda da esfera, um a um,
cada um puxando sua trilha.

Módulos e trilhas partem do **raio da orbe**, nunca do centro — é o que garante
que nada seja desenhado sobre a esfera.

### Revelação por seção

`useInView` observa o contêiner e o CSS escalona os filhos por `nth-child`. Um
observador por card e um wrapper por elemento seriam desperdício e quebrariam os
grids.

> **Cuidado ao adicionar variantes de entrada.** Todo deslocamento precisa ser
> escopado com `:not(.is-in)`. Sem isso, a variante empata em especificidade com
> o reset e vence por ordem na folha — o elemento fica deslocado
> permanentemente, não só durante a animação.

---

## Acessibilidade

- **Contraste com piso de 4,5:1** em todos os pares de texto, nos dois temas,
  medido contra o fundo real e não contra o token. Pior caso: 4,86:1.
- **`prefers-reduced-motion`** desliga entradas, pulsos, giros e a coreografia
  da abertura — a cena aparece montada.
- **Alvos de toque de 44px** até 1080px, que cobre celular e iPad em paisagem.
- **Anel de foco em amarelo**, não em azul: sobre um botão azul o anel azul
  praticamente desaparecia.
- **Gaveta de navegação com `inert`** quando fechada. Sem isso o Tab entra em
  treze links invisíveis antes de chegar ao conteúdo.
- **Formulário** com `label` real, `role="alert"` nos erros e foco no primeiro
  campo inválido.
- **Mapa sob demanda**, com alternativa em texto e link para o Google Maps caso
  o provedor recuse o frame.

### Perfil de performance reduzido

`AmbientExperience` detecta máquina modesta, `saveData` ou movimento reduzido e
marca `performance-lite` na raiz. O CSS então desliga feixes, a segunda orbe, o
brilho do cursor, o grão e os pulsos.

---

## Responsividade

Validado em 13 larguras. Em todas: **sem rolagem horizontal e sem elemento fora
da tela.**

| Faixa | Comportamento |
| --- | --- |
| ≤ 760px | Tipografia e alvos ampliados; tabelas rolam internamente |
| ≤ 900px | Módulos da orbe saem da órbita e viram lista empilhada |
| ≤ 1080px | Palco fixo é liberado; a cena aparece montada |
| ≤ 1100px | Barra colapsa e o menu de seções assume |
| ≤ 1400px | Cena da orbe encolhe para caber na coluna |

No celular os módulos da orbe **trocam de arranjo, não de escala**. Encolher a
cena resolveria a geometria e destruiria a leitura: o texto cairia para 5px.

---

## Conteúdo

`src/data.ts` é a única fonte. Contém contatos, áreas de atendimento, serviços,
prazos, faixas de preço, portfólio, depoimentos, dúvidas e horários.

Dois detalhes que evitam bug de conteúdo:

**Telefone exibido é derivado do discado.** `formatPhoneBR` formata a partir do
número usado no link, então os dois não podem divergir.

**Serviço conhece a frente que o atende.** Se o visitante escolhe um serviço de
hardware mas selecionou um contato de software, o formulário avisa e oferece a
troca — o pedido não chega a quem não cuida dele.

---

## Antes de publicar

> [!IMPORTANT]
> Oito blocos de `data.ts` estão marcados com `// confirmar`. São estimativas
> geradas na prototipação e **não foram validadas com a empresa**.

| Item | Risco de publicar errado |
| --- | --- |
| Faixas de preço | Cobrança indevida e reclamação |
| Prazos e garantias | Promessa que a operação não cumpre |
| Depoimentos com nome de pessoa | Problema jurídico: fala atribuída sem autorização |
| Números de vitrine e ano de fundação | Informação falsa sobre a empresa |
| Projetos do portfólio | Trabalho atribuído sem comprovação |

Revise cada um antes de subir para produção. Buscar por `confirmar` no
`data.ts` lista todos.

---

## Build e deploy

```bash
pnpm build
```

Além dos assets em `dist/`, o build emite `dist/server/index.js`: um
**Cloudflare Worker** que serve o HTML e os assets embutidos, com cache
imutável para arquivos versionados e `no-store` para o documento. O plugin que
faz isso vive em `vite.config.ts`.

Metadados de página — título, descrição, idioma, favicon, imagem social e
`robots` — saem de `.figma/make/site.json` e são injetados no HTML no build.
`FIGMA_PUBLIC_URL` define o `base` quando o site é servido sob um prefixo.

O `App.tsx` injeta **JSON-LD** de `LocalBusiness` e `FAQPage`, com endereço,
coordenadas, horário e região atendida — o que ajuda a loja física a aparecer na
busca local.

---

## Convenções de código

- **Aspas duplas** em strings com apóstrofo, ou escape. Apóstrofo não escapado
  em string de aspas simples quebra o build.
- **Comentário explica o motivo, não o óbvio.** O código já diz o que faz; o
  comentário existe para o que não é dedutível — por que um valor é aquele, que
  bug uma regra evita.
- **Componente exportado como `default`.**
- **Sem hex fora dos tokens.** A única exceção é o verde do WhatsApp no botão
  flutuante, que é cor de marca de terceiro.

---

## Dívidas conhecidas

Documentadas de propósito: quem entra no projeto merece saber onde estão as
arestas.

| Dívida | Detalhe |
| --- | --- |
| `framer-motion` declarado e não usado | Dependência de produção sem um único import. Pode sair do `package.json`. |
| Duas quebras próximas | A barra colapsa em 1100px e o palco fixo solta em 1080px. Funciona, mas são duas medidas onde poderia haver uma. Unificar exige revisar juntas as regras herdadas do bloco de 1100px. |
| Tipografia miúda em rótulos | Rótulos e códigos em mono usam 8–11px em várias seções, herança do desenho original. Legível no desktop, apertado em tela pequena — no celular há regras que ampliam os principais. |
| `package-lock.json` fora do versionamento | O projeto usa pnpm. O arquivo aparece como não rastreado e deve ser ignorado ou removido. |
| Sem testes automatizados | A validação foi feita por medição no navegador — contraste, alinhamento, ausência de estouro. Nada disso está preso em teste que rode sozinho. |
