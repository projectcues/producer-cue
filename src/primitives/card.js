export function createCardPrimitive(options = {}) {
  const name = options.name || 'Card'
  const defaultTitle = options.defaultTitle || 'Card Title'

  return {
    name,
    description: 'Accessible container surface with elevation and header/body slots.',
    attributes: {
      title: { type: 'String', testValue: defaultTitle, default: defaultTitle },
      subtitle: { type: 'String', testValue: 'Card subtitle text', default: '' },
    },
    root: {
      tag: 'div',
      style: {
        display: 'flex',
        'flex-direction': 'column',
        'background-color': 'var(--bg-surface, #FFFFFF)',
        border: '1px solid var(--border-default, #E2E8F0)',
        'border-radius': 'var(--radius-lg, 0.5rem)',
        'box-shadow': 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
        padding: 'var(--space-6, 1.5rem)',
        gap: 'var(--space-4, 1rem)',
      },
      children: [
        {
          tag: 'div',
          style: {
            display: 'flex',
            'flex-direction': 'column',
            gap: 'var(--space-1, 0.25rem)',
          },
          children: [
            {
              tag: 'h3',
              text: 'Attributes.title',
              style: {
                margin: '0',
                'font-size': 'var(--font-size-lg, 1.125rem)',
                'font-weight': '700',
                color: 'var(--text-primary, #0F172A)',
              },
            },
            {
              tag: 'p',
              text: 'Attributes.subtitle',
              style: {
                margin: '0',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                color: 'var(--text-muted, #64748B)',
              },
            },
          ],
        },
        {
          tag: 'slot',
          slot: 'default',
        },
      ],
    },
  }
}
