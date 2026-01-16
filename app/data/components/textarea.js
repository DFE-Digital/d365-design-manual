export default {
  id: 'textarea',
  title: 'Textarea',
  description: 'Use the textarea component when you need users to enter text that is longer than a single line.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the textarea component when you need users to enter text that is longer than a single line, such as comments or descriptions.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Do not use the textarea component if you need users to enter short answers that will fit on a single line. In this case, use the <a class="govuk-link" href="/powerpages/components/text-input/">text input component</a>.</p>`
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">All textareas must have visible labels aligned above the textarea they refer to. Labels should be short, direct and written in sentence case. Do not use colons at the end of labels.</p>
      <p class="govuk-body">Make the height of a textarea proportional to the amount of text you expect users to enter. You can set the height of a textarea by specifying the rows attribute.</p>
    `
  },

  examples: [
    {
      id: 'single-question',
      title: 'For single question pages',
      description: `
        <p class="govuk-body">If presenting only one question on the page, designate the contents of the <code>label</code> as the page heading. This practice ensures users of screen readers hear the contents only once.</p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header and avoid duplication.</p>
      `,
      templatePath: 'includes/components/textarea/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>label</code> as the page heading.</p>`,
      templatePath: 'includes/components/textarea/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'hint-text',
      title: 'Using hint text',
      description: `
        <p class="govuk-body">Use hint text to provide relevant assistance to the majority of users, such as clarifying how their information will be used.</p>
      `,
      templatePath: 'includes/components/textarea/hintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
    `
  }
};
