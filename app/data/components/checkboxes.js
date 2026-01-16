export default {
  id: 'checkboxes',
  title: 'Checkboxes',
  description: 'Use the checkboxes component when you need to help users select multiple options from a list or toggle a single option on or off.',

  // Define which sections appear and in what order
  sections: [
    'whenToUse',
    'whenNotToUse',
    'howItWorks',
    'examples',
    'errorMessages',
    'knownIssues'
  ],

  whenToUse: {
    title: 'When to use this component',
    content: `
      <p class="govuk-body">Use the checkboxes component when you need to help users select multiple options from a list or toggle a single option on or off.</p>
      <p class="govuk-body">If required, you can use custom script to associate records where each checkbox selection refers to a parent-child or many-to-many relationship record.</p>
    `
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Avoid using the checkboxes component if users can only choose one option from a selection. Instead, opt for the <a class="govuk-link" href="/powerpages/components/radios/">radios component</a>.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">Checkboxes are positioned to the left of their labels for enhanced visibility, particularly for users utilising screen magnifiers.</p>
      <p class="govuk-body">Unlike radios, users can select multiple options from a list of checkboxes. Do not assume users will understand the number of selectable options based solely on the visual distinction between radios and checkboxes.</p>
      <p class="govuk-body">If necessary, provide hint text such as 'Select all that apply' to clarify the selection process.</p>
      <p class="govuk-body">Avoid pre-selecting checkbox options as it may lead to users overlooking questions or providing incorrect answers.</p>
      <p class="govuk-body">Order checkbox options alphabetically by default.</p>
    `
  },

  examples: [
    {
      id: 'single-question',
      title: 'For single question pages',
      description: `
        <p class="govuk-body">If presenting only one question on the page, designate the contents of the <code>legend</code> as the page heading. This practice ensures users of screen readers hear the contents only once.</p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header and avoid duplication.</p>
      `,
      templatePath: 'includes/components/checkbox/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `
        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>legend</code> as the page heading.</p>
      `,
      templatePath: 'includes/components/checkbox/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'using-hint-text',
      title: 'Using hint text',
      description: `
        <p class="govuk-body">Use hint text to provide relevant assistance to the majority of users, such as clarifying how their information will be used or where to locate it. The hint text block is demonstrated in the example below.</p>
        <p class="govuk-body">Please ensure the following:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Use the hint text block appropriately</li>
          <li>Place the hint block correctly within your HTML component</li>
          <li>Add the <code>aria-describedby</code> attribute where necessary, for accessibility. For checkboxes this is against the <code>fieldset</code>.</li>
        </ul>
        <p class="govuk-body">Avoid lengthy paragraphs and lists in hint text, as screen readers will read out the entire content, potentially frustrating users. Additionally, refrain from including links within hint text, as screen readers do not indicate that the text is a clickable link.</p>
      `,
      templatePath: 'includes/components/checkbox/hintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  additionalExamples: {
    title: 'Additional examples',
    intro: 'Additional examples can be found on the GOV.UK Design System:',
    links: [
      { text: "Add an option for 'none'", url: 'https://design-system.service.gov.uk/components/checkboxes#add-an-option-for-none' },
      { text: 'Conditionally revealing a related question', url: 'https://design-system.service.gov.uk/components/checkboxes#conditionally-revealing-a-related-question' },
      { text: 'Smaller checkboxes', url: 'https://design-system.service.gov.uk/components/checkboxes#smaller-checkboxes' }
    ],
    outro: 'These examples will eventually be incorporated into this guidance, demonstrating how to use each of these additional examples with Power Pages. If you require assistance in the interim to adapt these additional examples for use with Power Pages and the CRM helper framework, please contact the Solutions Delivery Team.'
  },

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
      <p class="govuk-body">Ensure that your component HTML and your <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/#validation">inputs validation JavaScript object</a> are structured correctly for your component type.</p>
      <p class="govuk-body govuk-!-font-weight-bold">If nothing is selected and the question is required</p>
      <p class="govuk-body">Occasionally you may wish to employ error messages outside of the validation process. You can <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">read about the functions available within the CRM helper framework</a> to assist you with this.</p>
    `
  },

  knownIssues: {
    title: 'Known issues',
    content: `
      <p class="govuk-body">The CRM helper framework does not currently support submitting to multi-choice select fields in Dynamics 365. This issue has been added to the <a class="govuk-link" href="https://github.com/DFE-Digital/d365-design-manual/issues" target="_blank">issues backlog in GitHub (opens in a new tab)</a>.</p>
    `
  }
};
