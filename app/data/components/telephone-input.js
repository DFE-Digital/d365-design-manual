export default {
  id: 'telephone-input',
  title: "Telephone input",
  description: "Use the telephone input component when you need to let users enter a phone number.",
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
        <p class="govuk-body">Only collect phone numbers from people if you genuinely need them. Not everyone has or can use a phone, so make sure you give users a choice about how they can be contacted.</p>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/patterns/telephone-numbers/" target="_blank">GOV.UK Design System guidance on asking for telephone numbers (opens in a new tab)</a> for information on labels, accepted formats, and accessibility considerations.</p>
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
          "Telephone input for single question",
          "includes/components/telephone-input/headerExample.njk",
          { showUpdateSchema: true, index: 1, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m">For multiple question pages</h3>
        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>&lt;label&gt;</code> as the page heading.</p>

        {{ exampleTabs(
          "Telephone input for multiple questions",
          "includes/components/telephone-input/standardExample.njk",
          { showUpdateSchema: true, index: 2, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m">Using hint text</h3>
        <p class="govuk-body">Use hint text for help that's relevant to the majority of users, like specifying the type of telephone number you need or that you accept international numbers.</p>
        <p class="govuk-body">Do not use long paragraphs and lists in hint text. Screen readers read out the entire text when users interact with the form element. Do not include links within hint text.</p>

        {{ exampleTabs(
          "Telephone input with hint",
          "includes/components/telephone-input/hintExample.njk",
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
        <p class="govuk-body">'Enter a telephone number' or 'Enter a UK mobile telephone number'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the telephone number is not in a valid format</p>
        <p class="govuk-body">'Enter a telephone number in the correct format, like 01632 960 001, 07700 900 982 or +44 808 157 0192'.</p>
      `
    }
  ]
};
