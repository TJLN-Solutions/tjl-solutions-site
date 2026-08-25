import test from 'node:test'
import assert from 'node:assert/strict'
import { capabilities, people, problemsByField } from '../src/data.js'

test('mantém as duas frentes com problemas e respostas reais', () => {
  assert.equal(problemsByField.hardware.length, 4)
  assert.equal(problemsByField.software.length, 4)
  for (const field of Object.values(problemsByField)) {
    assert.ok(field.every(item => item.problem && item.answer))
  }
})

test('mantém somente telefones brasileiros válidos da equipe', () => {
  assert.equal(people.length, 4)
  assert.ok(people.every(person => /^55\d{11}$/.test(person.phone)))
})

test('declara capacidades sem métricas ou clientes fabricados', () => {
  assert.deepEqual(capabilities.map(item => item.visual), ['web', 'system', 'flow'])
  assert.ok(capabilities.every(item => item.label && item.title && item.detail))
})
