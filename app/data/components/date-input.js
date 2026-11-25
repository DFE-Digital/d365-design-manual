export default {
  id: 'date-input',
  title: "Date input",
  description: "Use the date input component when users need to input a memorable or easily retrievable date.",
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
        <p class="govuk-body">Avoid using the date input component if users are unlikely to know the precise date of the event in question.</p>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/components/date-input/#how-it-works" target="_blank">GOV.UK Design System guidance on date inputs (opens in a new tab)</a> for information on hint text, error messages, and accessibility considerations.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      subsections: [{ id: "single-question", title: "For single question pages" }, { id: "multiple-questions", title: "For multiple question pages" }, { id: "dob", title: "Asking for a date of birth" }],
      content: `
        <p class="govuk-body">
          Copy the HTML into your web template. Replace <code>schema-name</code> with your CRM field schema name, keeping any suffixes like <code>-hint</code>. This is required for the <a class="govuk-link" href="{{ pages['powerpages/developer-guides/crm-helper-framework'].url }}">CRM helper framework</a> to validate and submit data.
        </p>
        <p class="govuk-body">
          Use the input field above each example to enter your schema name. This updates all instances in the code automatically, ensuring no mistakes that could impact validation or accessibility.
        </p>

        <h3 class="govuk-heading-m" id="single-question">For single question pages</h3>
        <p class="govuk-body">
          If presenting only one question on the page, designate the contents of the <code>legend</code> as the page heading.
          This practice ensures users of screen readers hear the contents only once.
        </p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header and avoid duplication.</p>

        {{ exampleTabs(
          "Date input for single question",
          "includes/components/date-input/headerExample.njk",
          { showUpdateSchema: true, index: 1, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m" id="multiple-questions">For multiple question pages</h3>
        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>&lt;legend&gt;</code> as the page heading.</p>

        {{ exampleTabs(
          "Date input for multiple questions",
          "includes/components/date-input/standardExample.njk",
          { showUpdateSchema: true, index: 2, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="dob">Asking for a date of birth</h3>
        <p class="govuk-body">
          When collecting a date of birth, apply the autocomplete attribute to the date input component.
          This enables browsers to autofill the information if previously entered by the user.
        </p>
        <p class="govuk-body">
          Set the <code>autocomplete</code> attribute on the day, month, and year inputs to <code>bday-day</code>, <code>bday-month</code> and <code>bday-year</code> respectively.
        </p>

        {{ exampleTabs(
          "Date of birth with autocomplete",
          "includes/components/date-input/autocompleteExample.njk",
          { showUpdateSchema: true, index: 3, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m">Additional examples</h3>
        <p class="govuk-body">Additional examples can be found on the <a class="govuk-link" href="https://design-system.service.gov.uk/components/date-input/" target="_blank">GOV.UK Design System date input page (opens in a new tab)</a>, including guidance on:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>using a calendar or date picker</li>
          <li>asking for approximate dates</li>
          <li>asking for dates from documents</li>
        </ul>
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
        <p class="govuk-body govuk-!-font-weight-bold">If a required date part is missing</p>
        <p class="govuk-body">'[whatever it is] must contain a [day/month/year]'. For example, 'Date of birth must contain a year'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If a date part is invalid</p>
        <p class="govuk-body">'[whatever it is] must contain a valid [day/month/year]'. For example, 'Date of birth must contain a valid day'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the date is not a real date</p>
        <p class="govuk-body">'[whatever it is] must be a real date'. For example, 'Date of birth must be a real date'.</p>
      `
    }
  ]
};
