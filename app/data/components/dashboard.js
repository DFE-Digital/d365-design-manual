export default {
  id: 'dashboard',
  title: 'Dashboard',
  description: 'Use the dashboard component to display summary totals or counts with status indicators in a visually prominent way.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'variants', 'status', 'sizes', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the dashboard component to display summary totals or counts in a visually prominent way, particularly when you need to:</p>
    <ul class="govuk-list govuk-list--bullet">
      <li>show key metrics at a glance</li>
      <li>indicate status alongside a count (such as "action required" or "complete")</li>
      <li>provide quick navigation to filtered views of data</li>
    </ul>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Avoid using the dashboard component if there's no need to present summary totals or a total count.</p>
      <p class="govuk-body">If dealing with a limited number of records, it's advisable to use the table component upfront, which can display a list of records alongside status tags for each entry.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">The dashboard component consists of tiles that display a number and label, optionally with a status indicator below. Each tile can be a link to navigate users to a filtered view of the data.</p>
      <p class="govuk-body">The component uses fluid typography with <code>clamp()</code> to ensure numbers scale appropriately across different screen sizes.</p>
    `
  },

  variants: {
    title: 'Variants',
    content: `
      <p class="govuk-body">The dashboard component offers several variants:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li><strong>With status</strong>: Includes a status bar below the main tile showing state (passing/failing)</li>
        <li><strong>Dark</strong>: A standalone dark tile without a status bar, with white text on black background</li>
        <li><strong>Light</strong>: A standalone light tile without a status bar, with black text on white background and a border</li>
        <li><strong>Status with link</strong>: The status bar itself can contain a link for additional navigation</li>
      </ul>
    `
  },

  status: {
    title: 'Status indicators',
    content: `
      <p class="govuk-body">When using the "with status" variant, you can indicate different states:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li><strong>Passing (green)</strong>: Use <code>dfe-dashboard-status</code> for positive states like "Active", "Complete", or "No action required"</li>
        <li><strong>Failing (red)</strong>: Use <code>dfe-dashboard-status-failing</code> for states requiring attention like "Action required"</li>
      </ul>
    `
  },

  sizes: {
    title: 'Size options',
    content: `
      <p class="govuk-body">The dashboard number can be displayed in three sizes:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li><strong>Default</strong>: Use <code>dfe-dashboard</code> for the largest display (32px base)</li>
        <li><strong>Smaller</strong>: Use <code>dfe-dashboard-smaller</code> for medium display (24px base)</li>
        <li><strong>Smallest</strong>: Use <code>dfe-dashboard-smallest</code> for compact display (18px base)</li>
      </ul>
      <p class="govuk-body">All sizes use fluid typography and will scale based on the container width.</p>
    `
  },

  examples: [
    {
      id: 'with-status',
      title: 'Dashboard with status (mixed states)',
      description: `Shows a three-column dashboard with both passing and failing status indicators.`,
      templatePath: 'includes/components/dashboard/withStatusExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'with-status-passing',
      title: 'Dashboard with status (all passing)',
      description: `Shows a three-column dashboard where all items have a passing (green) status.`,
      templatePath: 'includes/components/dashboard/withStatusPassingExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'two-column',
      title: 'Two column layout',
      description: `A two-column dashboard layout using <code>govuk-grid-column-one-half</code>.`,
      templatePath: 'includes/components/dashboard/twoColumnExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'dark',
      title: 'Dark variant (without status)',
      description: `A standalone dark dashboard tile without a status bar, useful for simple count displays.`,
      templatePath: 'includes/components/dashboard/darkExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'light',
      title: 'Light variant (without status)',
      description: `A standalone light dashboard tile with a border, without a status bar. Use when you need a lighter appearance that fits better on coloured backgrounds.`,
      templatePath: 'includes/components/dashboard/lightExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'size-variants',
      title: 'Size variants',
      description: `Shows the three available sizes: default, smaller, and smallest.`,
      templatePath: 'includes/components/dashboard/sizeVariantsExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'status-with-link',
      title: 'Status bar with link',
      description: `The status bar can contain a link for additional navigation options.`,
      templatePath: 'includes/components/dashboard/statusWithLinkExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
