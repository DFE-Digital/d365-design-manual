const nunjucks = require('nunjucks');

nunjucks.configure([
    "/views",
    "node_modules/govuk-frontend/",
    "node_modules/dfe-frontend-alpha/packages/components"
])