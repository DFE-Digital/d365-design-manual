import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import { marked } from 'marked';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import config from './app/config.js';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pages, { getPageByUrl, getBreadcrumbs, getChildren, getAllPages, getRedirect, getNavTree, getPagination } from './app/data/pages.js';
import componentExamples from './app/data/component-examples.js';
import components from './app/data/components/index.js';
import hljs from 'highlight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
});


// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://rsms.me"],
      fontSrc: ["'self'", "https://rsms.me", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// Set up Nunjucks as the template engine
const nunjucksEnv = nunjucks.configure(
  [
    'app/views',  // Main views directory
    'node_modules/govuk-frontend/dist', // GOV.UK Frontend components
    // Add more directories as needed
  ],
  {
    autoescape: true,
    express: app, // Set the Express app instance
  }
);

// Add the URLs as a global variable
nunjucksEnv.addGlobal('pages', getAllPages());

// Add navigation helper functions
nunjucksEnv.addGlobal('getBreadcrumbs', getBreadcrumbs);
nunjucksEnv.addGlobal('getChildren', getChildren);
nunjucksEnv.addGlobal('getNavTree', getNavTree);
nunjucksEnv.addGlobal('getPagination', getPagination);
nunjucksEnv.addGlobal('getPageByUrl', getPageByUrl);

// Add component examples as a global variable
nunjucksEnv.addGlobal('componentExamples', componentExamples);

// Lets a component's template render its data file through powerpages/components/_component.html
nunjucksEnv.addGlobal('components', components);

// Add custom filters for merge and push
nunjucksEnv.addFilter('merge', function(obj, additional) {
  return { ...obj, ...additional };
});

nunjucksEnv.addFilter('push', function(array, item) {
  return [...array, item];
});

nunjucksEnv.addFilter('slugify', function(str) {
  return slugify(str, { lower: true, strict: true });
});

// Custom filter to check if a string contains a substring
nunjucksEnv.addFilter('contains', (str, substring) => {
  if (typeof str !== 'string' || typeof substring !== 'string') {
    return false;
  }
  return str.indexOf(substring) !== -1;
});

nunjucksEnv.addFilter('replace', (str, searchValue, replaceValue) => {
  if (typeof str !== 'string' || typeof searchValue !== 'string' || typeof replaceValue !== 'string') {
    return false;
  }
  return str.replace(searchValue, replaceValue);
});

nunjucksEnv.addFilter('formatNumber', function (number) {
  return number.toLocaleString();
});

marked.setOptions({ gfm: true });
nunjucksEnv.addFilter('markdown', function (content) {
  return marked(content);
});

nunjucksEnv.addFilter('getPageDescription', (url) => {
  // Use the page registry to get description
  const page = getPageByUrl(url);
  if (page && page.description) {
    return page.description;
  }
  return '';
});

// Register the Nunjucks view engine
app.engine('html', nunjucks.render); // Tell Express to use Nunjucks for .html files
app.set('view engine', 'html'); // Set the default view engine to 'html'

app.locals.serviceName = 'Dynamics 365 and Power Pages manual';

// Set up static file serving for the app's assets
app.use('/assets/js/sdt-toolkit.js', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/assets', express.static(path.join(__dirname, 'public/')));

// Adds a Link header with a canonical URL to the response for URLs that end with a trailing slash (/). Useful for search engine optimization (SEO)
app.use((req, res, next) => {
  if (req.url.replace(/\/$/, '') !== req.url) {
    res.set('Link', `<${req.url.replace(/\/$/, '')}>; rel="canonical"`);
  }
  next();
});

// Process HTML to add syntax highlighting to code blocks
function processHtml(html) {
  let $ = cheerio.load(html);
  $('pre code').each(function () {
    const code = $(this).text();
    const classAttr = $(this).attr('class') || '';
    const langMatch = classAttr.match(/language-(\w+)/);
    const language = langMatch ? langMatch[1] : null;

    let result;
    if (language && hljs.getLanguage(language)) {
      result = hljs.highlight(code, { language });
      $(this).addClass(`hljs ${language}`);
    } else {
      result = hljs.highlightAuto(code);
      $(this).addClass(`hljs ${result.language || ''}`);
    }
    $(this).html(result.value);
  });
  return $.html();
}

// Render a template file with page data
function renderTemplate(templatePath, res, next, currentPath, pageData, pageKey) {
  const breadcrumbs = pageKey ? getBreadcrumbs(pageKey) : [];
  const children = pageKey ? getChildren(pageKey) : [];

  res.set('Content-type', 'text/html; charset=utf-8');
  res.render(templatePath, {
    currentPath,
    pageData,
    breadcrumbs,
    children,
    pageKey
  }, (error, html) => {
    if (error) {
      if (error.message.startsWith('template not found')) {
        // Try with /index suffix for backwards compatibility during migration
        res.render(`${templatePath}/index`, {
          currentPath,
          pageData,
          breadcrumbs,
          children,
          pageKey
        }, (err2, html2) => {
          if (err2) {
            next(err2);
          } else {
            res.end(processHtml(html2));
          }
        });
      } else {
        next(error);
      }
    } else {
      res.end(processHtml(html));
    }
  });
}

// Route matching - use page registry, then fall back to file-based
function matchRoutes(req, res, next) {
  const urlPath = req.path === '/' ? '/' : req.path;
  const currentPath = urlPath;

  // Look up page in registry by URL
  const pageData = getPageByUrl(urlPath);
  const pageKey = pageData ? Object.keys(getAllPages()).find(key => getAllPages()[key] === pageData) : null;

  // Each page has one URL, with a trailing slash
  if (pageData && urlPath !== pageData.url) {
    const queryStart = req.originalUrl.indexOf('?');
    return res.redirect(301, pageData.url + (queryStart === -1 ? '' : req.originalUrl.slice(queryStart)));
  }

  if (pageData && pageData.template) {
    renderTemplate(pageData.template, res, next, currentPath, pageData, pageKey);
    return;
  }

  // Fall back to file-based routing. Registry pages that land here, such as
  // component pages without a template, still pass their key for navigation
  let filePath = urlPath.substr(1).replace(/\/$/, '');
  if (filePath === '') {
    filePath = 'index';
  }
  const viewsDir = path.join(__dirname, 'app/views');
  const exists = ['.html', '/index.html'].some(ext => fs.existsSync(path.join(viewsDir, filePath + ext)));
  if (!exists) {
    return next();
  }
  renderTemplate(filePath, res, next, currentPath, null, pageKey);
}

app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

app.use(function(req, res, next) {
  res.locals.includeScript = true;
  next();
});

app.get(/\.html?$/i, function (req, res) {
  const path = req.path.replace(/\.html?$/, '');
  res.redirect(path);
});

// Send old URLs of moved pages to their new location
app.use((req, res, next) => {
  const redirectTo = getRedirect(req.path);
  if (redirectTo) {
    const queryStart = req.originalUrl.indexOf('?');
    const query = queryStart === -1 ? '' : req.originalUrl.slice(queryStart);
    const [target, fragment] = redirectTo.split('#');
    return res.redirect(301, `${target}${query}${fragment ? `#${fragment}` : ''}`);
  }
  next();
});

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next);
});

// Page not found
app.use((req, res) => {
  res.status(404).render('404', { currentPath: req.path });
});

// Anything that fails while rendering a page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { currentPath: req.path });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
})