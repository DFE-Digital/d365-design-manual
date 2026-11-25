export default {
  id: 'sidebar',
  title: "Sidebar",
  description: "Use the sidebar component to display related links or supplementary information alongside main content.",
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
        <p class="govuk-body">Use a sidebar when you need to:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>display related links alongside main content</li>
          <li>show contact information or support details</li>
          <li>provide quick access to related resources or documents</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use a sidebar:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>for primary navigation (use the main navigation instead)</li>
          <li>on mobile-first designs where space is limited</li>
          <li>when the sidebar content is more important than the main content</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The sidebar component has a coloured top border to visually separate it from the main content. It can contain multiple sections, each with a heading and list of links or content.</p>
        <p class="govuk-body">Place the sidebar in a one-third column alongside a two-thirds main content area.</p>
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
          "Sidebar",
          "includes/components/sidebar/basicExample.njk",
          { showUpdateSchema: false, index: 1, layout: 'rightColumn' }
        ) }}

      `
    }
  ]
};
