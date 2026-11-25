export default {
  id: 'attachment',
  title: "Attachment",
  description: "Use the attachment component to display downloadable file attachments (e.g. PDFs, Word documents) with a thumbnail, title, and metadata like file type or size.",
  // The page has no contents list
  contents: false,

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
        <p class="govuk-body">Avoid using the attachment component for inline content (e.g., code snippets, images), simple links without metadata, non-file media, or in space-constrained layouts where the thumbnail and padding may cause overflow or clutter.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      subsections: [{ id: "basic-attachment", title: "Basic attachment with thumbnail, title, and metadata" }, { id: "meta-compact", title: "Attachment with multiple metadata and compact styling" }, { id: "expandable-details", title: "Attachment with expandable details" }],
      content: `
        <p class="govuk-body">
          Select the appropriate example from this page and directly integrate the HTML into your web template.
          You can customise these examples to align with your specific requirements, as indicated below.
          Refer to the <a class="govuk-link" href="{{ pages['powerpages/page-templates/layouts'].url }}">layouts</a> section for further guidance on structuring your web template.
        </p>

        <h3 class="govuk-heading-m" id="basic-attachment">Basic attachment with thumbnail, title, and metadata</h3>
        <p class="govuk-body"> This example shows a simple attachment with a PDF icon, a title, and metadata (file type and size).</p>

        {{ exampleTabs(
          "Basic attachment with thumbnail, title, and metadata",
          "includes/components/attachment/basicExample.njk",
          { showUpdateSchema: false, index: 1, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="meta-compact">Attachment with multiple metadata and compact styling</h3>
        <p class="govuk-body">This example includes multiple metadata items (e.g., file type, size, and date) and uses the compact variant.</p>

        {{ exampleTabs(
          "Attachment with multiple metadata and compact styling",
          "includes/components/attachment/multipleMetaExample.njk",
          { showUpdateSchema: false, index: 2, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="expandable-details">Attachment with expandable details</h3>
        <p class="govuk-body">This example includes a <code>govuk-details</code> component for additional information (e.g., accessibility details).</p>

        {{ exampleTabs(
          "Attachment with expandable details",
          "includes/components/attachment/expandableExample.njk",
          { showUpdateSchema: false, index: 3, layout: 'withTitle' }
        ) }}
      `
    },
    {
      id: "file-type-icons",
      title: "Alternative file type icons",
      subsections: [{ id: "icon-document", title: "Document" }, { id: "icon-spreadsheet", title: "Spreadsheet" }, { id: "icon-html", title: "HTML" }, { id: "icon-generic", title: "Generic" }],
      content: `
        <p class="govuk-body">Use the appropriate thumbnail icon for the file type you are linking to. The examples above use a PDF icon. Below are alternative icons for other common file types.</p>

        <h3 class="govuk-heading-m" id="icon-document">Document</h3>
        <p class="govuk-body">Use for Word documents (.doc, .docx), OpenDocument text (.odt), and rich text formats (.rtf).</p>

        {{ exampleTabs(
          "Document file attachment",
          "includes/components/attachment/documentExample.njk",
          { showUpdateSchema: false, index: 4, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="icon-spreadsheet">Spreadsheet</h3>
        <p class="govuk-body">Use for Excel files (.xls, .xlsx), OpenDocument spreadsheets (.ods), and CSV files (.csv).</p>

        {{ exampleTabs(
          "Spreadsheet file attachment",
          "includes/components/attachment/spreadsheetExample.njk",
          { showUpdateSchema: false, index: 5, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="icon-html">HTML</h3>
        <p class="govuk-body">Use for HTML documents or web pages (.html, .htm).</p>

        {{ exampleTabs(
          "HTML file attachment",
          "includes/components/attachment/htmlExample.njk",
          { showUpdateSchema: false, index: 6, layout: 'withTitle' }
        ) }}

        <h3 class="govuk-heading-m" id="icon-generic">Generic</h3>
        <p class="govuk-body">Use for any other file type not covered above, such as compressed archives (.zip, .rar), text files (.txt), or unknown formats.</p>

        {{ exampleTabs(
          "Generic file attachment",
          "includes/components/attachment/genericExample.njk",
          { showUpdateSchema: false, index: 7, layout: 'withTitle' }
        ) }}
      `
    }
  ]
};
