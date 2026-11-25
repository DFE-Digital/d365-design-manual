export default {
  id: 'contents-list',
  title: "Contents list",
  description: "Use a contents list at the top of a page to facilitate user navigation within a small group of related pages or page sections.",
  // The page has no contents list
  contents: false,
  imports: ["{% from 'includes/components/_contents.njk' import contentsStandardExample, contentsWithoutDashesExample, contentsNestedListExample, contentsNestedListBoldExample %}"],

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
        <p class="govuk-body">Avoid using a contents list on pages that lack clear grouping or related content, as this may confuse users.</p>
        <p class="govuk-body">Additionally, do not incorporate a contents list in transactional services or forms. Instead, use alternative components such as buttons for navigation or back links.</p>
      `
    },
    {
      id: "how-it-works",
      title: "How it works",
      content: `
        <p class="govuk-body">Ensure that links are concise and descriptive, as overly lengthy links (exceeding two lines) hinder user scanning. Page titles or headers must accurately reflect the content of the page to provide users with clear navigation cues.</p>
      `
    },
    {
      id: "customisation-options",
      title: "Customisation options",
      content: `
        <ul class="govuk-list govuk-list--bullet">
          <li><strong>Without dashes:</strong> You can choose not to use dashes before your links by removing the <code>dfe-contents-list__list-item--dashed</code> class from the list item.</li>
          <li><strong>Bold links:</strong> You can enhance the visibility of links by adding the <code>dfe-contents-list__list-item--parent</code> class to the list item. This is particularly useful for showcasing parent-child page or page content relationships in nested contents lists.</li>
        </ul>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      content: `
        <p class="govuk-body">
          Select the appropriate example below and directly integrate the HTML into your web template.
          You can customise these examples to align with your specific requirements, as indicated earlier.
          Refer to the <a class="govuk-link" href="{{ pages['powerpages/page-templates/layouts'].url }}">layouts</a> section for further guidance on structuring your web template.
        </p>

        <h3 class="govuk-heading-m">With dashes</h3>
        {{ contentsStandardExample() }}

        <h3 class="govuk-heading-m">Without dashes</h3>
        <p class="govuk-body">Display the contents list without dashes preceding each link.</p>

        {{ contentsWithoutDashesExample() }}

        <h3 class="govuk-heading-m">Nested child links</h3>
        <p class="govuk-body">Use nested child links to illustrate structural relationships between child pages or page headers.</p>

        {{ contentsNestedListExample() }}

        <h3 class="govuk-heading-m">Nested child links with bold parent links</h3>
        <p class="govuk-body">Highlight parent links in bold to emphasise structural relationships between parent and child pages or headers.</p>

        {{ contentsNestedListBoldExample() }}
      `
    }
  ]
};
