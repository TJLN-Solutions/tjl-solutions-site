import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const charge = readFileSync(new URL('../src/ChargeDemo.jsx', import.meta.url), 'utf8')

test('menu móvel expõe estado, controle, Escape e restauração de foco', () => {
  assert.match(app, /aria-expanded=\{open\}/)
  assert.match(app, /aria-controls="mobile-navigation"/)
  assert.match(app, /event\.key === 'Escape'/)
  assert.match(app, /trigger\?\.focus\(\)/)
})

test('abas de solução seguem o padrão acessível e aceitam setas', () => {
  assert.match(app, /role="tablist"/)
  assert.match(app, /aria-controls=\{`\$\{tabsId\}-panel`\}/)
  assert.match(app, /ArrowRight/)
  assert.match(app, /role="tabpanel"/)
})

test('demonstração Charge oferece modal, tema, navegação e recebimento local', () => {
  assert.match(app, /aria-modal="true"/)
  assert.match(app, /Abrir demonstração/)
  for (const view of ['overview', 'clients', 'sales', 'installments', 'subscriptions', 'calendar', 'billing']) assert.match(charge, new RegExp(`id: '${view}'`))
  assert.match(charge, /Ativar modo/)
  assert.match(charge, /Receber/)
  assert.match(charge, /nenhum dado é salvo/)
})

test('formulário declara validação, erros e alternativa a popup bloqueado', () => {
  assert.match(app, /aria-invalid/)
  assert.match(app, /role="alert"/)
  assert.match(app, /whatsapp-fallback/)
  assert.match(app, /Nada é enviado automaticamente/)
})
