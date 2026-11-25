export default {
  id: 'email-input',
  title: "Email input",
  description: "Use the email input component when allowing users to input their email address.",
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
        <p class="govuk-body">Avoid using the email input component for any purpose other than entering an email address.</p>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/patterns/email-addresses/" target="_blank">GOV.UK Design System guidance on asking for email addresses (opens in a new tab)</a> for information on labels, hint text, and accessibility considerations.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      subsections: [{ id: "single-question", title: "For single question pages" }, { id: "multiple-question", title: "For multiple question pages" }, { id: "hint-text", title: "Using hint text" }],
      content: `
        <p class="govuk-body">
          Copy the HTML into your web template. Replace <code>schema-name</code> with your CRM field schema name, keeping any suffixes like <code>-hint</code>. This is required for the <a class="govuk-link" href="{{ pages['powerpages/developer-guides/crm-helper-framework'].url }}">CRM helper framework</a> to validate and submit data.
        </p>
        <p class="govuk-body">
          Use the input field above each example to enter your schema name. This updates all instances in the code automatically, ensuring no mistakes that could impact validation or accessibility.
        </p>

        <h3 class="govuk-heading-m" id="single-question">For single question pages</h3>
        <p class="govuk-body">
          If presenting only one question on the page, designate the contents of the <code>label</code> as the page heading.
          This practice ensures users of screen readers hear the contents only once.
        </p>

        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header and avoid duplication.</p>
        {{ exampleTabs(
          "Email input for single question",
          "includes/components/email-input/headerExample.njk",
          { showUpdateSchema: true, index: 1, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m" id="multiple-question">For multiple question pages</h3>
        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>label</code> as the page heading.</p>

        {{ exampleTabs(
          "Email input for multiple questions",
          "includes/components/email-input/standardExample.njk",
          { showUpdateSchema: true, index: 2, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="hint-text">Using hint text</h3>
        <p class="govuk-body">
          Use hint text to provide relevant assistance to the majority of users, such as clarifying how their information will be used or where to locate it.
          The hint text block is demonstrated in the example below.
        </p>

        <p class="govuk-body">Please ensure the following:</p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Use the hint text block appropriately</li>
          <li>Place the hint block correctly within your HTML component</li>
          <li>Add the <code>aria-describedby</code> attribute where necessary, for accessiblity. For the email component this is against the <code>input</code>.</li>
        </ul>
        <p class="govuk-body">
          Avoid lengthy paragraphs and lists in hint text, as screen readers will read out the entire content, potentially frustrating users.
          Additionally, refrain from including links within hint text, as screen readers do not indicate that the text is a clickable link.
        </p>

        {{ exampleTabs(
          "Email input with hint",
          "includes/components/email-input/hintExample.njk",
          { showUpdateSchema: true, index: 3, layout: 'default' }
        ) }}
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
        <p class="govuk-body">'Enter [whatever it is]'. For example, 'Enter your email address'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the email address is not in a valid format</p>
        <p class="govuk-body">'Enter a valid email address'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input is too long</p>
        <p class="govuk-body">'[whatever it is] must be [number] characters or less'. For example, 'Email address must be 254 characters or less'.</p>
      `
    }
  ]
};
