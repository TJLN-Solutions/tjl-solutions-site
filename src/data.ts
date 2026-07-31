export const navLinks = [
  { label: "Início", href: "#inicio", short: "01" },
  { label: "Empresa", href: "#sobre", short: "02" },
  { label: "BASE4 Charge", href: "#sistemas", short: "03" },
  { label: "Serviços", href: "#servicos", short: "04" },
  { label: "Diferenciais", href: "#diferenciais", short: "05" },
  { label: "Contato", href: "#contato", short: "06" },
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

export const areas: Record<ServiceArea, { label: string; short: string; desc: string }> = {
  hardware: {
    label: "Loja física · Hardware",
    short: "Hardware e atendimento presencial",
    desc: "Manutenção, conserto e montagem de computadores e notebooks, com atendimento na loja.",
  },
  software: {
    label: "Sistemas e software",
    short: "Sistemas, sites e automações",
    desc: "Sites, sistemas sob medida, automações e o BASE4 Charge — os produtos desenvolvidos pela empresa.",
  },
}

export type TeamMember = { name: string; phone: string; display: string; area: ServiceArea }

const roster: Omit<TeamMember, "display">[] = [
  { name: "Apollo", phone: "5518996464731", area: "hardware" },
  { name: "Leonardo", phone: "5518996311838", area: "hardware" },
  { name: "Thiago", phone: "5518996980211", area: "software" },
  { name: "Nicolas", phone: "5518996148839", area: "software" },
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
