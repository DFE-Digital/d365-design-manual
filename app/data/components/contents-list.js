export default {
  id: 'contents-list',
  title: 'Contents list',
  description: 'Use the contents list component to allow users to navigate to different sections within a page or to different pages.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'customisation', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the contents list component to allow users to navigate to different sections within a page or to different pages.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Avoid using a contents list on pages that lack clear grouping or related content, as this may confuse users.</p>
      <p class="govuk-body">Additionally, do not incorporate a contents list in transactional services or forms. Instead, use alternative components such as buttons for navigation or back links.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `<p class="govuk-body">Ensure that links are concise and descriptive, as overly lengthy links (exceeding two lines) hinder user scanning. Page titles or headers must accurately reflect the content of the page to provide users with clear navigation cues.</p>`
  },

  customisation: {
    title: 'Customisation options',
    content: `
      <ul class="govuk-list govuk-list--bullet">
        <li><strong>Without dashes:</strong> You can choose not to use dashes before your links by removing the <code>dfe-contents-list__list-item--dashed</code> class from the list item.</li>
        <li><strong>Bold links:</strong> You can enhance the visibility of links by adding the <code>dfe-contents-list__list-item--parent</code> class to the list item. This is particularly useful for showcasing parent-child page or page content relationships in nested contents lists.</li>
      </ul>
    `
  },

  examples: [
    {
      id: 'with-dashes',
      title: 'With dashes',
      description: ``,
      templatePath: 'includes/components/contents-list/standardExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'without-dashes',
      title: 'Without dashes',
      description: `<p class="govuk-body">Display the contents list without dashes preceding each link.</p>`,
      templatePath: 'includes/components/contents-list/withoutDashesExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'nested-child',
      title: 'Nested child links',
      description: `<p class="govuk-body">Use nested child links to illustrate structural relationships between child pages or page headers.</p>`,
      templatePath: 'includes/components/contents-list/nestedListExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'nested-bold',
      title: 'Nested child links with bold parent links',
      description: `<p class="govuk-body">Highlight parent links in bold to emphasise structural relationships between parent and child pages or headers.</p>`,
      templatePath: 'includes/components/contents-list/nestedListBoldExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
