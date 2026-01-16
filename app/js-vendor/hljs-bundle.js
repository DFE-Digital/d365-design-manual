/**
 * Highlight.js browser bundle
 * Includes core + XML (HTML) and Django languages for code highlighting
 */
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import django from 'highlight.js/lib/languages/django';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';

// Register the languages we need
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); // HTML is an alias for XML
hljs.registerLanguage('django', django);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);

// Export to window for use by other scripts
window.hljs = hljs;
