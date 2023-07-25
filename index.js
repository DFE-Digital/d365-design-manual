const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
//var dateFilter = require('nunjucks-date-filter');
const marked = require('marked');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./app/config');
const compression = require('compression');
const favicon = require('serve-favicon');
const cheerio = require('cheerio');

const app = express();
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

app.set('view engine', 'html');

app.locals.serviceName = 'Dynamics 365 Design Manual';

// Set up Nunjucks as the template engine
const nunjuckEnv = nunjucks.configure(
  [
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/dfe-frontend-alpha/packages/components/',
  ],
  {
    autoescape: true,
    express: app,
  }
);

//nunjuckEnv.addFilter('date', dateFilter);
nunjuckEnv.addFilter('formatNumber', function (number) {
  return number.toLocaleString();
});
marked.setOptions({ gfm: true });
nunjuckEnv.addFilter('markdown', function (content) {
  return marked(content);
});


nunjuckEnv.addFilter('getPageDescription', (url) => {
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




// Set up static file serving for the app's assets
app.use('/assets', express.static('public/assets'));

// Adds a Link header with a canonical URL to the response for URLs that end with a trailing slash (/). Useful for search engine optimization (SEO)
app.use((req, res, next) => {
  if (req.url.replace(/\/$/, '') !== req.url) {
    res.set('Link', `<${req.url.replace(/\/$/, '')}>; rel="canonical"`);
  }
  next();
});

app.get('/design-system/dfe-frontend', async (req, res, next) => {
  try {
    const packageName = 'dfe-frontend-alpha';
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
    const packageName = 'dfe-frontend-alpha';
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

app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'downloads', filename);

  res.download(filePath, (error) => {
    if (error) {
      console.error(error);
      res.status(404).send('File not found');
    }
  });
});


function renderPath(path, res, next) {
  res.render(path, { 'Content-type': 'text/html; charset=utf-8' }, (error, html) => {
    if (error) {
      if (error.message.startsWith('template not found')) {
        renderPath(`${path}/index`, res, next);
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

  if (path === '') {
    path = 'index';
  }

  renderPath(path, res, next);
}

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
