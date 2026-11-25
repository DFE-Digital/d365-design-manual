# Dynamics 365 and Power Pages manual

Guidance and standards for Department for Education (DfE) teams building services on Dynamics 365 CRM and Power Pages.

[View the Dynamics 365 and Power Pages manual](https://d365-design-manual-8523de7fad90.herokuapp.com/)

## What the manual covers

### Power Pages

How to build accessible Power Pages websites that follow the GOV.UK Design System, using the DfE base portal:

- **Getting started**: branding standards, pre-requisites, getting the base portal and framework versions
- **Page templates**: layouts, page headings, the phase banner, and breadcrumbs and back links
- **Components**: GOV.UK components adapted for Power Pages, and DfE components
- **Patterns**: error messages, and sorting and filtering lists
- **Developer guides**: the CRM helper framework, server logic and scanning uploaded files for viruses

### Dynamics 365 CRM

The standards DfE teams follow when they design, build, deploy and secure Dynamics 365 CRM services: architecture, configuration, customisation, environments, security, licensing and tooling. The manual sets DfE standards and links to Microsoft's documentation for how each feature works.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm, which comes with Node.js

### Run it locally

1. Clone the repository:

   ```bash
   git clone https://github.com/DFE-Digital/dynamics-power-pages-manual.git
   cd dynamics-power-pages-manual
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Build the assets and start the development server:

   ```bash
   npm run dev
   ```

   The site runs at [http://localhost:3000](http://localhost:3000) and rebuilds when you change files.

### Environment variables

None are needed to run the site locally. You can set:

| Variable | What it does | Default |
|---|---|---|
| `PORT` | The port the server listens on | `3000` |

You can put it in a `.env` file in the project root.

## Development

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Build everything, then start the server with file watching and automatic restarts |
| `npm run build` | Run the full build: clean, bundle JavaScript, compile Sass and copy assets |
| `npm run serve` | Start the server without file watching |
| `npm run styles` | Compile Sass and run PostCSS |
| `npm run build-app-js` | Bundle the client-side JavaScript with esbuild |
| `npm run clean` | Remove the built assets from `public/` |

### How it works

- **Server**: Express (`index.mjs`) renders Nunjucks templates from `app/views/`.
- **Page registry**: `app/data/pages.js` lists every page with its title, URL, description, template, parent and children. The side navigation, breadcrumbs, section page lists and previous and next links are all built from it.
- **Redirects**: the `redirects` list in `app/data/pages.js` sends old URLs of moved pages to their new location. Every page has one URL, with a trailing slash, and other forms redirect to it.
- **Components**: each component's content is a data file in `app/data/components/`. Its page in `app/views/powerpages/components/` just loads the data and renders it through `_component.html`.
- **Styles**: GOV.UK Frontend 6 with the DfE header and logo. Sass in `app/scss/` compiles to `public/css/`, and PostCSS removes the `@font-face` rules.
- **JavaScript**: client-side scripts in `app/js/` are bundled with esbuild. GOV.UK Frontend and jQuery are copied in as vendor scripts.
- **Built files**: `public/` holds the built CSS, JavaScript and images, and is committed. Run `npm run build` and commit the result when you change Sass or scripts.

### Add a page

1. Add an entry to `app/data/pages.js`, and add its key to its parent's `children` in the order it should appear in the navigation.
2. Create the template named in `template`, under `app/views/`. Extend `layouts/_wide-right-left-navigation.html` and start with an `h1` of `{{ pageData.title }}`.
3. Add `{% include "includes/components/_pagination.njk" %}` at the end for previous and next links.
4. If the page replaces an old one, add the old URL to `redirects`.

Use the GOV.UK heading scale: `h1` `govuk-heading-xl`, `h2` `govuk-heading-l`, `h3` `govuk-heading-m` and `h4` `govuk-heading-s`.

### Add or change a component

1. Create or edit its data file in `app/data/components/`. A component has an `intro` and a list of `sections`, each with an `id`, a `title` and `content`. The content is Nunjucks, so you can use `{{ pages['…'].url }}` links and `exampleTabs(...)` for code examples.
2. Put the example markup in `app/views/includes/components/<component>/`.
3. For a new component, register it in `app/data/components/index.js`, add a page to `app/data/pages.js`, and create a page template that loads it:

   ```njk
   {% set pageData = pages['powerpages/components/<component>'] %}
   {% set component = components['<component>'] %}

   {% extends "powerpages/components/_component.html" %}
   ```

### Branches

Create a branch from `dev`, raise a pull request into `dev`, then release by raising a pull request from `dev` into `main`.

### Project structure

```
dynamics-power-pages-manual/
├── index.mjs                  # Express server, routing and redirects
├── app/
│   ├── config.js              # App configuration
│   ├── data/
│   │   ├── pages.js           # Page registry, navigation and redirects
│   │   └── components/        # Component content
│   ├── images/                # Images copied into public/
│   ├── js/                    # Client-side JavaScript
│   ├── scss/                  # Sass
│   └── views/                 # Nunjucks templates
│       ├── includes/          # Header, footer, navigation and component examples
│       ├── layouts/           # Page layouts
│       ├── crm/               # Dynamics 365 CRM pages
│       └── powerpages/        # Power Pages pages
├── public/                    # Built CSS, JavaScript and images
├── Procfile                   # Heroku process
└── package.json
```

## Deployment

The site is hosted on Heroku. The `Procfile` starts `node ./index.mjs`.

## Tech stack

- [Express](https://expressjs.com/): web server
- [Nunjucks](https://mozilla.github.io/nunjucks/): templating
- [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) 6: design system
- [Sass](https://sass-lang.com/): styles
- [esbuild](https://esbuild.github.io/): JavaScript bundling
- [Highlight.js](https://highlightjs.org/): code highlighting
- [jQuery](https://jquery.com/): used by some client-side scripts

## Contact

For questions or advice, email the Solutions Delivery Team at [solutionsdevelopment.techdirectorate@education.gov.uk](mailto:solutionsdevelopment.techdirectorate@education.gov.uk).
