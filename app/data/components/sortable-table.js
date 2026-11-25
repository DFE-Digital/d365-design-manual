export default {
  id: 'sortable-table',
  title: "Sortable table",
  description: "Use the sortable table component to let users sort columns in ascending or descending order.",
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
        <p class="govuk-body">Use a sortable table when:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>users need to compare data across rows</li>
          <li>the order of data matters and users may want to reorder it</li>
          <li>you have multiple columns that users might want to sort by</li>
        </ul>
      `
    },
    {
      id: "when-not-to-use-this-component",
      title: "When not to use this component",
      content: `
        <p class="govuk-body">Do not use a sortable table:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>for simple data that doesn't need sorting</li>
          <li>when the table has very few rows (under 5)</li>
          <li>if the data is already in a logical order that users expect</li>
        </ul>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">The sortable table component extends the standard GOV.UK table with sorting functionality. Users can click column headers to sort the table data in ascending or descending order.</p>
        <p class="govuk-body">Each sortable column header contains a button with sort indicators. The <code>aria-sort</code> attribute indicates the current sort state:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li><code>aria-sort="none"</code> - column is sortable but not currently sorted</li>
          <li><code>aria-sort="ascending"</code> - sorted A to Z or lowest to highest</li>
          <li><code>aria-sort="descending"</code> - sorted Z to A or highest to lowest</li>
        </ul>
      `
    },
    {
      id: "html-example",
      title: "HTML example",
      content: `
        <p class="govuk-body">
          Copy the HTML from this page directly into your web template.
          Refer to the <a class="govuk-link" href="{{ pages['powerpages/page-templates/layouts'].url }}">layouts</a> section for further guidance on structuring your web template.
        </p>
        <p class="govuk-body">You will need to add JavaScript to handle the sorting functionality when users click the column headers.</p>

        {{ exampleTabs(
          "Sortable table",
          "includes/components/sortable-table/example.njk",
          { showUpdateSchema: false, index: 1, layout: 'withTitle' }
        ) }}

      `
    }
  ]
};
