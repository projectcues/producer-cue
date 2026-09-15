export function createToastPrimitive() {
  return {
    name: 'Toast',
    description: 'Accessible floating toast notification with polite screen-reader announcements.',
    variables: {
      isVisible: { initialValue: true },
      message: { initialValue: 'Operation completed successfully!' },
    },
    root: {
      tag: 'div',
      condition: 'Variables.isVisible == true',
      attrs: {
        role: 'status',
        'aria-live': 'polite',
      },
      style: {
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        'align-items': 'center',
        gap: '0.75rem',
        padding: '0.875rem 1.25rem',
        'background-color': '#0F172A',
        color: '#F8FAFC',
        'border-radius': 'var(--radius-lg, 0.5rem)',
        'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        'z-index': '9999',
        border: '1px solid #334155',
      },
      children: [
        {
          tag: 'span',
          text: '✓',
          style: {
            color: '#10B981',
            'font-weight': '700',
            'font-size': '1.125rem',
          },
        },
        {
          tag: 'span',
          text: 'Variables.message',
          style: {
            'font-size': '0.875rem',
            'font-weight': '500',
          },
        },
        {
          tag: 'button',
          text: '✕',
          attrs: { 'aria-label': 'Dismiss notification' },
          style: {
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            'font-size': '0.875rem',
            padding: '0.25rem',
            'margin-left': '0.5rem',
          },
          events: {
            click: {
              type: 'SetVariable',
              variable: 'isVisible',
              data: false,
            },
          },
        },
      ],
    },
  }
}
