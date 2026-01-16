export default {
  id: 'text-input',
  title: 'Text input',
  description: 'Use the text input component when you need users to enter text that is no longer than a single line, such as their name or phone number.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the text input component when you need users to enter text that is no longer than a single line, such as their name or phone number.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Do not use the text input component if you need users to enter longer answers that might span multiple lines. In this case, use the <a class="govuk-link" href="/powerpages/components/textarea/">textarea component</a>.</p>
      <p class="govuk-body">There is specific guidance on how to ask for:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li><a class="govuk-link" href="/powerpages/components/date-input/">dates</a></li>
        <li><a class="govuk-link" href="/powerpages/components/email-input/">email addresses</a></li>
        <li><a class="govuk-link" href="/powerpages/components/telephone-input/">telephone numbers</a></li>
        <li><a class="govuk-link" href="/powerpages/components/number-input/">numbers</a></li>
      </ul>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">All text inputs must have visible labels aligned above the text input they refer to. Labels should be short, direct and written in sentence case. Do not use colons at the end of labels.</p>
      <p class="govuk-body">Avoid using placeholder text instead of labels or for hints/examples. Placeholder text can disappear as soon as users start typing, potentially causing issues for users with memory conditions or when reviewing answers. Additionally, not all screen readers read placeholder text, and its default browser styles may not meet minimum contrast requirements.</p>
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
      templatePath: 'includes/components/text-input/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>label</code> as the page heading.</p>`,
      templatePath: 'includes/components/text-input/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'hint-text',
      title: 'Using hint text',
      description: `
        <p class="govuk-body">Use hint text to provide relevant assistance to the majority of users, such as clarifying how their information will be used or where to locate it.</p>
        <p class="govuk-body">Please ensure the following:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Use the hint text block appropriately</li>
          <li>Place the hint block correctly within your HTML component</li>
          <li>Add the <code>aria-describedby</code> attribute where necessary, for accessibility</li>
        </ul>
        <p class="govuk-body">Avoid lengthy paragraphs and lists in hint text, as screen readers will read out the entire content, potentially frustrating users.</p>
      `,
      templatePath: 'includes/components/text-input/hintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
      <p class="govuk-body">Ensure that your component HTML and your <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/#validation">inputs validation JavaScript object</a> are structured correctly for your component type.</p>
    `
  }
};
