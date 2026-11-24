export default {
  id: 'file-upload',
  title: 'File upload',
  description: 'Use the file upload component to help users select and upload a file, and validate and virus scan it with the CRM helper framework.',

  sections: ['whenToUse', 'whenNotToUse', 'howItWorks', 'examples', 'errorMessages', 'knownIssues'],

  whenToUse: {
    title: 'When to use this component',
    content: `
      <p class="govuk-body">Use the file upload component when users need to give you a document or other file, such as evidence for an application or a data return.</p>
      <p class="govuk-body">Only ask users to upload a file if you really need it. It's often easier for them to answer questions instead.</p>
    `
  },

  whenNotToUse: {
    title: 'When to not use this component',
    content: `
      <p class="govuk-body">Don't use the file upload component to collect information you could ask for with questions, such as a name or address. Use form components like the <a class="govuk-link" href="/powerpages/components/text-input/">text input</a> instead.</p>
    `
  },

  howItWorks: {
    title: 'How it works',
    content: `
      <p class="govuk-body">Read the <a class="govuk-link" href="https://design-system.service.gov.uk/components/file-upload/" target="_blank">GOV.UK Design System guidance on file upload (opens in a new tab)</a> for advice on labels, hint text and accessibility.</p>

      <h3 class="govuk-heading-m">Improved file upload or plain file input</h3>
      <p class="govuk-body">Use GOV.UK's improved file upload component. It's easier to use: users can drag and drop files, and it shows the name of the file they've chosen. To use it, wrap the file input in a <code>&lt;div&gt;</code> with the <code>govuk-file-upload-wrapper</code> class and <code>data-module="govuk-file-upload"</code>. The base portal's layouts already start GOV.UK Frontend, which turns it into the improved component.</p>
      <p class="govuk-body">The <a class="govuk-link" href="/powerpages/developer-guides/crm-helper-framework/">CRM helper framework</a> works with the improved component from version 03. On a site still using version 02 or earlier, use the plain file input. See <a class="govuk-link" href="/powerpages/getting-started/framework-versions/">framework versions</a>.</p>
      <p class="govuk-body">Use the <code>govuk-file-upload-wrapper</code> class, not <code>govuk-drop-zone</code>. <code>govuk-drop-zone</code> is deprecated, and will be removed in GOV.UK Frontend 7.</p>

      <h3 class="govuk-heading-m">Tell users what files they can upload</h3>
      <p class="govuk-body">Use hint text to tell users which file types they can upload and how big they can be. Match it to the limits you set in the framework.</p>

      <h3 class="govuk-heading-m">Validate and scan the file</h3>
      <p class="govuk-body">Use the file column's logical name as the input's <code>id</code> and <code>name</code>, and as the <code>identifier</code> in your validation data object. Keep the same identifier if you change from the plain input to the improved component.</p>
      <pre><code class="language-javascript">const inputs = [
  {
    identifier: "dfe_evidencefile",
    type: "file",
    friendlyName: "your evidence",
    required: true,
    allowedFileTypes: ["pdf", "docx"],
    maxFileSize: 3,
    fileLimit: 1
  }
];

const isValid = await DfEPortal.ValidateData(inputs);</code></pre>
      <ul class="govuk-list govuk-list--bullet">
        <li><code>allowedFileTypes</code>: the file extensions users can upload, in lowercase, without the dot</li>
        <li><code>maxFileSize</code>: the largest file, in megabytes</li>
        <li><code>fileLimit</code>: how many files users can select at once</li>
      </ul>
      <p class="govuk-body"><code>ValidateData</code> checks the files' type, number and size, then sends them to be scanned for viruses. Your site needs the <code>VirusScan</code> server logic for this. See <a class="govuk-link" href="/powerpages/developer-guides/scan-uploaded-files/">scanning uploaded files for viruses</a>, including the largest files that can be scanned.</p>

      <h3 class="govuk-heading-m">Save the file</h3>
      <p class="govuk-body">Save the record first, then upload the file to it:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li><code>DfEPortal.WebApi.UploadFile(identifier, entitySetName, recordId)</code> saves the file to a file or image column on the record. It does nothing if the user hasn't selected a file, so you don't need to check first.</li>
        <li><code>DfEPortal.WebApi.ProcessFileAndUploadToNotes(identifier, logicalName, recordId)</code> saves the file as a note attachment on the record instead.</li>
      </ul>
      <pre><code class="language-javascript">await DfEPortal.WebApi.Update(recordId, "dfe_applications", dataObj);
await DfEPortal.WebApi.UploadFile("dfe_evidencefile", "dfe_applications", recordId);</code></pre>
      <p class="govuk-body">Don't check for a file with <code>$("#dfe_evidencefile")[0].files</code>. With the improved component, that element is the component's button, not the input, so it has no files.</p>
    `
  },

  examples: [
    {
      id: 'single-question',
      title: 'For single question pages',
      description: `
        <p class="govuk-body">If presenting only one question on the page, set the contents of the <code>label</code> as the page heading. This means users of screen readers only hear it once.</p>
        <p class="govuk-body">You will need to include an empty <code>&#123;% title %&#125;</code> block in your web template to remove the default page header and avoid duplication.</p>
      `,
      templatePath: 'includes/components/file-upload/headerExample.njk',
      options: { showUpdateSchema: true, layout: 'default' }
    },
    {
      id: 'multiple-question',
      title: 'For multiple question pages',
      description: `<p class="govuk-body">If presenting more than one question on the page, don't set the contents of the <code>label</code> as the page heading.</p>`,
      templatePath: 'includes/components/file-upload/standardExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'plain-input',
      title: 'Plain file input',
      description: `<p class="govuk-body">Use the plain file input only if your site is on version 02 or earlier of the framework.</p>`,
      templatePath: 'includes/components/file-upload/plainExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    },
    {
      id: 'multiple-files',
      title: 'Selecting more than one file',
      description: `
        <p class="govuk-body">Add the <code>multiple</code> attribute to let users select more than one file, and set <code>fileLimit</code> to the most they can select. Every file is validated and scanned.</p>
        <p class="govuk-body">The framework's upload functions only save the first file, so you'll need your own code to save the rest. See known issues.</p>
      `,
      templatePath: 'includes/components/file-upload/multipleExample.njk',
      options: { showUpdateSchema: true, layout: 'withTitle' }
    }
  ],

  errorMessages: {
    title: 'Error messages',
    content: `
      <p class="govuk-body">An error message is displayed next to the field and in the error summary when a validation error occurs. The <a class="govuk-link" href="/powerpages/developer-guides/crm-helper-framework/">CRM helper framework</a> shows these for you. With the improved component, the error message is placed above the component, as GOV.UK does it.</p>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">When</th>
            <th scope="col" class="govuk-table__header">Error message</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">No file is selected and the question is required</td>
            <td class="govuk-table__cell">Select a file</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">The file is the wrong type</td>
            <td class="govuk-table__cell">The selected file '[file name]' must be a pdf or docx.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">The file is too big</td>
            <td class="govuk-table__cell">The selected file "[file name]" must be smaller than 3MB</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">Too many files are selected</td>
            <td class="govuk-table__cell">You can only select up to 3 files at the same time.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">The file has a virus, or couldn't be scanned</td>
            <td class="govuk-table__cell">Virus detected in file '[file name]'</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">The virus scan failed</td>
            <td class="govuk-table__cell">An error occurred. Please try again.</td>
          </tr>
        </tbody>
      </table>
      <p class="govuk-body">The required-file message is always "Select a file", whatever <code>friendlyName</code> you set.</p>
    `
  },

  knownIssues: {
    title: 'Known issues',
    content: `
      <ul class="govuk-list govuk-list--bullet">
        <li><code>UploadFile</code> and <code>ProcessFileAndUploadToNotes</code> only save the first file selected in an input.</li>
        <li><code>ProcessFileAndUploadToNotes</code> builds the table's entity set name by adding "s" to its logical name, so it doesn't work for tables whose entity set name is different, such as one ending in "y".</li>
        <li>In version 02 and earlier of the framework, the improved component doesn't work: the virus scan passes without scanning, and the file isn't saved.</li>
      </ul>
      <p class="govuk-body">To report an issue, use the <a class="govuk-link" href="https://github.com/DFE-Digital/d365-design-manual/issues" target="_blank">issues backlog in GitHub (opens in a new tab)</a>.</p>
    `
  }
};
