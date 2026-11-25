export default {
  id: 'feedback',
  title: "Feedback",
  description: "Use the feedback component to collect user feedback about a page with a simple 'Is this page useful?' prompt.",
  // The page has no contents list
  contents: false,

  intro: `
    <p class="govuk-body"><a class="govuk-link" href="#html-example">Skip to HTML example</a></p>
  `,

  sections: [
    {
      id: "when-to-use-this-component",
      title: "When to use this component",
      content: `
        <p class="govuk-body">{{ pageData.description }}</p>
        <p class="govuk-body">You can see a working example of this component on most pages of the <a class="govuk-link" href="https://www.gov.uk" target="_blank">GOV.UK website (opens in a new tab)</a>.</p>
        <p class="govuk-body">Use the feedback component when you want to:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>gather quick feedback on whether a page is useful</li>
          <li>provide users with a way to report issues with a page</li>
          <li>collect data to help improve your service</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use the feedback component:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>on transactional pages where it might distract from the main task</li>
          <li>if you cannot act on the feedback received</li>
          <li>as a replacement for proper user research</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The feedback component appears at the bottom of the page, above the footer, and asks users "Is this page useful?" with Yes and No buttons.</p>
        <p class="govuk-body">When a user clicks a button:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>show a thank you message confirming their response was received</li>
          <li>optionally reveal a form for more detailed feedback</li>
          <li>store the response for analysis</li>
        </ul>
      `
    },
    {
      id: "error-handling",
      title: "Error handling",
      content: `
        <p class="govuk-body">If your feedback form includes validation (for example, requiring users to enter comments before submitting), you will need to use a custom error container.</p>
        <p class="govuk-body">Because the feedback form typically appears in a panel or modal separate from the main page content, validation errors should display within that panel rather than at the top of the main page.</p>
        <p class="govuk-body">See the <a class="govuk-link" href="{{ pages['powerpages/patterns/custom-errors'].url }}">displaying custom errors</a> pattern for guidance on how to implement this, including a specific example for the feedback component.</p>
      `
    },
    {
      id: "html-example",
      title: "HTML example",
      content: `
        <p class="govuk-body">
          Copy the HTML from this page directly into your web template. You will need to add JavaScript to handle the button clicks and form submission.
        </p>

        {{ exampleTabs(
          "Feedback",
          "includes/components/feedback/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}

      `
    }
  ]
};
