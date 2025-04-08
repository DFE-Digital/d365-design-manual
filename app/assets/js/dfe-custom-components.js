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

export { DfEComponents };