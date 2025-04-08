import e from 'express';
import nunjucks from 'nunjucks';
import axios from 'axios';
import { marked } from 'marked';
import bodyParser from 'body-parser';
import path from 'path';
import config from './app/config.js';
import compression from 'compression';
import favicon from 'serve-favicon';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pages from './app/data/pages.js';
import componentExamples from './app/data/component-examples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = e();
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

// Set up Nunjucks as the template engine
const nunjucksEnv = nunjucks.configure(
  [
    'app/views',  // Main views directory
    'node_modules/govuk-frontend/dist', // GOV.UK Frontend components
    'node_modules/dfe-frontend/packages/components', // DfE Frontend components
    // Add more directories as needed
  ],
  {
    autoescape: true,
    express: app, // Set the Express app instance
  }
);

// Add the URLs as a global variable
nunjucksEnv.addGlobal('pages', pages);

// Add component examples as a global variable
nunjucksEnv.addGlobal('componentExamples', componentExamples);

// Add custom filters for merge and push
nunjucksEnv.addFilter('merge', function(obj, additional) {
  return { ...obj, ...additional };
});

nunjucksEnv.addFilter('push', function(array, item) {
  return [...array, item];
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
  let importPath = path.join(process.cwd(), 'app', 'views', url, 'index.html');
  try {
    const template = nunjucks.render(importPath);
    const $ = cheerio.load(template);
    const metaDescription = $('meta[name="description"]').attr('content');
    const pageDescription = metaDescription || '';
    return pageDescription;
  } catch (error) {
    console.error(`Error importing template from "${importPath}": ${error}`);
    return '';
  }
});

// Register the Nunjucks view engine
app.engine('html', nunjucks.render); // Tell Express to use Nunjucks for .html files
app.set('view engine', 'html'); // Set the default view engine to 'html'

app.locals.serviceName = 'Dynamics 365 Design Manual';

// Set up static file serving for the app's assets
app.use('/assets', e.static(path.join(__dirname, 'public/assets')));

// Adds a Link header with a canonical URL to the response for URLs that end with a trailing slash (/). Useful for search engine optimization (SEO)
app.use((req, res, next) => {
  if (req.url.replace(/\/$/, '') !== req.url) {
    res.set('Link', `<${req.url.replace(/\/$/, '')}>; rel="canonical"`);
  }
  next();
});

// Middleware to inject script
app.use(function(req, res, next) {
  res.locals.includeScript = true;
  next();
});

app.get('/design-system/dfe-frontend', async (req, res, next) => {
  try {
    const packageName = 'dfe-frontend';
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const version = response.data['dist-tags'].latest;
    const lastUpdatedv = new Date(response.data.time.modified).toISOString();

    res.render('design-system/dfe-frontend/index.html', { version, lastUpdatedv });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/design-system/dfe-frontend/sass-documentation', async (req, res, next) => {
  try {
    const packageName = 'dfe-frontend';
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const version = response.data['dist-tags'].latest;
    const lastUpdatedv = new Date(response.data.time.modified).toISOString();

    res.render('design-system/dfe-frontend/sass-documentation/index.html', { version, lastUpdatedv });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get(/\.html?$/i, function (req, res) {
  const path = req.path.replace(/\.html?$/, '');
  res.redirect(path);
});

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next);
});


function renderPath(path, res, next, currentPath) {
  res.set('Content-type', 'text/html; charset=utf-8');
  res.render(path, { 
    currentPath: currentPath // Use the original currentPath
  }, (error, html) => {
    if (error) {
      if (error.message.startsWith('template not found')) {
        renderPath(`${path}/index`, res, next, currentPath); // Pass currentPath along
      } else {
        next(error);
      }
    } else {
      res.end(html);
    }
  });
}

function matchRoutes(req, res, next) {
  let path = req.path.substr(1);
  const currentPath = req.path === '/' ? '/' : req.path; // Use the original request path
  if (path === '') {
    path = 'index';
  }
  renderPath(path, res, next, currentPath);
}

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
})