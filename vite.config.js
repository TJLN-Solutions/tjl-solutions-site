import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { sites } from '@openai/sites-vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const workerSource = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const url = new URL(request.url)
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}\n`

function sitesWorker() {
  return {
    name: 'base4-sites-worker',
    apply: 'build',
    async closeBundle() {
      const serverDirectory = resolve('dist/server')
      await mkdir(serverDirectory, { recursive: true })
      await writeFile(resolve(serverDirectory, 'index.js'), workerSource)
    },
  }
}

export default defineConfig({
  plugins: [react(), sites(), sitesWorker()],
})
