export default {
  id: 'timeline',
  title: "Timeline",
  description: "Use the timeline component to help users understand what has happened and when.",
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
        <p class="govuk-body">Use the timeline component when you need to:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>show the history of an application or case</li>
          <li>display a sequence of events in chronological order</li>
          <li>help users understand the progress of a process</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use the timeline component:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>for step-by-step guidance (use the task list pattern instead)</li>
          <li>when events don't have a clear chronological order</li>
          <li>for very long lists of events (consider pagination or filtering)</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The timeline component displays a vertical list of events with a connecting line. Each event has:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>a title describing what happened</li>
          <li>a date or time when it happened</li>
          <li>optional content with additional details</li>
        </ul>
        <p class="govuk-body">Events are typically displayed in reverse chronological order (most recent first), but you can display them in any order that makes sense for your users.</p>
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
          "Timeline",
          "includes/components/timeline/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}
      `
    }
  ]
};
