// Component data index
// Every component page renders from its data file through app/views/powerpages/components/_component.html

import attachment from './attachment.js';
import card from './card.js';
import checkboxes from './checkboxes.js';
import chevronCard from './chevron-card.js';
import contentsList from './contents-list.js';
import dashboard from './dashboard.js';
import dateInput from './date-input.js';
import emailInput from './email-input.js';
import feedback from './feedback.js';
import fileUpload from './file-upload.js';
import filterPanel from './filter-panel.js';
import loadingSpinner from './loading-spinner.js';
import numberInput from './number-input.js';
import printLink from './print-link.js';
import radios from './radios.js';
import search from './search.js';
import select from './select.js';
import sidebar from './sidebar.js';
import sortableTable from './sortable-table.js';
import subNavigation from './sub-navigation.js';
import telephoneInput from './telephone-input.js';
import textInput from './text-input.js';
import textarea from './textarea.js';
import timeline from './timeline.js';

// Keyed by the component's URL path segment (e.g., /powerpages/components/checkboxes/)
const components = {
  attachment: attachment,
  card: card,
  checkboxes: checkboxes,
  'chevron-card': chevronCard,
  'contents-list': contentsList,
  dashboard: dashboard,
  'date-input': dateInput,
  'email-input': emailInput,
  feedback: feedback,
  'file-upload': fileUpload,
  'filter-panel': filterPanel,
  'loading-spinner': loadingSpinner,
  'number-input': numberInput,
  'print-link': printLink,
  radios: radios,
  search: search,
  select: select,
  sidebar: sidebar,
  'sortable-table': sortableTable,
  'sub-navigation': subNavigation,
  'telephone-input': telephoneInput,
  'text-input': textInput,
  textarea: textarea,
  timeline: timeline
};

export default components;
