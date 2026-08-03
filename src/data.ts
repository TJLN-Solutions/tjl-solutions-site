export type SiteLink = { label: string; href: string; short: string }

/**
 * A barra de navegação leva quatro entradas, e só. São as quatro perguntas de
 * quem chega: quem são, o que fazem, quanto custa, como falo com vocês.
 *
 * Cada uma é um link de verdade para a sua seção — funciona no clique, sem
 * depender do menu abrir. O menu que aparece no hover é atalho para as seções
 * internas daquele assunto, não a única forma de navegar.
 *
 * A descrição de cada item existe para o cartão não virar só uma lista de
 * palavras: é ela que diz ao visitante o que vai encontrar lá.
 */
export type NavGroup = SiteLink & {
  items: { label: string; href: string; desc: string }[]
}

export const navGroups: NavGroup[] = [
  {
    label: "Empresa",
    href: "#sobre",
    short: "04",
    items: [
      { label: "Sobre a empresa", href: "#sobre", desc: "Como a BASE4 trabalha e por quê" },
      { label: "Equipe", href: "#equipe", desc: "As quatro pessoas que atendem você" },
      { label: "Diferenciais", href: "#diferenciais", desc: "O que nos separa da concorrência" },
      { label: "Depoimentos", href: "#depoimentos", desc: "O que dizem os clientes" },
      { label: "Dicas técnicas", href: "#dicas", desc: "Cuidados que evitam problema" },
    ],
  },
  {
    label: "Serviços",
    href: "#servicos",
    short: "07",
    items: [
      { label: "Nossas frentes", href: "#frentes", desc: "Hardware e software, lado a lado" },
      { label: "O que fazemos", href: "#servicos", desc: "Sites, sistemas, automação e manutenção" },
      { label: "BASE4 Charge", href: "#sistemas", desc: "O sistema de cobrança que criamos" },
      { label: "Como funciona", href: "#como-funciona", desc: "Do problema à entrega, em 4 passos" },
      { label: "Tecnologias", href: "#tecnologias", desc: "Marcas atendidas e stack de trabalho" },
    ],
  },
  {
    label: "Preços",
    href: "#investimento",
    short: "10",
    items: [
      { label: "Faixas de investimento", href: "#investimento", desc: "Quanto custa cada serviço" },
      { label: "Prazos e garantia", href: "#prazos", desc: "Quanto tempo leva e o que é coberto" },
      { label: "Portfólio", href: "#portfolio", desc: "Projetos já entregues" },
      { label: "Antes e depois", href: "#antes-depois", desc: "O resultado de uma limpeza completa" },
    ],
  },
  {
    label: "Contato",
    href: "#contato",
    short: "18",
    items: [
      { label: "Falar com a equipe", href: "#contato", desc: "Escolha a frente e mande a mensagem" },
      { label: "Onde estamos", href: "#localizacao", desc: "Endereço, mapa e horário da loja" },
      { label: "Dúvidas frequentes", href: "#faq", desc: "As perguntas que mais chegam" },
    ],
  },
]

/**
 * Índice completo das 20 seções. Vive onde há espaço para ele: o menu do
 * celular e o mapa do rodapé. O `short` é o código da seção na página, por
 * isso a sequência tem saltos.
 */
export const menuLinks: SiteLink[] = [
  { label: "Início", href: "#inicio", short: "01" },
  { label: "Nossas frentes", href: "#frentes", short: "02" },
  { label: "Empresa", href: "#sobre", short: "04" },
  { label: "Equipe", href: "#equipe", short: "05" },
  { label: "BASE4 Charge", href: "#sistemas", short: "06" },
  { label: "Serviços", href: "#servicos", short: "07" },
  { label: "Como funciona", href: "#como-funciona", short: "08" },
  { label: "Prazos e garantia", href: "#prazos", short: "09" },
  { label: "Preços", href: "#investimento", short: "10" },
  { label: "Portfólio", href: "#portfolio", short: "11" },
  { label: "Dúvidas frequentes", href: "#faq", short: "17" },
  { label: "Contato", href: "#contato", short: "18" },
  { label: "Onde estamos", href: "#localizacao", short: "19" },
]

/**
 * Formata um celular brasileiro (55 + DDD + 9 dígitos) para exibição.
 * O texto exibido é sempre derivado do número discado — nunca digitado à
 * mão — para que os dois não possam divergir.
 */
export const formatPhoneBR = (phone: string) =>
  phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "+55 $1 $2-$3")

export const whatsappUrl = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

/**
 * A equipe atende por duas frentes distintas. Quem procura conserto de
 * máquina e quem procura desenvolvimento fala com pessoas diferentes, então
 * a área precisa estar visível antes de o visitante escolher um contato.
 */
export type ServiceArea = "hardware" | "software"

export const areas: Record<
  ServiceArea,
  { label: string; short: string; desc: string; tab: string }
> = {
  hardware: {
    label: "Loja física · Hardware",
    short: "Hardware e atendimento presencial",
    /** Rótulo curto: em aba, duas palavras lado a lado no celular. */
    tab: "Hardware",
    desc: "Manutenção, conserto e montagem de computadores e notebooks, com atendimento na loja.",
  },
  software: {
    label: "Sistemas e software",
    short: "Sistemas, sites e automações",
    tab: "Software",
    desc: "Sites, sistemas sob medida, automações e o BASE4 Charge — os produtos desenvolvidos pela empresa.",
  },
}

export type TeamMember = {
  name: string
  phone: string
  display: string
  area: ServiceArea
  role: string
  bio: string
}

const roster: Omit<TeamMember, "display">[] = [
  {
    name: "Apollo",
    phone: "5518996464731",
    area: "hardware",
    role: "Técnico em hardware",
    bio: "Diagnóstico e reparo de equipamentos, do desktop antigo ao notebook novo.",
  },
  {
    name: "Leonardo",
    phone: "5518996311838",
    area: "hardware",
    role: "Técnico em hardware",
    bio: "Upgrade de performance: SSD, memória RAM e sistemas de refrigeração.",
  },
  {
    name: "Thiago",
    phone: "5518996980211",
    area: "software",
    role: "Desenvolvedor full-stack",
    bio: "Arquitetura de sistemas, aplicações web e integrações entre serviços.",
  },
  {
    name: "Nicolas",
    phone: "5518996148839",
    area: "software",
    role: "Dev & UI/UX",
    bio: "Interface, experiência de uso e front-end. Requisito virando tela que faz sentido.",
  },
]

export const team: TeamMember[] = roster.map((member) => ({
  ...member,
  display: formatPhoneBR(member.phone),
}))

export const teamByArea = (area: ServiceArea) => team.filter((member) => member.area === area)

/** Contato padrão dos CTAs que não deixam o visitante escolher com quem falar. */
export const primaryPhone = team[0].phone

/**
 * Cada serviço aponta para a área que o atende, para que o formulário possa
 * avisar quando o contato selecionado não for de quem cuida daquele assunto.
 * `null` = sem área definida, não há o que avisar.
 */
export const serviceOptions: { label: string; area: ServiceArea | null }[] = [
  { label: "Desenvolvimento de site", area: "software" },
  { label: "Manutenção de hardware", area: "hardware" },
  { label: "Desenvolvimento de automação", area: "software" },
  { label: "BASE4 Charge", area: "software" },
  { label: "Outro", area: null },
]

export const baseMessage =
  "Olá! Encontrei o contato pelo site da BASE4 e gostaria de conhecer melhor os serviços da empresa."

export const services = [
  {
    id: "01",
    key: "sites",
    title: "Desenvolvimento de sites",
    short: "Interfaces que trabalham pelo seu negócio.",
    desc: "Criação de sites modernos, responsivos e profissionais para empresas, lojas, escritórios, prestadores de serviços e portfólios.",
    items: [
      "Sites institucionais",
      "Landing pages",
      "Portfólios profissionais",
      "Catálogos digitais",
      "Integração com WhatsApp",
      "Formulários de contato",
      "Hospedagem e publicação",
    ],
    whatsapp: "Olá! Gostaria de solicitar um orçamento para desenvolvimento de site.",
  },
  {
    id: "02",
    key: "hardware",
    title: "Manutenção de hardware",
    short: "Diagnóstico preciso. Máquina pronta.",
    desc: "Serviços de manutenção, diagnóstico e melhoria de computadores e notebooks.",
    items: [
      "Formatação e instalação de sistemas",
      "Limpeza interna",
      "Troca de componentes",
      "Instalação de SSD e memória RAM",
      "Diagnóstico de problemas",
      "Otimização de computadores",
      "Backup e recuperação de arquivos",
    ],
    whatsapp: "Olá! Gostaria de solicitar um orçamento para manutenção de hardware.",
  },
  {
    id: "03",
    key: "automacoes",
    title: "Desenvolvimento de automações",
    short: "Menos tarefas. Mais fluxo.",
    desc: "Criação de automações personalizadas para reduzir tarefas manuais, organizar processos e melhorar a produtividade.",
    items: [
      "Automação de cobranças",
      "Integração entre sistemas",
      "Envio automático de mensagens",
      "Organização de dados",
      "Automatização de tarefas administrativas",
      "Fluxos personalizados para empresas",
    ],
    whatsapp: "Olá! Gostaria de solicitar um orçamento para desenvolvimento de automação.",
  },
]

/* ============================================================
   CONTEÚDO DAS SEÇÕES NOVAS

   ⚠️ REVISAR ANTES DE PUBLICAR
   Os blocos marcados com "confirmar" nasceram da geração no
   Figma e são estimativas, não dados verificados. Preço, prazo,
   garantia e depoimento errados no ar geram cobrança indevida e
   reclamação — confira com a equipe antes de subir para produção.
   ============================================================ */

export const empresa = {
  nome: "BASE4 SYSTEMS",
  endereco: "Rua XV de Novembro, 283",
  cidade: "Bilac",
  uf: "SP",
  cep: "16210-000",
  fundacao: "2016", // confirmar
  lat: -21.4055942,
  lng: -50.4757713,
}

/** Mensagens dos CTAs que já sabem de qual frente o visitante precisa. */
export const ctaMessages: Record<ServiceArea, string> = {
  hardware: "Olá! Meu computador está com problema e gostaria de levar na loja para diagnóstico.",
  software: "Olá! Tenho um projeto de sistema ou site em mente e gostaria de conversar.",
}

/* ---------------- 02 · Frentes ---------------- */

export const frentes: {
  area: ServiceArea
  numero: string
  titulo: string
  desc: string
  itens: string[]
  href: string
}[] = [
  {
    area: "hardware",
    numero: "Frente 01",
    titulo: "Manutenção de hardware",
    desc: "Loja física em Bilac, com atendimento presencial. Diagnóstico gratuito, peça com nota fiscal e garantia por escrito.",
    itens: [
      "Formatação e instalação",
      "Limpeza e manutenção preventiva",
      "Troca de peças e upgrade",
      "Diagnóstico de falhas",
      "Backup e recuperação de dados",
    ],
    href: "#servicos",
  },
  {
    area: "software",
    numero: "Frente 02",
    titulo: "Sistemas e software",
    desc: "Sites, sistemas web e automações sob medida. O código-fonte é entregue ao cliente, sem dependência de terceiros.",
    itens: [
      "Sites institucionais e landing pages",
      "Sistemas de gestão (ERP/CRM)",
      "Automações e integrações",
      "Lojas virtuais",
      "Painéis e aplicativos web",
    ],
    href: "#sistemas",
  },
]

/* ---------------- 03 · Números (confirmar) ---------------- */

export const numeros = [
  { valor: 8, sufixo: "+", label: "Anos no mercado" },
  { valor: 2400, sufixo: "+", label: "Equipamentos reparados" },
  { valor: 47, sufixo: "+", label: "Sistemas entregues" },
  { valor: 180, sufixo: "+", label: "Clientes atendidos" },
]

/* ---------------- 08 · Como funciona ---------------- */

export const trilhas: Record<
  ServiceArea,
  { passo: string; titulo: string; desc: string }[]
> = {
  hardware: [
    {
      passo: "01",
      titulo: "Traga o equipamento",
      desc: "Leve o notebook ou desktop até a loja em Bilac. Atendimento presencial de segunda a sábado.",
    },
    {
      passo: "02",
      titulo: "Diagnóstico gratuito",
      desc: "Identificamos o problema sem custo. Você recebe o orçamento antes de qualquer serviço.",
    },
    {
      passo: "03",
      titulo: "Aprovação e execução",
      desc: "Com o orçamento aprovado, o reparo começa com prazo definido.",
    },
    {
      passo: "04",
      titulo: "Retirada com garantia",
      desc: "Equipamento funcionando, com garantia por escrito e nota fiscal das peças.",
    },
  ],
  software: [
    {
      passo: "01",
      titulo: "Conversa inicial",
      desc: "Entendemos o processo atual e o que o sistema precisa resolver de verdade.",
    },
    {
      passo: "02",
      titulo: "Escopo e proposta",
      desc: "Escrevemos o que será entregue, com prazo e valor fechados antes de começar.",
    },
    {
      passo: "03",
      titulo: "Entregas parciais",
      desc: "Você acompanha e valida cada etapa antes de seguirmos para a próxima.",
    },
    {
      passo: "04",
      titulo: "Entrega e suporte",
      desc: "Publicação, treinamento, código-fonte na sua mão e suporte pós-entrega.",
    },
  ],
}

/* ---------------- 09 · Prazos e garantia (confirmar) ---------------- */

export const prazos: Record<
  ServiceArea,
  { servico: string; prazo: string; garantia: string }[]
> = {
  hardware: [
    { servico: "Diagnóstico", prazo: "No ato", garantia: "—" },
    { servico: "Formatação", prazo: "Mesmo dia", garantia: "30 dias" },
    { servico: "Limpeza preventiva", prazo: "1–2 horas", garantia: "30 dias" },
    { servico: "Troca de peça simples", prazo: "1–3 dias úteis", garantia: "90 dias" },
    { servico: "Troca de tela", prazo: "2–5 dias úteis", garantia: "90 dias" },
    { servico: "Recuperação de dados", prazo: "1–5 dias úteis", garantia: "—" },
    { servico: "Montagem de PC", prazo: "1–2 dias úteis", garantia: "6 meses" },
  ],
  software: [
    { servico: "Landing page", prazo: "3–7 dias úteis", garantia: "30 dias pós-entrega" },
    { servico: "Site institucional", prazo: "7–15 dias úteis", garantia: "60 dias pós-entrega" },
    { servico: "Sistema simples", prazo: "15–30 dias úteis", garantia: "90 dias pós-entrega" },
    { servico: "Sistema complexo", prazo: "A combinar", garantia: "90 dias pós-entrega" },
    { servico: "Automação", prazo: "5–15 dias úteis", garantia: "60 dias pós-entrega" },
    { servico: "Loja virtual", prazo: "10–20 dias úteis", garantia: "90 dias pós-entrega" },
  ],
}

/* ---------------- 10 · Faixas de investimento (confirmar) ---------------- */

export const investimento: Record<
  ServiceArea,
  { titulo: string; nota: string; itens: { servico: string; faixa: string }[] }
> = {
  hardware: {
    titulo: "Hardware · manutenção",
    nota: "Peça de reposição cobrada à parte, conforme o modelo do equipamento.",
    itens: [
      { servico: "Diagnóstico", faixa: "Gratuito" },
      { servico: "Formatação completa", faixa: "R$ 80 – R$ 150" },
      { servico: "Limpeza preventiva", faixa: "R$ 50 – R$ 100" },
      { servico: "Upgrade de SSD (mão de obra)", faixa: "R$ 50 – R$ 80" },
      { servico: "Troca de tela de notebook", faixa: "R$ 100 – R$ 300" },
      { servico: "Recuperação de dados", faixa: "R$ 100 – R$ 400" },
      { servico: "Montagem de PC", faixa: "A partir de R$ 150" },
    ],
  },
  software: {
    titulo: "Software · desenvolvimento",
    nota: "Orçamento sem compromisso, com parcelamento em até 6×.",
    itens: [
      { servico: "Landing page", faixa: "A partir de R$ 800" },
      { servico: "Site institucional", faixa: "R$ 1.500 – R$ 4.000" },
      { servico: "Sistema de gestão", faixa: "R$ 4.000 – R$ 15.000" },
      { servico: "Loja virtual", faixa: "R$ 3.000 – R$ 10.000" },
      { servico: "Automação", faixa: "R$ 500 – R$ 3.000" },
      { servico: "Aplicativo web", faixa: "A partir de R$ 5.000" },
    ],
  },
}

/* ---------------- 11 · Portfólio (confirmar os projetos) ---------------- */

export const portfolio = [
  {
    numero: "01",
    categoria: "ERP · Web app",
    titulo: "Sistema de gestão para distribuidora",
    desc: "Controle de estoque, pedidos, faturamento e rotas de entrega para distribuidora regional.",
    stack: ["React", "Node.js", "PostgreSQL"],
  },
  {
    numero: "02",
    categoria: "Loja virtual",
    titulo: "E-commerce de calçados",
    desc: "Catálogo amplo, checkout integrado, controle de estoque e painel de pedidos.",
    stack: ["Next.js", "Pagamentos", "MySQL"],
  },
  {
    numero: "03",
    categoria: "Site institucional",
    titulo: "Site para escritório de advocacia",
    desc: "Presença digital sóbria, com blog, formulário de contato e área restrita para clientes.",
    stack: ["React", "Tailwind", "CMS"],
  },
  {
    numero: "04",
    categoria: "Automação",
    titulo: "Automação de relatórios para clínica",
    desc: "Coleta de dados de várias fontes e envio programado de relatórios gerenciais.",
    stack: ["Python", "BI", "API REST"],
  },
]

/* ---------------- 12 · Antes e depois (confirmar os ganhos) ---------------- */

export const antesDepois = {
  ganhos: [
    { valor: "−15 °C", label: "Temperatura" },
    { valor: "−60%", label: "Barulho do cooler" },
    { valor: "−90%", label: "Travamentos" },
  ],
}

/* ---------------- 13 · Tecnologias ---------------- */

export const tecnologias: { titulo: string; area: ServiceArea; itens: string[] }[] = [
  {
    titulo: "Hardware atendido",
    area: "hardware",
    itens: [
      "Windows 10/11",
      "macOS",
      "Linux",
      "Dell",
      "HP",
      "Lenovo",
      "ASUS",
      "Acer",
      "Samsung",
      "Positivo",
      "Intel",
      "AMD",
    ],
  },
  {
    titulo: "Stack de desenvolvimento",
    area: "software",
    itens: [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "TypeScript",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "WordPress",
      "Figma",
      "AWS",
      "Docker",
    ],
  },
]

/* ---------------- 14 · Depoimentos ----------------
   ⚠️ confirmar: textos gerados como exemplo. Depoimento inventado
   atribuído a pessoa real é problema sério — publique somente com
   autorização de quem falou. */

export const depoimentos = [
  {
    texto:
      "Trouxe meu notebook quebrado de manhã e retirei até o meio-dia. Serviço rápido, preço justo e saiu com nota fiscal.",
    nome: "Marcos T.",
    contexto: "Cliente · reparo de hardware",
  },
  {
    texto:
      "O sistema que a BASE4 desenvolveu para minha distribuidora reduziu bastante o tempo de fechamento diário.",
    nome: "Patrícia L.",
    contexto: "Proprietária · distribuidora regional",
  },
  {
    texto:
      "Suporte rápido, atencioso e sem enrolação. Já indiquei para os amigos que precisaram de assistência aqui na região.",
    nome: "Ricardo A.",
    contexto: "MEI · cliente recorrente",
  },
]

/* ---------------- 16 · Dicas ---------------- */

export const dicas = [
  {
    numero: "01",
    titulo: "Nunca desligue o PC direto da tomada",
    desc: "Desligar sem encerrar o sistema pode corromper arquivos, danificar o disco e causar falha no Windows. Use sempre Iniciar → Desligar.",
  },
  {
    numero: "02",
    titulo: "Faça backup dos seus dados com regularidade",
    desc: "Nenhum hardware dura para sempre. HD externo, pendrive ou nuvem — pelo menos uma vez por semana para o que você não pode perder.",
  },
  {
    numero: "03",
    titulo: "Mantenha o interior do gabinete limpo",
    desc: "Poeira é o principal vilão do desempenho. Um computador limpo a cada 6 meses roda mais frio, mais silencioso e dura mais.",
  },
]

/* ---------------- 17 · FAQ ---------------- */

export const faq = [
  {
    pergunta: "Qual o prazo para conserto de hardware?",
    resposta:
      "Formatação e limpeza geralmente saem no mesmo dia. Reparo com troca de peça leva de 1 a 5 dias úteis, dependendo da disponibilidade do componente. O prazo é sempre confirmado antes de começar.",
  },
  {
    pergunta: "Atendem notebooks e desktops de todas as marcas?",
    resposta:
      "Sim. Trabalhamos com Dell, HP, Lenovo, ASUS, Acer, Samsung, Positivo e demais marcas. Também atendemos Mac para limpeza, formatação e diagnóstico.",
  },
  {
    pergunta: "Como funciona o orçamento?",
    resposta:
      "O diagnóstico é gratuito. Depois de identificar o problema, emitimos um orçamento detalhado. O serviço só começa com a sua aprovação — sem custo surpresa.",
  },
  {
    pergunta: "O que é o BASE4 Charge?",
    resposta:
      "É um sistema de gestão de cargas desenvolvido internamente pela BASE4 SYSTEMS. Permite monitorar operações em tempo real, gerar relatórios automáticos e centralizar o controle logístico. Está disponível para demonstração.",
  },
  {
    pergunta: "Quanto tempo leva para desenvolver um sistema?",
    resposta:
      "Depende da complexidade. Uma landing page fica pronta em 3 a 7 dias. Um sistema de gestão completo pode levar de 15 a 60 dias. O prazo é definido junto com o escopo, antes de qualquer contrato.",
  },
  {
    pergunta: "Trabalham com empresas de fora de Bilac?",
    resposta:
      "Sim. O desenvolvimento de software é totalmente remoto e atendemos toda a região — Araçatuba, Birigui, Penápolis, Lins — além de outros estados.",
  },
  {
    pergunta: "Oferecem suporte depois da entrega do sistema?",
    resposta:
      "Sempre. Todo projeto inclui período de suporte pós-entrega, de 30 a 90 dias conforme o contrato. Correção de bug e ajuste dentro do escopo original não têm custo adicional.",
  },
  {
    pergunta: "Como acompanho o status do meu reparo?",
    resposta:
      "Avisamos pelo WhatsApp nas etapas principais: recebimento, diagnóstico concluído, início do serviço e pronto para retirada. Você também pode ligar a qualquer momento.",
  },
]

/* ---------------- 19 · Horário de atendimento ---------------- */

export const horarios: { dia: string; hora: string; fechado?: boolean }[] = [
  { dia: "Segunda a sexta", hora: "08h – 18h" },
  { dia: "Sábado", hora: "08h – 12h" },
  { dia: "Domingo e feriados", hora: "Fechado", fechado: true },
]
