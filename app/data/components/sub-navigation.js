export default {
  id: 'sub-navigation',
  title: "Sub-navigation",
  description: "Use the sub-navigation component to help users navigate between related pages or sections within a service.",
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
        <p class="govuk-body">Use sub-navigation when you need to:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>help users navigate between related pages within a section</li>
          <li>show the current page within a group of pages</li>
          <li>provide quick access to sibling pages without returning to a parent page</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use sub-navigation:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>as the primary navigation for your service</li>
          <li>when there are only one or two items to navigate between</li>
          <li>for deep navigation hierarchies (consider a different pattern)</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The sub-navigation component displays a horizontal list of links below the main navigation. The current page is highlighted with a bottom border.</p>
        <p class="govuk-body">On mobile devices, the navigation can be collapsed behind a toggle button to save space.</p>
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
          "Sub-navigation",
          "includes/components/sub-navigation/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}

      `
    }
  ]
};
