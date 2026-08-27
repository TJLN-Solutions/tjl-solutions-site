# BASE4 SYSTEMS — Site institucional

Site institucional em página única (one-page) da BASE4 SYSTEMS, empresa de Bilac, SP, que reúne manutenção de hardware e desenvolvimento de software sob a mesma marca.

## Sobre o projeto

A BASE4 nasceu para resolver um problema comum: quem precisa de tecnologia normalmente precisa contratar duas empresas diferentes — uma para consertar o hardware, outra para construir o software. O site apresenta essa proposta em uma narrativa única de rolagem, guiando o visitante do problema (hardware travado, empresa sem presença digital) até a solução (bancada técnica + desenvolvimento sob medida), com cada seção reforçando a identidade "do componente ao código".

O site também funciona como vitrine: exibe projetos reais de clientes (portfólio de Sara Marques, Obsidian Estética Automotiva), casos de manutenção de hardware com comparador antes/depois, a equipe por trás do atendimento e um teaser navegável do próximo produto da empresa, o **B4 Charge**.

## Funcionalidades

- Narrativa em página única guiada por scroll, com animações de revelação (`data-reveal`) e cenas com efeito de profundidade/parallax (hero, transformação, capacidade)
- Header com navegação por âncora, menu mobile e scroll suave sem "pulos" bruscos
- Seção de soluções separando problemas de hardware e de software, cada uma com sua resposta
- Vitrine de capacidade de desenvolvimento (sites, sistemas, automações) com preview real de projetos entregues
- Comparador antes/depois arrastável para casos de limpeza e manutenção de hardware
- Demonstração interativa (wireframe navegável) do **B4 Charge**, produto em desenvolvimento, com contador regressivo até o lançamento e modal de expansão
- Seção de presença física (endereço, mapa incorporado, rota no Google Maps) e presença remota para projetos de software em todo o Brasil
- Seção "Sobre" com história da empresa e estatísticas
- Grade de equipe com diferencial de cada pessoa
- FAQ em acordeão
- Formulário/CTA de contato direcionando para WhatsApp, separado por especialidade (hardware/software)
- SEO: metadados Open Graph, dados estruturados `LocalBusiness` (JSON-LD), canonical e favicon dedicados

## Tecnologias utilizadas

**Frontend**
- React 19
- Vite 8
- CSS puro (`src/styles.css`), sem framework de UI

**Qualidade e testes**
- ESLint (flat config)
- TypeScript apenas para checagem de tipos (`tsc` via `jsconfig.json`, projeto em JSX)
- Testes unitários com o test runner nativo do Node (`node --test`)
- Testes de UI/responsividade com Playwright (`e2e/`)

**Build e deploy**
- Vite (build e preview)
- Hospedado na Vercel

## Estrutura do projeto

```
tjl-solutions-site/
├── src/
│   ├── App.jsx            # Todas as seções da página (hero, soluções, charge, hardware, equipe, faq, contato...)
│   ├── ChargeDemo.jsx      # Wireframe navegável do produto B4 Charge (dentro do site)
│   ├── chargeDemoData.js   # Dados mockados usados na demo do B4 Charge
│   ├── data.js             # Conteúdo estático: problemas/soluções, capacidades, FAQ, equipe
│   ├── formLogic.js        # Lógica auxiliar do formulário/CTA de contato
│   ├── styles.css          # Estilos globais (sem CSS-in-JS ou Tailwind)
│   └── main.jsx            # Ponto de entrada React
├── public/assets/          # Imagens, sequência de frames da GPU, marca (favicon, og:image)
├── docs/
│   ├── marca/               # Assets de identidade visual (logo)
│   └── prompts/             # Prompts de apoio ao projeto
├── scripts/
│   └── prepare_brand_assets.py  # Preparo de assets de marca
├── e2e/
│   └── responsive.spec.js   # Testes Playwright de responsividade
└── tests/
    ├── accessibility-contract.test.js
    ├── content.test.js
    └── formLogic.test.js
```

## Como executar

```bash
npm install
npm run dev
```

**Verificações**

```bash
npm run lint       # ESLint
npm run typecheck  # tsc sobre jsconfig.json
npm test           # testes unitários (node --test)
npm run test:ui    # testes Playwright (e2e/)
```

**Build de produção**

```bash
npm run build
npm run preview    # ou: npm start
```

## Status

O site está em produção, cobrindo hardware, software e a apresentação institucional completa da BASE4 SYSTEMS. As seções de portfólio de hardware (comparador antes/depois com fotos reais) e a demonstração do B4 Charge foram incorporadas recentemente. Ajustes finos de transição visual entre seções (hero → ecossistema, sobreposição de logo) foram corrigidos nos commits mais recentes.

O B4 Charge, sistema de cobrança apresentado como teaser dentro do site, é desenvolvido como projeto próprio (`tjl-charge-hostinger`) e ainda não foi lançado publicamente.

## Próximos passos

- Lançamento público do B4 Charge e atualização da seção de teaser para link direto ao produto
- Expansão do portfólio de projetos de software em destaque na seção de capacidade
- Novos casos de manutenção de hardware no comparador antes/depois

## Autor

Nicolas Pichiteli
