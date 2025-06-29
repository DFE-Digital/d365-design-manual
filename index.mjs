import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import nunjucks from 'nunjucks';
import { marked } from 'marked';
import bodyParser from 'body-parser';
import { Octokit  } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
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

const app = express();

process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
});


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
app.use('/assets', express.static(path.join(__dirname, 'public/')));

// Adds a Link header with a canonical URL to the response for URLs that end with a trailing slash (/). Useful for search engine optimization (SEO)
app.use((req, res, next) => {
  if (req.url.replace(/\/$/, '') !== req.url) {
    res.set('Link', `<${req.url.replace(/\/$/, '')}>; rel="canonical"`);
  }
  next();
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

async function getInstallationToken(token) {
  const octokit = new Octokit({
    auth: token  // your newly minted JWT
  });

  const { data } = await octokit.request(
    'POST /app/installations/{installation_id}/access_tokens',
    { installation_id: Number(process.env.GH_APP_INSTALL_ID) }
  );
  return data.token;
}

const privateKeyPath = path.join(process.cwd(), '/d365-powerpages-importer.2025-06-29.private-key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const OWNER = 'DFE-DIGITAL';
const REPO  = 'd365-gds-powerpages';

app.post('/api/trigger-import', async (req, res) => {
  try {

    const {brand, environmentUrl, clientId, clientSecret} = req.body;

    const missing = [];
    if (!brand)          missing.push('Website brand');
    if (!environmentUrl) missing.push('Environment URL');
    if (!clientId)       missing.push('Client ID');
    if (!clientSecret)   missing.push('Client Secret');

    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing required field${missing.length>1?'s':''}: ${missing.join(', ')}` });
    }

    const eventTypeMap = {
      "dfe":  'create-dfe-website',
      "govuk":'create-govuk-website'
    };
    const eventType = eventTypeMap[brand];

    if (!eventType) {
      return res.status(400).json({ error: 'Invalid brand. Must be "dfe" or "govuk"' });
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + (10 * 60),
      iss: process.env.GH_APP_ID
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    const installToken = await getInstallationToken(token);
    const github = new Octokit({ auth: installToken });

    await github.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: OWNER,
      repo: REPO,
      event_type: eventType,
      client_payload: {
        environment_url: environmentUrl,
        client_id:       clientId,
        client_secret:   clientSecret
      }
    });

    const dispatchTime = new Date().toISOString();
    res.status(202).json({ ok: true, dispatchTime });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/run-id', async (_req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + (10 * 60),
      iss: process.env.GH_APP_ID
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    const installToken = await getInstallationToken(token);
    const github = new Octokit({ auth: installToken });

    const { data } = await github.request('GET /repos/{owner}/{repo}/actions/runs', {
      owner: OWNER,
      repo: REPO,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const yourRun = data.workflow_runs[0];

    console.log(yourRun);

    if (!yourRun) {
      return res.json({ id: null });
    }

    return res.json({
      id: yourRun.id
    })
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

// Endpoint to fetch the latest run status
app.get('/api/import-status', async (_req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + (10 * 60),
      iss: process.env.GH_APP_ID
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    const installToken = await getInstallationToken(token);
    const github = new Octokit({ auth: installToken });

    const { runId } = _req.query;

    if (!runId) {
      return res.status(400).json({ error: 'Invalid run ID' });
    }

    const { data } = await github.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
      owner: OWNER,
      repo: REPO,
      run_id: runId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return res.json({
      status: data.status,
      conclusion: data.conclusion
    });
  } catch (err) {
    console.error(err);
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
});0

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