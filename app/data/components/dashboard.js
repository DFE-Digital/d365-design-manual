export default {
  id: 'dashboard',
  title: 'Dashboard',
  description: 'Use the dashboard component to display summary totals or counts in a visually prominent way.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'customisation', 'width', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the dashboard component to display summary totals or counts in a visually prominent way.</p>`
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
      <p class="govuk-body">The default dashboard consists of three columns, each accommodating an <code>article</code> for the dashboard content. However, you can customise the number of columns and articles according to your requirements.</p>
      <p class="govuk-body">You have the flexibility to include or exclude count or value sections within the dashboard as per your needs.</p>
    `
  },

  customisation: {
    title: 'Customisation options',
    content: `
      <p class="govuk-body">The dashboard component offers three interchangeable colour schemes to suit your preferences or requirements:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>Default (black)</li>
        <li>Red: Add the class <code>dfe-dashboard-total-group__values--red</code> to your <code>dl</code> element.</li>
        <li>Blue: Add the class <code>dfe-dashboard-total-group__values--blue</code> to your <code>dl</code> element.</li>
      </ul>
    `
  },

  width: {
    title: 'Width adjustment',
    content: `
      <p class="govuk-body">If your dashboard comprises fewer than three columns and you want the component to match the page container width, adjust the <code>govuk-grid-column-one-third</code> class for the <code>article</code> elements.</p>
      <p class="govuk-body">For instance, if opting for two dashboard columns instead of three, substitute the <code>govuk-grid-column-one-third</code> class for both articles with <code>govuk-grid-column-one-half</code> to align with the page container width.</p>
    `
  },

  examples: [
    {
      id: 'three-column-count-amount',
      title: 'Three column example with count and amount',
      description: ``,
      templatePath: 'includes/components/dashboard/threeColumnExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'three-column-count-only',
      title: 'Three column example with count only',
      description: ``,
      templatePath: 'includes/components/dashboard/threeColumnCountOnlyExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'two-column-count-only',
      title: 'Two column example with count only',
      description: ``,
      templatePath: 'includes/components/dashboard/twoColumnCountOnlyExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
