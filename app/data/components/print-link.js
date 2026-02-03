export default {
  id: 'print-link',
  title: 'Print link',
  description: 'Use the print link component to let users print the current page.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'accessibility', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `
      <p class="govuk-body">Use the print link component when users are likely to want a physical or PDF copy of the page content, such as:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>confirmation pages after completing a transaction</li>
        <li>reference information that users may want to keep</li>
        <li>detailed guidance or instructions</li>
        <li>receipts or summaries of submitted information</li>
      </ul>
    `
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Avoid using the print link component on pages where:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>the content is primarily interactive or dynamic</li>
        <li>the page contains forms that need to be completed online</li>
        <li>the content is frequently updated and printed versions would quickly become outdated</li>
      </ul>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">The print link component displays a button that triggers the browser's native print dialog when clicked.</p>
      <p class="govuk-body">The component uses the <code>govuk-!-display-none-print</code> utility class to hide the button when printing, so it won't appear on the printed page.</p>
      <p class="govuk-body">For the button to appear, either JavaScript must be enabled (via the <code>.govuk-frontend-supported</code> class on the body) or you can add the <code>dfe-print-link--show-without-js</code> class to show it without JavaScript support checking.</p>
    `
  },

  accessibility: {
    title: 'Accessibility',
    content: `
      <p class="govuk-body">The print link component is accessible and follows GOV.UK Design System patterns:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>Uses a semantic <code>&lt;button&gt;</code> element for the action</li>
        <li>The printer icon uses <code>aria-hidden="true"</code> and <code>focusable="false"</code> to hide it from assistive technologies</li>
        <li>Clear, descriptive button text that explains the action</li>
        <li>Visible focus states that meet WCAG 2.1 requirements</li>
      </ul>
    `
  },

  examples: [
    {
      id: 'default',
      title: 'Default print link',
      description: `The default print link with a printer icon.`,
      templatePath: 'includes/components/print-link/defaultExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'without-icon',
      title: 'Print link without icon',
      description: `A simpler version without the printer icon.`,
      templatePath: 'includes/components/print-link/withoutIconExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
