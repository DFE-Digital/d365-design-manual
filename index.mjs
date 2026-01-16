import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import { marked } from 'marked';
import bodyParser from 'body-parser';
import path from 'path';
import config from './app/config.js';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pages, { getPageByUrl, getBreadcrumbs, getChildren, getAllPages } from './app/data/pages.js';
import componentExamples from './app/data/component-examples.js';
import components, { getComponent } from './app/data/components/index.js';
import hljs from 'highlight.js';
import * as githubService from './app/services/github.js';

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
nunjucksEnv.addGlobal('getPageByUrl', getPageByUrl);

// Add component examples as a global variable
nunjucksEnv.addGlobal('componentExamples', componentExamples);

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

app.locals.serviceName = 'Dynamics 365 Design Manual';

// Set up static file serving for the app's assets
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

// Render a data-driven component page
function renderComponent(componentId, res, next, currentPath, pageData) {
  const component = getComponent(componentId);
  if (!component) {
    return null; // Component not found
  }

  const pageKey = `powerpages/components/${componentId}`;
  const breadcrumbs = getBreadcrumbs(pageKey);

  res.set('Content-type', 'text/html; charset=utf-8');
  res.render('powerpages/components/_component', {
    currentPath,
    component,
    pageData: pageData || { title: component.title, description: component.description },
    breadcrumbs
  }, (error, html) => {
    if (error) {
      next(error);
    } else {
      res.end(processHtml(html));
    }
  });
  return true;
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
    children
  }, (error, html) => {
    if (error) {
      if (error.message.startsWith('template not found')) {
        // Try with /index suffix for backwards compatibility during migration
        res.render(`${templatePath}/index`, {
          currentPath,
          pageData,
          breadcrumbs,
          children
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

  if (pageData) {
    // Found in registry - determine how to render
    const pageKey = Object.keys(getAllPages()).find(key => {
      const p = getAllPages()[key];
      const pUrl = p.url === '/' ? '/' : p.url.replace(/\/$/, '');
      const targetUrl = urlPath === '/' ? '/' : urlPath.replace(/\/$/, '');
      return pUrl === targetUrl;
    });

    if (pageData.dataSource === 'components') {
      // Data-driven component page
      const componentId = urlPath.split('/').pop();
      const rendered = renderComponent(componentId, res, next, currentPath, pageData);
      if (rendered) return;
    }

    if (pageData.template) {
      // Template-based page
      renderTemplate(pageData.template, res, next, currentPath, pageData, pageKey);
      return;
    }
  }

  // Fall back to file-based routing for pages not in registry
  let filePath = urlPath.substr(1).replace(/\/$/, '');
  if (filePath === '') {
    filePath = 'index';
  }
  renderTemplate(filePath, res, next, currentPath, null, null);
}

// GitHub API endpoints
app.post('/api/trigger-import', async (req, res) => {
  try {
    const { brand, environmentUrl, clientId, clientSecret } = req.body;

    // Validate required fields
    const missing = [];
    if (!brand) missing.push('Website brand');
    if (!environmentUrl) missing.push('Environment URL');
    if (!clientId) missing.push('Client ID');
    if (!clientSecret) missing.push('Client Secret');

    if (missing.length) {
      return res.status(400).json({
        error: `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`
      });
    }

    // Validate environment URL format
    if (!environmentUrl.startsWith('https://')) {
      return res.status(400).json({
        error: 'Environment URL must start with https://'
      });
    }

    const result = await githubService.triggerImport({ brand, environmentUrl, clientId, clientSecret });
    res.status(202).json({ ok: true, ...result });
  } catch (err) {
    console.error('Trigger import error:', err.message);
    const status = err.message.includes('Invalid brand') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

app.get('/api/find-run', async (req, res) => {
  try {
    const { dispatchTime } = req.query;

    if (!dispatchTime) {
      return res.status(400).json({ error: 'dispatchTime is required' });
    }

    const run = await githubService.findRunAfterTime(dispatchTime, 'repository_dispatch');
    res.json({ run });
  } catch (err) {
    console.error('Find run error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/import-status', async (req, res) => {
  try {
    const { runId } = req.query;

    if (!runId) {
      return res.status(400).json({ error: 'Run ID is required' });
    }

    const status = await githubService.getRunStatus(runId);
    res.json(status);
  } catch (err) {
    console.error('Get import status error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

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

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next);
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
})