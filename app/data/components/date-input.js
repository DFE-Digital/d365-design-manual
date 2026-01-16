export default {
  id: 'date-input',
  title: 'Date input',
  description: 'Use the date input component when you need users to enter a memorable date, such as their date of birth or the date they received a document.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the date input component when you need users to enter a memorable date, such as their date of birth or the date they received a document.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Avoid using the date input component if users are unlikely to know the precise date of the event in question.</p>`
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">The date input component comprises three fields allowing users to enter the day, month, and year individually.</p>
      <p class="govuk-body">Always include hint text within date components to inform users about the required input format. Additional hint text can be added as needed. Ensure that any example dates provided in hint text are relevant to the specific question being asked.</p>
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
      templatePath: 'includes/components/date-input/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-questions',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>&lt;legend&gt;</code> as the page heading.</p>`,
      templatePath: 'includes/components/date-input/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'dob',
      title: 'Asking for a date of birth',
      description: `
        <p class="govuk-body">When collecting a date of birth, apply the autocomplete attribute to the date input component. This enables browsers to autofill the information if previously entered by the user.</p>
        <p class="govuk-body">Set the <code>autocomplete</code> attribute on the day, month, and year inputs to <code>bday-day</code>, <code>bday-month</code> and <code>bday-year</code> respectively.</p>
      `,
      templatePath: 'includes/components/date-input/autocompleteExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
      <p class="govuk-body">Ensure that your component HTML and your <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/#validation">inputs validation JavaScript object</a> are structured correctly for your component type.</p>
      <p class="govuk-body">Occasionally you may wish to employ error messages outside of the validation process. You can <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">read about the functions available within the CRM helper framework</a> to assist you with this.</p>
    `
  }
};
