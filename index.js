const express = require('express')
const nunjucks = require('nunjucks')
const axios = require('axios')
var dateFilter = require('nunjucks-date-filter')
var markdown = require('nunjucks-markdown')
var marked = require('marked')
const bodyParser = require('body-parser')
const path = require('path')
const config = require('./app/config')
const forceHttps = require('express-force-https');
const compression = require('compression');
const favicon = require('serve-favicon');
const PageIndex = require('./middleware/pageIndex')

const pageIndex = new PageIndex(config)
require('dotenv').config()

const app = express()
app.use(compression());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

app.set('view engine', 'html')

app.locals.serviceName = 'Dynamics 365 Standards Manual'

// Set up Nunjucks as the template engine
var nunjuckEnv = nunjucks.configure(
  [
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/dfe-frontend-alpha/packages/components/',
  ],
  {
    autoescape: true,
    express: app,
  },
)

nunjuckEnv.addFilter('date', dateFilter)
markdown.register(nunjuckEnv, marked.parse)

nunjuckEnv.addFilter('formatNumber', function(number) {
  return number.toLocaleString();
});

app.use(forceHttps);

// Set up static file serving for the app's assets
app.use('/assets', express.static('public/assets'))

app.use((req, res, next) => {
  if (req.url.endsWith('/') && req.url.length > 1) {
    const canonicalUrl = req.url.slice(0, -1);
    res.set('Link', `<${canonicalUrl}>; rel="canonical"`);
  }
  next();
});


if (config.env !== 'development') {
  setTimeout(() => {
    pageIndex.init()
  }, 2000)
}

app.get('/design-system/dfe-frontend', function (req, res, next) {
  const packageName = 'dfe-frontend-alpha'
  let version = '-'

  axios
    .get(`https://registry.npmjs.org/${packageName}`)
    .then((response) => {
      const version = response.data['dist-tags'].latest
      const lastUpdatedv = new Date(response.data.time.modified).toISOString()

      res.render('design-system/dfe-frontend/index.html', {
        version,
        lastUpdatedv,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get('/design-system/dfe-frontend/sass-documentation', function (
  req,
  res,
  next,
) {
  const packageName = 'dfe-frontend-alpha'
  let version = '-'

  axios
    .get(`https://registry.npmjs.org/${packageName}`)
    .then((response) => {
      const version = response.data['dist-tags'].latest
      const lastUpdatedv = new Date(response.data.time.modified).toISOString()

      res.render('design-system/dfe-frontend/sass-documentation/index.html', {
        version,
        lastUpdatedv,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next)
})

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// and /app/views/test/index.html

function renderPath(path, res, next) {
  // Try to render the path
  res.render(path, function (error, html) {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }
    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found - call next with the error
      next(error)
      return
    }
    if (!path.endsWith('/index')) {
      // Maybe it's a folder - try to render [path]/index.html
      renderPath(path + '/index', res, next)
      return
    }
    // We got template not found both times - call next to trigger the 404 page
    next()
  })
}

matchRoutes = function (req, res, next) {
  var path = req.path

  // Remove the first slash, render won't work with it
  path = path.substr(1)

  // If it's blank, render the root index
  if (path === '') {
    path = 'index'
  }

  renderPath(path, res, next)
}

// Start the server

// // Run application on configured port
//if (config.env === 'development') {
//   app.listen(config.port - 50, () => {
//   });
// } else {
// app.listen(config.port);
//}

app.listen(config.port)