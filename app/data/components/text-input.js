export default {
  id: 'text-input',
  title: "Text input",
  description: "Use the text input component when you need to let users enter text that's no longer than a single line.",
  // The page has no contents list
  contents: false,
  scripts: ["/assets/js/update-html-example.js"],

  intro: `
    <p class="govuk-body"><a class="govuk-link" href="#html-examples">Skip to HTML examples</a></p>
  `,

  sections: [
    {
      id: "when-to-use-this-component",
      title: "When to use this component",
      content: `
        <p class="govuk-body">{{ pageData.description }}</p>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use the text input component if you need to let users enter longer answers that might span multiple lines. In this case, you should use the <a class="govuk-link" href="{{ pages['powerpages/components/textarea'].url }}">textarea</a> component instead.</p>
        <p class="govuk-body">There is specific guidance on how to ask for:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li><a class="govuk-link" href="{{ pages['powerpages/components/date-input'].url }}">dates</a></li>
          <li><a class="govuk-link" href="{{ pages['powerpages/components/email-input'].url }}">email addresses</a></li>
          <li><a class="govuk-link" href="{{ pages['powerpages/components/number-input'].url }}">numbers</a></li>
          <li><a class="govuk-link" href="{{ pages['powerpages/components/telephone-input'].url }}">telephone numbers</a></li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/components/text-input/#how-it-works" target="_blank">GOV.UK Design System guidance on text inputs (opens in a new tab)</a> for information on labels, hint text, and accessibility considerations.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      content: `
        <p class="govuk-body">
          Copy the HTML into your web template. Replace <code>schema-name</code> with your CRM field schema name, keeping any suffixes like <code>-hint</code>. This is required for the <a class="govuk-link" href="{{ pages['powerpages/developer-guides/crm-helper-framework'].url }}">CRM helper framework</a> to validate and submit data.
        </p>
        <p class="govuk-body">
          Use the input field above each example to enter your schema name. This updates all instances in the code automatically, ensuring no mistakes that could impact validation or accessibility.
        </p>

        <h3 class="govuk-heading-m">For single question pages</h3>
        <p class="govuk-body">
          If presenting only one question on the page, set the contents of the <code>&lt;label&gt;</code> as the page heading.
          This is good practice as it means that users of screen readers will only hear the contents once.
        </p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header.</p>

        {{ exampleTabs(
          "Text input for single question",
          "includes/components/text-input/headerExample.njk",
          { showUpdateSchema: true, index: 1, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m">For multiple question pages</h3>
        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>&lt;label&gt;</code> as the page heading.</p>

        {{ exampleTabs(
          "Text input for multiple questions",
          "includes/components/text-input/standardExample.njk",
          { showUpdateSchema: true, index: 2, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m">Using hint text</h3>
        <p class="govuk-body">Use hint text for help that's relevant to the majority of users, like how their information will be used, or where to find it.</p>
        <p class="govuk-body">Do not use long paragraphs and lists in hint text. Screen readers read out the entire text when users interact with the form element. Do not include links within hint text.</p>

        {{ exampleTabs(
          "Text input with hint",
          "includes/components/text-input/hintExample.njk",
          { showUpdateSchema: true, index: 3, layout: 'default' }
        ) }}
      `
    },
    {
      id: "input-sizing",
      title: "Use appropriately-sized inputs",
      content: `
        <p class="govuk-body">Help users understand what they should enter by making text inputs the right size for the content they're intended for.</p>
        <p class="govuk-body">By default, the width of text inputs is fluid and will fit the full width of the container they are placed into.</p>
        <p class="govuk-body">If you want to make the input smaller, you can either use a fixed width input, or use the width override classes to create a smaller, fluid width input.</p>
        <p class="govuk-body"><a class="govuk-link" href="https://design-system.service.gov.uk/components/text-input/#use-appropriately-sized-text-inputs" target="_blank">Read more about sizing your inputs and see examples on the GOV.UK Design System (opens in a new tab)</a>.</p>
      `
    },
    {
      id: "error-messages",
      title: "Error messages",
      content: `
        <p class="govuk-body">
          An error message is displayed next to the field and in the error summary when a validation error occurs.
          The <a class="govuk-link" href="{{ pages['powerpages/developer-guides/crm-helper-framework'].url }}">CRM helper framework</a> automatically handles error messages for specific error states.
        </p>
        <p class="govuk-body govuk-!-font-weight-bold">If nothing is entered and the question is required</p>
        <p class="govuk-body">'Enter [whatever it is]'. For example, 'Enter your full name'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input is too long</p>
        <p class="govuk-body">'[whatever it is] must be [number] characters or less'. For example, 'Full name must be 50 characters or less'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input is too short</p>
        <p class="govuk-body">'[whatever it is] must be [number] characters or more'. For example, 'Full name must be 2 characters or more'.</p>
      `
    }
  ]
};
