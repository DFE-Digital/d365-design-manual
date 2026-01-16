export default {
  id: 'sortable-table',
  title: 'Sortable table',
  description: 'Use the sortable table component to display tabular data that users can sort by column.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the sortable table component to display tabular data that users can sort by column.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">The sortable table component allows users to sort data by column. Before using this component, consider whether users actually need to sort the data.</p>
      <p class="govuk-body">If users need to filter the data, consider using a different solution, such as a <a class="govuk-link" href="/powerpages/components/search/">search component</a> or combining with <a class="govuk-link" href="/powerpages/components/radios/">radios</a>.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">The sortable table allows users to sort data by clicking on column headers.</p>
      <p class="govuk-body">If the component needs to submit to a field in CRM, replace the highlighted <code>schema-name</code> text in the example HTML with the target field schema name. <strong>Do not</strong> remove any prepended or appended text to the schema name. For example, if the id attribute is displayed as <code>schema-name-error</code> in the example, the value should still contain <code>-error</code> after the schema name has been replaced (<code>dfe_field-error</code>).</p>
      <p class="govuk-body">This step is essential for the custom portal helper framework to validate and submit data to CRM. <a class="govuk-link" href="/powerpages/patterns/crm-helper-framework/">Read about data validation and submitting data to CRM</a>.</p>
    `
  },

  examples: [
    {
      id: 'standard',
      title: 'Sortable table example',
      description: ``,
      templatePath: 'includes/components/sortable-table/example.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
