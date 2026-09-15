export function createDropdownPrimitive() {
  return {
    name: 'DropdownMenu',
    description: 'Accessible popover dropdown menu with toggle state and role="menu".',
    variables: {
      isOpen: { initialValue: false },
    },
    root: {
      tag: 'div',
      style: {
        position: 'relative',
        display: 'inline-block',
      },
      children: [
        {
          tag: 'button',
          text: 'Options ▾',
          attrs: {
            'aria-haspopup': 'menu',
            'aria-expanded': 'Variables.isOpen',
          },
          style: {
            padding: '0.625rem 1rem',
            'font-size': 'var(--font-size-sm, 0.875rem)',
            'font-weight': '600',
            color: 'var(--text-primary, #0F172A)',
            'background-color': 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-default, #CBD5E1)',
            'border-radius': 'var(--radius-md, 0.375rem)',
            cursor: 'pointer',
          },
          events: {
            click: {
              type: 'SetVariable',
              variable: 'isOpen',
              data: '!Variables.isOpen',
            },
          },
        },
        {
          tag: 'div',
          condition: 'Variables.isOpen == true',
          attrs: { role: 'menu' },
          style: {
            position: 'absolute',
            top: '100%',
            left: '0',
            'margin-top': '0.5rem',
            width: '12rem',
            'background-color': 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-default, #CBD5E1)',
            'border-radius': 'var(--radius-lg, 0.5rem)',
            'box-shadow': 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
            padding: '0.25rem',
            display: 'flex',
            'flex-direction': 'column',
            'z-index': '50',
          },
          children: [
            {
              tag: 'button',
              text: 'Edit Profile',
              attrs: { role: 'menuitem' },
              style: {
                padding: '0.5rem 0.75rem',
                'text-align': 'left',
                border: 'none',
                background: 'transparent',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                color: 'var(--text-primary, #0F172A)',
                'border-radius': 'var(--radius-sm, 0.25rem)',
                cursor: 'pointer',
              },
              variants: [
                {
                  hover: true,
                  style: { 'background-color': 'var(--bg-subtle, #F1F5F9)' },
                },
              ],
            },
            {
              tag: 'button',
              text: 'Account Settings',
              attrs: { role: 'menuitem' },
              style: {
                padding: '0.5rem 0.75rem',
                'text-align': 'left',
                border: 'none',
                background: 'transparent',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                color: 'var(--text-primary, #0F172A)',
                'border-radius': 'var(--radius-sm, 0.25rem)',
                cursor: 'pointer',
              },
              variants: [
                {
                  hover: true,
                  style: { 'background-color': 'var(--bg-subtle, #F1F5F9)' },
                },
              ],
            },
            {
              tag: 'button',
              text: 'Sign Out',
              attrs: { role: 'menuitem' },
              style: {
                padding: '0.5rem 0.75rem',
                'text-align': 'left',
                border: 'none',
                background: 'transparent',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                color: '#DC2626',
                'border-radius': 'var(--radius-sm, 0.25rem)',
                cursor: 'pointer',
              },
              variants: [
                {
                  hover: true,
                  style: { 'background-color': '#FEE2E2' },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}
