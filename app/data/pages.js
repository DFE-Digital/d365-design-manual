// Centralized page registry - single source of truth for all pages
// Defines hierarchy, rendering method, and metadata for each page

const pages = {
  "home": {
    title: "Home",
    url: "/",
    description: "Principles, guidance, and standards to support people delivering joined-up, effective, user-centred outcomes for people who use Department for Education Dynamics 365 and Power Pages services.",
    template: "index",
    children: ["powerpages", "crm"]
  },

  // Accessibility Statement
  "accessibility-statement": {
    title: "Accessibility statement",
    url: "/accessibility-statement/",
    description: "Accessibility statement for the Dynamics 365 and Power Pages manual website.",
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
    children: ["powerpages/getting-started", "powerpages/page-templates", "powerpages/components", "powerpages/patterns", "powerpages/developer-guides"]
  },

  // Getting Started
  "powerpages/getting-started": {
    title: "Getting started",
    url: "/powerpages/getting-started/",
    description: "Understand how to get started with building and designing your Power Pages website.",
    template: "powerpages/getting-started",
    parent: "powerpages",
    children: ["powerpages/getting-started/branding-standards", "powerpages/getting-started/pre-requisites", "powerpages/getting-started/base-portal", "powerpages/getting-started/framework-versions"]
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
  "powerpages/getting-started/base-portal": {
    title: "Get the base portal",
    url: "/powerpages/getting-started/base-portal/",
    description: "How to get a copy of the DfE base portal to start your Power Pages site.",
    template: "powerpages/getting-started/base-portal",
    parent: "powerpages/getting-started"
  },
  "powerpages/getting-started/framework-versions": {
    title: "Framework versions",
    url: "/powerpages/getting-started/framework-versions/",
    description: "Find out which version of the DfE Power Pages framework your site uses, what changed in each version and how to move to a new one.",
    template: "powerpages/getting-started/framework-versions",
    parent: "powerpages/getting-started"
  },

  // Page templates
  "powerpages/page-templates": {
    title: "Page templates",
    url: "/powerpages/page-templates/",
    description: "Use the DfE layout templates to give every page a consistent structure, and change the parts each page needs, such as the heading, phase banner and breadcrumbs.",
    template: "powerpages/page-templates",
    parent: "powerpages",
    children: [
      "powerpages/page-templates/layouts",
      "powerpages/page-templates/page-headings",
      "powerpages/page-templates/phase-banner",
      "powerpages/page-templates/breadcrumbs-and-back-links"
    ]
  },
  "powerpages/page-templates/layouts": {
    title: "Layouts",
    url: "/powerpages/page-templates/layouts/",
    description: "Choose between the one and two column layouts, and extend them in your web templates.",
    template: "powerpages/page-templates/layouts",
    parent: "powerpages/page-templates"
  },
  "powerpages/page-templates/page-headings": {
    title: "Page headings",
    url: "/powerpages/page-templates/page-headings/",
    description: "Set accessible page headings on single and multiple question pages, with or without a caption.",
    template: "powerpages/page-templates/page-headings",
    parent: "powerpages/page-templates"
  },
  "powerpages/page-templates/phase-banner": {
    title: "Phase banner",
    url: "/powerpages/page-templates/phase-banner/",
    description: "Switch the phase banner between alpha and beta, change its content or remove it when your service is live.",
    template: "powerpages/page-templates/phase-banner",
    parent: "powerpages/page-templates"
  },
  "powerpages/page-templates/breadcrumbs-and-back-links": {
    title: "Breadcrumbs and back links",
    url: "/powerpages/page-templates/breadcrumbs-and-back-links/",
    description: "Use the default breadcrumbs, or replace them with a back link in end-to-end journeys.",
    template: "powerpages/page-templates/breadcrumbs-and-back-links",
    parent: "powerpages/page-templates"
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
      "powerpages/components/file-upload",
      "powerpages/components/filter-panel",
      "powerpages/components/loading-spinner",
      "powerpages/components/number-input",
      "powerpages/components/print-link",
      "powerpages/components/radios",
      "powerpages/components/search",
      "powerpages/components/select",
      "powerpages/components/sidebar",
      "powerpages/components/sortable-table",
      "powerpages/components/sub-navigation",
      "powerpages/components/telephone-input",
      "powerpages/components/textarea",
      "powerpages/components/text-input",
      "powerpages/components/timeline"
    ]
  },
  "powerpages/components/attachment": {
    title: "Attachment",
    url: "/powerpages/components/attachment/",
    description: "Use the attachment component to display downloadable file attachments (e.g. PDFs, Word documents) with a thumbnail, title, and metadata like file type or size.",
    parent: "powerpages/components"
  },
  "powerpages/components/card": {
    title: "Card",
    url: "/powerpages/components/card/",
    description: "The card component is a versatile user interface element used to display grouped information in a visually appealing and organised way.",
    parent: "powerpages/components"
  },
  "powerpages/components/checkboxes": {
    title: "Checkboxes",
    url: "/powerpages/components/checkboxes/",
    description: "Use the checkboxes component to assist users in selecting multiple options from a list or toggling a single option on or off.",
    parent: "powerpages/components"
  },
  "powerpages/components/chevron-card": {
    title: "Chevron card",
    url: "/powerpages/components/chevron-card/",
    description: "Use the chevron card component to display a list of linked items with titles, descriptions and a visual chevron indicator.",
    parent: "powerpages/components"
  },
  "powerpages/components/contents-list": {
    title: "Contents list",
    url: "/powerpages/components/contents-list/",
    description: "Use a contents list at the top of a page to facilitate user navigation within a small group of related pages or page sections.",
    parent: "powerpages/components"
  },
  "powerpages/components/dashboard": {
    title: "Dashboard",
    url: "/powerpages/components/dashboard/",
    description: "Use the dashboard component to present a summarised view of information for groups.",
    parent: "powerpages/components"
  },
  "powerpages/components/date-input": {
    title: "Date input",
    url: "/powerpages/components/date-input/",
    description: "Use the date input component when users need to input a memorable or easily retrievable date.",
    parent: "powerpages/components"
  },
  "powerpages/components/email-input": {
    title: "Email input",
    url: "/powerpages/components/email-input/",
    description: "Use the email input component when allowing users to input their email address.",
    parent: "powerpages/components"
  },
  "powerpages/components/feedback": {
    title: "Feedback",
    url: "/powerpages/components/feedback/",
    description: "Use the feedback component to collect user feedback about a page with a simple 'Is this page useful?' prompt.",
    parent: "powerpages/components"
  },
  "powerpages/components/file-upload": {
    title: "File upload",
    url: "/powerpages/components/file-upload/",
    description: "Use the file upload component to help users select and upload a file, and validate and virus scan it with the CRM helper framework.",
    parent: "powerpages/components"
  },
  "powerpages/components/filter-panel": {
    title: "Filter panel",
    url: "/powerpages/components/filter-panel/",
    description: "Use the filter panel component to help users narrow down a large list of results by applying multiple filters.",
    parent: "powerpages/components"
  },
  "powerpages/components/loading-spinner": {
    title: "Loading spinner",
    url: "/powerpages/components/loading-spinner/",
    description: "Use the loading spinner component to indicate that content is being loaded or an action is being processed.",
    parent: "powerpages/components"
  },
  "powerpages/components/number-input": {
    title: "Number input",
    url: "/powerpages/components/number-input/",
    description: "Use the number input component when you need to let a user enter either a whole number, a decimal number or either.",
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
    parent: "powerpages/components"
  },
  "powerpages/components/search": {
    title: "Search",
    url: "/powerpages/components/search/",
    description: "Use the search component when you need to let users search and select a record from a database table.",
    parent: "powerpages/components"
  },
  "powerpages/components/select": {
    title: "Select",
    url: "/powerpages/components/select/",
    description: "The select component should only be used as a last resort in public-facing services.",
    parent: "powerpages/components"
  },
  "powerpages/components/sidebar": {
    title: "Sidebar",
    url: "/powerpages/components/sidebar/",
    description: "Use the sidebar component to display related links or supplementary information alongside main content.",
    parent: "powerpages/components"
  },
  "powerpages/components/sortable-table": {
    title: "Sortable table",
    url: "/powerpages/components/sortable-table/",
    description: "Use the sortable table component to let users sort columns in ascending or descending order.",
    parent: "powerpages/components"
  },
  "powerpages/components/sub-navigation": {
    title: "Sub-navigation",
    url: "/powerpages/components/sub-navigation/",
    description: "Use the sub-navigation component to help users navigate between related pages or sections within a service.",
    parent: "powerpages/components"
  },
  "powerpages/components/telephone-input": {
    title: "Telephone input",
    url: "/powerpages/components/telephone-input/",
    description: "Use the telephone input component when you need to let users enter a phone number.",
    parent: "powerpages/components"
  },
  "powerpages/components/text-input": {
    title: "Text input",
    url: "/powerpages/components/text-input/",
    description: "Use the text input component when you need to let users enter text that's no longer than a single line.",
    parent: "powerpages/components"
  },
  "powerpages/components/textarea": {
    title: "Textarea",
    url: "/powerpages/components/textarea/",
    description: "Use the textarea component when you need to let users enter an amount of text that's longer than a single line.",
    parent: "powerpages/components"
  },
  "powerpages/components/timeline": {
    title: "Timeline",
    url: "/powerpages/components/timeline/",
    description: "Use the timeline component to help users understand what has happened and when.",
    parent: "powerpages/components"
  },

  // Patterns
  "powerpages/patterns": {
    title: "Patterns",
    url: "/powerpages/patterns/",
    description: "Best-practice ways to help users complete common tasks in Power Pages services, and how to build them.",
    template: "powerpages/patterns",
    parent: "powerpages",
    children: [
      "powerpages/patterns/custom-errors",
      "powerpages/patterns/apply-sort-and-filters"
    ]
  },
  "powerpages/patterns/custom-errors": {
    title: "Error messages",
    url: "/powerpages/patterns/custom-errors/",
    description: "Tell users what went wrong and how to fix it, including errors shown in a custom location and errors that don't come from validation.",
    template: "powerpages/patterns/custom-errors",
    parent: "powerpages/patterns"
  },
  "powerpages/patterns/apply-sort-and-filters": {
    title: "Sorting and filtering lists",
    url: "/powerpages/patterns/apply-sort-and-filters/",
    description: "Help users find records in a long list by letting them filter and sort it, using URL parameters and Liquid on the server.",
    template: "powerpages/patterns/apply-sort-and-filters",
    parent: "powerpages/patterns"
  },

  // Developer guides
  "powerpages/developer-guides": {
    title: "Developer guides",
    url: "/powerpages/developer-guides/",
    description: "Use the CRM helper framework and server logic to validate data, save it to CRM and do work that has to run on the server.",
    template: "powerpages/developer-guides",
    parent: "powerpages",
    children: [
      "powerpages/developer-guides/crm-helper-framework",
      "powerpages/developer-guides/server-logic",
      "powerpages/developer-guides/scan-uploaded-files"
    ]
  },
  "powerpages/developer-guides/crm-helper-framework": {
    title: "CRM helper framework",
    url: "/powerpages/developer-guides/crm-helper-framework/",
    description: "Use the CRM helper framework to validate user input and submit data to CRM.",
    template: "powerpages/developer-guides/crm-helper-framework",
    parent: "powerpages/developer-guides"
  },
  "powerpages/developer-guides/scan-uploaded-files": {
    title: "Scanning uploaded files for viruses",
    url: "/powerpages/developer-guides/scan-uploaded-files/",
    description: "Scan files for viruses before they're saved to CRM, using the CRM helper framework and the VirusScan server logic.",
    template: "powerpages/developer-guides/scan-uploaded-files",
    parent: "powerpages/developer-guides"
  },
  "powerpages/developer-guides/server-logic": {
    title: "Server logic",
    url: "/powerpages/developer-guides/server-logic/",
    description: "Run JavaScript on the server in Power Pages to work with Dataverse and call other services without exposing secrets in the browser.",
    template: "powerpages/developer-guides/server-logic",
    parent: "powerpages/developer-guides",
    children: [
      "powerpages/developer-guides/server-logic/setting-up",
      "powerpages/developer-guides/server-logic/behaviour-and-limitations"
    ]
  },
  "powerpages/developer-guides/server-logic/setting-up": {
    title: "Setting up server logic",
    url: "/powerpages/developer-guides/server-logic/setting-up/",
    description: "Enable server logic on your site, create a server logic record, write the script and call it from your pages.",
    template: "powerpages/developer-guides/server-logic/setting-up",
    parent: "powerpages/developer-guides/server-logic"
  },
  "powerpages/developer-guides/server-logic/behaviour-and-limitations": {
    title: "Behaviour and limitations",
    url: "/powerpages/developer-guides/server-logic/behaviour-and-limitations/",
    description: "Known quirks, size and memory limits, and how to debug server logic that fails with a generic error.",
    template: "powerpages/developer-guides/server-logic/behaviour-and-limitations",
    parent: "powerpages/developer-guides/server-logic"
  },

  
  // CRM Section
  "crm": {
    title: "Dynamics 365 CRM",
    url: "/crm/",
    description: "Guidance for building Dynamics 365 CRM solutions that follow best practice and align with DfE’s CRM strategy",
    template: "crm",
    parent: "home",
    children: [
      "crm/architecture",
      "crm/configuration",
      "crm/customisation",
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
    title: "Model-driven apps",
    url: "/crm/configuration/model-driven-apps/",
    description: "When to use Microsoft's Dynamics 365 apps, when to build a custom app, and how to avoid duplicate apps.",
    template: "crm/configuration/model-driven-apps",
    parent: "crm/configuration"
  },
  "crm/configuration/sitemap": {
    title: "Sitemaps",
    url: "/crm/configuration/sitemap/",
    description: "How to group tables, keep configuration tables apart, name items and choose icons.",
    template: "crm/configuration/sitemap",
    parent: "crm/configuration"
  },
  "crm/configuration/tables": {
    title: "Tables",
    url: "/crm/configuration/tables/",
    description: "Use Microsoft's tables first, design tables for reuse, and follow the naming and publisher prefix rules.",
    template: "crm/configuration/tables",
    parent: "crm/configuration"
  },
  "crm/configuration/columns": {
    title: "Columns",
    url: "/crm/configuration/columns/",
    description: "Naming, descriptions, yes or no questions, choices or lookups, and relationships.",
    template: "crm/configuration/columns",
    parent: "crm/configuration"
  },
  "crm/configuration/forms": {
    title: "Forms",
    url: "/crm/configuration/forms/",
    description: "Forms for different roles, layout, related records, naming and form logic.",
    template: "crm/configuration/forms",
    parent: "crm/configuration"
  },
  "crm/configuration/views": {
    title: "Views",
    url: "/crm/configuration/views/",
    description: "Public and personal views, columns, sorting, Quick Find and naming.",
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
      "crm/customisation/javascript-vs-businessrules",
      "crm/customisation/power-automate",
      "crm/customisation/plugins",
      "crm/customisation/pro-code"
    ]
  },
  "crm/customisation/configuration-first": {
    title: "Configuration, low‑code and pro‑code",
    url: "/crm/customisation/configuration-first/",
    description: "Use configuration first, then low-code, and pro-code only when nothing else meets the need.",
    template: "crm/customisation/configuration-first",
    parent: "crm/customisation"
  },
  "crm/customisation/javascript-vs-businessrules": {
    title: "JavaScript or business rules",
    url: "/crm/customisation/javascript-vs-businessrules/",
    description: "Use business rules first for form logic, and JavaScript when business rules are not enough.",
    template: "crm/customisation/javascript-vs-businessrules",
    parent: "crm/customisation"
  },
  "crm/customisation/plugins": {
    title: "Plugins",
    url: "/crm/customisation/plugins/",
    description: "When to use a plugin, and the standards for building and deploying one.",
    template: "crm/customisation/plugins",
    parent: "crm/customisation"
  },
  "crm/customisation/power-automate": {
    title: "Power Automate",
    url: "/crm/customisation/power-automate/",
    description: "When to use Power Automate, and how to build, connect and deploy flows.",
    template: "crm/customisation/power-automate",
    parent: "crm/customisation"
  },
  "crm/customisation/pro-code": {
    title: "Pro-code coding standards",
    url: "/crm/customisation/pro-code/",
    description: "Coding standards for plugins, scripts and other pro-code components.",
    template: "crm/customisation/pro-code",
    parent: "crm/customisation",
    // Not written yet, so it is not listed in navigation
    hideFromNav: true
  },
  "crm/architecture": {
    title: "Architecture",
    url: "/crm/architecture/",
    description: "Guidance on designing Dynamics 365 solutions that follow DfE’s architecture principles, promote simplicity, consistency and re‑use.",
    template: "crm/architecture",
    parent: "crm",
    children: [
      "crm/architecture/strategy",
      "crm/architecture/product-suite",
      "crm/architecture/design-principles",
      "crm/architecture/integration",
      "crm/architecture/patterns-components",
      "crm/architecture/document-management",
      "crm/architecture/email-integration",
      "crm/architecture/reporting"
    ]
  },
  "crm/architecture/strategy": {
    title: "CRM strategy",
    url: "/crm/architecture/strategy/",
    description: "How DfE uses, governs and consolidates its CRM platforms.",
    template: "crm/architecture/strategy",
    parent: "crm/architecture"
  },
  "crm/architecture/product-suite": {
    title: "Dynamics 365 and Power Platform product suite",
    url: "/crm/architecture/product-suite/",
    description: "The Dynamics 365 and Power Platform products DfE uses, and what each is used for.",
    template: "crm/architecture/product-suite",
    parent: "crm/architecture"
  },
  "crm/architecture/design-principles": {
    title: "Design principles",
    url: "/crm/architecture/design-principles/",
    description: "The principles every DfE Dynamics 365 solution must follow.",
    template: "crm/architecture/design-principles",
    parent: "crm/architecture"
  },
  "crm/architecture/patterns-components": {
    title: "Patterns and components",
    url: "/crm/architecture/patterns-components/",
    description: "The shared components to use before building your own: the DfE Core solution and GIAS data.",
    template: "crm/architecture/patterns-components",
    parent: "crm/architecture"
  },
  "crm/architecture/integration": {
    title: "Integration patterns",
    url: "/crm/architecture/integration/",
    description: "How to choose an integration pattern and technology, and the standards every integration follows.",
    template: "crm/architecture/integration",
    parent: "crm/architecture"
  },
  "crm/architecture/document-management": {
    title: "SharePoint document storage",
    url: "/crm/architecture/document-management/",
    description: "Store documents in SharePoint Online through the standard integration, and how to secure them.",
    template: "crm/architecture/document-management",
    parent: "crm/architecture"
  },
  "crm/architecture/email-integration": {
    title: "Email integration",
    url: "/crm/architecture/email-integration/",
    description: "Use server-side synchronisation with Exchange Online for all Dynamics 365 email.",
    template: "crm/architecture/email-integration",
    parent: "crm/architecture"
  },
  "crm/architecture/reporting": {
    title: "Reporting and analytics",
    url: "/crm/architecture/reporting/",
    description: "Which reporting tool to use, from Dynamics 365 views and dashboards to Power BI and Azure Synapse Link for large data sets.",
    template: "crm/architecture/reporting",
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
    title: "Environment setup",
    url: "/crm/environments/environment-setup/",
    description: "The four standard environments, the rules for each, and how to request a new one.",
    template: "crm/environments/environment-setup",
    parent: "crm/environments"
  },
  "crm/environments/solutions": {
    title: "Solutions",
    url: "/crm/environments/solutions/",
    description: "The standard solution model, solution names and what goes in each solution.",
    template: "crm/environments/solutions",
    parent: "crm/environments"
  },
  "crm/environments/deployment-pipelines": {
    title: "Azure DevOps pipelines",
    url: "/crm/environments/deployment-pipelines/",
    description: "Deploy everything through the standard Azure DevOps pipelines.",
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
    title: "How business units work with security roles",
    url: "/crm/security/business-units-security-roles/",
    description: "How business units, security roles and teams combine, with examples from DfE CRMs.",
    template: "crm/security/business-units-security-roles",
    parent: "crm/security"
  },
  "crm/security/business-units": {
    title: "Business units",
    url: "/crm/security/business-units/",
    description: "Keep business units simple, and only create one when data needs to be kept apart.",
    template: "crm/security/business-units",
    parent: "crm/security"
  },
  "crm/security/security-roles": {
    title: "Security roles",
    url: "/crm/security/security-roles/",
    description: "Base security roles on what people need to do, and give each the least privilege it needs.",
    template: "crm/security/security-roles",
    parent: "crm/security"
  },
  "crm/security/teams": {
    title: "Teams",
    url: "/crm/security/teams/",
    description: "Which type of team to use, and how to use teams for shared access.",
    template: "crm/security/teams",
    parent: "crm/security"
  },
  "crm/security/auditing": {
    title: "Auditing",
    url: "/crm/security/auditing/",
    description: "Which tables and columns to audit, and how to record who viewed sensitive data.",
    template: "crm/security/auditing",
    parent: "crm/security"
  },
  "crm/other": {
    title: "Other",
    url: "/crm/other/",
    description: "Licensing and the standard developer tools.",
    template: "crm/other",
    parent: "crm",
    children: [
      "crm/other/licensing",
      "crm/other/tooling"
    ]
  },
  "crm/other/licensing": {
    title: "Licensing",
    url: "/crm/other/licensing/",
    description: "Which Dynamics 365 or Power Apps licence users need.",
    template: "crm/other/licensing",
    parent: "crm/other"
  },
  "crm/other/tooling": {
    title: "Standard developer tooling",
    url: "/crm/other/tooling/",
    description: "The standard tools for building and deploying Dynamics 365 solutions.",
    template: "crm/other/tooling",
    parent: "crm/other"
  }

};

export default pages;

// Old URLs of pages that have moved, so existing links and bookmarks still work
// Sub-paths are kept, so /powerpages/server-logic/setting-up/ goes to its new location too
export const redirects = {
  "/powerpages/getting-started/import-website-template/": "/powerpages/getting-started/base-portal/",
  "/powerpages/styles/layout/": "/powerpages/page-templates/layouts/",
  "/powerpages/styles/": "/powerpages/page-templates/",
  "/powerpages/patterns/page-heading/": "/powerpages/page-templates/page-headings/",
  "/powerpages/patterns/caption-page-heading/": "/powerpages/page-templates/page-headings/#captions",
  "/powerpages/patterns/phase-banner/": "/powerpages/page-templates/phase-banner/",
  "/powerpages/patterns/back-link/": "/powerpages/page-templates/breadcrumbs-and-back-links/",
  "/powerpages/patterns/crm-helper-framework/": "/powerpages/developer-guides/crm-helper-framework/",
  "/powerpages/patterns/scan-uploaded-files/": "/powerpages/developer-guides/scan-uploaded-files/",
  "/powerpages/server-logic/": "/powerpages/developer-guides/server-logic/"
};

// Old URLs whose sub-pages were removed rather than moved
const dropSubPaths = new Set(["/powerpages/getting-started/import-website-template/"]);

// Longest first, so a moved page wins over the section it was in
const redirectSources = Object.keys(redirects).sort((a, b) => b.length - a.length);

export function getRedirect(url) {
  const path = url.endsWith('/') ? url : `${url}/`;
  const from = redirectSources.find(oldUrl => path.startsWith(oldUrl));
  if (!from) return null;

  const to = redirects[from];
  const rest = path.slice(from.length);
  // A target with a fragment points at a section, so there's nowhere to put a sub-path
  return rest && !to.includes('#') && !dropSubPaths.has(from) ? `${to}${rest}` : to;
}

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
  return parent.children.filter(key => !pages[key].hideFromNav).map(key => ({ key, ...pages[key] }));
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

// Previous and next pages within the same section, in side navigation order
export function getPagination(pageKey) {
  const page = pages[pageKey];
  if (!page || !page.parent) return {};

  const siblings = (pages[page.parent].children || []).filter(key => !pages[key].hideFromNav);
  const index = siblings.indexOf(pageKey);
  if (index === -1) return {};

  const toLink = key => key ? { title: pages[key].title, url: pages[key].url } : null;
  return { previous: toLink(siblings[index - 1]), next: toLink(siblings[index + 1]) };
}

// Side navigation for the product area (Power Pages or CRM) a page is in.
// Lists the product's sections, opening up the sections on the way to the current page.
export function getNavTree(pageKey) {
  const trail = pageKey ? getBreadcrumbs(pageKey).map(crumb => crumb.key) : [];
  const rootKey = trail.find(key => pages[key].parent === 'home');
  if (!rootKey) return null;

  const isListed = key => !pages[key].hideFromNav;

  const toItem = key => {
    const page = pages[key];
    const isOpen = trail.includes(key);
    return {
      title: page.title,
      url: page.url,
      current: key === pageKey,
      active: isOpen,
      children: isOpen && page.children ? page.children.filter(isListed).map(toItem) : []
    };
  };

  const root = pages[rootKey];
  return {
    title: root.title,
    items: [
      { title: 'Overview', url: root.url, current: rootKey === pageKey, active: rootKey === pageKey, children: [] },
      ...(root.children || []).filter(isListed).map(toItem)
    ]
  };
}
