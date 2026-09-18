import { renderPageBody } from '@nordcraft/ssr/dist/rendering/components.js'
import { createStylesheet } from '@nordcraft/core/dist/styling/style.css.js'

/**
 * Renders a Nordcraft Project Component into production-ready SSR HTML and CSS.
 * 
 * @param {object} project - Valid Nordcraft project AST
 * @param {string} componentName - Name of component to render (e.g. 'HomePage')
 * @param {string} url - Target URL path
 * @returns {Promise<{ html: string, css: string, customProperties: string[], title: string }>}
 */
export async function renderNordcraftSsr(project, componentName = 'HomePage', url = 'http://localhost:3000/') {
  const component = project.files.components[componentName]
  if (!component) {
    throw new Error(`Component "${componentName}" not found in project`)
  }

  const req = new Request(url)
  const env = {
    isServer: true,
    branchName: 'main',
    request: {
      url: req.url,
      headers: {},
      cookies: {},
      params: {},
      query: {},
    },
    runtime: 'page',
    logErrors: true,
  }

  const formulaContext = {
    data: {
      Args: {},
      Attributes: {},
      Variables: {},
      Apis: {},
      Component: component,
      Event: undefined,
    },
    component,
    package: undefined,
    toddle: {
      project: project.project.id,
      branch: 'main',
      commit: project.commit,
      components: project.files.components,
      formulas: project.files.formulas || {},
      actions: project.files.actions || {},
      getFormula: () => undefined,
      getAction: () => undefined,
      getCustomFormula: () => undefined,
      getCustomAction: () => undefined,
    },
  }

  const result = await renderPageBody({
    component,
    env,
    evaluateComponentApis: async () => ({}),
    files: project.files,
    formulaContext,
    includedComponents: [],
    req,
    projectId: project.project.id,
  })

  // Generate authentic Nordcraft scoped CSS rules
  let css = ''
  try {
    const themes = { ...(project.files.themes || {}) }
    if (themes.Default && !themes.Default.fonts) {
      themes.Default.fonts = []
    }
    css = createStylesheet(
      component,
      Object.values(project.files.components),
      themes,
      { theme: 'Default', mode: 'light' }
    )
  } catch (err) {
    console.error('createStylesheet error:', err)
  }

  const title = component.route?.info?.title?.formula?.value || componentName

  return {
    html: result.html,
    css,
    customProperties: result.customProperties || [],
    title,
  }
}

