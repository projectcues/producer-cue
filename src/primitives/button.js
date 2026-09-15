export function createButtonPrimitive(options = {}) {
  const name = options.name || 'Button'
  const defaultLabel = options.defaultLabel || 'Click Me'
  const variant = options.variant || 'primary'

  const variantStyles = {
    primary: {
      'background-color': 'var(--brand-default, #2563EB)',
      color: 'var(--brand-contrast, #FFFFFF)',
      border: '1px solid transparent',
    },
    secondary: {
      'background-color': 'var(--bg-subtle, #F1F5F9)',
      color: 'var(--text-primary, #0F172A)',
      border: '1px solid var(--border-default, #E2E8F0)',
    },
    outline: {
      'background-color': 'transparent',
      color: 'var(--brand-default, #2563EB)',
      border: '1px solid var(--brand-default, #2563EB)',
    },
    ghost: {
      'background-color': 'transparent',
      color: 'var(--text-primary, #0F172A)',
      border: '1px solid transparent',
    },
    destructive: {
      'background-color': '#DC2626',
      color: '#FFFFFF',
      border: '1px solid transparent',
    },
  }

  const hoverStyles = {
    primary: { 'background-color': 'var(--brand-hover, #1D4ED8)' },
    secondary: { 'background-color': 'var(--border-default, #E2E8F0)' },
    outline: { 'background-color': 'rgba(37, 99, 235, 0.08)' },
    ghost: { 'background-color': 'rgba(0, 0, 0, 0.05)' },
    destructive: { 'background-color': '#B91C1C' },
  }

  return {
    name,
    description: 'WAI-ARIA accessible button with variants, hover/focus rings, and loading state support.',
    attributes: {
      label: { type: 'String', testValue: defaultLabel, default: defaultLabel },
      disabled: { type: 'Boolean', testValue: false, default: false },
      loading: { type: 'Boolean', testValue: false, default: false },
    },
    root: {
      tag: 'button',
      text: 'Attributes.label',
      attrs: {
        'aria-disabled': 'Attributes.disabled',
        'aria-busy': 'Attributes.loading',
      },
      style: {
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        gap: 'var(--space-2, 0.5rem)',
        padding: '0.625rem 1.25rem',
        'font-size': 'var(--font-size-sm, 0.875rem)',
        'font-weight': '600',
        'font-family': 'inherit',
        'border-radius': 'var(--radius-md, 0.375rem)',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        outline: 'none',
        ...(variantStyles[variant] || variantStyles.primary),
      },
      variants: [
        {
          hover: true,
          style: hoverStyles[variant] || {},
        },
        {
          focus: true,
          style: {
            'box-shadow': '0 0 0 3px rgba(59, 130, 246, 0.4)',
          },
        },
        {
          active: true,
          style: {
            transform: 'scale(0.98)',
          },
        },
      ],
      events: {
        click: {
          type: 'TriggerEvent',
          event: 'press',
        },
      },
    },
  }
}
