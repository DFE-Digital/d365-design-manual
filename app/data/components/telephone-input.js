export default {
  id: 'telephone-input',
  title: 'Telephone input',
  description: 'Use the telephone input component when you need users to enter a telephone number.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the telephone input component when you need users to enter a telephone number.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Do not use the telephone input component for any purpose other than entering a telephone number. Use the <a class="govuk-link" href="/powerpages/components/text-input/">text input component</a> for general text.</p>`
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">All telephone inputs must have visible labels aligned above the corresponding text input. Labels should be concise, direct, and written in sentence case.</p>
      <p class="govuk-body">Allow users to enter telephone numbers in whatever format is familiar to them. You should allow for additional spaces, hyphens and brackets, and be able to accommodate country codes if necessary.</p>
      <p class="govuk-body">When you ask for a telephone number, tell users why you need it and how you will use it.</p>
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
      templatePath: 'includes/components/telephone-input/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>label</code> as the page heading.</p>`,
      templatePath: 'includes/components/telephone-input/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
    `
  }
};
