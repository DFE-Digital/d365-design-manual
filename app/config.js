const config = {
  baseURL: process.env.BASE_URL || 'https://d365-design-manual-8523de7fad90.herokuapp.com/',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  githubrepo: 'https://github.com/haynes-dev/dfe-d365-design-manual',
  assetPath: process.env.assetPath,
};

export default config;