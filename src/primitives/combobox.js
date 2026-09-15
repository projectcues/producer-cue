export function createComboboxPrimitive() {
  return {
    name: 'Combobox',
    description: 'Accessible autocomplete search combobox with listbox popup and selection state.',
    variables: {
      query: { initialValue: '' },
      isOpen: { initialValue: false },
      selectedItem: { initialValue: 'Option 1' },
    },
    root: {
      tag: 'div',
      style: {
        position: 'relative',
        width: '100%',
        'max-width': '20rem',
      },
      children: [
        {
          tag: 'input',
          attrs: {
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-expanded': 'Variables.isOpen',
            'aria-haspopup': 'listbox',
            placeholder: 'Search options...',
            'aria-label': 'Search options',
          },
          style: {
            width: '100%',
            padding: '0.625rem 0.875rem',
            'font-size': '0.875rem',
            border: '1px solid var(--border-default, #CBD5E1)',
            'border-radius': 'var(--radius-md, 0.375rem)',
            outline: 'none',
            'background-color': 'var(--bg-canvas, #FFFFFF)',
            color: 'var(--text-primary, #0F172A)',
          },
          events: {
            focus: {
              type: 'SetVariable',
              variable: 'isOpen',
              data: true,
            },
          },
        },
        {
          tag: 'div',
          condition: 'Variables.isOpen == true',
          attrs: {
            role: 'listbox',
            'aria-label': 'Suggestions',
          },
          style: {
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            'margin-top': '0.25rem',
            'background-color': 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--border-default, #CBD5E1)',
            'border-radius': 'var(--radius-md, 0.375rem)',
            'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            'max-height': '12rem',
            'overflow-y': 'auto',
            'z-index': '50',
            padding: '0.25rem',
          },
          children: [
            {
              tag: 'div',
              attrs: {
                role: 'option',
                'aria-selected': "Variables.selectedItem == 'Option 1'",
              },
              text: 'Option 1 (Alpha)',
              style: {
                padding: '0.5rem 0.75rem',
                'font-size': '0.875rem',
                cursor: 'pointer',
                'border-radius': 'var(--radius-sm, 0.25rem)',
                color: 'var(--text-primary, #0F172A)',
              },
              variants: [
                {
                  hover: true,
                  style: { 'background-color': 'var(--bg-subtle, #F1F5F9)' },
                },
              ],
              events: {
                click: [
                  { type: 'SetVariable', variable: 'selectedItem', data: 'Option 1' },
                  { type: 'SetVariable', variable: 'isOpen', data: false },
                ],
              },
            },
            {
              tag: 'div',
              attrs: {
                role: 'option',
                'aria-selected': "Variables.selectedItem == 'Option 2'",
              },
              text: 'Option 2 (Beta)',
              style: {
                padding: '0.5rem 0.75rem',
                'font-size': '0.875rem',
                cursor: 'pointer',
                'border-radius': 'var(--radius-sm, 0.25rem)',
                color: 'var(--text-primary, #0F172A)',
              },
              variants: [
                {
                  hover: true,
                  style: { 'background-color': 'var(--bg-subtle, #F1F5F9)' },
                },
              ],
              events: {
                click: [
                  { type: 'SetVariable', variable: 'selectedItem', data: 'Option 2' },
                  { type: 'SetVariable', variable: 'isOpen', data: false },
                ],
              },
            },
          ],
        },
      ],
    },
  }
}
