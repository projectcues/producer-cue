/**
 * Producer Cue: Autonomous AI Design & Development Engine
 * Built by Project Cues, Inc. (https://projectcues.com)
 */

import { startHttpServer } from './server.js'

export * from './dsl/compactTypes.js'
export * from './dsl/compiler.js'
export * from './exporters/index.js'
export * from './figma/figmaSync.js'
export * from './formulas/expressionParser.js'
export * from './formulas/formulaTranspiler.js'
export * from './healer/autoFixer.js'
export * from './mcp/mcpServer.js'
export * from './orchestrator/astMutator.js'
export * from './orchestrator/systemPrompts.js'
export * from './orchestrator/validatorGate.js'
export * from './primitives/index.js'
export * from './tokens/colorUtils.js'
export * from './tokens/tokenEngine.js'
export * from './vision/visionPipeline.js'
export * from './server.js'

// Auto-boot HTTP server in hosted / server environments (Hostinger, Cloud, Docker)
const isCliStdio =
  process.argv[1] &&
  process.argv[1].includes('bin/producer-cue') &&
  !process.argv.includes('--server')

const isEntryFile =
  Boolean(process.env.PORT) ||
  process.env.TRANSPORT === 'http' ||
  process.env.TRANSPORT === 'sse' ||
  process.env.NODE_ENV === 'production' ||
  (process.argv[1] &&
    (process.argv[1].endsWith('src/index.js') ||
      process.argv[1].endsWith('index.js') ||
      process.argv[1].endsWith('src/server.js')))

if (isEntryFile && !isCliStdio) {
  startHttpServer()
}
