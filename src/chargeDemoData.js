export const chargeClients = [
  { id: 1, initials: 'AD', name: 'Ana Demo Silva', detail: 'Notebook Profissional', status: 'Em dia', balance: 3200 },
  { id: 2, initials: 'BD', name: 'Bruno Demo Santos', detail: 'Smartphone Empresarial', status: 'Em atraso', balance: 1200 },
  { id: 3, initials: 'CD', name: 'Carla Demonstração Lima', detail: 'Kit Energia Solar', status: 'Renegociado', balance: 8200 },
]

export const chargeInstallments = [
  { id: 1, client: 'Carla Demonstração Lima', short: 'CD', due: '01/09', part: '2/8', value: 1025, status: 'Pendente' },
  { id: 2, client: 'Bruno Demo Santos', short: 'BD', due: '18/08', part: '3/6', value: 400, status: 'Vencida' },
  { id: 3, client: 'Ana Demo Silva', short: 'AD', due: '01/09', part: '5/12', value: 400, status: 'Pendente' },
]

export const chargeChart = [32, 48, 39, 66, 52, 82]

export const chargeRevealAt = '2026-09-20T00:00:00-03:00'

export const formatChargeMoney = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
