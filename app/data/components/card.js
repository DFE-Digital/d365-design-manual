export default {
  id: 'card',
  title: 'Card',
  description: 'Use the card component to display related content in a visually distinct container.',

  sections: ['whenToUse', 'whenNotToUse', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the card component to display related content in a visually distinct container.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Cards can make things harder to understand if overused or used incorrectly. Before using them, test your content as structured content with headers and paragraphs and grid layout.</p>`
  },

  examples: [
    {
      id: 'basic-cards',
      title: 'Basic cards',
      description: `<p class="govuk-body">An example of a basic card component used in a group.</p>`,
      templatePath: 'includes/components/card/basicExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'basic-meta',
      title: 'Basic cards with meta information',
      description: `<p class="govuk-body">An example of a basic card component used in a group which has meta data.</p>`,
      templatePath: 'includes/components/card/basicMetaExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'cards-image',
      title: 'Cards with image',
      description: `<p class="govuk-body">An example of a card component used in a group which has meta data and an image.</p>`,
      templatePath: 'includes/components/card/imageExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
