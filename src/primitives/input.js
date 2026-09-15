export function createInputPrimitive(options = {}) {
  const name = options.name || 'TextField'
  const defaultLabel = options.defaultLabel || 'Email address'
  const placeholder = options.placeholder || 'Enter your email'

  return {
    name,
    description: 'Accessible form text input with label association, focus ring, and validation error alerting.',
    attributes: {
      label: { type: 'String', testValue: defaultLabel, default: defaultLabel },
      placeholder: { type: 'String', testValue: placeholder, default: placeholder },
      errorMessage: { type: 'String', testValue: '', default: '' },
      hasError: { type: 'Boolean', testValue: false, default: false },
    },
    variables: {
      value: { initialValue: '' },
    },
    root: {
      tag: 'div',
      style: {
        display: 'flex',
        'flex-direction': 'column',
        gap: 'var(--space-1, 0.25rem)',
        width: '100%',
      },
      children: [
        {
          tag: 'label',
          text: 'Attributes.label',
          attrs: { for: 'input-field' },
          style: {
            'font-size': 'var(--font-size-sm, 0.875rem)',
            'font-weight': '600',
            color: 'var(--text-primary, #0F172A)',
          },
        },
        {
          tag: 'input',
          attrs: {
            id: 'input-field',
            type: 'text',
            placeholder: 'Attributes.placeholder',
            'aria-invalid': 'Attributes.hasError',
            'aria-describedby': 'error-desc',
          },
          style: {
            padding: '0.625rem 0.875rem',
            'font-size': 'var(--font-size-base, 1rem)',
            'font-family': 'inherit',
            color: 'var(--text-primary, #0F172A)',
            'background-color': 'var(--bg-canvas, #FFFFFF)',
            border: '1px solid var(--border-default, #CBD5E1)',
            'border-radius': 'var(--radius-md, 0.375rem)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          },
          variants: [
            {
              focus: true,
              style: {
                'border-color': 'var(--brand-default, #2563EB)',
                'box-shadow': '0 0 0 3px rgba(37, 99, 235, 0.2)',
              },
            },
          ],
        },
        {
          tag: 'span',
          condition: 'Attributes.hasError == true',
          attrs: {
            id: 'error-desc',
            role: 'alert',
          },
          text: 'Attributes.errorMessage',
          style: {
            'font-size': 'var(--font-size-xs, 0.75rem)',
            color: '#DC2626',
            'font-weight': '500',
          },
        },
      ],
    },
  }
}
