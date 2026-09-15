#!/usr/bin/env node

/**
 * Producer Cue CLI — Model Context Protocol (MCP) Server Entrypoint
 * Developed by Project Cues, Inc. (https://projectcues.com)
 */

import { startMcpServer } from '../src/mcp/mcpServer.js'
import { startHttpServer } from '../src/server.js'

const isServerMode =
  process.argv.includes('--server') ||
  process.argv.includes('--http') ||
  Boolean(process.env.PORT) ||
  process.env.TRANSPORT === 'http' ||
  process.env.TRANSPORT === 'sse'

if (isServerMode) {
  startHttpServer()
} else {
  startMcpServer()
}
