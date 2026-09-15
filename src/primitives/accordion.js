export function createAccordionPrimitive(items) {
  const defaultItems = items || [
    {
      id: 'sec1',
      title: 'What is Producer Cue?',
      content: 'Producer Cue is an autonomous AI design and development engine developed by Project Cues, Inc.',
    },
    {
      id: 'sec2',
      title: 'How does the signal reactivity work?',
      content: 'Signals trigger direct DOM node updates without Virtual DOM diffing, making applications extremely lightweight.',
    },
    {
      id: 'sec3',
      title: 'Can I export to other frameworks?',
      content: 'Yes, components can be exported directly to React, Svelte, Vue, or native Web Components.',
    },
  ]

  const sections = defaultItems.map((item) => ({
    tag: 'div',
    style: {
      border: '1px solid var(--border-default, #E2E8F0)',
      'border-radius': 'var(--radius-md, 0.375rem)',
      overflow: 'hidden',
      'background-color': 'var(--bg-surface, #FFFFFF)',
    },
    children: [
      {
        tag: 'button',
        text: item.title,
        attrs: {
          'aria-expanded': `Variables.openSection == '${item.id}'`,
          'aria-controls': `sec-${item.id}-panel`,
        },
        style: {
          width: '100%',
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          padding: '1rem',
          'font-size': 'var(--font-size-base, 1rem)',
          'font-weight': '600',
          'text-align': 'left',
          color: 'var(--text-primary, #0F172A)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        },
        events: {
          click: {
            type: 'SetVariable',
            variable: 'openSection',
            data: `Variables.openSection == '${item.id}' ? '' : '${item.id}'`,
          },
        },
        variants: [
          {
            hover: true,
            style: { 'background-color': 'var(--bg-subtle, #F8FAFC)' },
          },
        ],
      },
      {
        tag: 'div',
        condition: `Variables.openSection == '${item.id}'`,
        attrs: {
          id: `sec-${item.id}-panel`,
          role: 'region',
        },
        style: {
          padding: '0 1rem 1rem 1rem',
          'font-size': 'var(--font-size-sm, 0.875rem)',
          color: 'var(--text-secondary, #475569)',
          'line-height': '1.5',
        },
        children: [item.content],
      },
    ],
  }))

  return {
    name: 'Accordion',
    description: 'WAI-ARIA compliant multi-section accordion with toggle synchronization.',
    variables: {
      openSection: { initialValue: 'sec1' },
    },
    root: {
      tag: 'div',
      style: {
        display: 'flex',
        'flex-direction': 'column',
        gap: 'var(--space-2, 0.5rem)',
        width: '100%',
        'max-width': '36rem',
      },
      children: sections,
    },
  }
}
