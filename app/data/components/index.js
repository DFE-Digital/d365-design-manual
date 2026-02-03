// Component data index
// Import all component definitions here

import checkboxes from './checkboxes.js';
import radios from './radios.js';
import dateInput from './date-input.js';
import emailInput from './email-input.js';
import textInput from './text-input.js';
import textarea from './textarea.js';
import telephoneInput from './telephone-input.js';
import numberInput from './number-input.js';
import select from './select.js';
import search from './search.js';
import card from './card.js';
import attachment from './attachment.js';
import contentsList from './contents-list.js';
import dashboard from './dashboard.js';
import sortableTable from './sortable-table.js';
import timeline from './timeline.js';
import printLink from './print-link.js';

// Export as a keyed object for easy lookup
// Keys match the URL path segment (e.g., /powerpages/components/checkboxes/)
const components = {
  checkboxes,
  radios,
  'date-input': dateInput,
  'email-input': emailInput,
  'text-input': textInput,
  textarea,
  'telephone-input': telephoneInput,
  'number-input': numberInput,
  select,
  search,
  card,
  attachment,
  'contents-list': contentsList,
  dashboard,
  'sortable-table': sortableTable,
  timeline,
  'print-link': printLink
};

export default components;

// Helper to get component by ID
export function getComponent(id) {
  return components[id] || null;
}

// Get all component IDs
export function getAllComponentIds() {
  return Object.keys(components);
}
