export default {
  id: 'filter-panel',
  title: "Filter panel",
  description: "Use the filter panel component to help users narrow down a large list of results by applying multiple filters.",

  // The skip link sits above the contents list
  introBeforeContents: true,
  intro: `
    <p class="govuk-body"><a class="govuk-link" href="#html-example">Skip to HTML example</a></p>
  `,

  sections: [
    {
      id: "when-to-use-this-component",
      title: "When to use this component",
      content: `
        <p class="govuk-body">{{ pageData.description }}</p>
        <p class="govuk-body">Use a filter panel when you need to:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>help users narrow down a large list of results</li>
          <li>allow users to filter by multiple criteria at once</li>
          <li>provide sorting options alongside filters</li>
          <li>display the currently applied filters</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use a filter panel:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>when there are only a few items to display (fewer than 10)</li>
          <li>when filtering options are very limited (1-2 options)</li>
          <li>as a replacement for search functionality</li>
          <li>on transactional pages where it might distract from the main task</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The filter panel is typically placed in the left column of a two-column layout, alongside the main content area that displays the filtered results.</p>
        <p class="govuk-body">The component consists of:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>a collapsible header that shows or hides all filter options</li>
          <li>a selected filters section showing active filters as removable tags</li>
          <li>filter groups, each containing related filter options</li>
          <li>an actions section with apply and clear buttons</li>
        </ul>
      `
    },
    {
      id: "collapsible-sections",
      title: "Collapsible sections",
      content: `
        <p class="govuk-body">Both the main panel header and individual filter groups are collapsible. This helps users focus on relevant filters and reduces visual clutter, especially on mobile devices.</p>
        <p class="govuk-body">The collapsible behaviour uses <code>aria-expanded</code> and <code>aria-controls</code> attributes for accessibility. Screen readers will announce the expanded or collapsed state when users interact with the toggle buttons.</p>
      `
    },
    {
      id: "selected-filters",
      title: "Selected filters",
      content: `
        <p class="govuk-body">When filters are active, a "Selected filters" section appears showing all applied filters as tags. Users can:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>see at a glance which filters are currently applied</li>
          <li>remove individual filters by clicking on a tag</li>
          <li>clear all filters using the "Clear all filters" link</li>
        </ul>
        <p class="govuk-body">Each tag includes data attributes (<code>data-filter-group</code> and <code>data-filter-value</code>) that link it to the corresponding checkbox or radio button. When a tag is removed, the JavaScript automatically unchecks the related input.</p>
      `
    },
    {
      id: "filter-types",
      title: "Filter types",
      content: `
        <p class="govuk-body">The filter panel supports various input types:</p>

        <h3 class="govuk-heading-m">Checkboxes</h3>
        <p class="govuk-body">Use checkboxes when users can select multiple options within a category. This is the most common filter type.</p>

        <h3 class="govuk-heading-m">Radio buttons</h3>
        <p class="govuk-body">Use radio buttons when users can only select one option, such as sort order.</p>

        <h3 class="govuk-heading-m">Date inputs</h3>
        <p class="govuk-body">Use date inputs for filtering by date ranges, such as "from" and "to" dates.</p>

        <h3 class="govuk-heading-m">Search within filters</h3>
        <p class="govuk-body">For filter groups with many options, add a search input to help users find specific values quickly. Place the search input at the top of the filter group, and use the <code>dfe-filter-panel__checkboxes</code> class on the container to enable scrolling when there are many options.</p>

        <div class="govuk-inset-text">
          The JavaScript handles the UI interactions (expanding/collapsing, removing tags). You will need to add your own logic to handle the actual filtering of results when the "Apply filters" button is clicked.
        </div>
      `
    },
    {
      id: "html-example",
      title: "HTML example",
      content: `
        <p class="govuk-body">
          Copy the HTML from this page directly into your web template. You will need to add JavaScript to handle the filtering logic when users click the "Apply filters" button.
        </p>

        {{ exampleTabs(
          "Filter panel",
          "includes/components/filter-panel/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}

      `
    }
  ]
};
