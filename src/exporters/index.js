import { exportToReactTailwind } from './reactTailwindExporter.js'
import { exportToSvelte } from './svelteExporter.js'
import { exportToVue } from './vueExporter.js'
import { exportToWebComponent } from './webComponentExporter.js'

export * from './reactTailwindExporter.js'
export * from './svelteExporter.js'
export * from './vueExporter.js'
export * from './webComponentExporter.js'

export function exportToFramework(component, target, options) {
  switch (target) {
    case 'react':
      return exportToReactTailwind(component)
    case 'svelte':
      return exportToSvelte(component)
    case 'vue':
      return exportToVue(component)
    case 'web-component':
      return exportToWebComponent(component, options?.tagName)
    default:
      throw new Error(`Unsupported export target: ${target}`)
  }
}
