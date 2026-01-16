export default {
  id: 'search',
  title: 'Search',
  description: 'Use the search component when you need users to search for and select a value.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'minMaxLength', 'inputSize', 'displayResults', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the search component when you need users to search for and select a value.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Do not use the search component as part of a table. In this case, you should use the searchable table component instead.</p>`
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">Always use the search component as the only component on a page. The search component is often accompanied by a radio component to display the search results, which requires the user to choose an option. If the search and related components are not the only components on the page it is more likely that users will not realise they've missed a question.</p>
      <p class="govuk-body">Set the contents of the <code>&lt;label&gt;</code> as the page heading. This is good practice as it means that users of screen readers will only hear the contents once.</p>
      <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to override the default page header.</p>
    `
  },

  examples: [
    {
      id: 'with-hint',
      title: 'Search with hint text',
      description: `
        <p class="govuk-body">Use hint text for help that's relevant to the majority of users, like how their information will be used, or where to find it. The hint text block is included in the example below.</p>
        <p class="govuk-body">Hint text is not mandatory, and can be removed if it is not required.</p>
      `,
      templatePath: 'includes/components/search/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'without-hint',
      title: 'Search without hint text',
      description: `
        <h4 class="govuk-heading-s">When not to use hint text</h4>
        <p class="govuk-body">Do not use long paragraphs and lists in hint text. Screen readers read out the entire text when users interact with the form element. This could frustrate users if the text is long.</p>
        <h4 class="govuk-heading-s">Avoid links in hint text</h4>
        <p class="govuk-body">Do not include links within hint text. While screen readers will read out the link text when describing the field, they will not tell users that the text is a link.</p>
      `,
      templatePath: 'includes/components/search/noHintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  minMaxLength: {
    title: 'Minimum and maximum length',
    content: `
      <p class="govuk-body">Use custom <code>minchar</code> and <code>maxchar</code> attributes to set a minimum or maximum length for your search input. For example, you may wish to use <code>input minchar="6" maxchar="6"</code> when asking for a school's URN. This will ensure the user can only submit a search query of 6 characters in length.</p>
      <p class="govuk-body">You can use the <code>minchar</code> attribute together with the <code>maxchar</code> attribute to create a range of allowed lengths, as described in the example above, or as individual attributes.</p>
    `
  },

  inputSize: {
    title: 'Use appropriately-sized inputs',
    content: `
      <p class="govuk-body">Help users understand what they should enter by making search inputs the right size for the content they're intended for.</p>
      <p class="govuk-body">By default, the examples on this page contain the input class <code>govuk-!-width-two-thirds</code>. Removing this class makes the width of search inputs fluid and they will fit the full width of the container they are placed into.</p>
      <p class="govuk-body">If you want to change the search input size, you can either use a fixed width input, or use the width override classes.</p>
      <p class="govuk-body"><a class="govuk-link" href="https://design-system.service.gov.uk/components/text-input/#use-appropriately-sized-text-inputs" target="_blank">Read more about sizing your inputs and see examples (opens in a new tab)</a> on the GOV.UK Design System.</p>
    `
  },

  displayResults: {
    title: 'Display your search results',
    content: `
      <p class="govuk-body">Your search results should be displayed in an accompanying radio component unless your user research shows there is need for an alternative approach.</p>
      <p class="govuk-body"><a class="govuk-link" href="/powerpages/components/radios/">Read about how to display search results using a radio component</a>.</p>
    `
  },

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is shown next to the field and in the error summary when there is a validation error. The HTML content for these errors is already included in the component examples and in the base portal web template set up, therefore you do not need to add any additional error containers to your page.</p>
      <p class="govuk-body">The <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">portal helper framework</a> validation process automatically handles error messages for specific error states.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If nothing is entered</p>
      <p class="govuk-body">'Enter [whatever it is]'.<br><br>For example, 'Enter your URN'.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If the input is too short</p>
      <p class="govuk-body">'[whatever it is] must be [number] characters or more'.<br><br>For example, 'Your reference number must be 8 characters or more'.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If the input is too long</p>
      <p class="govuk-body">'[whatever it is] must be [number] characters or less'.<br><br>For example, 'Your reference must be 8 characters or less'.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If the input has both a minimum and maximum length</p>
      <p class="govuk-body">'[whatever it is] must be between [number] and [number] characters'.<br><br>For example, 'Your reference number must be between 6 and 8 characters'.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If the input has equal value minimum and maximum lengths</p>
      <p class="govuk-body">'[whatever it is] must be [number] characters'.<br><br>For example, 'Your URN must be 6 characters'.</p>
      <p class="govuk-body">Occasionally you may wish to use error messages outside of the validation process. You can <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">read about the functions available within the portal helper framework</a> to help you with this.</p>
    `
  }
};
