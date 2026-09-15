import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import test from 'node:test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const binPath = path.resolve(__dirname, '../bin/producer-cue.js')

test('Producer Cue: End-to-End MCP Stdio Protocol', async () => {
  const child = spawn(process.execPath, [binPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  let outputBuffer = ''
  child.stdout.on('data', (chunk) => {
    outputBuffer += chunk.toString()
  })

  function sendRpc(msg) {
    return new Promise((resolve) => {
      const startLen = outputBuffer.length
      child.stdin.write(JSON.stringify(msg) + '\n')

      const checkInterval = setInterval(() => {
        const newOutput = outputBuffer.slice(startLen)
        const lines = newOutput.split('\n').filter((l) => l.trim())
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)
            if (parsed.id === msg.id) {
              clearInterval(checkInterval)
              resolve(parsed)
              return
            }
          } catch (e) {}
        }
      }, 20)
    })
  }

  // 1. Handshake: initialize
  const initRes = await sendRpc({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {},
  })
  assert.equal(initRes.result.serverInfo.name, 'producer-cue')
  assert.equal(initRes.result.serverInfo.version, '1.0.0')

  // 2. List tools
  const listRes = await sendRpc({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {},
  })
  assert.ok(listRes.result.tools.length >= 6)
  const toolNames = listRes.result.tools.map((t) => t.name)
  assert.ok(toolNames.includes('producer_generate_theme'))
  assert.ok(toolNames.includes('producer_generate_component'))
  assert.ok(toolNames.includes('producer_audit_and_heal'))
  assert.ok(toolNames.includes('producer_export_code'))

  // 3. Call tool: producer_generate_theme
  const themeRes = await sendRpc({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'producer_generate_theme',
      arguments: {
        name: 'ProjectCuesDark',
        primarySeed: '#2563EB',
        scheme: 'dark',
      },
    },
  })
  const themeData = JSON.parse(themeRes.result.content[0].text)
  assert.equal(themeData.theme.scheme, 'dark')
  assert.ok(themeData.cssVariables.includes('--brand-default'))

  // 4. Call tool: producer_get_primitive
  const primRes = await sendRpc({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'producer_get_primitive',
      arguments: { type: 'accordion' },
    },
  })
  const primData = JSON.parse(primRes.result.content[0].text)
  assert.equal(primData.name, 'Accordion')

  // 5. Call tool: producer_export_code (React)
  const exportRes = await sendRpc({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'producer_export_code',
      arguments: {
        component: {
          name: 'HeroButton',
          nodes: {
            root: {
              type: 'element',
              tag: 'button',
              style: { display: 'flex' },
              children: [],
            },
          },
        },
        target: 'react',
      },
    },
  })
  const exportData = JSON.parse(exportRes.result.content[0].text)
  assert.ok(exportData.code.includes('export const HeroButton'))

  child.kill()
})
