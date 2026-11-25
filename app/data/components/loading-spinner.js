export default {
  id: 'loading-spinner',
  title: "Loading spinner",
  description: "Use the loading spinner component to indicate that content is being loaded or an action is being processed.",
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
        <p class="govuk-body">Use a loading spinner when:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>submitting data to CRM via the Web API</li>
          <li>loading content dynamically after the page has rendered</li>
          <li>waiting for a response from an external service</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use a loading spinner:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>for initial page loads (the browser handles this)</li>
          <li>when the wait time is very short (under 1 second)</li>
          <li>without accompanying text explaining what is loading</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The loading spinner is a simple CSS animation that rotates continuously. It should be shown when an action begins and hidden when the action completes.</p>
        <p class="govuk-body">Always pair the spinner with descriptive text so users understand what is happening, especially for screen reader users.</p>
      `
    },
    {
      id: "html-example",
      title: "HTML example",
      content: `
        <p class="govuk-body">
          Copy the HTML from this page directly into your web template.
        </p>

        {{ exampleTabs(
          "Loading spinner",
          "includes/components/loading-spinner/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}

      `
    }
  ]
};
