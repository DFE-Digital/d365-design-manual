export default {
  id: 'attachment',
  title: 'Attachment',
  description: 'Use the attachment component to display file attachments with metadata.',

  sections: ['whenToUse', 'whenNotToUse', 'examples'],

  whenToUse: {
    title: 'When to use this component',
    content: `<p class="govuk-body">Use the attachment component to display file attachments with metadata.</p>`
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `<p class="govuk-body">Avoid using the attachment component for inline content (e.g., code snippets, images), simple links without metadata, non-file media, or in space-constrained layouts where the thumbnail and padding may cause overflow or clutter.</p>`
  },

  examples: [
    {
      id: 'basic-attachment',
      title: 'Basic attachment with thumbnail, title, and metadata',
      description: `<p class="govuk-body">This example shows a simple attachment with a PDF icon, a title, and metadata (file type and size).</p>`,
      templatePath: 'includes/components/attachment/basicExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'meta-compact',
      title: 'Attachment with multiple metadata and compact styling',
      description: `<p class="govuk-body">This example includes multiple metadata items (e.g., file type, size, and date) and uses the compact variant.</p>`,
      templatePath: 'includes/components/attachment/multipleMetaExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    },
    {
      id: 'expandable-details',
      title: 'Attachment with expandable details',
      description: `<p class="govuk-body">This example includes a <code>govuk-details</code> component for additional information (e.g., accessibility details).</p>`,
      templatePath: 'includes/components/attachment/expandableExample.njk',
      options: { showUpdateSchema: false, layout: 'withTitle' }
    }
  ]
};
