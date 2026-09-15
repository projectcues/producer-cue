export function createDialogPrimitive(options = {}) {
  const name = options.name || 'ModalDialog'
  const defaultTitle = options.defaultTitle || 'Dialog Title'

  return {
    name,
    description: 'WAI-ARIA accessible modal dialog with backdrop overlay and close events.',
    variables: {
      isOpen: { initialValue: false },
    },
    attributes: {
      title: { type: 'String', testValue: defaultTitle, default: defaultTitle },
      description: {
        type: 'String',
        testValue: 'This is an accessible modal dialog description.',
        default: 'Dialog description.',
      },
    },
    root: {
      tag: 'div',
      condition: 'Variables.isOpen == true',
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'z-index': '9999',
      },
      children: [
        {
          tag: 'div',
          style: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            'background-color': 'rgba(0, 0, 0, 0.6)',
            'backdrop-filter': 'blur(4px)',
          },
          events: {
            click: {
              type: 'SetVariable',
              variable: 'isOpen',
              data: false,
            },
          },
        },
        {
          tag: 'div',
          attrs: {
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'dialog-title',
            'aria-describedby': 'dialog-desc',
          },
          style: {
            position: 'relative',
            width: '100%',
            'max-width': '32rem',
            'background-color': 'var(--bg-surface, #FFFFFF)',
            'border-radius': 'var(--radius-xl, 0.75rem)',
            'box-shadow': 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
            padding: 'var(--space-6, 1.5rem)',
            display: 'flex',
            'flex-direction': 'column',
            gap: 'var(--space-4, 1rem)',
            margin: 'var(--space-4, 1rem)',
          },
          children: [
            {
              tag: 'div',
              style: {
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'space-between',
              },
              children: [
                {
                  tag: 'h2',
                  attrs: { id: 'dialog-title' },
                  text: 'Attributes.title',
                  style: {
                    margin: '0',
                    'font-size': 'var(--font-size-xl, 1.25rem)',
                    'font-weight': '700',
                    color: 'var(--text-primary, #0F172A)',
                  },
                },
                {
                  tag: 'button',
                  text: '✕',
                  attrs: { 'aria-label': 'Close dialog' },
                  style: {
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    'font-size': '1.25rem',
                    color: 'var(--text-muted, #64748B)',
                    padding: '0.25rem 0.5rem',
                    'border-radius': 'var(--radius-md, 0.375rem)',
                  },
                  events: {
                    click: {
                      type: 'SetVariable',
                      variable: 'isOpen',
                      data: false,
                    },
                  },
                },
              ],
            },
            {
              tag: 'p',
              attrs: { id: 'dialog-desc' },
              text: 'Attributes.description',
              style: {
                margin: '0',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                color: 'var(--text-secondary, #334155)',
              },
            },
            {
              tag: 'slot',
              slot: 'default',
            },
          ],
        },
      ],
    },
  }
}
