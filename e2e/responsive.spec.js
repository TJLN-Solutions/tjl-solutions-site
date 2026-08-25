import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const viewports = [
  [320, 568], [360, 800], [375, 667], [390, 844], [412, 915],
  [768, 1024], [820, 1180], [821, 1180], [900, 1180],
  [980, 768], [981, 768], [1024, 768], [1280, 720],
  [1366, 768], [1440, 900], [1920, 1080], [667, 375],
]

test('matriz responsiva não cria overflow, saltos ou páginas excessivas', async ({ page }) => {
  const auditDir = path.resolve('test-results', 'responsive-audit')
  await mkdir(auditDir, { recursive: true })
  const results = []

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const metrics = await page.evaluate(() => {
      const sectionHeights = [...document.querySelectorAll('main > section')].map(section => ({
        id: section.id,
        height: Math.round(section.getBoundingClientRect().height),
      }))
      return {
        viewportWidth: innerWidth,
        pageHeight: document.documentElement.scrollHeight,
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        sectionHeights,
      }
    })
    results.push({ requested: { width, height }, ...metrics })
    expect(metrics.horizontalOverflow, `${width}x${height}: overflow horizontal`).toBeLessThanOrEqual(1)
    const maximumPageHeight = width <= 1100 ? 7600 : height * 12
    expect(metrics.pageHeight, `${width}x${height}: página longa demais`).toBeLessThan(maximumPageHeight)
    await page.screenshot({ path: path.join(auditDir, `${width}x${height}.png`), fullPage: true })
  }

  const byWidth = new Map(results.map(result => [result.requested.width, result]))
  for (const [left, right] of [[820, 821], [980, 981]]) {
    const delta = Math.abs(byWidth.get(left).pageHeight - byWidth.get(right).pageHeight)
    expect(delta, `salto de layout entre ${left}px e ${right}px`).toBeLessThan(300)
  }
  await writeFile(path.resolve('test-results', 'responsive-metrics.json'), JSON.stringify(results, null, 2))
})

test('hero preserva leitura e ações sem sobreposição em desktop', async ({ page }) => {
  for (const viewport of [{ width: 1024, height: 768 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const copy = await page.locator('.hero-copy').boundingBox()
    const actions = await page.locator('.hero-actions').boundingBox()
    expect(copy).not.toBeNull()
    expect(actions).not.toBeNull()
    expect(copy.y + copy.height, `${viewport.width}: título sobrepõe ações`).toBeLessThanOrEqual(actions.y + 1)
    await expect(page.locator('.hero-copy h1')).toBeVisible()
  }
})

test('menu móvel navega e entrega foco ao conteúdo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page.locator('#mobile-navigation a[href="#solucoes"]').click()
  await expect(page.locator('#solucoes')).toBeFocused()
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
})

test('formulário move o foco para o primeiro campo inválido', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    window.open = url => {
      window.__capturedWhatsApp = String(url)
      return { closed: false }
    }
  })
  await page.goto('/#contato')
  await page.locator('#contato button[type="submit"]').click()
  await expect(page.locator('#contato input[name="name"]')).toBeFocused()
  await expect(page.locator('#contato input[name="name"]')).toHaveAttribute('aria-invalid', 'true')
  await page.locator('#contato input[name="name"]').fill('Cliente Teste')
  await page.locator('#contato textarea[name="detail"]').fill('Preciso de ajuda com um notebook que não inicia.')
  await page.locator('#contato button[type="submit"]').click()
  const capturedUrl = await page.evaluate(() => window.__capturedWhatsApp)
  expect(capturedUrl).toContain('https://wa.me/')
  expect(capturedUrl).toContain('Cliente%20Teste')
})

test('Charge é legível, navegável e mantém a barra móvel horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#charge')
  await page.getByRole('button', { name: 'Abrir demonstração' }).click()
  const nav = page.locator('.charge-modal-content .demo-sidebar')
  await expect(nav).toBeVisible()
  expect(await nav.evaluate(element => getComputedStyle(element).flexDirection)).toBe('row')
  for (const label of ['Clientes', 'Vendas e contratos', 'Parcelas', 'Mensalidades', 'Calendário', 'Cobranças', 'Visão geral']) {
    await nav.getByRole('button', { name: label, exact: true }).click()
    await expect(nav.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-current', 'page')
  }
  for (const value of await page.locator('.charge-modal-content .demo-kpis strong').all()) {
    expect(await value.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
  }
  const demo = page.locator('.charge-modal-content .charge-demo')
  await expect(demo).toHaveClass(/theme-dark/)
  await page.getByRole('button', { name: 'Ativar modo claro' }).click()
  await expect(demo).toHaveClass(/theme-light/)
})

test('movimento reduzido mantém toda a narrativa essencial visível', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://localhost:3000/#transformacao')
  for (const selector of ['.scene-copy-matter', '.scene-copy-core', '.scene-copy-data', '.matter-object', '.transform-core']) {
    await expect(page.locator(selector)).toBeVisible()
  }
  await context.close()
})

test('teclado, modal e fluxos do Charge respondem sem erros de console', async ({ page }) => {
  const errors = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const menuButton = page.getByRole('button', { name: 'Abrir menu' })
  await menuButton.click()
  await page.keyboard.press('Escape')
  await expect(menuButton).toBeFocused()

  await page.goto('/#solucoes')
  const hardwareTab = page.getByRole('tab', { name: 'Hardware' })
  const softwareTab = page.getByRole('tab', { name: 'Software' })
  await hardwareTab.focus()
  await page.keyboard.press('ArrowRight')
  await expect(softwareTab).toHaveAttribute('aria-selected', 'true')

  await page.goto('/#charge')
  const opener = page.getByRole('button', { name: 'Abrir demonstração' })
  await opener.click()
  await expect(page.getByRole('button', { name: 'Fechar demonstração' })).toBeFocused()

  const nav = page.locator('.charge-modal-content .demo-sidebar')
  await nav.getByRole('button', { name: 'Clientes', exact: true }).click()
  const client = page.locator('.charge-modal-content .demo-client-list>button').nth(1)
  await client.click()
  await expect(client).toHaveClass(/active/)

  await nav.getByRole('button', { name: 'Vendas e contratos', exact: true }).click()
  await page.locator('.charge-modal-content .demo-sale-clients button').first().click()
  const continueButton = page.locator('.charge-modal-content .demo-sales-grid>aside>button')
  await expect(continueButton).toBeEnabled()
  await continueButton.click()
  await expect(page.locator('.charge-modal-content .demo-steps button').nth(1)).toHaveClass(/active/)

  await nav.getByRole('button', { name: 'Parcelas', exact: true }).click()
  await page.locator('.charge-modal-content .demo-installment-list>div>button:not(:disabled)').first().click()
  await expect(page.getByRole('button', { name: 'Fechar aviso' })).toBeVisible()
  await page.getByRole('button', { name: 'Fechar aviso' }).click()

  await nav.getByRole('button', { name: 'Calendário', exact: true }).click()
  const fourthDay = page.locator('.charge-modal-content .demo-calendar-grid main button').nth(3)
  await fourthDay.click()
  await expect(fourthDay).toHaveAttribute('aria-pressed', 'true')

  await nav.getByRole('button', { name: 'Cobranças', exact: true }).click()
  await page.locator('.charge-modal-content .demo-billing-grid>section>button').first().click()
  await expect(page.getByRole('button', { name: 'Limpar prévia' })).toBeVisible()
  await page.getByRole('button', { name: 'Limpar prévia' }).click()

  await page.keyboard.press('Escape')
  await expect(page.locator('.charge-modal')).toHaveCount(0)
  await expect(opener).toBeFocused()
  expect(errors).toEqual([])
})
