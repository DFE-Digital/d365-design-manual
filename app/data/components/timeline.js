export default {
  id: 'timeline',
  title: 'Timeline',
  description: 'Use the timeline component to display a sequence of events or activities in chronological order.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the timeline component to display a sequence of events or activities in chronological order, such as application status updates, case history, or activity logs.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Avoid using the timeline component for content that does not have a natural chronological order.</p>
      <p class="govuk-body">If you need to display a simple list of items without time-based relationships, use a standard list or table component instead.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">The timeline component displays events in a vertical list, with each event showing a title, date, and optional description.</p>
      <p class="govuk-body">Events are typically displayed in reverse chronological order (newest first), but can be arranged based on your specific use case.</p>
    `
  },

  examples: [
    {
      id: 'standard',
      title: 'Timeline example',
      description: `<p class="govuk-body">A basic timeline showing a sequence of events with dates and descriptions.</p>`,
      templatePath: 'includes/components/timeline/example.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
