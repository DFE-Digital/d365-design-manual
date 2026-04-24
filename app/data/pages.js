// Centralized page registry - single source of truth for all pages
// Defines hierarchy, rendering method, and metadata for each page

const pages = {
  "home": {
    title: "Home",
    url: "/",
    description: "Principles, guidance, and standards to support people delivering joined-up, effective, user-centred outcomes for people who use Department for Education Dynamics 365 services.",
    template: "index",
    children: ["powerpages", "crm"]
  },

  // Accessibility Statement
  "accessibility-statement": {
    title: "Accessibility statement",
    url: "/accessibility-statement/",
    description: "Accessibility statement for the Dynamics 365 Design System website.",
    template: "accessibility-statement",
    parent: "home"
  },

  // Power Pages Section
  "powerpages": {
    title: "Power Pages",
    url: "/powerpages/",
    description: "Guidance for building GOV.UK-aligned Power Pages with the GOV.UK Design System, DfE Frontend and custom components.",
    template: "powerpages",
    parent: "home",
    children: ["powerpages/getting-started", "powerpages/styles", "powerpages/components", "powerpages/patterns"]
  },

  // Getting Started
  "powerpages/getting-started": {
    title: "Getting started",
    url: "/powerpages/getting-started/",
    description: "Understand how to get started with building and designing your Power Pages website.",
    template: "powerpages/getting-started",
    parent: "powerpages",
    children: ["powerpages/getting-started/branding-standards", "powerpages/getting-started/pre-requisites", "powerpages/getting-started/import-website-template"]
  },
  "powerpages/getting-started/branding-standards": {
    title: "Branding standards",
    url: "/powerpages/getting-started/branding-standards/",
    description: "Learn about the branding standards for Power Pages websites.",
    template: "powerpages/getting-started/branding-standards",
    parent: "powerpages/getting-started"
  },
  "powerpages/getting-started/pre-requisites": {
    title: "Pre-requisites",
    url: "/powerpages/getting-started/pre-requisites/",
    description: "Complete the pre-requisite steps before starting with Power Pages.",
    template: "powerpages/getting-started/pre-requisites",
    parent: "powerpages/getting-started"
  },
  "powerpages/getting-started/import-website-template": {
    title: "Website import tool",
    url: "/powerpages/getting-started/import-website-template/",
    description: "Import the website template to your Dynamics 365 environment.",
    template: "powerpages/getting-started/import-website-template",
    parent: "powerpages/getting-started",
    children: ["powerpages/getting-started/import-website-template/start-import", "powerpages/getting-started/import-website-template/import-success", "powerpages/getting-started/import-website-template/import-failed"]
  },
  "powerpages/getting-started/import-website-template/start-import": {
    title: "Import website",
    url: "/powerpages/getting-started/import-website-template/start-import/",
    description: "Start the website import.",
    template: "powerpages/getting-started/import-website-template/start-import",
    parent: "powerpages/getting-started/import-website-template"
  },
  "powerpages/getting-started/import-website-template/import-success": {
    title: "Import success",
    url: "/powerpages/getting-started/import-website-template/import-success/",
    description: "Your website has imported successfully.",
    template: "powerpages/getting-started/import-website-template/import-success",
    parent: "powerpages/getting-started/import-website-template"
  },
  "powerpages/getting-started/import-website-template/import-failed": {
    title: "Import failed",
    url: "/powerpages/getting-started/import-website-template/import-failed/",
    description: "Your website has failed to import.",
    template: "powerpages/getting-started/import-website-template/import-failed",
    parent: "powerpages/getting-started/import-website-template"
  },

  // Styles
  "powerpages/styles": {
    title: "Styles",
    url: "/powerpages/styles/",
    description: "Understand the design standards and elements that create consistent, accessible Power Pages websites for sector users.",
    template: "powerpages/styles",
    parent: "powerpages",
    children: ["powerpages/styles/layout"]
  },
  "powerpages/styles/layout": {
    title: "Layout",
    url: "/powerpages/styles/layout/",
    description: "Learn how to arrange content on your Power Pages website for effective, user-friendly layouts.",
    template: "powerpages/styles/layout",
    parent: "powerpages/styles"
  },

  // Components - uses data-driven rendering
  "powerpages/components": {
    title: "Components",
    url: "/powerpages/components/",
    description: "Components are reusable parts of user interface that have been designed to specifically support your build.",
    template: "powerpages/components",
    parent: "powerpages",
    children: [
      "powerpages/components/attachment",
      "powerpages/components/card",
      "powerpages/components/checkboxes",
      "powerpages/components/chevron-card",
      "powerpages/components/contents-list",
      "powerpages/components/dashboard",
      "powerpages/components/date-input",
      "powerpages/components/email-input",
      "powerpages/components/feedback",
      "powerpages/components/filter-panel",
      "powerpages/components/loading-spinner",
      "powerpages/components/number-input",
      "powerpages/components/radios",
      "powerpages/components/search",
      "powerpages/components/select",
      "powerpages/components/sidebar",
      "powerpages/components/print-link",
      "powerpages/components/sortable-table",
      "powerpages/components/sub-navigation",
      "powerpages/components/telephone-input",
      "powerpages/components/text-input",
      "powerpages/components/textarea",
      "powerpages/components/timeline"
    ]
  },
  "powerpages/components/attachment": {
    title: "Attachment",
    url: "/powerpages/components/attachment/",
    description: "Use the attachment component to display downloadable file attachments (e.g. PDFs, Word documents) with a thumbnail, title, and metadata like file type or size.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/card": {
    title: "Card",
    url: "/powerpages/components/card/",
    description: "The card component is a versatile user interface element used to display grouped information in a visually appealing and organised way.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/checkboxes": {
    title: "Checkboxes",
    url: "/powerpages/components/checkboxes/",
    description: "Use the checkboxes component to assist users in selecting multiple options from a list or toggling a single option on or off.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/chevron-card": {
    title: "Chevron card",
    url: "/powerpages/components/chevron-card/",
    description: "Use the chevron card component to display a list of linked items with titles, descriptions and a visual chevron indicator.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/contents-list": {
    title: "Contents list",
    url: "/powerpages/components/contents-list/",
    description: "Use a contents list at the top of a page to facilitate user navigation within a small group of related pages or page sections.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/dashboard": {
    title: "Dashboard",
    url: "/powerpages/components/dashboard/",
    description: "Use the dashboard component to present a summarised view of information for groups.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/date-input": {
    title: "Date input",
    url: "/powerpages/components/date-input/",
    description: "Use the date input component when users need to input a memorable or easily retrievable date.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/email-input": {
    title: "Email input",
    url: "/powerpages/components/email-input/",
    description: "Use the email input component when allowing users to input their email address.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/feedback": {
    title: "Feedback",
    url: "/powerpages/components/feedback/",
    description: "Use the feedback component to collect user feedback about a page with a simple 'Is this page useful?' prompt.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/filter-panel": {
    title: "Filter panel",
    url: "/powerpages/components/filter-panel/",
    description: "Use the filter panel component to help users narrow down a large list of results by applying multiple filters.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/loading-spinner": {
    title: "Loading spinner",
    url: "/powerpages/components/loading-spinner/",
    description: "Use the loading spinner component to indicate that content is being loaded or an action is being processed.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/number-input": {
    title: "Number input",
    url: "/powerpages/components/number-input/",
    description: "Use the number input component when you need to let a user enter either a whole number, a decimal number or either.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/print-link": {
    title: "Print link",
    url: "/powerpages/components/print-link/",
    description: "Use the print link component to let users print the current page.",
    template: "powerpages/components/print-link",
    parent: "powerpages/components"
  },
  "powerpages/components/radios": {
    title: "Radios",
    url: "/powerpages/components/radios/",
    description: "Use the radios component when users can only select one option from a list.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/search": {
    title: "Search",
    url: "/powerpages/components/search/",
    description: "Use the search component when you need to let users search and select a record from a database table.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/select": {
    title: "Select",
    url: "/powerpages/components/select/",
    description: "The select component should only be used as a last resort in public-facing services.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/sidebar": {
    title: "Sidebar",
    url: "/powerpages/components/sidebar/",
    description: "Use the sidebar component to display related links or supplementary information alongside main content.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/sortable-table": {
    title: "Sortable table",
    url: "/powerpages/components/sortable-table/",
    description: "Use the sortable table component to let users sort columns in ascending or descending order.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/sub-navigation": {
    title: "Sub-navigation",
    url: "/powerpages/components/sub-navigation/",
    description: "Use the sub-navigation component to help users navigate between related pages or sections within a service.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/telephone-input": {
    title: "Telephone input",
    url: "/powerpages/components/telephone-input/",
    description: "Use the telephone input component when you need to let users enter a phone number.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/text-input": {
    title: "Text input",
    url: "/powerpages/components/text-input/",
    description: "Use the text input component when you need to let users enter text that's no longer than a single line.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/textarea": {
    title: "Textarea",
    url: "/powerpages/components/textarea/",
    description: "Use the textarea component when you need to let users enter an amount of text that's longer than a single line.",
    dataSource: "components",
    parent: "powerpages/components"
  },
  "powerpages/components/timeline": {
    title: "Timeline",
    url: "/powerpages/components/timeline/",
    description: "Use the timeline component to help users understand what has happened and when.",
    dataSource: "components",
    parent: "powerpages/components"
  },

  // Patterns
  "powerpages/patterns": {
    title: "Patterns",
    url: "/powerpages/patterns/",
    description: "Explore patterns that solve common design and development challenges when building Power Pages websites.",
    template: "powerpages/patterns",
    parent: "powerpages",
    children: [
      "powerpages/patterns/apply-sort-and-filters",
      "powerpages/patterns/crm-helper-framework",
      "powerpages/patterns/custom-errors",
      "powerpages/patterns/back-link",
      "powerpages/patterns/phase-banner",
      "powerpages/patterns/page-heading",
      "powerpages/patterns/caption-page-heading"
    ]
  },
  "powerpages/patterns/apply-sort-and-filters": {
    title: "Applying sort and filters",
    url: "/powerpages/patterns/apply-sort-and-filters/",
    description: "Learn how to implement server-side filtering and sorting in Power Pages using URL parameters and Liquid.",
    template: "powerpages/patterns/apply-sort-and-filters",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/crm-helper-framework": {
    title: "Validating and submitting data to CRM",
    url: "/powerpages/patterns/crm-helper-framework/",
    description: "Use the CRM Helper Framework to validate user input and submit data to CRM.",
    template: "powerpages/patterns/crm-helper-framework",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/custom-errors": {
    title: "Displaying custom errors",
    url: "/powerpages/patterns/custom-errors/",
    description: "Learn how to show helpful custom error messages to users on your Power Pages website.",
    template: "powerpages/patterns/custom-errors",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/back-link": {
    title: "Overriding breadcrumbs with a back link",
    url: "/powerpages/patterns/back-link/",
    description: "Show a back link in place of breadcrumbs to simplify navigation in specific Power Pages journeys.",
    template: "powerpages/patterns/back-link",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/phase-banner": {
    title: "Overriding the phase banner",
    url: "/powerpages/patterns/phase-banner/",
    description: "Find out how to replace or customise the phase banner to reflect your service's stage.",
    template: "powerpages/patterns/phase-banner",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/page-heading": {
    title: "Setting the page heading",
    url: "/powerpages/patterns/page-heading/",
    description: "Understand how to apply consistent, accessible page headings across Power Pages screens.",
    template: "powerpages/patterns/page-heading",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/caption-page-heading": {
    title: "Using captions in page headings",
    url: "/powerpages/patterns/caption-page-heading/",
    description: "Enhance page context by adding captions above headings on Power Pages pages.",
    template: "powerpages/patterns/caption-page-heading",
    parent: "powerpages/patterns"
  },

  
  // CRM Section
  "crm": {
    title: "Dynamics 365 CRM",
    url: "/crm/",
    description: "Guidance for building Dynamics 365 CRM solutions that follow best practice and align with DfE’s CRM strategy",
    template: "crm",
    parent: "home",
    children: [
      "crm/configuration",
      "crm/customisation",
      "crm/architecture",
      "crm/environments",
      "crm/security",
      "crm/other"
    ]
  },

  "crm/configuration": {
    title: "Configuration",
    url: "/crm/configuration/",
    description: "Guidance on how to configure Dynamics 365 in a consistent, reusable and scalable way, covering apps, tables, columns, forms and views.",
    template: "crm/configuration",
    parent: "crm",
    children: [
      "crm/configuration/model-driven-apps",
      "crm/configuration/sitemap",
      "crm/configuration/tables",
      "crm/configuration/columns",
      "crm/configuration/forms",
      "crm/configuration/views"
    ]
  },
  "crm/configuration/model-driven-apps": {
    title: "Model Driven Apps",
    url: "/crm/configuration/model-driven-apps/",
    description: "Guidance on choosing and designing model‑driven apps, including when to reuse existing apps and when to build new ones.",
    template: "crm/configuration/model-driven-apps",
    parent: "crm/configuration"
  },
  "crm/configuration/sitemap": {
    title: "Sitemaps",
    url: "/crm/configuration/sitemap/",
    description: "How to create clear, well‑structured sitemaps, including grouping tables, organising configuration areas and using custom icons.",
    template: "crm/configuration/sitemap",
    parent: "crm/configuration"
  },
  "crm/configuration/tables": {
    title: "Tables",
    url: "/crm/configuration/tables/",
    description: "How to design and name tables in a consistent way, using out‑of‑the‑box options first and creating reusable, aligned structures where needed.",
    template: "crm/configuration/tables",
    parent: "crm/configuration"
  },
  "crm/configuration/columns": {
    title: "Columns",
    url: "/crm/configuration/columns/",
    description: "Guidance on creating and managing columns (fields), including naming, columns descriptions, selecting columns types and choosing between choice and lookup columns.",
    template: "crm/configuration/columns",
    parent: "crm/configuration"
  },
  "crm/configuration/forms": {
    title: "Forms",
    url: "/crm/configuration/forms/",
    description: "How to design user‑friendly forms, including using multiple forms per table, applying security role restrictions and structuring layouts effectively.",
    template: "crm/configuration/forms",
    parent: "crm/configuration"
  },
  "crm/configuration/views": {
    title: "Views",
    url: "/crm/configuration/views/",
    description: "Guidance on creating consistent and useful views, including when to use public or personal views, standardising columns and using Quick Find and view components.",
    template: "crm/configuration/views",
    parent: "crm/configuration"
  },
  "crm/customisation": {
    title: "Customisation",
    url: "/crm/customisation/",
    description: "Guidance on when and how to use low‑code and pro‑code customisations in Dynamics 365, focusing on using the right tools for the job.",
    template: "crm/customisation",
    parent: "crm",
        children: [
      "crm/customisation/configuration-first",
      "crm/customisation/javascriptvsbusinessrules",
      "crm/customisation/plugins",
      "crm/customisation/power-automate",
      "crm/customisation/pro-code"
    ]
  },
  "crm/customisation/configuration-first": {
    title: "Configuration, Low‑code, Pro‑code",
    url: "/crm/customisation/configuration-first/",
    description: "Implementing changes using platform configuration first, using low‑code only where needed and reserving pro‑code for scenarios the platform cannot support.",
    template: "crm/customisation/configuration-first",
    parent: "crm/customisation"
  },
  "crm/customisation/javascriptvsbusinessrules": {
    title: "JavaScript vs Business Rules",
    url: "/crm/customisation/javascriptvsbusinessrules/",
    description: "When to use Business Rules for simple client‑side logic and validation, and use JavaScript where more advanced or conditional behaviour is required.",
    template: "crm/customisation/javascriptvsbusinessrules",
    parent: "crm/customisation"
  },
  "crm/customisation/plugins": {
    title: "Plugins",
    url: "/crm/customisation/plugins/",
    description: "Plugins are for complex automation, advanced logic, or scenarios requiring synchronous or tightly controlled server‑side processing.",
    template: "crm/customisation/plugins",
    parent: "crm/customisation"
  },
  "crm/customisation/power-automate": {
    title: "Power Automate",
    url: "/crm/customisation/power-automate/",
    description: "Use Power Automate for lightweight automation or simple integration tasks that do not require synchronous execution.",
    template: "crm/customisation/power-automate",
    parent: "crm/customisation"
  },
  "crm/customisation/pro-code": {
    title: "Pro Code Coding Standards",
    url: "/crm/customisation/pro-code/",
    description: "Established coding standards and patterns to all pro‑code components to ensure maintainability, reliability and consistency across services.",
    template: "crm/customisation/pro-code",
    parent: "crm/customisation"
  },
  "crm/architecture": {
    title: "Architecture",
    url: "/crm/architecture/",
    description: "Guidance on designing Dynamics 365 solutions that follow DfE’s architecture principles, promote simplicity, consistency and re‑use.",
    template: "crm/architecture",
    parent: "crm",
    children: [
      "crm/architecture/product-suite",
      "crm/architecture/design-principles",
      "crm/architecture/patterns-components",
      "crm/architecture/integration"
    ]
  },
  "crm/architecture/product-suite": {
    title: "Dynamics 365 & Power Platform Product Suite",
    url: "/crm/architecture/product-suite/",
    description: "An overview of the Dynamics 365 and Power Platform tools, services and capabilities adopted across DfE to deliver CRM solutions.",
    template: "crm/architecture/product-suite",
    parent: "crm/architecture"
  },
  "crm/architecture/design-principles": {
    title: "Design Principles",
    url: "/crm/architecture/design-principles/",
    description: "Guiding principles that ensure solutions align with DfE’s CRM strategy, make use of out‑of‑the‑box capabilities where possible, and promote consistency and re‑use.",
    template: "crm/architecture/design-principles",
    parent: "crm/architecture"
  },
  "crm/architecture/patterns-components": {
    title: "Patterns and Components",
    url: "/crm/architecture/patterns-components/",
    description: "Reusable architectural patterns and shared components that support standardisation and repeatable delivery across multiple services.",
    template: "crm/architecture/patterns-components",
    parent: "crm/architecture"
  },
  "crm/architecture/integration": {
    title: "Integration Patterns",
    url: "/crm/architecture/integration/",
    description: "Recommended integration patterns for Dynamics 365, outlining how to connect Dynamics 365 with other systems in a secure, scalable and maintainable way using the Power Platform and supported Microsoft technologies.",
    template: "crm/architecture/integration",
    parent: "crm/architecture"
  },
  "crm/environments": {
    title: "Environments",
    url: "/crm/environments/",
    description: "Guidance on how to set up, structure and manage Dynamics 365 environments, including solution design and deployment pipelines.",
    template: "crm/environments",
    parent: "crm",
    children: [
      "crm/environments/environment-setup",
      "crm/environments/solutions",
      "crm/environments/deployment-pipelines"
    ]
  },
  "crm/environments/environment-setup": {
    title: "Environment Setup",
    url: "/crm/environments/environment-setup/",
    description: "Outlines the environment model, maintaining consistency across environments, and provides guidance on the end‑to‑end setup process.",
    template: "crm/environments/environment-setup",
    parent: "crm/environments"
  },
  "crm/environments/solutions": {
    title: "Solutions",
    url: "/crm/environments/solutions/",
    description: "How Dynamics 365 solutions are structured, organised and managed to ensure consistent, maintainable development aligned with deployment pipeline standards.",
    template: "crm/environments/solutions",
    parent: "crm/environments"
  },
  "crm/environments/deployment-pipelines": {
    title: "Azure DevOps Pipelines",
    url: "/crm/environments/deployment-pipelines/",
    description: "Describes how Azure DevOps pipelines should be configured to deploy Dynamics 365 and Power Pages solutions across all environments.",
    template: "crm/environments/deployment-pipelines",
    parent: "crm/environments"
  },
  "crm/security": {
    title: "Security",
    url: "/crm/security/",
    description: "Guidance on setting up a secure and manageable Dynamics 365 security model, covering business units, roles, teams and auditing.",
    template: "crm/security",
    parent: "crm",
        children: [
      "crm/security/business-units-security-roles",
      "crm/security/business-units",
      "crm/security/security-roles",
      "crm/security/teams",
      "crm/security/auditing"
    ]
  },
  "crm/security/business-units-security-roles": {
    title: "How Business Units work with Security Roles",
    url: "/crm/security/business-units-security-roles/",
    description: "Explains how Business Units and Security Roles work together to control what users can see and do.",
    template: "crm/security/business-units-security-roles",
    parent: "crm/security"
  },
  "crm/security/business-units": {
    title: "Business Units",
    url: "/crm/security/business-units/",
    description: "Explains how business units structure data access and ownership across the organisation.",
    template: "crm/security/business-units",
    parent: "crm/security"
  },
  "crm/security/security-roles": {
    title: "Security Roles",
    url: "/crm/security/security-roles/",
    description: "Describes how security roles control permissions and define what users can view and do within the system.",
    template: "crm/security/security-roles",
    parent: "crm/security"
  },
  "crm/security/teams": {
    title: "Teams",
    url: "/crm/security/teams/",
    description: "Outlines how teams are used to manage shared access, collaboration and ownership of records.",
    template: "crm/security/teams",
    parent: "crm/security"
  },
  "crm/security/auditing": {
    title: "Auditing",
    url: "/crm/security/auditing/",
    description: "Provides an overview of how auditing tracks changes to data, configuration and user activity for governance and compliance.",
    template: "crm/security/auditing",
    parent: "crm/security"
  },
  "crm/other": {
    title: "Other",
    url: "/crm/other/",
    description: "Additional guidance and supporting information that sits outside the main architecture, security, configuration and customisation topics.",
    template: "crm/other",
    parent: "crm",
    parent: "crm",
        children: [
      "crm/other/licensing",
      "crm/other/tooling"
    ]
  },
  "crm/other/licensing": {
    title: "Licensing",
    url: "/crm/other/licensing/",
    description: "Summary of the licensing model used for Dynamics 365, explaining the licence types, how they apply to different user roles and how they support DfE’s CRM services.",
    template: "crm/other/licensing",
    parent: "crm/other"
  },
  "crm/other/tooling": {
    title: "Standard Developer Tooling",
    url: "/crm/other/tooling/",
    description: "Overview of the standard tools and extensions used by developers working with Dynamics 365, ensuring consistent setup, predictable workflows and alignment with DfE development practices.",
    template: "crm/other/tooling",
    parent: "crm/other"
  }

};

export default pages;

// Helper functions
export function getPage(key) {
  return pages[key] || null;
}

export function getPageByUrl(url) {
  // Normalize URL (remove trailing slash for comparison except for root)
  const normalizedUrl = url === '/' ? '/' : url.replace(/\/$/, '');
  return Object.values(pages).find(p => {
    const pageUrl = p.url === '/' ? '/' : p.url.replace(/\/$/, '');
    return pageUrl === normalizedUrl;
  });
}

export function getChildren(parentKey) {
  const parent = pages[parentKey];
  if (!parent || !parent.children) return [];
  return parent.children.map(key => ({ key, ...pages[key] }));
}

export function getBreadcrumbs(pageKey) {
  const breadcrumbs = [];
  let current = pages[pageKey];

  while (current) {
    breadcrumbs.unshift({ key: pageKey, ...current });
    if (current.parent) {
      pageKey = current.parent;
      current = pages[current.parent];
    } else {
      current = null;
    }
  }

  return breadcrumbs;
}

export function getAllPages() {
  return pages;
}
