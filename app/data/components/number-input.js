export default {
  id: 'number-input',
  title: "Number input",
  description: "Use the number input component when you need to let a user enter either a whole number, a decimal number or either.",
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
        <p class="govuk-body">Do not use the number input component for any other purpose than allowing users to enter an whole number or decimal number.</p>

        <p class="govuk-body">There is specific guidance on how to ask for:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li><a class="govuk-link" href="{{ pages['powerpages/components/date-input'].url }}">dates</a></li>
          <li><a class="govuk-link" href="{{ pages['powerpages/components/telephone-input'].url }}">telephone numbers</a></li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/components/text-input/#numbers" target="_blank">GOV.UK Design System guidance on asking for numbers (opens in a new tab)</a> for information on labels, hint text, and accessibility considerations.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      subsections: [{ id: "single-question", title: "For single question pages" }, { id: "multiple-question", title: "For multiple question pages" }, { id: "hint-text", title: "Using hint text" }, { id: "prefix-suffix", title: "Prefixes and suffixes" }],
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
          "Number input for single question",
          "includes/components/number-input/headerExample.njk",
          { showUpdateSchema: true, index: 1, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m" id="multiple-question">For multiple question pages</h3>

        <p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>label</code> as the page heading.</p>

        {{ exampleTabs(
          "Number input for multiple questions",
          "includes/components/number-input/standardExample.njk",
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
          "Number input with hint",
          "includes/components/number-input/hintExample.njk",
          { showUpdateSchema: true, index: 3, layout: 'default' }
        ) }}

        <h3 class="govuk-heading-m" id="prefix-suffix">Prefixes and suffixes</h3>
        <p class="govuk-body">Use prefixes and suffixes to help users enter things like currencies and measurements.</p>
        <p class="govuk-body">Prefixes and suffixes are useful when there's a commonly understood symbol or abbreviation for the type of information you're asking for.
          Do not rely on prefixes or suffixes alone, because screen readers will not read them out.</p>
        <p class="govuk-body">If you need a specific type of information, say so in the input label or hint text as well. For example, put 'Cost, in pounds' in the input label
          and use the '£' symbol in the prefix.</p>
        <p class="govuk-body">Position prefixes and suffixes are positioned outside of their input to avoid interfering with some browsers that might insert an icon into the input
           (for example to show or generate a password).</p>

        {{ exampleTabs(
          "Number with prefix and suffix",
          "includes/components/number-input/prefixSuffixExample.njk",
          { showUpdateSchema: true, index: 4, layout: 'default' }
        ) }}
      `
    },
    {
      id: "input-sizing",
      title: "Use appropriately-sized inputs",
      content: `
        <p class="govuk-body">Help users understand what they should enter by making number inputs the right size for the content they're intended for.</p>
        <p class="govuk-body">By default, the width of number inputs is fluid and will fit the full width of the container they are placed into.</p>
        <p class="govuk-body">If you want to make the input smaller, you can either use a fixed width input, or use the width override classes to create a smaller, fluid width input.</p>
        <p class="govuk-body"><a class="govuk-link" href="https://design-system.service.gov.uk/components/text-input/#use-appropriately-sized-text-inputs" target="_blank">Read more about sizing your inputs and see examples on the GOV.UK Design System (opens in a new tab)</a>.</p>
      `
    },
    {
      id: "whole-number",
      title: "Asking for a whole number",
      content: `
        <p class="govuk-body">If you're asking the user to enter a whole number, make sure the <code>inputmode</code> attribute is set to <code>numeric</code> to use the numeric keypad on devices
          with on-screen keyboards. The examples provided above on this page already have the <code>inputmode="numeric"</code> attribute.</p>
      `
    },
    {
      id: "decimal-number",
      title: "Asking for a decimal number",
      content: `
        <p class="govuk-body">If you're asking the user to enter a number that might include decimal places, use <code>input type="text"</code>.
        <p class="govuk-body">Do not set the <code>inputmode</code> attribute as it causes some devices to bring up a keypad without a key for the decimal separator.
          When copying the examples on this page, you will need to remove this attribute from the HTML.</p>
      `
    },
    {
      id: "avoid-type-number",
      title: "Avoid using inputs with a type of number",
      content: `
        <p class="govuk-body">Do not use <code>&lt;input type="number"&gt;</code> unless your user research shows that there's a need for it. With <code>&lt;input type="number"&gt;</code> there's
          a risk of users accidentally incrementing a number when they're trying to do something else - for example, scroll up or down the page. And if the user tries to enter
          something that's not a number, there's no explicit feedback about what they're doing wrong.</p>
      `
    },
    {
      id: "min-max",
      title: "Minimum and maximum",
      content: `
        <p class="govuk-body">The number component does not use <code>input type="number"</code> so the standard HTML <code>min</code> and <code>max</code> attributes do not apply.
          Do not use the <code>minlength</code> and <code>maxlength</code> attributes associated with <code>input type="text"</code> either. Browsers will not permit the user to enter more than the characters defined by the value of the maxlength attribute, cutting off the text as-you-type and truncating
           pasted text. This can lead to bad user experience.</p>
        <p class="govuk-body">You can use custom attributes which will work with the CRM helper framework to set the allowed value or length range of a number input.</p>
        <p class="govuk-body">Minimum and maximum length and minimum and maximum value attributes can be used together, but only when the input is a whole number.</p>

        <h3 class="govuk-heading-m">Minimum and maximum value</h3>
        <p class="govuk-body">Use <code>minvalue</code> and <code>maxvalue</code> attributes to set a minimum or maximum value for your input. For example, <code>input maxvalue="10"</code>
          will prevent the user being able to submit a number greater than 10.</p>
        <p class="govuk-body">Use the <code>minvalue</code> attribute together with the <code>maxvalue</code> attribute to create a range of allowed values.</p>

        <h3 class="govuk-heading-m">Minimum and maximum length</h3>
        <p class="govuk-body">Use <code>minchar</code> and <code>maxchar</code> attributes to set a minimum or maximum length for your input. For example, you may wish to use <code>input minchar="8" maxchar="8"</code>
          when asking for a bank account number. Will ensure the user can only submit a number of 8 characters in length.</p>
        <p class="govuk-body">You can use the <code>minchar</code> attribute together with the <code>maxchar</code> attribute to create a range of allowed lengths, as described in the example above, or as individual attributes.</p>
        <p class="govuk-body">The length attributes can only be used as part of a number component when the input is a whole number.</p>
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
        <p class="govuk-body">'Enter [whatever it is]'. For example, 'Enter your age'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input is not a number</p>
        <p class="govuk-body">'[whatever it is] must be a number'. For example, 'Age must be a number'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input should be a whole number but contains decimals</p>
        <p class="govuk-body">'[whatever it is] must be a whole number'. For example, 'Quantity must be a whole number'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input should be a decimal number</p>
        <p class="govuk-body">'[whatever it is] must be a decimal number'. For example, 'Amount must be a decimal number'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the value is too high</p>
        <p class="govuk-body">'[whatever it is] must be [number] or fewer'. For example, 'Quantity must be 100 or fewer'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the value is too low</p>
        <p class="govuk-body">'[whatever it is] must be [number] or more'. For example, 'Quantity must be 1 or more'.</p>
        <p class="govuk-body govuk-!-font-weight-bold">If the input is too long (whole numbers only)</p>
        <p class="govuk-body">'[whatever it is] must be [number] characters or less'. For example, 'Reference number must be 8 characters or less'.</p>
      `
    }
  ]
};
