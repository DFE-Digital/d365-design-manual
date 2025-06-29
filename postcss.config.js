// postcss.config.js
import stripFontFace from 'postcss-strip-font-face';

export default {
  plugins: [
    // removes all @font-face blocks
    stripFontFace()
  ]
};