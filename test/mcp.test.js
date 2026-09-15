import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import test from 'node:test'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { createHttpServer } from '../src/server.js'

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

test('Producer Cue: End-to-End Cloud HTTP & SSE Transport', async () => {
  const server = createHttpServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  function makeRequest(pathname, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: pathname,
          method,
          headers: {
            ...headers,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
          },
        },
        (res) => {
          let data = ''
          res.on('data', (c) => (data += c))
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
            })
          })
        }
      )
      req.on('error', reject)
      if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body))
      req.end()
    })
  }

  // 1. Health check: GET /health
  const health = await makeRequest('/health')
  assert.equal(health.statusCode, 200)
  const healthJson = JSON.parse(health.body)
  assert.equal(healthJson.status, 'ok')
  assert.equal(healthJson.server, 'producer-cue')
  assert.equal(healthJson.tools, 7)

  // 2. Tools list: GET /tools
  const tools = await makeRequest('/tools')
  assert.equal(tools.statusCode, 200)
  const toolsJson = JSON.parse(tools.body)
  assert.equal(toolsJson.total_tools, 7)
  assert.ok(toolsJson.tools.find((t) => t.name === 'producer_generate_theme'))

  // 3. Web Dashboard: GET /
  const dashboard = await makeRequest('/')
  assert.equal(dashboard.statusCode, 200)
  assert.ok(dashboard.body.includes('Producer Cue'))
  assert.ok(dashboard.body.includes('Project Cues, Inc.'))

  // 4. Direct JSON-RPC: POST /rpc
  const rpcRes = await makeRequest('/rpc', 'POST', {
    jsonrpc: '2.0',
    id: 10,
    method: 'tools/call',
    params: {
      name: 'producer_get_primitive',
      arguments: { type: 'toast' },
    },
  })
  assert.equal(rpcRes.statusCode, 200)
  const rpcJson = JSON.parse(rpcRes.body)
  assert.equal(rpcJson.id, 10)
  const toastData = JSON.parse(rpcJson.result.content[0].text)
  assert.equal(toastData.name, 'Toast')

  // 5. Streamable HTTP: POST /mcp
  const mcpRes = await makeRequest('/mcp', 'POST', {
    jsonrpc: '2.0',
    id: 11,
    method: 'tools/list',
    params: {},
  })
  assert.equal(mcpRes.statusCode, 200)
  const mcpJson = JSON.parse(mcpRes.body)
  assert.equal(mcpJson.id, 11)
  assert.equal(mcpJson.result.tools.length, 7)

  // 6. SSE Transport: GET /sse & POST /messages
  const sseSession = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: '/sse',
        method: 'GET',
      },
      (res) => {
        let buffer = ''
        res.on('data', (chunk) => {
          buffer += chunk.toString()
          if (buffer.includes('event: endpoint')) {
            const match = buffer.match(/data: \/messages\?sessionId=([a-f0-9-]+)/)
            if (match) {
              resolve({
                sessionId: match[1],
                res,
                req,
                getBuffer: () => buffer,
              })
            }
          }
        })
      }
    )
    req.on('error', reject)
    req.end()
  })

  assert.ok(sseSession.sessionId)

  // Send message via POST /messages
  const msgRes = await makeRequest(
    `/messages?sessionId=${sseSession.sessionId}`,
    'POST',
    {
      jsonrpc: '2.0',
      id: 99,
      method: 'tools/call',
      params: {
        name: 'producer_get_primitive',
        arguments: { type: 'combobox' },
      },
    }
  )
  assert.equal(msgRes.statusCode, 202)

  // Verify message arrived over SSE
  await new Promise((resolve) => setTimeout(resolve, 50))
  const sseOutput = sseSession.getBuffer()
  assert.ok(sseOutput.includes('"id":99'))
  assert.ok(sseOutput.includes('Combobox'))

  sseSession.req.destroy()
  await new Promise((resolve) => server.close(resolve))
})
