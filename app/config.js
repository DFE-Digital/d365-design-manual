module.exports = {

    // Base URL
    baseURL: process.env.BASE_URL || 'https://localhost:3000',
  
    // Environment
    env: process.env.NODE_ENV || 'development',
  
    // Port to run local development server on
    port: process.env.PORT || 3066,
    githubrepo: 'https://github.com/haynes-dev/dfe-crmportal-designsystem-dynamics365',
    
    assetPath: process.env.assetPath
  };