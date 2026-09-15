export function createTabsPrimitive() {
  return {
    name: 'Tabs',
    description: 'Accessible tab navigation list with active state synchronization.',
    variables: {
      activeTab: { initialValue: 'tab1' },
    },
    root: {
      tag: 'div',
      style: {
        display: 'flex',
        'flex-direction': 'column',
        gap: 'var(--space-4, 1rem)',
        width: '100%',
      },
      children: [
        {
          tag: 'div',
          attrs: { role: 'tablist' },
          style: {
            display: 'inline-flex',
            padding: '4px',
            'background-color': 'var(--bg-subtle, #F1F5F9)',
            'border-radius': 'var(--radius-lg, 0.5rem)',
            gap: '4px',
          },
          children: [
            {
              tag: 'button',
              attrs: {
                role: 'tab',
                'aria-selected': "Variables.activeTab == 'tab1'",
              },
              text: 'Overview',
              style: {
                padding: '0.5rem 1rem',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                'font-weight': '600',
                border: 'none',
                'border-radius': 'var(--radius-md, 0.375rem)',
                cursor: 'pointer',
                'background-color': 'transparent',
                color: 'var(--text-secondary, #475569)',
                transition: 'all 0.15s ease',
              },
              events: {
                click: {
                  type: 'SetVariable',
                  variable: 'activeTab',
                  data: 'tab1',
                },
              },
            },
            {
              tag: 'button',
              attrs: {
                role: 'tab',
                'aria-selected': "Variables.activeTab == 'tab2'",
              },
              text: 'Analytics',
              style: {
                padding: '0.5rem 1rem',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                'font-weight': '600',
                border: 'none',
                'border-radius': 'var(--radius-md, 0.375rem)',
                cursor: 'pointer',
                'background-color': 'transparent',
                color: 'var(--text-secondary, #475569)',
                transition: 'all 0.15s ease',
              },
              events: {
                click: {
                  type: 'SetVariable',
                  variable: 'activeTab',
                  data: 'tab2',
                },
              },
            },
            {
              tag: 'button',
              attrs: {
                role: 'tab',
                'aria-selected': "Variables.activeTab == 'tab3'",
              },
              text: 'Settings',
              style: {
                padding: '0.5rem 1rem',
                'font-size': 'var(--font-size-sm, 0.875rem)',
                'font-weight': '600',
                border: 'none',
                'border-radius': 'var(--radius-md, 0.375rem)',
                cursor: 'pointer',
                'background-color': 'transparent',
                color: 'var(--text-secondary, #475569)',
                transition: 'all 0.15s ease',
              },
              events: {
                click: {
                  type: 'SetVariable',
                  variable: 'activeTab',
                  data: 'tab3',
                },
              },
            },
          ],
        },
        {
          tag: 'div',
          attrs: { role: 'tabpanel' },
          condition: "Variables.activeTab == 'tab1'",
          children: ['Overview panel content rendered here.'],
        },
        {
          tag: 'div',
          attrs: { role: 'tabpanel' },
          condition: "Variables.activeTab == 'tab2'",
          children: ['Detailed analytics metrics and charts panel.'],
        },
        {
          tag: 'div',
          attrs: { role: 'tabpanel' },
          condition: "Variables.activeTab == 'tab3'",
          children: ['System configuration and preferences panel.'],
        },
      ],
    },
  }
}
