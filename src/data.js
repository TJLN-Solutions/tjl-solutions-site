export const problemsByField = {
  hardware: [
    { problem: 'Computador lento', answer: 'Diagnóstico e upgrade' },
    { problem: 'Equipamento não liga', answer: 'Análise e reparo' },
    { problem: 'Aquecimento e ruído', answer: 'Limpeza preventiva' },
    { problem: 'Arquivos inacessíveis', answer: 'Recuperação de dados' }
  ],
  software: [
    { problem: 'Empresa sem presença digital', answer: 'Site profissional' },
    { problem: 'Processos manuais', answer: 'Automação' },
    { problem: 'Dados desorganizados', answer: 'Sistema de gestão' },
    { problem: 'Ferramentas desconectadas', answer: 'Integrações' }
  ]
}

export const capabilities = [
  { label: 'Presença digital', title: 'Sites que apresentam, explicam e convertem.', detail: 'Sites institucionais, landing pages, catálogos e e-commerce.', visual: 'web' },
  { label: 'Operação sob medida', title: 'Sistemas que organizam o trabalho real.', detail: 'Gestão, dashboards, aplicações web e painéis internos.', visual: 'system' },
  { label: 'Fluxo conectado', title: 'Automações que devolvem tempo à equipe.', detail: 'Integrações, relatórios e processos executados sem repetição.', visual: 'flow' }
]

export const faq = [
  { q: 'Quanto tempo demora um conserto de hardware?', a: 'Diagnósticos simples saem no mesmo dia, em até 24h. Quando o reparo depende de uma peça ou fornecedor externo, o prazo é combinado com você antes de começar.' },
  { q: 'Vocês atendem só em Bilac?', a: 'O atendimento presencial de hardware é em Bilac e região. Já os projetos de software — sites, sistemas e automações — atendemos remotamente para qualquer lugar do Brasil.' },
  { q: 'Como funciona a garantia?', a: 'Os serviços de hardware têm garantia de até 45 dias, variando conforme o tipo de reparo. O prazo exato é informado junto com o orçamento.' },
  { q: 'Quais formas de pagamento vocês aceitam?', a: 'Pix, cartão de crédito e débito, dinheiro e parcelamento.' },
  { q: 'Recebo orçamento antes de começar?', a: 'Sim, sempre. Todo serviço — de hardware ou software — começa com um orçamento sem compromisso, antes de qualquer execução.' },
  { q: 'Recebo o código-fonte dos projetos de software?', a: 'Quando aplicável ao escopo do projeto, sim. Isso é combinado com você já no início do desenvolvimento.' },
]

export const people = [
  { name: 'Apollo', area: 'Hardware', role: 'Técnico em hardware', phone: '5518996464731', photo: '', differential: 'Diagnóstico rápido e preciso — resolve na bancada o que outros mandam pro fabricante.' },
  { name: 'Leonardo', area: 'Hardware', role: 'Técnico em hardware', phone: '5518996311838', photo: '', differential: 'Cuidado em cada detalhe do reparo, do primeiro diagnóstico até a entrega final.' },
  { name: 'Thiago', area: 'Software', role: 'Desenvolvedor full-stack', phone: '5518996980211', photo: '', differential: 'Constrói sistemas pensados para crescer junto com o negócio, não só para o próximo mês.' },
  { name: 'Nicolas', area: 'Software', role: 'Dev. Full Stack e UI/UX', phone: '5518996148839', photo: '/assets/brand/ImgPortifolio.jpeg', differential: 'Une código e design para entregar produtos que funcionam bem e parecem profissionais.' }
]
