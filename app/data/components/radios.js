export default {
  id: 'radios',
  title: 'Radios',
  description: 'Use the radios component when users can only select one option from a list.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the radios component when users can only select one option from a list.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Do not use the radios component if users might need to select more than one option. In this case, you should use the <a class="govuk-link" href="/powerpages/components/checkboxes/">checkboxes component</a> instead.</p>`
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">Always position radios to the left of their labels. This makes them easier to find, especially for users of screen magnifiers.</p>
      <p class="govuk-body">Unlike with checkboxes, users can only select one option from a list of radios. Do not assume that users will know how many options they can select based on the visual difference between radios and checkboxes alone. If needed, add a hint explaining this, for example, 'Select one option'.</p>
      <p class="govuk-body">Do not pre-select radio options as this makes it more likely that users will not realise they've missed a question or submitted the wrong answer.</p>
      <p class="govuk-body">Users cannot go back to having no option selected once they have selected one, without refreshing their browser window. Therefore, you should include 'None of the above' or 'I do not know' if they are valid options.</p>
      <p class="govuk-body">Order radio options alphabetically by default.</p>
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
      templatePath: 'includes/components/radios/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>&lt;legend&gt;</code> as the page heading.</p>`,
      templatePath: 'includes/components/radios/standardExample.njk',
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
          <li>Add the <code>aria-describedby</code> attribute where necessary, for accessibility. For radios this is against the <code>fieldset</code>.</li>
        </ul>
        <p class="govuk-body">Avoid lengthy paragraphs and lists in hint text, as screen readers will read out the entire content, potentially frustrating users. Additionally, refrain from including links within hint text, as screen readers do not indicate that the text is a clickable link.</p>
      `,
      templatePath: 'includes/components/radios/hintExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'inline-radios',
      title: 'Inline radios',
      description: `
        <p class="govuk-body">In some cases, you can choose to display radios 'inline' beside one another (horizontally). Only use inline radios when the question only has two options or both options are short.</p>
        <p class="govuk-body">On small screens such as mobile devices, the radios will still be 'stacked' on top of one another (vertically).</p>
      `,
      templatePath: 'includes/components/radios/inlineExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'conditional-questions',
      title: 'Conditionally revealing a related question',
      description: `
        <p class="govuk-body">You can ask the user a related question when they select a particular radio option, so they only see the question when it's relevant to them.</p>
        <p class="govuk-body">This might make two related questions easier to answer by grouping them on the same page. For example, you could reveal a phone number input when the user selects the 'Contact me by phone' option.</p>
        <p class="govuk-body">If the related question is complicated or has more than one part, show it on the next page in the process instead.</p>
        <p class="govuk-body">Do not conditionally reveal questions to inline radios, such as 'yes' and 'no' options placed next to each other.</p>
        <p class="govuk-body">Conditionally reveal questions only - do not show or hide anything that is not a question.</p>
        <div class="govuk-inset-text">
          <p class="govuk-body">Your schema names are likely to be different for your related questions. Using the above code example as reference, your 'Text message' option and related 'Mobile phone number' input are likely to have different schema names if you are submitting both values to fields in the CRM database. Be aware of this when replacing the 'schema-name' placeholder values.</p>
        </div>
      `,
      templatePath: 'includes/components/radios/conditionalExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    }
  ],

  additionalExamples: {
    title: 'Additional examples',
    intro: 'Additional examples can be found on the GOV.UK Design System:',
    links: [
      { text: 'Radio items with a text divider', url: 'https://design-system.service.gov.uk/components/radios#radio-items-with-a-text-divider' },
      { text: 'Smaller radios', url: 'https://design-system.service.gov.uk/components/radios#smaller-radios' }
    ],
    outro: 'These examples will eventually be incorporated into this guidance, demonstrating how to use each of these additional examples with Power Pages. If you require assistance in the interim to adapt these additional examples for use with Power Pages and the CRM helper framework, please contact the Solutions Delivery Team.'
  },

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The CRM helper framework automatically handles error messages for specific error states, therefore you do not need to add any additional error containers to your HTML. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Refer to the CRM helper framework guide</a> to understand how to validate your front-end data.</p>
      <p class="govuk-body">Ensure that your component HTML and your <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/#validation">inputs validation JavaScript object</a> are structured correctly for your component type.</p>
      <p class="govuk-body">Occasionally you may wish to employ error messages outside of the validation process. You can <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">read about the functions available within the CRM helper framework</a> to assist you with this.</p>
    `
  }
};
