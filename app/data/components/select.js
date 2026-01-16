export default {
  id: 'select',
  title: 'Select',
  description: 'Use the select component to allow users to choose an option from a long list.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the select component to allow users to choose an option from a long list.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">The select component allows users to choose an option from a long list. Before using the select component, try asking users questions which will allow you to present them with fewer options.</p>
      <p class="govuk-body">Asking questions means you're less likely to need to use the select component, and can consider using a different solution, such as <a class="govuk-link" href="/powerpages/components/radios/">radios</a>.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">If you use the select component for settings, you can make an option pre-selected by default when users first see it.</p>
      <p class="govuk-body">If you use the select component for questions, you should not pre-select any of the options in case it influences users' answers.</p>
    `
  },

  examples: [
    {
      id: 'single-question',
      title: 'If you are asking one question on the page',
      description: `
        <p class="govuk-body">If you are asking just one question on the page, set the contents of the <code>&lt;label&gt;</code> as the page heading. This is good practice as it means that users of screen readers will only hear the contents once.</p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to override the default page header.</p>
      `,
      templatePath: 'includes/components/select/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'If you are asking more than one question on the page',
      description: `<p class="govuk-body">If you're asking more than one question on the page, do not set the contents of the <code>&lt;legend&gt;</code> as the page heading.</p>`,
      templatePath: 'includes/components/select/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'hint-text',
      title: 'Using hint text',
      description: `
        <p class="govuk-body">Use hint text for help that's relevant to the majority of users, like how their information will be used, or where to find it. The hint text block is included in the example below.</p>
        <p class="govuk-body">Make sure to use the hint code block with the correct component for whether there is more than one question on a page or not.</p>
        <p class="govuk-body">Hint text is not mandatory.</p>
        <h4 class="govuk-heading-s">When not to use hint text</h4>
        <p class="govuk-body">Do not use long paragraphs and lists in hint text. Screen readers read out the entire text when users interact with the form element. This could frustrate users if the text is long.</p>
        <h4 class="govuk-heading-s">Avoid links in hint text</h4>
        <p class="govuk-body">Do not include links within hint text. While screen readers will read out the link text when describing the field, they will not tell users that the text is a link.</p>
      `,
      templatePath: 'includes/components/select/hintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is shown next to the field and in the error summary when there is a validation error. The <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">custom CRM portal helper framework</a> automatically processes and handles error messages for specific error states and is included in the files for the core portal set up. You do not need to add any custom error containers to your page.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If nothing is chosen and the question is required</p>
      <p class="govuk-body">'Choose [whatever it is]'.<br><br>For example, 'Choose location'.</p>
      <p class="govuk-body">Occasionally you may wish to use error messages outside of the validation process. You can <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">read about the functions available within the portal helper framework</a> to help you with this.</p>
    `
  }
};
