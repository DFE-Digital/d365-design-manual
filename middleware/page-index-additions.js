/* eslint-disable quote-props */
// Page specific
const additionalIndices = {
    '/interaction-design': ['ixd, ux, ui'],
    '/service-design': ['sd'],
    '/user-research': ['ur, research, user needs'],
    '/accessibility': ['wcag, usability, inclusive design'],
    '/content-design': ['writing']
  };
  
  // Term specific
  const alternativeSpelling = {
    '&': ['ampersand'],
    'dfe': ['Department for Education'],
    'D365': ['Dynamics 365']
  };
  
  const indexBlacklist = [
    '/'
  ];
  
  module.exports = { additionalIndices, alternativeSpelling, indexBlacklist };