# Department for Education - Dynamics 365 Design Manual

Principles, guidance, and standards to support people delivering joined-up, effective, user-centred outcomes for people who use Department for Education Dynamics 365 services.

[Access the Dynamics 365 Design Manual](https://d365-design-manual-8523de7fad90.herokuapp.com/)

## About

This is a documentation site built with Node.js and Express that provides guidance for two areas:

### PowerPages

Use the guidance on this site to make your Dynamics 365 PowerPages service as consistent as possible with Government Design Service (GDS) styles, components and patterns.

What's included:

- Create and set up your portal
- Styles, components and patterns for developers
- Building your custom portal
- Frontend validation for your custom portal
- Using the portal WebApi

### CRM Standards

We maintain a consistent process of building and releasing the back end of a Dynamics 365 CRM system, encompassing its configuration, customisation, and deployment.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DFE-Digital/d365-design-manual.git
   cd d365-design-manual
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (see [Environment variables](#environment-variables) below).

4. Build the project assets:

   ```bash
   npm run build
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The site will be available at [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root. The following variables are used for GitHub API integration:

```
GH_APP_ID=
GH_APP_INSTALL_ID=
GH_APP_PRIVATE_KEY=
```

These are optional for local development but required for GitHub integration features.

## Development

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with file watching and auto-reload |
| `npm run build` | Run the full build pipeline (clean, compile JS, SCSS, copy assets) |
| `npm run serve` | Start the Express server without file watchers |
| `npm run styles` | Compile SCSS and run PostCSS transformations |
| `npm run build-app-js` | Bundle client-side JavaScript with esbuild |
| `npm run clean` | Remove compiled assets from `public/` |

### How it works

- **Server**: Express.js (`index.mjs`) with Nunjucks templating
- **Styles**: SCSS compiled to CSS, with PostCSS post-processing to strip `@font-face` declarations
- **JavaScript**: Bundled with esbuild; jQuery and GOV.UK Frontend JS are copied as vendor scripts
- **Templates**: Nunjucks templates in `app/views/`, extending GOV.UK Frontend components
- **Components**: Custom DfE portal components defined in `app/data/components/` with interactive examples

### Project structure

```
d365-design-manual/
├── index.mjs                  # Express server entry point
├── app/
│   ├── config.js              # Environment and app configuration
│   ├── data/                  # Page definitions, component data
│   │   └── components/        # Individual component definitions
│   ├── js/                    # Client-side JavaScript source
│   ├── scss/                  # SCSS source files
│   ├── services/              # GitHub API integration
│   └── views/                 # Nunjucks templates
│       ├── includes/          # Partials (header, footer, nav, components)
│       ├── layouts/           # Page layout templates
│       ├── crm/               # CRM standards pages
│       └── powerpages/        # PowerPages guidance pages
├── public/                    # Compiled/built output (CSS, JS, images)
├── Procfile                   # Heroku deployment config
└── package.json
```

## Deployment

The site is deployed to Heroku. The `Procfile` runs `node ./index.mjs` as the web process.

## Tech stack

- [Express](https://expressjs.com/) - Web server
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating
- [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) v5 - Design system
- [esbuild](https://esbuild.github.io/) - JavaScript bundling
- [Sass](https://sass-lang.com/) - CSS preprocessing
- [Highlight.js](https://highlightjs.org/) - Code syntax highlighting
- [jQuery](https://jquery.com/) - DOM manipulation

## Contact

Contact the Solutions Delivery Team for advice and guidance.
