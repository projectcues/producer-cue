import http from 'node:http'
import crypto from 'node:crypto'
import { URL } from 'node:url'
import { MCP_TOOLS, executeRpc } from './mcp/mcpServer.js'

const sessions = new Map()

export function createHttpServer() {
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const pathname = parsedUrl.pathname
    const method = req.method

    // Permissive CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id, mcp-session-id')
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id, mcp-session-id')

    if (method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    // Helper: Read JSON Body
    async function readJsonBody() {
      return new Promise((resolve, reject) => {
        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
          if (raw.length > 10 * 1024 * 1024) {
            reject(new Error('Payload too large'))
          }
        })
        req.on('end', () => {
          if (!raw.trim()) {
            resolve({})
            return
          }
          try {
            resolve(JSON.parse(raw))
          } catch (e) {
            reject(new Error(`Invalid JSON: ${e.message}`))
          }
        })
        req.on('error', reject)
      })
    }

    // Health Check: GET /health
    if (pathname === '/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify(
          {
            status: 'ok',
            server: 'producer-cue',
            name: 'Producer Cue: Autonomous AI Design & Development Engine',
            version: '1.0.0',
            vendor: 'Project Cues, Inc.',
            cage: '9YWL9',
            uei: 'LPSKXU1KEJY8',
            tools: MCP_TOOLS.length,
            transports: ['stdio', 'sse', 'streamable-http', 'json-rpc'],
            activeSessions: sessions.size,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      )
      return
    }

    // Tools Schema Registry: GET /tools
    if (pathname === '/tools' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify(
          {
            server: 'producer-cue',
            version: '1.0.0',
            total_tools: MCP_TOOLS.length,
            tools: MCP_TOOLS,
          },
          null,
          2
        )
      )
      return
    }

    // Model Context Protocol SSE Transport: GET /sse
    if (pathname === '/sse' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      })

      const sessionId = crypto.randomUUID()
      sessions.set(sessionId, { res, createdAt: Date.now() })

      // Initial endpoint event as mandated by MCP SSE specification
      res.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`)

      // Periodic keepalive ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          res.write(': ping\n\n')
        } catch {
          clearInterval(pingInterval)
        }
      }, 15000)

      req.on('close', () => {
        clearInterval(pingInterval)
        sessions.delete(sessionId)
      })
      return
    }

    // MCP SSE Message Endpoint: POST /messages
    if (pathname === '/messages' && method === 'POST') {
      try {
        const sessionId = parsedUrl.searchParams.get('sessionId') || req.headers['mcp-session-id']
        const body = await readJsonBody()
        const session = sessionId ? sessions.get(sessionId) : null

        const rpcResult = await executeRpc(body)

        if (session && session.res && !session.res.writableEnded) {
          res.writeHead(202, { 'Content-Type': 'text/plain' })
          res.end('Accepted')

          if (rpcResult !== null) {
            session.res.write(`event: message\ndata: ${JSON.stringify(rpcResult)}\n\n`)
          }
        } else {
          // Direct HTTP fallback
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(rpcResult || { jsonrpc: '2.0', id: body?.id ?? null, result: {} }))
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32600, message: err.message },
          })
        )
      }
      return
    }

    // Streamable HTTP & Direct RPC: POST /mcp, POST /rpc, POST /
    if (
      (pathname === '/mcp' ||
        pathname === '/rpc' ||
        (pathname === '/' && req.headers['content-type']?.includes('application/json'))) &&
      method === 'POST'
    ) {
      try {
        const body = await readJsonBody()
        const result = await executeRpc(body)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result || { jsonrpc: '2.0', id: body?.id ?? null, result: {} }))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: err.message },
          })
        )
      }
      return
    }

    // Web Dashboard: GET /
    if (pathname === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(renderDashboardHtml())
      return
    }

    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify(
        {
          error: 'Not Found',
          message: `Endpoint ${method} ${pathname} not found on Producer Cue MCP Server.`,
          availableEndpoints: {
            health: 'GET /health',
            tools: 'GET /tools',
            sse: 'GET /sse',
            messages: 'POST /messages?sessionId=<id>',
            streamableHttp: 'POST /mcp',
            directRpc: 'POST /rpc',
            dashboard: 'GET /',
          },
        },
        null,
        2
      )
    )
  })
}

export function startHttpServer(port = process.env.PORT || 3000, host = process.env.HOST || '0.0.0.0') {
  const server = createHttpServer()
  server.listen(port, host, () => {
    console.log(`\n==================================================================`)
    console.log(`  PRODUCER CUE MCP SERVER (Project Cues, Inc.)`)
    console.log(`==================================================================`)
    console.log(`  Status:          ONLINE & OPERATIONAL`)
    console.log(`  Listening:       http://${host}:${port}`)
    console.log(`  Web Dashboard:   http://${host}:${port}/`)
    console.log(`  Health Check:    http://${host}:${port}/health`)
    console.log(`  Tool Schemas:    http://${host}:${port}/tools`)
    console.log(`  SSE Endpoint:    http://${host}:${port}/sse`)
    console.log(`  Messages POST:   http://${host}:${port}/messages`)
    console.log(`  Streamable HTTP: http://${host}:${port}/mcp`)
    console.log(`  Direct RPC:      http://${host}:${port}/rpc`)
    console.log(`  Tools Loaded:    ${MCP_TOOLS.length}`)
    console.log(`==================================================================\n`)
  })
  return server
}

function renderDashboardHtml() {
  const toolsHtml = MCP_TOOLS.map((t) => {
    return `
      <div class="tool-card">
        <div class="tool-header">
          <span class="tool-name">${t.name}</span>
          <span class="tool-tag">MCP Tool</span>
        </div>
        <p class="tool-desc">${t.description}</p>
        <div class="tool-args">Required: <code>${t.inputSchema.required ? t.inputSchema.required.join(', ') : 'none'}</code></div>
      </div>
    `
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Producer Cue — Autonomous AI Design & Development Engine</title>
  <style>
    :root {
      --bg: #07090E;
      --card-bg: #0E131F;
      --card-border: #1C2438;
      --text: #F1F5F9;
      --muted: #94A3B8;
      --accent: #3B82F6;
      --accent-glow: rgba(59, 130, 246, 0.25);
      --cyan: #06B6D4;
      --green: #10B981;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      padding: 0;
      min-height: 100vh;
    }
    header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(14, 19, 31, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      color: #fff;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .brand-title {
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 0.75rem;
      color: var(--muted);
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--green);
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 10px var(--green);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    .hero {
      text-align: center;
      margin-bottom: 3.5rem;
    }
    .hero h1 {
      font-size: 2.8rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #FFFFFF 20%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      font-size: 1.15rem;
      color: var(--muted);
      max-width: 760px;
      margin: 0 auto 1.5rem auto;
    }
    .hero-tags {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .tag {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-family: var(--font-mono);
      color: var(--cyan);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .card h2 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card p {
      font-size: 0.9rem;
      color: var(--muted);
      margin-bottom: 1rem;
    }
    .code-box {
      background: #05070B;
      border: 1px solid #1E2738;
      border-radius: 8px;
      padding: 0.85rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #38BDF8;
      overflow-x: auto;
      margin-bottom: 0.5rem;
    }
    .tool-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .tool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .tool-name {
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 700;
      color: #60A5FA;
    }
    .tool-tag {
      background: rgba(59, 130, 246, 0.15);
      color: #93C5FD;
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .tool-desc {
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 0.5rem;
    }
    .tool-args code {
      background: #05070B;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #F472B6;
    }
    footer {
      border-top: 1px solid var(--card-border);
      text-align: center;
      padding: 2.5rem 1rem;
      color: var(--muted);
      font-size: 0.85rem;
    }
    footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="logo-badge">PC</div>
      <div>
        <div class="brand-title">Producer Cue</div>
        <div class="brand-sub">Project Cues, Inc. • MCP Server</div>
      </div>
    </div>
    <div class="status-badge">
      <div class="pulse-dot"></div>
      <span>ONLINE • 200 OK</span>
    </div>
  </header>

  <main>
    <div class="hero">
      <h1>Autonomous AI Design & Development Engine</h1>
      <p>A full-stack, multimodal design system compiler and code generation engine exposing headless UI primitives, self-healing WCAG AA audits, and multi-framework exports via the Model Context Protocol.</p>
      <div class="hero-tags">
        <span class="tag">MCP v2024-11-05</span>
        <span class="tag">SSE Remote Transport</span>
        <span class="tag">Streamable HTTP</span>
        <span class="tag">React • Svelte 5 • Vue 3 • Web Components</span>
        <span class="tag">Zero Dependencies</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2>⚡ Remote MCP SSE Endpoint</h2>
        <p>Connect Claude Desktop, Cursor, or Antigravity directly to this cloud endpoint:</p>
        <div class="code-box">https://mcp.producercue.com/sse</div>
        <p style="font-size:0.8rem; margin-top:0.5rem;">Messages URL: <code>https://mcp.producercue.com/messages</code></p>
      </div>

      <div class="card">
        <h2>💻 Local CLI / Stdio</h2>
        <p>Run locally in terminal or through local MCP configurations via npx:</p>
        <div class="code-box">npx @projectcues/producer-cue</div>
        <p style="font-size:0.8rem; margin-top:0.5rem;">Full stdin/stdout JSON-RPC protocol supported.</p>
      </div>

      <div class="card">
        <h2>🩺 Health & REST APIs</h2>
        <p>Inspect server status, uptime, and machine-readable tool schemas:</p>
        <div class="code-box">curl -s https://mcp.producercue.com/health</div>
        <div class="code-box" style="margin-top:0.5rem;">curl -s https://mcp.producercue.com/tools</div>
      </div>
    </div>

    <h2 style="font-size:1.4rem; margin-bottom:1rem; letter-spacing:-0.01em;">Claude Desktop Configuration</h2>
    <div class="code-box" style="margin-bottom:2.5rem; padding:1rem; font-size:0.85rem;">
{
  "mcpServers": {
    "producer-cue": {
      "url": "https://mcp.producercue.com/sse"
    }
  }
}</div>

    <h2 style="font-size:1.4rem; margin-bottom:1rem; letter-spacing:-0.01em;">Active MCP Tools (${MCP_TOOLS.length})</h2>
    ${toolsHtml}
  </main>

  <footer>
    <p><strong>Producer Cue</strong> is an enterprise software product developed by <strong>Project Cues, Inc.</strong></p>
    <p style="margin-top:0.35rem;">CAGE: 9YWL9 • UEI: LPSKXU1KEJY8 • <a href="https://projectcues.com" target="_blank">projectcues.com</a></p>
  </footer>
</body>
</html>`
}
