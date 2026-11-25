export default {
  id: 'card',
  title: "Card",
  description: "The card component is a versatile user interface element used to display grouped information in a visually appealing and organised way.",
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
        <p class="govuk-body">Cards can make things harder to understand if overused or used incorrectly. Before using them, test your content as structured content with headers and paragraphs and grid layout.</p>
      `
    },
    {
      id: "html-examples",
      title: "HTML examples",
      subsections: [{ id: "basic-cards", title: "Basic cards" }, { id: "basic-meta", title: "Basic cards with meta information" }, { id: "cards-image", title: "Cards with image" }],
      content: `
        <p class="govuk-body">
          Select the appropriate example from this page and directly integrate the HTML into your web template.
          You can customise these examples to align with your specific requirements, as indicated below.
          Refer to the <a class="govuk-link" href="{{ pages['powerpages/page-templates/layouts'].url }}">layouts</a> section for further guidance on structuring your web template.
        </p>

        <h3 class="govuk-heading-m" id="basic-cards">Basic cards</h3>
        <p class="govuk-body">An example of a basic card component used in a group.</p>

        {{ exampleTabs(
          "Basic cards",
          "includes/components/card/basicExample.njk",
          { showUpdateSchema: false, index: 1 }
        ) }}

        <h3 class="govuk-heading-m" id="basic-meta">Basic cards with meta information</h3>
        <p class="govuk-body">An example of a basic card component used in a group which has meta data.</p>

        {{ exampleTabs(
          "Cards with meta information",
          "includes/components/card/basicMetaExample.njk",
          { showUpdateSchema: false, index: 2 }
        ) }}

        <h3 class="govuk-heading-m" id="cards-image">Cards with image</h3>
        <p class="govuk-body">An example of a card component used in a group which has meta data and an image.</p>

        {{ exampleTabs(
          "Cards with image",
          "includes/components/card/imageExample.njk",
          { showUpdateSchema: false, index: 3 }
        ) }}
      `
    }
  ]
};
