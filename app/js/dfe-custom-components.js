const DfEComponents = {};

DfEComponents.nodeListForEach = function(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback);
  }
  for (let i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
};

DfEComponents.initAll = function(options = {}) {
  const scope = options.scope || document;

  const $sortableTables = scope.querySelectorAll('[data-module="dfe-sortable-table"]');
  DfEComponents.nodeListForEach($sortableTables, function($table) {
    new DfEComponents.SortableTable({ table: $table });
  });

  const $searchableTables = scope.querySelectorAll('[data-module="dfe-searchable-table"]');
  DfEComponents.nodeListForEach($searchableTables, function($table) {
    new DfEComponents.SearchableTable({ table: $table });
  });

  const $filterPanels = scope.querySelectorAll('[data-module="dfe-filter-panel"]');
  DfEComponents.nodeListForEach($filterPanels, function($module) {
    new DfEComponents.FilterPanel($module);
  });
};

DfEComponents.SortableTable = class {
  constructor(params) {
    this.table = $(params.table);

    if (this.table.data('dfe-search-toggle-initialised')) {
      return;
    }

    this.table.data('dfe-search-toggle-initialised', true);

    this.setupOptions(params);
    this.body = this.table.find('tbody');
    this.createHeadingButtons();
    this.createStatusBox();
    this.initialiseSortedColumn();
    this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'));
  }

  setupOptions(params = {}) {
    this.statusMessage = params.statusMessage || 'Sort by %heading% (%direction%)';
    this.ascendingText = params.ascendingText || 'ascending';
    this.descendingText = params.descendingText || 'descending';
  }

  createHeadingButtons() {
    const headings = this.table.find('thead th');
    for (let i = 0; i < headings.length; i++) {
      const heading = $(headings[i]);
      if (heading.attr('aria-sort')) {
        this.createHeadingButton(heading, i);
      }
    }
  }

  createHeadingButton(heading, i) {
    const text = heading.text();
    const button = $('<button type="button" data-index="' + i + '">' + text + '</button>');
    heading.text('');
    heading.append(button);
  }

  createStatusBox() {
    this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />');
    this.table.parent().append(this.status);
  }

  initialiseSortedColumn() {
    const rows = this.getTableRowsArray();
    this.table
      .find('th')
      .filter('[aria-sort="ascending"], [aria-sort="descending"]')
      .first()
      .each((index, el) => {
        const sortDirection = $(el).attr('aria-sort');
        const columnNumber = $(el).find('button').attr('data-index');
        const sortedRows = this.sort(rows, columnNumber, sortDirection);
        this.addRows(sortedRows);
      });
  }

  onSortButtonClick(e) {
    const columnNumber = e.currentTarget.getAttribute('data-index');
    const sortDirection = $(e.currentTarget).parent().attr('aria-sort');
    const newSortDirection = sortDirection === 'none' || sortDirection === 'descending' ? 'ascending' : 'descending';
    const rows = this.getTableRowsArray();
    const sortedRows = this.sort(rows, columnNumber, newSortDirection);
    this.addRows(sortedRows);
    this.removeButtonStates();
    this.updateButtonState($(e.currentTarget), newSortDirection);
  }

  updateButtonState(button, direction) {
    button.parent().attr('aria-sort', direction);
    let message = this.statusMessage;
    message = message.replace(/%heading%/, button.text());
    message = message.replace(/%direction%/, this[direction + 'Text']);
    this.status.text(message);
  }

  removeButtonStates() {
    this.table.find('thead th').attr('aria-sort', 'none');
  }

  addRows(rows) {
    for (let i = 0; i < rows.length; i++) {
      this.body.append(rows[i]);
    }
  }

  getTableRowsArray() {
    const rows = [];
    const trs = this.body.find('tr');
    for (let i = 0; i < trs.length; i++) {
      rows.push(trs[i]);
    }
    return rows;
  }

  sort(rows, columnNumber, sortDirection) {
    return rows.sort(
      $.proxy(function(rowA, rowB) {
        const tdA = $(rowA).find('td,th').eq(columnNumber);
        const tdB = $(rowB).find('td,th').eq(columnNumber);
        const valueA = this.getCellValue(tdA);
        const valueB = this.getCellValue(tdB);
        if (sortDirection === 'ascending') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
        }
      }, this)
    );
  }

  getCellValue(cell) {
    let val = cell.attr('data-sort-value') || cell.html();
    if ($.isNumeric(val)) {
      val = parseInt(val, 10);
    }
    return val;
  }
};

DfEComponents.SearchableTable = class {
  constructor(params) {
    this.table = $(params.table);

    if (this.table.data('dfe-search-toggle-initialised')) {
      return;
    }

    this.table.data('dfe-search-toggle-initialised', true);

    this.setupOptions(params);
    this.body = this.table.find('tbody');
    this.createStatusBox();
    this.initialiseSortedColumn();
    this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick'));

    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('filterTable');
    const trArray = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));

    const filterTable = (event) => {
      const searchTerm = event.target.value.toLowerCase();
      trArray.forEach((row) => {
        row.classList.add('hidden');
        const tdArray = Array.prototype.slice.call(row.getElementsByTagName('td'));
        tdArray.forEach((cell) => {
          if (cell.innerText.toLowerCase().indexOf(searchTerm) > -1) {
            row.classList.remove('hidden');
          }
        });
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', filterTable);
    }
  }

  setupOptions(params = {}) {
    this.statusMessage = params.statusMessage || 'Searching %searchValue%';
  }

  createStatusBox() {
    this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />');
    this.table.parent().append(this.status);
  }

  initialiseSortedColumn() {
    const rows = this.getTableRowsArray();
    this.table
      .find('th')
      .filter('[aria-sort="ascending"], [aria-sort="descending"]')
      .first()
      .each((index, el) => {
        const sortDirection = $(el).attr('aria-sort');
        const columnNumber = $(el).find('button').attr('data-index');
        const sortedRows = this.sort(rows, columnNumber, sortDirection);
        this.addRows(sortedRows);
      });
  }

  onSortButtonClick(e) {
    const columnNumber = e.currentTarget.getAttribute('data-index');
    const sortDirection = $(e.currentTarget).parent().attr('aria-sort');
    const newSortDirection = sortDirection === 'none' || sortDirection === 'descending' ? 'ascending' : 'descending';
    const rows = this.getTableRowsArray();
    const sortedRows = this.sort(rows, columnNumber, newSortDirection);
    this.addRows(sortedRows);
    this.removeButtonStates();
    this.updateButtonState($(e.currentTarget), newSortDirection);
  }

  updateButtonState(button, direction) {
    button.parent().attr('aria-sort', direction);
    let message = this.statusMessage;
    message = message.replace(/%heading%/, button.text());
    message = message.replace(/%direction%/, this[direction + 'Text']);
    this.status.text(message);
  }

  removeButtonStates() {
    this.table.find('thead th').attr('aria-sort', 'none');
  }

  addRows(rows) {
    for (let i = 0; i < rows.length; i++) {
      this.body.append(rows[i]);
    }
  }

  getTableRowsArray() {
    const rows = [];
    const trs = this.body.find('tr');
    for (let i = 0; i < trs.length; i++) {
      rows.push(trs[i]);
    }
    return rows;
  }

  sort(rows, columnNumber, sortDirection) {
    return rows.sort(
      $.proxy(function(rowA, rowB) {
        const tdA = $(rowA).find('td,th').eq(columnNumber);
        const tdB = $(rowB).find('td,th').eq(columnNumber);
        const valueA = this.getCellValue(tdA);
        const valueB = this.getCellValue(tdB);
        if (sortDirection === 'ascending') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
        }
      }, this)
    );
  }

  getCellValue(cell) {
    let val = cell.attr('data-sort-value') || cell.html();
    if ($.isNumeric(val)) {
      val = parseInt(val, 10);
    }
    return val;
  }
};

DfEComponents.FilterPanel = class {
  constructor(moduleElement) {
    this.$module = moduleElement;
    // Support both old (.dfe-filter-panel__header-button) and new (.dfe-filter-panel__button) selectors
    this.$headerButton = this.$module.querySelector('.dfe-filter-panel__button') ||
                         this.$module.querySelector('.dfe-filter-panel__header-button');
    this.$content = this.$module.querySelector('.dfe-filter-panel__content');
    // Legacy group buttons (for old markup using buttons instead of details/summary)
    this.$groupButtons = this.$module.querySelectorAll('.dfe-filter-panel__group-button');
    this.$applyButton = this.$module.querySelector('.dfe-filter-panel__action--submit');
    this.$selectedSection = null;
    this.$filterSummary = null;

    this.init();
  }

  init() {
    if (!this.$module) return;

    // Initialize main panel toggle (header button controls visibility of content)
    if (this.$headerButton && this.$content) {
      this.$headerButton.addEventListener('click', this.toggleMainPanel.bind(this));
    }

    // Initialize legacy group toggles (for old button-based markup)
    // Note: New markup uses native <details>/<summary> which doesn't need JS
    DfEComponents.nodeListForEach(this.$groupButtons, ($button) => {
      $button.addEventListener('click', this.toggleGroup.bind(this, $button));
    });

    // Initialize apply button
    if (this.$applyButton) {
      this.$applyButton.addEventListener('click', this.applyFilters.bind(this));
    }

    // Create selected filters section if it doesn't exist
    this.ensureSelectedSection();

    // Create filter summary section (shown below panel after Apply)
    this.ensureFilterSummary();

    // Bind tag removal via event delegation (for tags inside panel)
    this.$module.addEventListener('click', (event) => {
      const $tag = event.target.closest('.dfe-filter-panel__tag');
      if ($tag) {
        this.removeTag($tag, event);
      }
    });

    // Listen for real-time changes on checkboxes, radios, and selects
    this.$module.addEventListener('change', (event) => {
      const $target = event.target;
      if ($target.matches('input[type="checkbox"], input[type="radio"], select')) {
        this.updateSelectedFiltersRealTime();
      }
    });

    // Listen for real-time changes on date inputs
    this.$module.addEventListener('input', (event) => {
      const $target = event.target;
      if ($target.closest('.govuk-date-input')) {
        this.updateSelectedFiltersRealTime();
      }
    });

    // On page load: read URL params, set form values, and show filter summary if filters exist
    this.initFromUrlParams();
  }

  initFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let hasFilters = false;

    // Set checkbox and radio values from URL params
    const $inputs = this.$module.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    DfEComponents.nodeListForEach($inputs, ($input) => {
      const name = $input.getAttribute('name').replace('[]', '');
      const value = $input.value;
      const paramValues = urlParams.getAll(name).concat(urlParams.getAll(name + '[]'));

      if ($input.type === 'radio') {
        if (paramValues.includes(value)) {
          $input.checked = true;
          // Don't count radio as filter if it's the default (first option)
          const $fieldset = $input.closest('fieldset');
          const $firstRadio = $fieldset ? $fieldset.querySelector('input[type="radio"]') : null;
          if ($firstRadio !== $input) {
            hasFilters = true;
          }
        }
      } else {
        if (paramValues.includes(value)) {
          $input.checked = true;
          hasFilters = true;
        }
      }
    });

    // Set select values from URL params
    const $selects = this.$module.querySelectorAll('select');
    DfEComponents.nodeListForEach($selects, ($select) => {
      const name = $select.getAttribute('name');
      const paramValue = urlParams.get(name);
      if (paramValue) {
        $select.value = paramValue;
        hasFilters = true;
      }
    });

    // Set date input values from URL params
    const $dateInputs = this.$module.querySelectorAll('.govuk-date-input');
    DfEComponents.nodeListForEach($dateInputs, ($dateGroup) => {
      const $dayInput = $dateGroup.querySelector('input[name$="[day]"]');
      const $monthInput = $dateGroup.querySelector('input[name$="[month]"]');
      const $yearInput = $dateGroup.querySelector('input[name$="[year]"]');

      if ($dayInput && $monthInput && $yearInput) {
        // Extract base name (e.g., "date_from" from "date_from[day]")
        const baseName = $dayInput.getAttribute('name').replace('[day]', '');

        const dayValue = urlParams.get(baseName + '[day]');
        const monthValue = urlParams.get(baseName + '[month]');
        const yearValue = urlParams.get(baseName + '[year]');

        if (dayValue) $dayInput.value = dayValue;
        if (monthValue) $monthInput.value = monthValue;
        if (yearValue) $yearInput.value = yearValue;

        if (dayValue || monthValue || yearValue) {
          hasFilters = true;
        }
      }
    });

    // If there are filters in URL, show the filter summary (collapsed view)
    if (hasFilters) {
      const filterGroups = this.getFilterGroups();
      this.renderFilterSummary(filterGroups);
      this.updateResultCount();
    }
  }

  buildUrlParams() {
    const params = new URLSearchParams();
    const existingParams = new URLSearchParams(window.location.search);

    // Preserve non-filter params (like 'keywords')
    existingParams.forEach((value, key) => {
      // Check for regular inputs, selects, and date inputs
      const escapedKey = CSS.escape(key);
      const isFilterParam = this.$module.querySelector(
        'input[name="' + escapedKey + '"], input[name="' + escapedKey + '[]"], select[name="' + escapedKey + '"], input[name="' + CSS.escape(key.replace('[]', '')) + '[]"]'
      );
      // Also check if this is a date input param (e.g., date_from[day])
      const isDateParam = key.match(/\[(day|month|year)\]$/);
      if (!isFilterParam && !isDateParam) {
        params.append(key, value);
      }
    });

    // Add filter params from form
    const $inputs = this.$module.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    DfEComponents.nodeListForEach($inputs, ($input) => {
      const name = $input.getAttribute('name');
      const value = $input.value;

      // For radios, only add if not the default (first option)
      if ($input.type === 'radio') {
        const $fieldset = $input.closest('fieldset');
        const $firstRadio = $fieldset ? $fieldset.querySelector('input[type="radio"]') : null;
        if ($firstRadio !== $input) {
          params.append(name.replace('[]', ''), value);
        }
      } else {
        params.append(name.replace('[]', '') + '[]', value);
      }
    });

    // Add select values
    const $selects = this.$module.querySelectorAll('select');
    DfEComponents.nodeListForEach($selects, ($select) => {
      if ($select.value) {
        params.append($select.getAttribute('name'), $select.value);
      }
    });

    // Add date input values
    const $dateInputs = this.$module.querySelectorAll('.govuk-date-input');
    DfEComponents.nodeListForEach($dateInputs, ($dateGroup) => {
      const $dayInput = $dateGroup.querySelector('input[name$="[day]"]');
      const $monthInput = $dateGroup.querySelector('input[name$="[month]"]');
      const $yearInput = $dateGroup.querySelector('input[name$="[year]"]');

      if ($dayInput && $dayInput.value) {
        params.append($dayInput.getAttribute('name'), $dayInput.value);
      }
      if ($monthInput && $monthInput.value) {
        params.append($monthInput.getAttribute('name'), $monthInput.value);
      }
      if ($yearInput && $yearInput.value) {
        params.append($yearInput.getAttribute('name'), $yearInput.value);
      }
    });

    return params;
  }

  reloadWithParams(params) {
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.location.href = newUrl;
  }

  toggleMainPanel(event) {
    event.preventDefault();
    const isExpanded = this.$headerButton.getAttribute('aria-expanded') === 'true';
    this.$headerButton.setAttribute('aria-expanded', String(!isExpanded));
    this.$content.hidden = isExpanded;
  }

  collapseMainPanel() {
    if (this.$headerButton && this.$content) {
      this.$headerButton.setAttribute('aria-expanded', 'false');
      this.$content.hidden = true;
    }
  }

  toggleGroup($button, event) {
    event.preventDefault();
    const isExpanded = $button.getAttribute('aria-expanded') === 'true';
    const contentId = $button.getAttribute('aria-controls');
    const $content = this.$module.querySelector('#' + contentId);

    if ($content) {
      $button.setAttribute('aria-expanded', String(!isExpanded));
      $content.hidden = isExpanded;
    }
  }

  ensureSelectedSection() {
    this.$selectedSection = this.$module.querySelector('.dfe-filter-panel__selected');
    if (!this.$selectedSection) {
      // Create the selected filters section
      this.$selectedSection = document.createElement('div');
      this.$selectedSection.className = 'dfe-filter-panel__selected';
      this.$selectedSection.hidden = true;
      this.$selectedSection.innerHTML = `
        <div class="dfe-filter-panel__selected-header">
          <h3 class="dfe-filter-panel__selected-heading">Selected filters</h3>
          <a href="#" class="govuk-link govuk-link--no-visited-state dfe-filter-panel__clear-all">Clear all filters</a>
        </div>
        <ul class="dfe-filter-panel__selected-categories"></ul>
      `;
      // Insert at the start of the content area
      if (this.$content) {
        this.$content.insertBefore(this.$selectedSection, this.$content.firstChild);
      }

      // Bind clear all link
      const $clearAll = this.$selectedSection.querySelector('.dfe-filter-panel__clear-all');
      if ($clearAll) {
        $clearAll.addEventListener('click', this.clearAllFilters.bind(this));
      }
    }
  }

  ensureFilterSummary() {
    // Create filter summary section that appears BELOW the filter panel (outside of it)
    this.$filterSummary = this.$module.nextElementSibling;
    if (!this.$filterSummary || !this.$filterSummary.classList.contains('dfe-filter-summary')) {
      this.$filterSummary = document.createElement('div');
      this.$filterSummary.className = 'dfe-filter-summary';
      this.$filterSummary.hidden = true;
      this.$filterSummary.innerHTML = `
        <h3 class="dfe-filter-summary__heading">Filters applied</h3>
        <ul class="dfe-filter-summary__remove-filters"></ul>
        <a href="#" class="govuk-link govuk-link--no-visited-state dfe-filter-summary__clear-filters">Clear all filters</a>
      `;
      // Insert after the filter panel
      this.$module.insertAdjacentElement('afterend', this.$filterSummary);

      // Bind clear all link in summary
      const $clearAll = this.$filterSummary.querySelector('.dfe-filter-summary__clear-filters');
      if ($clearAll) {
        $clearAll.addEventListener('click', this.clearAllFilters.bind(this));
      }

      // Bind tag removal via event delegation in summary
      this.$filterSummary.addEventListener('click', (event) => {
        const $tag = event.target.closest('.dfe-filter-summary__remove-filter');
        if ($tag) {
          this.removeSummaryTag($tag, event);
        }
      });
    }
  }

  getFilterGroups() {
    // Get all checked checkboxes and selected radios
    const $inputs = this.$module.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    const $selects = this.$module.querySelectorAll('select');

    // Group filters by their category (name attribute or parent details summary)
    const filterGroups = {};

    DfEComponents.nodeListForEach($inputs, ($input) => {
      const name = $input.getAttribute('name').replace('[]', '');
      const value = $input.value;
      const $label = this.$module.querySelector('label[for="' + $input.id + '"]');
      const labelText = $label ? $label.textContent.trim() : value;

      // Get category name from parent details summary
      const $details = $input.closest('details');
      const $summary = $details ? $details.querySelector('.dfe-filter-section__summary-heading') : null;
      const categoryName = $summary ? $summary.textContent.trim() : name;

      if (!filterGroups[categoryName]) {
        filterGroups[categoryName] = [];
      }
      filterGroups[categoryName].push({ name, value, label: labelText });
    });

    // Handle select elements
    DfEComponents.nodeListForEach($selects, ($select) => {
      if ($select.value) {
        const name = $select.getAttribute('name');
        const $selectedOption = $select.options[$select.selectedIndex];
        const labelText = $selectedOption.textContent.trim();

        // Get category name from parent details summary
        const $details = $select.closest('details');
        const $summary = $details ? $details.querySelector('.dfe-filter-section__summary-heading') : null;
        const categoryName = $summary ? $summary.textContent.trim() : name;

        if (!filterGroups[categoryName]) {
          filterGroups[categoryName] = [];
        }
        filterGroups[categoryName].push({ name, value: $select.value, label: labelText });
      }
    });

    // Handle date input groups
    const $dateInputGroups = this.$module.querySelectorAll('.govuk-date-input');
    DfEComponents.nodeListForEach($dateInputGroups, ($dateGroup) => {
      const $dayInput = $dateGroup.querySelector('input[name$="[day]"]');
      const $monthInput = $dateGroup.querySelector('input[name$="[month]"]');
      const $yearInput = $dateGroup.querySelector('input[name$="[year]"]');

      if ($dayInput && $monthInput && $yearInput) {
        const day = $dayInput.value;
        const month = $monthInput.value;
        const year = $yearInput.value;

        if (day || month || year) {
          // Extract base name (e.g., "date_from" from "date_from[day]")
          const baseName = $dayInput.getAttribute('name').replace('[day]', '');
          const dateString = [day, month, year].filter(Boolean).join('/');

          // Get category name and legend text
          const $details = $dateGroup.closest('details');
          const $summary = $details ? $details.querySelector('.dfe-filter-section__summary-heading') : null;
          const categoryName = $summary ? $summary.textContent.trim() : 'Date';

          // Get the legend text for this specific date group (e.g., "Updated after" or "Updated before")
          const $fieldset = $dateGroup.closest('fieldset');
          const $legend = $fieldset ? $fieldset.querySelector('legend') : null;
          const legendText = $legend ? $legend.textContent.trim() : baseName;

          if (!filterGroups[categoryName]) {
            filterGroups[categoryName] = [];
          }
          filterGroups[categoryName].push({
            name: baseName,
            value: dateString,
            label: legendText + ': ' + dateString,
            isDate: true
          });
        }
      }
    });

    return filterGroups;
  }

  updateSelectedFiltersRealTime() {
    // Update the selected filters section inside the panel in real-time
    const filterGroups = this.getFilterGroups();
    this.renderSelectedFilters(filterGroups);

    // Update result count header
    const $count = this.$module.querySelector('.dfe-filter-panel__count');
    if ($count) {
      const totalFilters = Object.values(filterGroups).reduce((sum, arr) => sum + arr.length, 0);
      $count.textContent = totalFilters > 0 ? totalFilters + ' filter' + (totalFilters !== 1 ? 's' : '') + ' selected' : '24 results';
    }
  }

  applyFilters(event) {
    event.preventDefault();

    // Build URL params from selected filters and reload page
    const params = this.buildUrlParams();
    this.reloadWithParams(params);
  }

  renderSelectedFilters(filterGroups) {
    const $categoriesList = this.$selectedSection.querySelector('.dfe-filter-panel__selected-categories');
    $categoriesList.innerHTML = '';

    const categoryNames = Object.keys(filterGroups);

    if (categoryNames.length === 0) {
      this.$selectedSection.hidden = true;
      return;
    }

    categoryNames.forEach((categoryName) => {
      const filters = filterGroups[categoryName];
      const $category = document.createElement('li');
      $category.className = 'dfe-filter-panel__selected-category';

      let tagsHtml = filters.map((filter) => `
        <li>
          <a href="#" class="dfe-filter-panel__tag" data-filter-group="${filter.name}" data-filter-value="${filter.value}">
            ${filter.label}
            <svg class="dfe-filter-panel__tag-remove-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path d="M11.3.7L7 5 11.3 9.3l-.7.7L6.3 5.7 2 10l-.7-.7L5.6 5 1.3.7 2 0l4.3 4.3L10.6 0z"/>
            </svg>
            <span class="govuk-visually-hidden">Remove filter</span>
          </a>
        </li>
      `).join('');

      $category.innerHTML = `
        <span class="dfe-filter-panel__selected-category-heading">${categoryName}</span>
        <ul class="dfe-filter-panel__tag-list">${tagsHtml}</ul>
      `;

      $categoriesList.appendChild($category);
    });

    this.$selectedSection.hidden = false;
  }

  renderFilterSummary(filterGroups) {
    const $filterList = this.$filterSummary.querySelector('.dfe-filter-summary__remove-filters');
    $filterList.innerHTML = '';

    // Flatten all filters into a single list
    const allFilters = [];
    Object.keys(filterGroups).forEach((categoryName) => {
      filterGroups[categoryName].forEach((filter) => {
        allFilters.push(filter);
      });
    });

    if (allFilters.length === 0) {
      this.$filterSummary.hidden = true;
      return;
    }

    allFilters.forEach((filter) => {
      const $item = document.createElement('li');
      $item.innerHTML = `
        <a href="#" class="dfe-filter-summary__remove-filter" data-filter-group="${filter.name}" data-filter-value="${filter.value}">
          ${filter.label}
        </a>
      `;
      $filterList.appendChild($item);
    });

    this.$filterSummary.hidden = false;
  }

  removeTag($tag, event) {
    event.preventDefault();

    // Get the filter value to uncheck
    const filterValue = $tag.getAttribute('data-filter-value');
    const filterGroup = $tag.getAttribute('data-filter-group');

    this.uncheckFilter(filterGroup, filterValue);

    // Remove the tag from the DOM
    const $tagItem = $tag.closest('li');
    if ($tagItem) {
      $tagItem.remove();
    }

    // Check if category is now empty and hide it
    this.updateSelectedFiltersVisibility();

    // Update result count
    this.updateResultCount();
  }

  removeSummaryTag($tag, event) {
    event.preventDefault();

    // Get the filter value to uncheck
    const filterValue = $tag.getAttribute('data-filter-value');
    const filterGroup = $tag.getAttribute('data-filter-group');

    // Uncheck the filter in the form
    this.uncheckFilter(filterGroup, filterValue);

    // Build new URL params and reload
    const params = this.buildUrlParams();
    this.reloadWithParams(params);
  }

  uncheckFilter(filterGroup, filterValue) {
    if (filterValue && filterGroup) {
      // Find and uncheck the corresponding checkbox/radio
      const $input = this.$module.querySelector(
        'input[name="' + filterGroup + '"][value="' + filterValue + '"], input[name="' + filterGroup + '[]"][value="' + filterValue + '"]'
      );
      if ($input) {
        if ($input.type === 'radio') {
          // For radios, we can't really "uncheck" - just leave it
        } else {
          $input.checked = false;
        }
      }

      // Handle select elements
      const $select = this.$module.querySelector('select[name="' + filterGroup + '"]');
      if ($select && $select.value === filterValue) {
        $select.value = '';
      }

      // Handle date inputs (filterGroup is base name like "date_from")
      const $dayInput = this.$module.querySelector('input[name="' + filterGroup + '[day]"]');
      const $monthInput = this.$module.querySelector('input[name="' + filterGroup + '[month]"]');
      const $yearInput = this.$module.querySelector('input[name="' + filterGroup + '[year]"]');

      if ($dayInput || $monthInput || $yearInput) {
        if ($dayInput) $dayInput.value = '';
        if ($monthInput) $monthInput.value = '';
        if ($yearInput) $yearInput.value = '';
      }
    }
  }

  updateResultCount() {
    const filterGroups = this.getFilterGroups();
    const $count = this.$module.querySelector('.dfe-filter-panel__count');
    if ($count) {
      const totalFilters = Object.values(filterGroups).reduce((sum, arr) => sum + arr.length, 0);
      $count.textContent = totalFilters > 0 ? totalFilters + ' filter' + (totalFilters !== 1 ? 's' : '') + ' applied' : '24 results';
    }
  }

  clearAllFilters(event) {
    event.preventDefault();

    // Uncheck all checkboxes
    const $checkboxes = this.$module.querySelectorAll('input[type="checkbox"]:checked');
    DfEComponents.nodeListForEach($checkboxes, ($checkbox) => {
      $checkbox.checked = false;
    });

    // Reset radios to first option
    const $fieldsets = this.$module.querySelectorAll('fieldset');
    DfEComponents.nodeListForEach($fieldsets, ($fieldset) => {
      const $firstRadio = $fieldset.querySelector('input[type="radio"]');
      if ($firstRadio) {
        $firstRadio.checked = true;
      }
    });

    // Reset selects to first option
    const $selects = this.$module.querySelectorAll('select');
    DfEComponents.nodeListForEach($selects, ($select) => {
      $select.selectedIndex = 0;
    });

    // Clear date inputs
    const $dateInputs = this.$module.querySelectorAll('.govuk-date-input input[type="text"]');
    DfEComponents.nodeListForEach($dateInputs, ($input) => {
      $input.value = '';
    });

    // Build URL params (will only have non-filter params like 'keywords') and reload
    const params = this.buildUrlParams();
    this.reloadWithParams(params);
  }

  updateSelectedFiltersVisibility() {
    if (!this.$selectedSection) return;

    const $categories = this.$selectedSection.querySelectorAll('.dfe-filter-panel__selected-category');
    let hasVisibleTags = false;

    DfEComponents.nodeListForEach($categories, ($category) => {
      const $tags = $category.querySelectorAll('.dfe-filter-panel__tag');
      if ($tags.length === 0) {
        $category.remove();
      } else {
        hasVisibleTags = true;
      }
    });

    // Hide selected section if no tags remain
    if (!hasVisibleTags) {
      this.$selectedSection.hidden = true;
    }
  }
};

export { DfEComponents };