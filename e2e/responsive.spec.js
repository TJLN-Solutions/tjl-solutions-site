import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const viewports = [
  [320, 568], [360, 800], [375, 667], [390, 844], [412, 915], [430, 932],
  [600, 960], [768, 1024], [820, 1180], [821, 1180], [900, 1180], [1024, 1366],
  [980, 768], [1024, 768], [1280, 720], [1366, 768], [1440, 900],
  [1536, 864], [1920, 1080], [2560, 1440],
  [667, 375], [844, 390], [915, 412], [1180, 820],
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
    const maximumPageHeight = width < 600 ? 7600 : width <= 1100 ? 8400 : height * 12
    expect(metrics.pageHeight, `${width}x${height}: página longa demais`).toBeLessThan(maximumPageHeight)
    await page.screenshot({ path: path.join(auditDir, `${width}x${height}.png`), fullPage: true })
  }

  const leftBreakpoint = results.find(result => result.requested.width === 820 && result.requested.height === 1180)
  const rightBreakpoint = results.find(result => result.requested.width === 821 && result.requested.height === 1180)
  const breakpointDelta = Math.abs(leftBreakpoint.pageHeight - rightBreakpoint.pageHeight)
  expect(breakpointDelta, 'salto de layout entre 820px e 821px').toBeLessThan(300)
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

test('controles interativos mantêm área mínima de toque no celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const undersizedTargets = await page.locator('a, button, input, textarea').evaluateAll(elements => elements
    .filter(element => {
      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && box.width > 0
        && box.height > 0
        && (box.width < 43.5 || box.height < 43.5)
    })
    .map(element => ({
      label: element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('placeholder'),
      width: Math.round(element.getBoundingClientRect().width),
      height: Math.round(element.getBoundingClientRect().height),
    })))

  expect(undersizedTargets).toEqual([])
})

test('movimento cinematográfico fica restrito às telas grandes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
  await page.mouse.move(1180, 260)
  await expect.poll(() => page.locator('.hero-scene').evaluate(element => element.style.getPropertyValue('--cursor-x'))).not.toBe('')
  await expect(page.locator('.hero-mark img')).toHaveCSS('animation-name', /markArrive, markBreathe/)

  await page.locator('.desktop-nav a[href="#transformacao"]').click()
  await expect.poll(() => page.locator('.transformation-scene').evaluate(element => element.style.getPropertyValue('--progress'))).not.toBe('')
  await expect(page.locator('.transformation-sticky')).toHaveCSS('position', 'sticky')
  const phaseAt = async progress => {
    await page.locator('.transformation-scene').evaluate((element, value) => {
      const distance = element.offsetHeight - innerHeight
      scrollTo(0, element.offsetTop + distance * value)
    }, progress)
    await page.waitForTimeout(80)
    return page.locator('.transformation-scene').evaluate(element => ({
      matter: Number(element.style.getPropertyValue('--matter')),
      core: Number(element.style.getPropertyValue('--core')),
      data: Number(element.style.getPropertyValue('--data')),
      final: Number(element.style.getPropertyValue('--final')),
      gpuFrame: Number(element.dataset.gpuFrame),
    }))
  }
  const gpuAssembled = await phaseAt(.01)
  const gpuDisassembled = await phaseAt(.2)
  const gpuReassembled = await phaseAt(.04)
  expect(gpuDisassembled.gpuFrame).toBeGreaterThan(gpuAssembled.gpuFrame)
  expect(gpuReassembled.gpuFrame).toBeLessThan(gpuDisassembled.gpuFrame)
  expect((await phaseAt(.05)).matter).toBeGreaterThan(.7)
  expect((await phaseAt(.45)).core).toBeGreaterThan(.9)
  expect((await phaseAt(.7)).data).toBeGreaterThan(.9)
  expect((await phaseAt(.96)).final).toBeGreaterThan(.9)
  await expect(page.locator('.final-copy')).toContainText('Da máquina que sustenta')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.hero-mark img')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-mark')).toHaveCSS('transform', 'none')
  expect(await page.locator('.transformation-scene').evaluate(element => element.style.getPropertyValue('--progress'))).toBe('')
  await expect(page.locator('.transformation-sticky')).toHaveCSS('position', 'relative')
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

test('imagens, recursos e textos permanecem íntegros em todos os formatos', async ({ page }) => {
  const failedResources = []
  page.on('response', response => {
    if (response.status() >= 400 && new URL(response.url()).origin === 'http://localhost:3000') {
      failedResources.push(`${response.status()} ${response.url()}`)
    }
  })

  for (const [width, height] of [[320, 568], [375, 667], [412, 915], [667, 375], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(80)
    }

    const integrity = await page.evaluate(() => {
      const visible = element => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .05 && rect.width > 1 && rect.height > 1
      }
      const brokenImages = [...document.images]
        .filter(image => visible(image) && (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0))
        .map(image => image.currentSrc || image.src)
      const clippedText = []

      for (const element of document.querySelectorAll('h1,h2,h3,p,a,button,label,legend,strong,small')) {
        if (!visible(element) || !element.textContent.trim()) continue
        if (element.closest('.demo-sidebar') || element.closest('.demo-calendar-grid')) continue
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        const textNodes = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        if (!textNodes.length) continue
        const textBounds = textNodes.map(node => {
          const range = document.createRange()
          range.selectNodeContents(node)
          return range.getBoundingClientRect()
        })
        const clipsX = ['hidden', 'clip'].includes(style.overflowX)
        const clipsY = ['hidden', 'clip'].includes(style.overflowY)
        if ((clipsX && textBounds.some(bounds => bounds.left < rect.left - 2 || bounds.right > rect.right + 2)) || (clipsY && textBounds.some(bounds => bounds.top < rect.top - 2 || bounds.bottom > rect.bottom + 2))) {
          clippedText.push(`${element.tagName.toLowerCase()}.${element.className || '(sem-classe)'}: ${element.textContent.trim().slice(0, 80)}`)
        }
        if (textBounds.some(bounds => bounds.right < -2 || bounds.left > innerWidth + 2)) {
          clippedText.push(`${element.tagName.toLowerCase()}.${element.className || '(sem-classe)'} fora da tela`)
        }
      }
      return { brokenImages, clippedText }
    })

    expect(integrity.brokenImages, `${width}x${height}: imagens quebradas`).toEqual([])
    expect(integrity.clippedText, `${width}x${height}: textos cortados ou fora da tela`).toEqual([])
  }

  expect(failedResources, 'recursos locais com erro HTTP').toEqual([])
})

test('novos visuais da narrativa carregam com proporção preservada', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/#transformacao')
    const assets = [
      viewport.width > 1100
        ? { selector: '.matter-object .gpu-frame', naturalWidth: 1170, naturalHeight: 600 }
        : { selector: '.matter-object .gpu-static', naturalWidth: 1400, naturalHeight: 583 },
      { selector: '.data-visual .scene-asset', naturalWidth: 1280, naturalHeight: 853 },
    ]
    for (const asset of assets) {
      const image = page.locator(asset.selector).first()
      await expect(image).toBeAttached()
      const dimensions = await image.evaluate(element => ({
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        renderedWidth: element.getBoundingClientRect().width,
        renderedHeight: element.getBoundingClientRect().height,
      }))
      expect(dimensions.complete).toBe(true)
      expect(dimensions.naturalWidth).toBe(asset.naturalWidth)
      expect(dimensions.naturalHeight).toBe(asset.naturalHeight)
      expect(dimensions.renderedWidth).toBeGreaterThan(100)
      expect(dimensions.renderedHeight).toBeGreaterThan(60)
      expect(dimensions.renderedWidth / dimensions.renderedHeight).toBeCloseTo(asset.naturalWidth / asset.naturalHeight, 1)
    }
  }
})

test('âncoras mantêm os títulos abaixo do cabeçalho fixo', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 667, height: 375 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
    for (const id of ['solucoes', 'charge', 'capacidade', 'presenca', 'contato']) {
      await page.evaluate(anchor => { location.hash = anchor }, id)
      await page.waitForTimeout(80)
      const header = await page.locator('.header-shell').boundingBox()
      const heading = await page.locator(`#${id} h2`).first().boundingBox()
      expect(header).not.toBeNull()
      expect(heading, `${viewport.width}x${viewport.height} #${id}: título ausente`).not.toBeNull()
      expect(heading.y, `${viewport.width}x${viewport.height} #${id}: título sob o cabeçalho`).toBeGreaterThanOrEqual(header.y + header.height + 4)
    }
  }
})

test('modal do Charge cabe na tela e conserva todas as abas navegáveis', async ({ page }) => {
  const labels = ['Visão geral', 'Clientes', 'Vendas e contratos', 'Parcelas', 'Mensalidades', 'Calendário', 'Cobranças']
  for (const viewport of [{ width: 320, height: 568 }, { width: 568, height: 320 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/#charge')
    await page.getByRole('button', { name: /(?:Abrir|Ampliar) demonstração/ }).click()
    const dialog = page.locator('.charge-modal-dialog')
    await expect(dialog).toBeVisible()
    const bounds = await dialog.boundingBox()
    expect(bounds.x, `${viewport.width}x${viewport.height}: modal fora à esquerda`).toBeGreaterThanOrEqual(0)
    expect(bounds.y, `${viewport.width}x${viewport.height}: modal fora acima`).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width, `${viewport.width}x${viewport.height}: modal fora à direita`).toBeLessThanOrEqual(viewport.width + 1)
    expect(bounds.y + bounds.height, `${viewport.width}x${viewport.height}: modal fora abaixo`).toBeLessThanOrEqual(viewport.height + 1)
    await expect(page.getByRole('button', { name: 'Fechar demonstração' })).toBeVisible()

    const nav = page.locator('.charge-modal-content .demo-sidebar')
    for (const label of labels) {
      const button = nav.getByRole('button', { name: label, exact: true })
      await button.scrollIntoViewIfNeeded()
      await button.click()
      await expect(button).toHaveAttribute('aria-current', 'page')
      await expect(page.locator('.charge-modal-content .demo-view')).toBeVisible()
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `${viewport.width}x${viewport.height}: modal criou overflow na página`).toBeLessThanOrEqual(1)
    await page.getByRole('button', { name: 'Fechar demonstração' }).click()
  }
})

test('prévias dos projetos carregam sem distorção em celular e desktop', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/#capacidade')
    const options = page.locator('.capability-list button')
    for (const index of [0, 1]) {
      await options.nth(index).click()
      const image = page.locator('.portfolio-preview img')
      await expect(image).toBeVisible()
      const dimensions = await image.evaluate(element => ({
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        renderedWidth: element.getBoundingClientRect().width,
        renderedHeight: element.getBoundingClientRect().height,
      }))
      expect(dimensions.complete).toBe(true)
      expect(dimensions.naturalWidth).toBeGreaterThan(0)
      expect(dimensions.naturalHeight).toBeGreaterThan(0)
      expect(dimensions.renderedWidth).toBeGreaterThan(40)
      expect(dimensions.renderedHeight).toBeGreaterThan(40)
    }
  }
})

test('redimensionamento em tempo real não reaproveita posições do layout anterior', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1024, height: 811 },
    { width: 768, height: 1024 },
    { width: 480, height: 811 },
    { width: 390, height: 844 },
    { width: 960, height: 540 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(50)
    const heroParts = await page.locator('.hero-mark,.hero-copy,.hero-actions').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect()
      return { left: rect.left, right: rect.right, width: rect.width }
    }))
    for (const part of heroParts) {
      expect(part.left, `${viewport.width}x${viewport.height}: hero fora à esquerda`).toBeGreaterThanOrEqual(0)
      expect(part.right, `${viewport.width}x${viewport.height}: hero fora à direita`).toBeLessThanOrEqual(viewport.width + 1)
      expect(part.width, `${viewport.width}x${viewport.height}: hero colapsado`).toBeGreaterThan(100)
    }
    await page.evaluate(() => document.querySelector('#transformacao').scrollIntoView({ block: 'start' }))
    await page.waitForTimeout(80)

    const result = await page.evaluate(() => {
      const viewportWidth = innerWidth
      const boxes = [...document.querySelectorAll('.transformation-card')].map(card => {
        const rect = card.getBoundingClientRect()
        return { display: getComputedStyle(card).display, left: rect.left, right: rect.right, width: rect.width }
      })
      const headings = [...document.querySelectorAll('.transformation-card h2')].map(heading => {
        const rect = heading.getBoundingClientRect()
        const textBlock = heading.closest('.scene-copy,.final-copy')
        const card = heading.closest('.transformation-card')
        const opacity = (textBlock ? Number(getComputedStyle(textBlock).opacity) : 0) * (card ? Number(getComputedStyle(card).opacity) : 1)
        return { visible: rect.width > 0 && rect.height > 0, opacity, left: rect.left, right: rect.right, width: rect.width, scrollWidth: heading.scrollWidth }
      })
      return { viewportWidth, scrollX, pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, boxes, headings }
    })

    expect(result.scrollX, `${viewport.width}x${viewport.height}: deslocamento horizontal persistente`).toBe(0)
    expect(result.pageOverflow, `${viewport.width}x${viewport.height}: overflow após redimensionar`).toBeLessThanOrEqual(1)
    const layoutBoxes = result.boxes.filter(box => box.display !== 'contents' && box.display !== 'none')
    expect(layoutBoxes.length, `${viewport.width}x${viewport.height}: modo narrativo incorreto`).toBe(viewport.width <= 1100 ? 3 : 1)
    for (const box of layoutBoxes) {
      expect(box.left, `${viewport.width}x${viewport.height}: card fora à esquerda`).toBeGreaterThanOrEqual(0)
      expect(box.right, `${viewport.width}x${viewport.height}: card fora à direita`).toBeLessThanOrEqual(result.viewportWidth + 1)
      expect(box.width, `${viewport.width}x${viewport.height}: card colapsado`).toBeGreaterThan(250)
    }
    for (const heading of result.headings.filter(item => item.visible && item.opacity > .05)) {
      expect(heading.left, `${viewport.width}x${viewport.height}: título fora à esquerda`).toBeGreaterThanOrEqual(0)
      expect(heading.right, `${viewport.width}x${viewport.height}: título fora à direita`).toBeLessThanOrEqual(result.viewportWidth + 1)
      expect(heading.scrollWidth, `${viewport.width}x${viewport.height}: título cortado`).toBeLessThanOrEqual(heading.width + 2)
    }
  }
})
