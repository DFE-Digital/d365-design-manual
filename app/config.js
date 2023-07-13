module.exports = {

    // Base URL
    baseURL: process.env.BASE_URL || 'https://d365-design-manual-8523de7fad90.herokuapp.com/',
  
    // Environment
    env: process.env.NODE_ENV || 'development',
  
    // Port to run local development server on
    port: process.env.PORT || 3066,
    githubrepo: 'https://github.com/haynes-dev/dfe-d365-design-manual',
    
    assetPath: process.env.assetPath
  };