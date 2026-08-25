export const contactPhones = { hardware: '5518996464731', software: '5518996980211' }

export function validateContact({ name, detail }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Informe seu nome com pelo menos 2 caracteres.'
  if (detail.trim().length < 10) errors.detail = 'Conte um pouco mais, usando pelo menos 10 caracteres.'
  return errors
}

export function buildContactMessage(field, name, detail) {
  return field === 'hardware'
    ? `Olá! Sou ${name.trim()}. Meu equipamento precisa de manutenção: ${detail.trim()}`
    : `Olá! Sou ${name.trim()}. Quero desenvolver um projeto: ${detail.trim()}`
}

export function buildWhatsAppUrl(field, name, detail) {
  return `https://wa.me/${contactPhones[field]}?text=${encodeURIComponent(buildContactMessage(field, name, detail))}`
}
