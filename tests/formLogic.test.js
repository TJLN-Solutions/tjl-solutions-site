import assert from 'node:assert/strict'
import test from 'node:test'
import { buildContactMessage, buildWhatsAppUrl, contactPhones, validateContact } from '../src/formLogic.js'

test('valida nome e descrição antes de abrir o WhatsApp', () => {
  assert.deepEqual(validateContact({ name: 'A', detail: 'curto' }), {
    name: 'Informe seu nome com pelo menos 2 caracteres.',
    detail: 'Conte um pouco mais, usando pelo menos 10 caracteres.',
  })
  assert.deepEqual(validateContact({ name: ' Thiago ', detail: ' Preciso reparar meu notebook ' }), {})
})

test('monta mensagens específicas sem perder os dados digitados', () => {
  assert.equal(buildContactMessage('hardware', ' Ana ', ' Notebook sem vídeo '), 'Olá! Sou Ana. Meu equipamento precisa de manutenção: Notebook sem vídeo')
  assert.equal(buildContactMessage('software', ' Bruno ', ' Portal para clientes '), 'Olá! Sou Bruno. Quero desenvolver um projeto: Portal para clientes')
})

test('gera URL segura para o contato correto', () => {
  const url = new URL(buildWhatsAppUrl('software', 'Carla', 'Automação do atendimento'))
  assert.equal(url.hostname, 'wa.me')
  assert.equal(url.pathname, `/${contactPhones.software}`)
  assert.match(url.searchParams.get('text'), /Carla/)
})
