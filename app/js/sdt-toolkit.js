/*
 * Solutions Delivery Team D365 Toolkit
 * Form helper for Dynamics 365 / model-driven apps.
 *
 * Use as a DevTools snippet (paste and run) or minified as a bookmarklet.
 * Unsupported by Microsoft. Uses Xrm.Page, which remains supported for
 * backwards compatibility but is deprecated, plus some DOM inspection that
 * is not contractual. Dev and Test only.
 */
(function () {
  'use strict';

  var PANEL_ID = 'sdt-d365-toolkit-panel';
  // major.feature.tweak. Major is declared by hand, never inferred. The middle
  // number moves when a new capability lands, the last for adjustments to one
  // that already exists.
  var VERSION = 'v2.3.0';
  var API_VERSION = 'v9.2';
  var MARK = 'data-sdt-highlight';
  var WRAP = 'data-sdt-wrap';

  /* --------------------------------------------------------------- theme --- */

  var T = {
    // A solid light tool window under a dark blue header, rather than the
    // translucent dark panel it used to be. Solid because the action buttons
    // are now white cards: anything showing through from the form behind
    // would sit directly under 13px text.
    bg: '#eef2f6',
    bgCard: '#ffffff',
    bgSunken: '#e2e8ee',
    bgAbout: '#f8fafc',
    bgHover: '#e9eef3',
    line: '#dde4ea',
    lineStrong: '#c3ccd5',
    text: '#1c2126',
    textMuted: '#5c656e',
    // Darker than the mock's #7b848e, which fell to 3.4:1 on the panel
    // ground. Section headings and the RECORD ID label are small text and
    // have to clear 4.5:1.
    textFaint: '#666f79',
    accent: '#0f6cbd',
    accentDark: '#0a4f8a',
    // The header band and everything drawn on it.
    header: '#0e4a7b',
    headerText: '#ffffff',
    headerMuted: '#a9c8e2',
    headerAccent: '#bfe0ff',
    // Solid rather than translucent white: the toolbox mark is cut out of a
    // white shape, and the cut-outs are painted in this exact colour. A darker
    // shade of the header band, so the tile reads as part of it.
    headerTile: '#0b3a63',
    headerTileLine: 'rgba(255, 255, 255, 0.22)',
    headerHover: 'rgba(255, 255, 255, 0.16)',
    // Action buttons read as white cards. Active toggles fill pale blue and
    // take a blue border, which is the only strong colour on the body.
    button: '#ffffff',
    buttonLine: '#e2e7ec',
    buttonHover: '#f4faff',
    buttonHoverLine: '#9cc4e6',
    buttonActive: '#e8f3fd',
    buttonActiveHover: '#daecfb',
    buttonActiveBorder: '#0f6cbd',
    danger: '#8f2c2c',
    dangerBg: '#fdeceb',
    dangerBorder: '#e6a5a1',
    dangerDot: '#c4392f',
    inputBg: '#ffffff',
    inputText: '#1c2126',
    inputBorder: '#c9d3dc',
    inputHover: 'rgba(18, 38, 63, 0.08)',
    // Applied to the form behind the panel, not to the panel, so these stay
    // as they were.
    schemaHighlight: 'rgba(120, 190, 255, 0.28)',
    dirtyHighlight: 'rgba(255, 214, 10, 0.40)',
    // 440 in the design, then 460 so the longest action label still sits on one
    // line whatever font the host resolves. Widened again by a fifth, to 552,
    // because the two column listings and the field values in the output were
    // still tight at 460. The resize grip overrides this.
    width: '552px',
    // Same gap above, below, left and right of the panel. The height is the
    // window less two of these, so the panel uses whatever space there is
    // rather than stopping at a fixed size. The resize grip overrides both.
    offset: '28px',
    minWidth: 360,
    minHeight: 240,
    radius: '14px',
    pad: '18px',
    gap: '8px',
    font: '13px "Segoe UI", system-ui, -apple-system, sans-serif',
    mono: '11.5px ui-monospace, SFMono-Regular, Consolas, monospace'
  };

  /* ----------------------------------------------------------------- Xrm --- */

  // Returns the window holding the form, so callers get both Xrm and the
  // document the form is rendered into. Multi-session apps (Customer Service
  // workspace) host each session in its own iframe, so the top window may not
  // be the one with the form.
  function findFormWindow() {
    var withForm = [];
    var withXrm = [];

    function walk(w, depth) {
      if (!w || depth > 4) return;
      try {
        if (w.Xrm) {
          withXrm.push(w);
          if (w.Xrm.Page && w.Xrm.Page.data && w.Xrm.Page.data.entity) withForm.push(w);
        }
      } catch (e) { /* cross-origin frame */ }
      try {
        for (var i = 0; i < w.frames.length; i++) walk(w.frames[i], depth + 1);
      } catch (e) { /* cross-origin frame */ }
    }

    var root = window;
    try {
      if (window.top && window.top.document) root = window.top;
    } catch (e) { /* top is cross-origin */ }
    walk(root, 0);

    return withForm[0] || withXrm[0] || null;
  }

  function getRecord(xrm) {
    if (!xrm) return null;
    try {
      var input = xrm.Utility.getPageContext().input;
      if (input && input.entityId) {
        return {
          id: clean(input.entityId),
          table: input.entityName || '',
          name: primaryName(xrm)
        };
      }
    } catch (e) { /* fall through */ }
    try {
      var id = xrm.Page.data.entity.getId();
      if (id) {
        return {
          id: clean(id),
          table: xrm.Page.data.entity.getEntityName() || '',
          name: primaryName(xrm)
        };
      }
    } catch (e) { /* fall through */ }
    return null;
  }

  // The value of the table's primary name column. Not every table has one, and
  // it is empty on a record that has never been saved.
  function primaryName(xrm) {
    try {
      var value = xrm.Page.data.entity.getPrimaryAttributeValue();
      return (typeof value === 'string' && value) ? value : '';
    } catch (e) {
      return '';
    }
  }

  function clean(guid) {
    return String(guid).replace(/[{}]/g, '').toLowerCase();
  }

  function getFormId(xrm) {
    try {
      var item = xrm.Page.ui.formSelector.getCurrentItem();
      if (item && item.getId) return clean(item.getId());
    } catch (e) { /* form selector not available */ }
    return null;
  }

  // Survives re-running the toolkit on the same page, so the schema name
  // toggle can still put the original labels back.
  function getStore(win) {
    if (!win.__sdtD365Toolkit) win.__sdtD365Toolkit = { recordId: null, labels: {}, schemaOn: false, hidden: null, hiddenOn: false, locked: null, unlockedOn: false, mandatory: null, mandatoryOn: false, dirtyOn: false, formXml: {}, relationships: {}, watchers: [] };
    // Added after the store shape was first written, so an older store left on
    // the window by a previous version would not have it.
    if (!win.__sdtD365Toolkit.relationships) win.__sdtD365Toolkit.relationships = {};
    return win.__sdtD365Toolkit;
  }

  /* --------------------------------------------------------- form actions --- */

  // What the user is looking at, for error messages. Anything not in this list
  // is reported generically rather than guessed at.
  var PAGE_NAMES = {
    entitylist: 'a view',
    entityrecord: 'a record form',
    dashboard: 'a dashboard',
    custom: 'a custom page',
    webresource: 'a web resource'
  };

  function currentPageType(xrm) {
    try {
      var input = xrm.Utility.getPageContext().input;
      return (input && input.pageType) ? input.pageType : null;
    } catch (e) {
      return null;
    }
  }

  // A grid page still exposes Xrm and Xrm.Page, but the control collection is
  // not there, which is what produced the raw null error.
  function hasForm(xrm) {
    try {
      return !!(xrm && xrm.Page && xrm.Page.ui && xrm.Page.ui.controls &&
        typeof xrm.Page.ui.controls.forEach === 'function' &&
        xrm.Page.data && xrm.Page.data.entity);
    } catch (e) {
      return false;
    }
  }

  function notAFormMessage(xrm) {
    var name = PAGE_NAMES[currentPageType(xrm)];
    if (name && name !== 'a record form') {
      return 'You are on ' + name + ', not a record form. Open a record and try again.';
    }
    return 'No record form is open on this page. Open a record and try again.';
  }

  function eachControl(xrm, fn) {
    if (!hasForm(xrm)) return;
    xrm.Page.ui.controls.forEach(function (c) {
      try { fn(c); } catch (e) { /* control does not support this */ }
    });
  }

  // Records which fields were locked before unlocking them. The script only
  // knows the state at the moment of the click - anything that changes the
  // state afterwards is not tracked.
  function unlockFields(xrm, store) {
    var locked = {};
    var n = 0;
    eachControl(xrm, function (c) {
      if (c.getDisabled && c.getDisabled()) {
        locked[c.getName()] = true;
        c.setDisabled(false);
        n++;
      }
    });
    store.locked = locked;
    store.unlockedOn = true;
    return n;
  }

  function relock(xrm, store) {
    var locked = store.locked || {};
    var n = 0;
    eachControl(xrm, function (c) {
      if (locked[c.getName()] && c.setDisabled) { c.setDisabled(true); n++; }
    });
    store.locked = {};
    store.unlockedOn = false;
    return n;
  }

  // Only fields already at 'required' are changed, so restoring them is exact.
  function removeMandatory(xrm, store) {
    var was = {};
    var n = 0;
    var seen = {};
    eachControl(xrm, function (c) {
      var a = c.getAttribute && c.getAttribute();
      if (!a || !a.getRequiredLevel) return;
      var name = a.getName();
      if (seen[name]) return;
      seen[name] = true;
      if (a.getRequiredLevel() === 'required') {
        was[name] = 'required';
        a.setRequiredLevel('none');
        n++;
      }
    });
    store.mandatory = was;
    store.mandatoryOn = true;
    return n;
  }

  function restoreMandatory(xrm, store) {
    var was = store.mandatory || {};
    var n = 0;
    var seen = {};
    eachControl(xrm, function (c) {
      var a = c.getAttribute && c.getAttribute();
      if (!a || !a.setRequiredLevel) return;
      var name = a.getName();
      if (seen[name] || !was[name]) return;
      seen[name] = true;
      a.setRequiredLevel(was[name]);
      n++;
    });
    store.mandatory = {};
    store.mandatoryOn = false;
    return n;
  }

  // Records what was hidden before revealing it, so the change can be undone.
  // Names are kept rather than object references because the client can
  // re-create tab and control objects between calls.
  function showHidden(xrm, store) {
    var hidden = { tabs: {}, sections: {}, controls: {} };
    var tabs = 0, sections = 0, fields = 0;

    xrm.Page.ui.tabs.forEach(function (tab) {
      var tabName = tab.getName ? tab.getName() : null;
      try {
        if (!tab.getVisible()) {
          if (tabName) hidden.tabs[tabName] = true;
          tab.setVisible(true);
          tabs++;
        }
      } catch (e) { /* ignore */ }
      try {
        tab.sections.forEach(function (s) {
          try {
            if (!s.getVisible()) {
              var sectionName = s.getName ? s.getName() : null;
              // Without both names the key is not unique, and a wrong key could
              // later re-hide a section that was visible all along. Reveal it,
              // but do not record it as reversible.
              if (tabName && sectionName) hidden.sections[tabName + '|' + sectionName] = true;
              s.setVisible(true);
              sections++;
            }
          } catch (e) { /* ignore */ }
        });
      } catch (e) { /* ignore */ }
    });

    eachControl(xrm, function (c) {
      if (c.getVisible && !c.getVisible()) {
        hidden.controls[c.getName()] = true;
        c.setVisible(true);
        fields++;
      }
    });

    store.hidden = hidden;
    store.hiddenOn = true;
    return { tabs: tabs, sections: sections, fields: fields };
  }

  function reHide(xrm, store) {
    var hidden = store.hidden || { tabs: {}, sections: {}, controls: {} };
    var tabs = 0, sections = 0, fields = 0;

    eachControl(xrm, function (c) {
      if (hidden.controls[c.getName()] && c.setVisible) { c.setVisible(false); fields++; }
    });

    xrm.Page.ui.tabs.forEach(function (tab) {
      var tabName = tab.getName ? tab.getName() : null;
      try {
        tab.sections.forEach(function (s) {
          try {
            var sectionName = s.getName ? s.getName() : null;
            if (!tabName || !sectionName) return;
            if (hidden.sections[tabName + '|' + sectionName]) { s.setVisible(false); sections++; }
          } catch (e) { /* ignore */ }
        });
      } catch (e) { /* ignore */ }
      try {
        if (tabName && hidden.tabs[tabName]) { tab.setVisible(false); tabs++; }
      } catch (e) { /* ignore */ }
    });

    store.hidden = { tabs: {}, sections: {}, controls: {} };
    store.hiddenOn = false;
    return { tabs: tabs, sections: sections, fields: fields };
  }

  // Every option available on the choice and two option columns on the
  // form, with the current selection marked.
  function choiceFieldValues(xrm, store) {
    var groups = [];
    var seen = {};

    eachControl(xrm, function (c) {
      var a = c.getAttribute && c.getAttribute();
      if (!a || !a.getAttributeType) return;

      var type = a.getAttributeType();
      if (type !== 'optionset' && type !== 'multiselectoptionset' && type !== 'boolean') return;

      var name = a.getName();
      if (seen[name]) return;
      seen[name] = true;

      var options = null;
      try {
        if (typeof a.getOptions === 'function') options = a.getOptions();
        else if (typeof c.getOptions === 'function') options = c.getOptions();
      } catch (e) { /* control does not expose options */ }
      if (!options || !options.length) return;

      var current = null;
      try { current = a.getValue(); } catch (e) { /* ignore */ }
      var selected = {};
      if (current !== null && current !== undefined) {
        if (current.length !== undefined && typeof current !== 'string') {
          current.forEach(function (v) { selected[v] = true; });
        } else {
          selected[current] = true;
        }
      }

      // Prefer the original label if the schema name toggle has changed it.
      var label = store.labels[c.getName()];
      if (label === undefined) {
        try { label = c.getLabel(); } catch (e) { label = name; }
      }

      groups.push({
        title: (label || name) + '  [' + name + ']',
        pairs: options.map(function (o) {
          return [
            (o.text === '' || o.text === null ? '(blank)' : o.text) + (selected[o.value] ? '  (selected)' : ''),
            String(o.value)
          ];
        })
      });
    });

    groups.sort(function (x, y) { return x.title.localeCompare(y.title); });
    return groups;
  }

  function controlSchemaName(c) {
    try {
      var a = c.getAttribute && c.getAttribute();
      if (a && a.getName) return a.getName();
    } catch (e) { /* control has no attribute */ }
    return c.getName ? c.getName() : null;
  }

  function setSchemaNames(xrm, docs, store, on) {
    var applied = [];
    eachControl(xrm, function (c) {
      if (!c.getLabel || !c.setLabel) return;
      var key = c.getName();
      var schema = controlSchemaName(c);
      if (!key || !schema) return;

      if (on) {
        if (store.labels[key] === undefined) store.labels[key] = c.getLabel();
        c.setLabel(store.labels[key] + ' [' + schema + ']');
        if (applied.indexOf(schema) === -1) applied.push(schema);
      } else if (store.labels[key] !== undefined) {
        c.setLabel(store.labels[key]);
        if (applied.indexOf(schema) === -1) applied.push(schema);
      }
    });
    if (!on) store.labels = {};
    store.schemaOn = on;
    return applied;
  }

  var SCHEMA_SUFFIX = /\[([A-Za-z0-9_]+)\]\s*$/;

  // An element's own text, ignoring text inside child elements. Matching on
  // this rather than textContent means a label that also contains an icon or a
  // required-field marker still gets picked up, and no ancestor is matched
  // twice.
  function ownText(node) {
    var text = '';
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (child.nodeType === 3) text += child.nodeValue;
    }
    return text;
  }

  // The Client API has no way to style a label, so the rendered label elements
  // are picked out by the [schemaname] suffix the toggle just added. The form
  // markup is not guaranteed to live in the same document as Xrm, so every
  // reachable document is searched. Returns the schema names actually found.
  //
  // Additive on purpose - nodes already painted are skipped rather than being
  // cleared and repainted, otherwise the repeated passes make the highlight
  // visibly flash.
  // Splits the label's text node so only the [schemaname] part, brackets
  // included, is wrapped and highlighted. The display name is left untouched.
  function wrapSchemaSuffix(node) {
    var doc = node.ownerDocument;
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (child.nodeType !== 3) continue;

      var text = child.nodeValue || '';
      if (!SCHEMA_SUFFIX.test(text)) continue;

      var start = text.lastIndexOf('[');
      if (start < 0) continue;

      var tail = child.splitText(start);
      var span = doc.createElement('span');
      span.setAttribute(MARK, 'schema');
      span.setAttribute(WRAP, '1');
      span.style.backgroundColor = T.schemaHighlight;
      span.style.borderRadius = '3px';
      span.style.padding = '0 4px';
      span.textContent = tail.nodeValue;
      if (tail.parentNode) tail.parentNode.replaceChild(span, tail);
      return true;
    }
    return false;
  }

  function highlightSchemaLabels(docs) {
    docs.forEach(function (doc) {
      var nodes = doc.querySelectorAll('*');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        // Skip the wrapper spans this function creates, or it would wrap them
        // again on the next pass.
        if (node.getAttribute(MARK)) continue;
        if (!SCHEMA_SUFFIX.test(ownText(node))) continue;
        wrapSchemaSuffix(node);
      }
    });
    return markedSchemaNames(docs);
  }

  function markedSchemaNames(docs) {
    var found = {};
    docs.forEach(function (doc) {
      var nodes = doc.querySelectorAll('[' + MARK + '="schema"]');
      for (var i = 0; i < nodes.length; i++) {
        var match = SCHEMA_SUFFIX.exec(nodes[i].textContent || '');
        if (match) found[match[1]] = true;
      }
    });
    return found;
  }

  // setLabel does not update the DOM synchronously, and the Unified Interface
  // only renders a tab once it has been opened. So the pass runs a few times
  // over the first couple of seconds, then an observer keeps painting labels as
  // they appear - which is what picks up fields on tabs opened later.
  function scheduleSchemaHighlight(docs, on, store, report) {
    if (!on) {
      stopSchemaWatch(store);
      clearHighlights(docs, 'schema');
      return;
    }
    var delays = [0, 250, 700, 1500, 2500];
    delays.forEach(function (delay, index) {
      setTimeout(function () {
        var found = highlightSchemaLabels(docs);
        if (index === delays.length - 1 && report) report(found);
      }, delay);
    });
    startSchemaWatch(docs, store);
  }

  function startSchemaWatch(docs, store) {
    stopSchemaWatch(store);
    var timer = null;
    var watchers = [];
    docs.forEach(function (doc) {
      try {
        var view = doc.defaultView;
        if (!view || !view.MutationObserver || !doc.body) return;
        var observer = new view.MutationObserver(function () {
          if (!store.schemaOn) return;
          if (timer) clearTimeout(timer);
          // Short debounce. The client re-renders labels and replaces the
          // nodes, dropping our inline styles, so a long wait here shows up as
          // a visible flash before the highlight comes back.
          timer = setTimeout(function () { highlightSchemaLabels(docs); }, 40);
        });
        // childList only. Watching attributes would fire on our own styling.
        observer.observe(doc.body, { childList: true, subtree: true });
        watchers.push(observer);
      } catch (e) { /* document not observable */ }
    });
    store.watchers = watchers;
  }

  function stopSchemaWatch(store) {
    (store.watchers || []).forEach(function (observer) {
      try { observer.disconnect(); } catch (e) { /* already gone */ }
    });
    store.watchers = [];
  }

  function clearHighlights(docs, kind) {
    var count = 0;
    docs.forEach(function (doc) {
      var nodes = doc.querySelectorAll('[' + MARK + '="' + kind + '"]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.getAttribute(WRAP)) {
          // Put the wrapped text back where it came from.
          var parent = node.parentNode;
          if (parent) {
            parent.replaceChild(doc.createTextNode(node.textContent), node);
            if (parent.normalize) parent.normalize();
          }
        } else {
          node.style.backgroundColor = '';
          node.style.borderRadius = '';
          node.style.padding = '';
          node.removeAttribute(MARK);
        }
        count++;
      }
    });
    return count;
  }

  // Field containers are matched on the data-id attribute the Unified
  // Interface renders. Not a documented contract, so this is best effort.
  function findFieldElement(docs, name) {
    var selectors = [
      '[data-id="' + name + '.fieldControl"]',
      '[data-id="' + name + '-FieldSectionItemContainer"]',
      '[data-id="' + name + '"]'
    ];
    for (var d = 0; d < docs.length; d++) {
      for (var i = 0; i < selectors.length; i++) {
        var found = null;
        try { found = docs[d].querySelector(selectors[i]); } catch (e) { /* bad selector */ }
        if (found) return found;
      }
    }
    return null;
  }

  // The field's label element, so unsaved changes can be marked the same way
  // schema names are rather than by shading the whole field container.
  function findFieldLabel(docs, controlName, displayLabel) {
    var container = findFieldElement(docs, controlName);
    if (container && container.querySelector) {
      var inside = container.querySelector('label');
      if (inside) return inside;
    }

    // The label often sits above the field control, so try the ancestors, but
    // only accept a label whose text matches - otherwise a neighbouring
    // field's label could be picked up.
    var wanted = (displayLabel || '').replace(SCHEMA_SUFFIX, '').trim();
    var parent = container ? container.parentNode : null;
    for (var up = 0; up < 3 && parent && parent.querySelectorAll; up++) {
      var near = parent.querySelectorAll('label');
      for (var n = 0; n < near.length; n++) {
        if (labelText(near[n]) === wanted) return near[n];
      }
      parent = parent.parentNode;
    }

    if (!wanted) return null;
    for (var d = 0; d < docs.length; d++) {
      var all = docs[d].querySelectorAll('label');
      for (var j = 0; j < all.length; j++) {
        if (labelText(all[j]) === wanted) return all[j];
      }
    }
    return null;
  }

  // Label text without any schema name suffix the toolkit may have added.
  function labelText(node) {
    return (node.textContent || '').replace(SCHEMA_SUFFIX, '').trim();
  }

  function highlightDirty(xrm, docs, store) {
    clearHighlights(docs, 'dirty');
    var names = [];
    var highlighted = 0;
    var seen = {};

    eachControl(xrm, function (c) {
      var a = c.getAttribute && c.getAttribute();
      if (!a || !a.getIsDirty || !a.getIsDirty()) return;
      var name = a.getName();
      if (seen[name]) return;
      seen[name] = true;
      names.push(name);

      var label = store.labels[c.getName()];
      if (label === undefined) {
        try { label = c.getLabel(); } catch (e) { label = null; }
      }

      var node = findFieldLabel(docs, c.getName(), label) || findFieldLabel(docs, name, label);
      if (node) {
        node.setAttribute(MARK, 'dirty');
        node.style.backgroundColor = T.dirtyHighlight;
        node.style.borderRadius = '3px';
        node.style.padding = '0 4px';
        highlighted++;
      }
    });

    return { names: names, highlighted: highlighted };
  }

  var ANNOTATION = '@OData.Community.Display.V1.FormattedValue';

  // Lookups come back as _fieldname_value.
  function logicalNameOf(key) {
    return /^_.+_value$/.test(key) ? key.slice(1, -6) : key;
  }

  // Every field on the table with the value this record holds for it. The
  // metadata call supplies the complete field list - a record retrieve alone
  // omits columns that are null, so it cannot tell you a field exists at all.
  function allFields(xrm, record) {
    return Promise.all([
      tableSchema(xrm, record.table),
      xrm.WebApi.retrieveRecord(record.table, record.id)
    ]).then(function (results) {
      var schema = results[0];
      var row = results[1];

      var values = {};
      Object.keys(row).forEach(function (key) {
        if (key.indexOf('@') > -1) return;
        var formatted = row[key + ANNOTATION];
        var value = formatted !== undefined ? formatted : row[key];
        if (value === null || value === undefined || value === '') return;
        if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
        values[logicalNameOf(key)] = String(value);
      });

      return schema.map(function (field) {
        var value = values[field.logical];
        return {
          logical: field.logical,
          display: field.display,
          value: value === undefined ? null : value
        };
      });
    });
  }

  /* ---------------------------------------------------------- form xml -- */

  function getFormXml(xrm, store) {
    var formId = getFormId(xrm);
    if (!formId) return Promise.reject(new Error('Could not determine the current form ID.'));
    if (store.formXml[formId]) return Promise.resolve(store.formXml[formId]);

    return xrm.WebApi.retrieveRecord('systemform', formId, '?$select=name,formxml').then(function (r) {
      var parsed = new DOMParser().parseFromString(r.formxml, 'text/xml');
      var doc = { name: r.name, xml: parsed };
      store.formXml[formId] = doc;
      return doc;
    });
  }

  function readLibraries(formXml) {
    var out = [];
    var nodes = formXml.xml.getElementsByTagName('Library');
    for (var i = 0; i < nodes.length; i++) {
      var name = nodes[i].getAttribute('name');
      if (name) out.push(name);
    }
    return out;
  }

  function readHandlers(formXml) {
    var out = [];
    var events = formXml.xml.getElementsByTagName('event');
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var evName = ev.getAttribute('name') || 'event';
      var attr = ev.getAttribute('attribute');
      var label = attr ? evName + ' (' + attr + ')' : evName;
      var handlers = ev.getElementsByTagName('Handler');
      for (var j = 0; j < handlers.length; j++) {
        var h = handlers[j];
        var fn = h.getAttribute('functionName') || '(none)';
        var lib = h.getAttribute('libraryName') || '';
        var enabled = h.getAttribute('enabled');
        var value = fn + (lib ? ' - ' + lib : '');
        if (enabled === 'false') value += ' [disabled]';
        out.push([label, value]);
      }
    }
    return out;
  }

  /* --------------------------------------------------------- web api ---- */

  // Well-known role template ID for System Administrator. Checked alongside the
  // role name because the name is localised, and the template ID is not present
  // on every deployment.
  var SYSTEM_ADMIN_TEMPLATE = '627090ff-40a3-4053-8790-584edc5be201';
  var SYSTEM_ADMIN_NAME = 'System Administrator';

  function isSystemAdministrator(xrm) {
    var ids;
    try {
      ids = xrm.Utility.getGlobalContext().userSettings.securityRoles || [];
    } catch (e) {
      return Promise.reject(new Error('your security roles could not be read'));
    }
    if (!ids.length) return Promise.resolve(false);

    var filter = '&$filter=' + ids.map(function (id) {
      return 'roleid eq ' + clean(id);
    }).join(' or ');

    function retrieve(select) {
      return xrm.WebApi.retrieveMultipleRecords('role', '?$select=' + select + filter);
    }

    // roletemplateid is a lookup, so it comes back as _roletemplateid_value.
    // Drop it and match on name alone if the column is rejected.
    return retrieve('name,_roletemplateid_value').then(null, function () {
      return retrieve('name');
    }).then(function (result) {
      return (result.entities || []).some(function (role) {
        var template = role._roletemplateid_value;
        if (template && clean(template) === SYSTEM_ADMIN_TEMPLATE) return true;
        return role.name === SYSTEM_ADMIN_NAME;
      });
    });
  }

  var AUDIT_SELECT = ['createdon', 'modifiedon', '_createdby_value', '_modifiedby_value'];
  var STATUS_SELECT = ['statecode', 'statuscode'];

  function readProperties(xrm, record) {
    function retrieve(fields) {
      return xrm.WebApi.retrieveRecord(record.table, record.id, '?$select=' + fields.join(','));
    }
    // Not every table has statecode/statuscode, so drop them and retry if the
    // first call is rejected for an unknown property.
    return retrieve(AUDIT_SELECT.concat(STATUS_SELECT)).then(null, function () {
      return retrieve(AUDIT_SELECT);
    });
  }

  function display(row, field) {
    var formatted = row[field + '@OData.Community.Display.V1.FormattedValue'];
    if (formatted !== undefined && formatted !== null && formatted !== '') return formatted;
    var raw = row[field];
    if (raw === undefined || raw === null || raw === '') return '-';
    return String(raw);
  }

  // Business rules are Processes with category 2. The Client API does not
  // expose them, so this lists the rules for the table rather than strictly
  // those bound to the current form.
  function readBusinessRules(xrm, record) {
    var filter = "&$filter=category eq 2 and primaryentity eq '" + record.table + "'&$orderby=name";
    function retrieve(select) {
      return xrm.WebApi.retrieveMultipleRecords('workflow', '?$select=' + select + filter);
    }
    return retrieve('name,statecode,formid').then(null, function () {
      return retrieve('name,statecode');
    });
  }

  // Xrm.Utility.getEntityMetadata only returns attributes you already know the
  // names of, and a record retrieve omits columns that are null, so neither can
  // list a whole table. The metadata endpoint can. Same origin, same session.
  function readLabel(displayName) {
    if (!displayName) return '';
    var user = displayName.UserLocalizedLabel;
    if (user && user.Label) return user.Label;

    // Fall back to any label that exists. UserLocalizedLabel is only populated
    // when the label has been defined in the user's own language, so custom
    // fields labelled in one language only come back empty without this.
    var all = displayName.LocalizedLabels;
    if (all && all.length) {
      for (var i = 0; i < all.length; i++) {
        if (all[i] && all[i].Label) return all[i].Label;
      }
    }
    return '';
  }

  // Raw GET against the Web API for the things Xrm.WebApi cannot reach: the
  // metadata endpoint, and count queries that need a Prefer header. Same
  // origin and same session, so the ambient authentication applies.
  function apiGet(xrm, path, prefer) {
    var request = (typeof fetch === 'function') ? fetch : null;
    if (!request) {
      return Promise.reject(new Error('this browser does not support the metadata request'));
    }

    var headers = {
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    };
    if (prefer) headers.Prefer = prefer;

    var url = xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/' + API_VERSION + path;

    return request(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: headers
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('metadata request returned ' + response.status);
      }
      return response.json();
    });
  }

  function tableSchema(xrm, table) {
    return apiGet(xrm, "/EntityDefinitions(LogicalName='" + table + "')/Attributes" +
      '?$select=LogicalName,DisplayName').then(function (data) {
      var out = [];
      (data.value || []).forEach(function (attribute) {
        var logical = attribute.LogicalName;
        if (!logical) return;
        out.push({
          logical: logical,
          display: readLabel(attribute.DisplayName)
        });
      });
      out.sort(function (x, y) {
        return String(x.display || x.logical).toLowerCase()
          .localeCompare(String(y.display || y.logical).toLowerCase());
      });
      return out;
    });
  }

  function webApiUrl(xrm, record) {
    return xrm.Utility.getEntityMetadata(record.table).then(function (meta) {
      var base = xrm.Utility.getGlobalContext().getClientUrl();
      return base + '/api/data/' + API_VERSION + '/' + meta.EntitySetName + '(' + record.id + ')';
    });
  }

  /* ------------------------------------------------------- relationships --- */

  // Only the relationships that hold a countable collection of records are
  // listed. N:1 is deliberately left out: it is the lookups on this record, so
  // the count is always nought or one, and the value is already in Show all
  // fields. Nothing is filtered on IsValidForAdvancedFind - which relationships
  // are worth looking at is decided by whether they hold records, not by
  // whether a maker exposed them to Advanced Find.
  var ONE_TO_MANY_SELECT = 'SchemaName,ReferencingEntity,ReferencingAttribute,' +
    'ReferencedEntityNavigationPropertyName';
  var MANY_TO_MANY_SELECT = 'SchemaName,Entity1LogicalName,Entity2LogicalName,' +
    'Entity1NavigationPropertyName,Entity2NavigationPropertyName';

  // Dataverse stops counting at this many rows for a standard table and says so
  // in an annotation, rather than returning the real total.
  var COUNT_CAP = 5000;
  var COUNT_PREFER = 'odata.maxpagesize=1,odata.include-annotations=' +
    '"Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded"';
  // Requests in flight at once. A table like Incident has dozens of
  // relationships and each count is its own request, so they are not all fired
  // at the same moment.
  var COUNT_LANES = 4;

  function relationshipSet(xrm, table, collection, select) {
    var base = "/EntityDefinitions(LogicalName='" + table + "')/" + collection;
    // A rejected $select would take the whole listing down with it, and the
    // unselected response is only larger, not different.
    return apiGet(xrm, base + '?$select=' + select).then(null, function () {
      return apiGet(xrm, base);
    }).then(function (data) {
      return data.value || [];
    });
  }

  // Read per table rather than per record, so it is cached on the store and
  // reused when the panel is opened on another record of the same table.
  function readRelationships(xrm, store, table) {
    if (store.relationships[table]) return Promise.resolve(store.relationships[table]);

    return Promise.all([
      relationshipSet(xrm, table, 'OneToManyRelationships', ONE_TO_MANY_SELECT),
      relationshipSet(xrm, table, 'ManyToManyRelationships', MANY_TO_MANY_SELECT)
    ]).then(function (results) {
      var list = [];

      results[0].forEach(function (r) {
        // The collection valued navigation property on this side of the
        // relationship. Without it there is nothing to count against.
        if (!r.ReferencedEntityNavigationPropertyName) return;
        list.push({
          kind: '1:N',
          table: r.ReferencingEntity || '',
          nav: r.ReferencedEntityNavigationPropertyName,
          navAlt: '',
          schema: r.SchemaName || r.ReferencedEntityNavigationPropertyName,
          via: r.ReferencingAttribute || ''
        });
      });

      results[1].forEach(function (r) {
        var isFirst = r.Entity1LogicalName === table;
        var other = isFirst ? r.Entity2LogicalName : r.Entity1LogicalName;
        var nav = isFirst ? r.Entity1NavigationPropertyName : r.Entity2NavigationPropertyName;
        var alt = isFirst ? r.Entity2NavigationPropertyName : r.Entity1NavigationPropertyName;
        if (!nav && !alt) return;
        list.push({
          kind: 'N:N',
          table: other || '',
          nav: nav || alt,
          // Which of the two navigation property names reaches the other side
          // from this one is not stated unambiguously by the metadata, and a
          // self-referential relationship has a valid name at both ends. The
          // count falls back to this one if the first is rejected.
          navAlt: alt || nav,
          schema: r.SchemaName || nav || alt,
          via: ''
        });
      });

      store.relationships[table] = list;
      return list;
    });
  }

  // Display names for the related tables. Asked for by name rather than pulling
  // the whole catalogue, which is a large response for a handful of labels.
  function tableDisplayNames(xrm, tables) {
    if (!tables.length) return Promise.resolve({});

    function collect(rows) {
      var map = {};
      (rows || []).forEach(function (row) {
        var label = readLabel(row.DisplayName);
        if (row.LogicalName && label) map[row.LogicalName] = label;
      });
      return map;
    }

    function everyTable() {
      return apiGet(xrm, '/EntityDefinitions?$select=LogicalName,DisplayName')
        .then(function (d) { return collect(d.value); }, function () { return {}; });
    }

    var chunks = [];
    for (var i = 0; i < tables.length; i += 40) chunks.push(tables.slice(i, i + 40));

    return Promise.all(chunks.map(function (chunk) {
      var filter = chunk.map(function (t) {
        return "LogicalName eq '" + t + "'";
      }).join(' or ');
      return apiGet(xrm, '/EntityDefinitions?$select=LogicalName,DisplayName&$filter=' +
        encodeURIComponent(filter)).then(function (d) { return d.value || []; },
        function () { return null; });
    })).then(function (results) {
      var map = {};
      var refused = false;
      results.forEach(function (rows) {
        if (rows === null) { refused = true; return; }
        var part = collect(rows);
        for (var k in part) {
          if (Object.prototype.hasOwnProperty.call(part, k)) map[k] = part[k];
        }
      });
      // $filter support on the metadata endpoint is narrower than on table
      // data, so falling back to the whole catalogue keeps the display names
      // rather than dropping the listing to logical names.
      if (refused && !Object.keys(map).length) return everyTable();
      return map;
    });
  }

  function countRelated(xrm, entitySet, id, rel) {
    function ask(nav) {
      return apiGet(xrm, '/' + entitySet + '(' + id + ')/' + nav + '?$count=true', COUNT_PREFER);
    }
    return ask(rel.nav).then(null, function (e) {
      if (!rel.navAlt || rel.navAlt === rel.nav) throw e;
      return ask(rel.navAlt);
    }).then(function (data) {
      var count = data['@odata.count'];
      return {
        count: typeof count === 'number' ? count : null,
        capped: data['@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded'] === true
      };
    });
  }

  // Runs the worker over the items a few at a time. A rejected item does not
  // stop the queue - each row reports its own failure.
  function throttle(items, limit, worker) {
    var next = 0;
    function pump() {
      if (next >= items.length) return Promise.resolve();
      var item = items[next++];
      return Promise.resolve().then(function () {
        return worker(item);
      }).then(pump, pump);
    }
    var lanes = [];
    for (var i = 0; i < Math.min(limit, items.length); i++) lanes.push(pump());
    return Promise.all(lanes);
  }

  // The related table's display name is the label, because a relationship
  // schema name is long and says little. Where two relationships reach the same
  // table the name alone is ambiguous, so only those rows carry the lookup
  // column that separates them.
  function labelRelationships(list, names) {
    var seen = {};
    list.forEach(function (rel) {
      rel.label = names[rel.table] || rel.table || rel.schema;
      seen[rel.label] = (seen[rel.label] || 0) + 1;
    });
    list.forEach(function (rel) {
      if (seen[rel.label] < 2) return;
      rel.label = rel.label + ' (' + (rel.via || rel.schema) + ')';
    });
    list.sort(function (x, y) {
      return String(x.label).toLowerCase().localeCompare(String(y.label).toLowerCase());
    });
    return list;
  }

  /* ------------------------------------------------------------- styling --- */

  // Applied through the CSSOM rather than inline style attributes or a style
  // block, so an enforced Content Security Policy does not affect it.
  function style(node, props) {
    for (var k in props) {
      if (Object.prototype.hasOwnProperty.call(props, k)) node.style[k] = props[k];
    }
    return node;
  }

  function el(doc, tag, props, text) {
    var node = doc.createElement(tag);
    if (props) style(node, props);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Background, and optionally the border with it. Buttons in the light theme
  // are white cards that pick up a blue edge on hover, so one without the
  // other would only be half the state.
  function hover(node, from, to, fromBorder, toBorder) {
    node.onmouseenter = function () {
      if (node.disabled) return;
      node.style.background = to;
      if (toBorder) node.style.borderColor = toBorder;
    };
    node.onmouseleave = function () {
      node.style.background = from;
      if (fromBorder) node.style.borderColor = fromBorder;
    };
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svg(doc, paths) {
    var s = doc.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 16 16');
    s.setAttribute('width', '16');
    s.setAttribute('height', '16');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.4');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    paths.forEach(function (d) {
      var p = doc.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', d);
      s.appendChild(p);
    });
    return s;
  }

  // Toolkit mark - the team's toolbox: an open case with a ring spanner and a
  // screwdriver standing in it, and SDT across the front.
  //
  // Two things carry the toolbox read, and the mark loses it without them: the
  // case is WIDE and squat rather than square, and its bottom is flat with
  // vertical sides. Tapering the body turns it back into a bin, which is what
  // v2.2.1 did. The tools are drawn first and the rim is drawn over them, so
  // only the part of each tool above the rim shows - everything is the same
  // white, and the rim is what makes them read as standing in the case rather
  // than lying on it. Nothing may be drawn between them.
  //
  // Built element by element rather than from a markup string: the toolkit is
  // injected into pages with a content security policy, and nothing here may
  // depend on parsing HTML.
  function logo(doc) {
    var s = doc.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', '26');
    s.setAttribute('height', '26');
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'SDT D365 Toolkit');

    var ink = T.headerTile;

    function add(parent, name, attrs) {
      var node = doc.createElementNS(SVG_NS, name);
      for (var key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) node.setAttribute(key, attrs[key]);
      }
      parent.appendChild(node);
      return node;
    }

    // The tools, each leaning out from the middle of the case.
    var tools = add(s, 'g', { fill: T.headerText });

    var spanner = add(tools, 'g', { transform: 'rotate(13 15 7)' });
    add(spanner, 'rect', { x: '14', y: '4.9', width: '2', height: '5.8', rx: '1' });
    add(spanner, 'path', { d: 'M15 1.9a2.5 2.5 0 0 1 1.55 4.46L16.55 7h-3.1l0-0.64A2.5 2.5 0 0 1 15 1.9Z' });

    var driver = add(tools, 'g', { transform: 'rotate(-13 9 7)' });
    add(driver, 'rect', { x: '7.55', y: '2.6', width: '2.9', height: '4.3', rx: '1.2' });
    add(driver, 'rect', { x: '8.55', y: '6.6', width: '0.9', height: '4.1' });

    // The hole that turns the spanner head from a blob into a ring, in the same
    // rotated frame the head was drawn in.
    var eye = add(s, 'g', { transform: 'rotate(13 15 7)', fill: ink });
    add(eye, 'circle', { cx: '15', cy: '4.3', r: '1.05' });

    // Rim, then the case front. Drawn after the tools, so they are cut off at
    // the rim rather than running down behind the lettering.
    add(s, 'rect', { x: '1.9', y: '9.5', width: '20.2', height: '2.4', rx: '0.9', fill: T.headerText });
    add(s, 'rect', { x: '2.9', y: '11.6', width: '18.2', height: '9', rx: '1.4', fill: T.headerText });

    // Cut out of the case front. textLength pins the width whatever font the
    // host resolves, so the lettering cannot grow wider than the case.
    var text = add(s, 'text', {
      x: '12', y: '18.6', 'text-anchor': 'middle',
      'font-family': '"Segoe UI", system-ui, -apple-system, sans-serif',
      'font-size': '6.8', 'font-weight': '700',
      textLength: '12.4', lengthAdjust: 'spacingAndGlyphs',
      fill: ink
    });
    text.appendChild(doc.createTextNode('SDT'));

    return s;
  }

  var ICON = {
    copy: ['M6 6h7v7h-7z', 'M10.5 6V3.5h-7v7H6'],
    refresh: ['M13 8A5 5 0 1 1 8 3', 'M8 0.9L10.8 3L8 5.1'],
    close: ['M4 4l8 8', 'M12 4l-8 8'],
    // warning triangle
    warning: ['M8 2.4L14.6 13.6H1.4z', 'M8 6.6v3.3', 'M8 11.7h.01'],
    // chevrons for the collapsible notices block
    chevronDown: ['M4.4 6.4L8 10l3.6-3.6'],
    chevronUp: ['M4.4 9.6L8 6l3.6 3.6'],
    // shield, marking the block that explains what the tool does with data
    shield: ['M8 2.1l4.9 1.9v3.6c0 3-2.1 5.2-4.9 6.3-2.8-1.1-4.9-3.3-4.9-6.3V4z'],
    // corner grip - diagonals running the way the panel grows
    grip: ['M13 5.5L5.5 13', 'M13 9.6L9.6 13'],
    // minimise - a single rule where the bottom of the panel will be
    minimise: ['M3.6 11.8h8.8'],
    // expand - the same rule with the panel dropping back down onto it
    expand: ['M3.6 12.6h8.8', 'M8 3.2v6.2', 'M5.3 6.7L8 9.4l2.7-2.7']
  };

  // Action icons. Stroke only, 16x16, so they inherit the button text colour.
  var ACTION_ICON = {
    // open padlock
    unlock: ['M3.9 7.4h8.2v6H3.9z', 'M6.1 7.4V5.1a2.7 2.7 0 0 1 5.4 0'],
    // asterisk struck through
    optional: ['M8 4.4v7.2', 'M4.9 6.2l6.2 3.6', 'M11.1 6.2l-6.2 3.6', 'M2.9 13.1L13.1 2.9'],
    // eye
    show: ['M1.8 8s2.4-4.1 6.2-4.1S14.2 8 14.2 8s-2.4 4.1-6.2 4.1S1.8 8 1.8 8z', 'M8 6.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z'],
    // tag
    schema: ['M2.9 8.5V3.5a.6.6 0 0 1 .6-.6h5l5.1 5.1a.9.9 0 0 1 0 1.2l-4.4 4.4a.9.9 0 0 1-1.2 0L2.9 8.5z', 'M5.5 5.5h.01'],
    // pencil
    dirty: ['M11.4 2.7l1.9 1.9-7.3 7.3-2.6.7.7-2.6 7.3-7.3z', 'M10.1 4l1.9 1.9'],
    // bulleted list
    values: ['M6 4.4h7.2', 'M6 8h7.2', 'M6 11.6h7.2', 'M3.3 4.4h.01', 'M3.3 8h.01', 'M3.3 11.6h.01'],
    // info circle
    properties: ['M8 2.3a5.7 5.7 0 1 0 0 11.4 5.7 5.7 0 0 0 0-11.4z', 'M8 7.5v3.4', 'M8 5.3h.01'],
    // decision diamond
    rules: ['M8 2.5l3.2 3.2L8 8.9 4.8 5.7z', 'M8 8.9v2.2', 'M4.4 13.3h7.2'],
    // curly braces
    libraries: ['M6.2 3.1C4.9 3.1 5.3 7 3.7 8c1.6 1 1.2 4.9 2.5 4.9', 'M9.8 3.1c1.3 0 .9 3.9 2.5 4.9-1.6 1-1.2 4.9-2.5 4.9'],
    // lightning bolt
    events: ['M9.1 2.2L4.4 9.1h3.3l-.6 4.7L11.9 7H8.6z'],
    // list with a tick
    options: ['M3 4.6h6.4', 'M3 8h6.4', 'M3 11.4h4', 'M10.4 11.9l1.6 1.6 3-3.4'],
    // table
    table: ['M2.5 3.5h11v9h-11z', 'M2.5 6.5h11', 'M6.6 6.5v6'],
    // one box branching to two below it
    related: ['M6.2 2.2h3.6v2.6H6.2z', 'M8 4.8v2.6', 'M3.8 7.4h8.4',
      'M3.8 7.4v1.8', 'M12.2 7.4v1.8', 'M2 9.2h3.6v2.6H2z', 'M10.4 9.2h3.6v2.6h-3.6z'],
    // external link
    external: ['M9.4 3.2h3.4v3.4', 'M12.8 3.2L7.5 8.5', 'M12.2 9.4v3a1.4 1.4 0 0 1-1.4 1.4H3.9a1.4 1.4 0 0 1-1.4-1.4V5.5a1.4 1.4 0 0 1 1.4-1.4h3']
  };

  /* ------------------------------------------------------------------ UI --- */

  // Square control holding nothing but an icon. The same button appears on the
  // dark header and on the white context bar, so the colours are passed in
  // rather than assumed.
  function iconButton(doc, icon, tooltip, handler, opts) {
    var o = opts || {};
    var size = o.size || '28px';
    var resting = o.background || 'transparent';
    var b = el(doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      width: size,
      height: size,
      padding: '0',
      background: resting,
      color: o.color || T.textMuted,
      border: '1px solid ' + (o.border || 'transparent'),
      borderRadius: o.radius || '7px',
      cursor: 'pointer'
    });
    b.title = tooltip;
    b.appendChild(svg(doc, icon));
    b.onmouseenter = function () {
      if (b.disabled) return;
      b.style.background = o.hoverBackground || T.bgHover;
      if (o.hoverColor) b.style.color = o.hoverColor;
      if (o.hoverBorder) b.style.borderColor = o.hoverBorder;
    };
    b.onmouseleave = function () {
      b.style.background = resting;
      b.style.color = o.color || T.textMuted;
      b.style.borderColor = o.border || 'transparent';
    };
    b.onclick = handler;
    return b;
  }

  // A one line confirmation - "Copied to clipboard." - shown in the row of the
  // control that produced it, immediately to its left. Hidden when empty so it
  // takes no room at all in that row.
  function noteSlot(doc) {
    var n = el(doc, 'span', {
      display: 'none',
      flex: '0 1 auto',
      minWidth: '0',
      fontSize: '12px',
      color: T.textMuted,
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, '');
    n.setAttribute('data-sdt', 'note');
    return n;
  }

  function labelled(doc, prefix, valueProps, prefixProps) {
    var wrap = el(doc, 'div', { color: T.text, wordBreak: 'break-all' });
    wrap.appendChild(el(doc, 'span', prefixProps || { fontWeight: '600' }, prefix));
    var value = el(doc, 'span', valueProps || {}, '');
    wrap.appendChild(value);
    return { wrap: wrap, value: value };
  }

  function build(doc, win) {
    var old = doc.getElementById(PANEL_ID);
    if (old) old.parentNode.removeChild(old);

    // A fixed size window rather than a panel that grows with its content.
    // The header, the record it is acting on and the status line stay put
    // while everything between them scrolls, so it is always clear which
    // record an action applied to.
    // Two offsets - one above, one below - taken off the window height, so the
    // panel is as tall as the space allows.
    var gutter = (parseFloat(T.offset) * 2) + 'px';
    var store = getStore(win);

    var panel = el(doc, 'div', {
      position: 'fixed',
      top: T.offset,
      right: T.offset,
      zIndex: '2147483647',
      display: 'flex',
      flexDirection: 'column',
      width: T.width,
      maxWidth: 'calc(100vw - ' + gutter + ')',
      height: 'calc(100vh - ' + gutter + ')',
      maxHeight: 'calc(100vh - ' + gutter + ')',
      boxSizing: 'border-box',
      overflow: 'hidden',
      background: T.bg,
      color: T.text,
      border: '1px solid ' + T.lineStrong,
      borderRadius: T.radius,
      boxShadow: '0 30px 70px -14px rgba(11,26,45,0.5), 0 10px 24px -8px rgba(11,26,45,0.28)',
      font: T.font,
      lineHeight: '1.5'
    });
    panel.id = PANEL_ID;

    // Minimised, everything below the header is hidden and the panel is only
    // as tall as that header. Declared here because the geometry helpers below
    // have to know not to write a height while it is true.
    var collapsed = false;
    var minimiseButton = null;

    // A box the user dragged or resized to is kept on the window, so re-running
    // the bookmarklet does not throw it away. An untouched panel is left to its
    // default styles - top right, full height - rather than pinned in pixels.
    if (store.panelLeft != null) applyGeometry(geometry());

    /* ------------------------------------------------------------ header -- */

    var header = el(doc, 'div', {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '13px',
      padding: '16px 18px 14px',
      background: T.header,
      color: T.headerText,
      // The header is the drag handle. Selecting the title text mid drag would
      // leave a highlight behind, and touch scrolling would fight the pointer.
      cursor: 'move',
      userSelect: 'none',
      touchAction: 'none'
    });
    header.setAttribute('data-sdt', 'header');
    header.title = 'Drag to move the panel';

    // The mark sits in a rounded tile rather than carrying its own badge.
    var tile = el(doc, 'div', {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: T.headerTile,
      border: '1px solid ' + T.headerTileLine
    });
    tile.appendChild(logo(doc));

    var titles = el(doc, 'div', { flex: '1 1 auto', minWidth: '0' });
    titles.appendChild(el(doc, 'div', {
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      lineHeight: '1.25',
      color: T.headerMuted
    }, 'Solutions Delivery Team'));
    titles.appendChild(el(doc, 'div', {
      fontSize: '19px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      lineHeight: '1.25',
      marginTop: '2px'
    }, 'Dynamics 365 Toolkit'));

    header.appendChild(tile);
    header.appendChild(titles);

    minimiseButton = iconButton(doc, ICON.minimise, 'Minimise', function () {
      setCollapsed(!collapsed);
    }, {
      size: '30px',
      radius: '8px',
      color: '#c4d8ea',
      hoverBackground: T.headerHover,
      hoverColor: T.headerText
    });
    minimiseButton.setAttribute('data-sdt', 'minimise');
    minimiseButton.setAttribute('aria-label', 'Minimise');
    minimiseButton.setAttribute('aria-expanded', 'true');
    header.appendChild(minimiseButton);

    header.appendChild(iconButton(doc, ICON.close, 'Close', function () {
      teardown();
      if (panel.parentNode) panel.parentNode.removeChild(panel);
    }, {
      size: '30px',
      radius: '8px',
      color: '#c4d8ea',
      hoverBackground: T.headerHover,
      hoverColor: T.headerText
    }));

    /* ------------------------------------------------------- record card -- */

    // The record the toolkit is pointed at. White, directly under the header,
    // so it reads as the subject of everything below rather than as one more
    // block of content.
    var card = el(doc, 'div', {
      flex: '0 0 auto',
      padding: '11px 18px 12px',
      background: T.bgCard,
      borderBottom: '1px solid ' + T.line
    });
    card.setAttribute('data-sdt', 'record');

    // Record name, then the table name as a pill beside it, then refresh.
    var nameRow = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    });
    var name = el(doc, 'div', {
      flex: '0 1 auto',
      minWidth: '0',
      fontSize: '14.5px',
      fontWeight: '600',
      color: T.text,
      lineHeight: '1.3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, '');
    var tablePill = el(doc, 'span', {
      flex: '0 1 auto',
      minWidth: '0',
      fontSize: '11.5px',
      color: T.textMuted,
      background: '#eaeef2',
      borderRadius: '20px',
      padding: '2px 9px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, '');
    tablePill.title = 'Table name';
    var refreshHolder = el(doc, 'div', { display: 'flex', flexShrink: '0' });
    // Right hand end of the row, left of the refresh control, so the
    // confirmation reads as coming from the button that was just pressed.
    var noteRefresh = noteSlot(doc);
    nameRow.appendChild(name);
    nameRow.appendChild(tablePill);
    nameRow.appendChild(el(doc, 'span', { flex: '1 1 auto' }));
    nameRow.appendChild(noteRefresh);
    nameRow.appendChild(refreshHolder);

    var idRow = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px'
    });
    idRow.appendChild(el(doc, 'span', {
      flexShrink: '0',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.03em',
      color: T.textFaint
    }, 'RECORD ID'));
    var id = el(doc, 'span', {
      flex: '1 1 auto',
      minWidth: '0',
      font: T.mono,
      color: '#3d454d',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'all'
    }, '');
    var copyHolder = el(doc, 'div', { display: 'flex', flexShrink: '0' });
    // Same again for the copy control. The ID shrinks to make room, and gives
    // it back the moment the message is cleared.
    var noteCopy = noteSlot(doc);
    idRow.appendChild(id);
    idRow.appendChild(noteCopy);
    idRow.appendChild(copyHolder);

    card.appendChild(nameRow);
    card.appendChild(idRow);

    /* ------------------------------------------------------ scroll region -- */

    var scrollWrap = el(doc, 'div', {
      position: 'relative',
      flex: '1 1 auto',
      minHeight: '0'
    });

    // How far down the actions you are. Two pixels, at the top of the scroll
    // region, so it never competes with the content.
    var progressTrack = el(doc, 'div', {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '2px',
      background: T.bgSunken,
      zIndex: '3',
      pointerEvents: 'none'
    });
    var progressBar = el(doc, 'div', {
      height: '100%',
      width: '0%',
      background: T.accent,
      borderRadius: '0 2px 2px 0',
      transition: 'width 0.1s linear'
    });
    progressTrack.appendChild(progressBar);

    var scroll = el(doc, 'div', {
      height: '100%',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      padding: '16px ' + T.pad + ' 26px',
      boxSizing: 'border-box'
    });
    scroll.setAttribute('data-sdt', 'scroll');

    // Sections are appended here, each with its own grid.
    var actions = el(doc, 'div', {});
    actions.setAttribute('data-sdt', 'actions');

    // Only drawn when there is output under it, so an empty output area does
    // not leave a rule floating below the last action.
    var divider = el(doc, 'div', {
      display: 'none',
      height: '1px',
      background: T.line,
      margin: '4px 0 14px'
    });
    var output = el(doc, 'div', { fontSize: '12.5px', color: T.text });
    output.setAttribute('data-sdt', 'output');

    /* --------------------------------------------------------- about box -- */

    // The standing notices, folded away. They have to be readable, but they
    // are read once and then they are in the way of the actions.
    var about = el(doc, 'div', {
      marginTop: '20px',
      border: '1px solid ' + T.line,
      borderRadius: '10px',
      background: T.bgAbout,
      overflow: 'hidden'
    });
    about.setAttribute('data-sdt', 'about');

    var aboutBody = el(doc, 'div', {
      display: 'none',
      padding: '2px 14px 14px',
      fontSize: '12.5px',
      lineHeight: '1.5',
      color: T.textMuted
    });
    aboutBody.appendChild(el(doc, 'div', {},
      'This tool is only accessible to users with a System Administrator security role.'));
    aboutBody.appendChild(el(doc, 'div', { marginTop: '9px' },
      'This tool has not been accessibility tested. Its features only provide shortcuts to ' +
      'functionality that is already available by other means.'));
    aboutBody.appendChild(el(doc, 'div', { marginTop: '9px' },
      'This tool does not store or save any data. It reads from the form and from Dataverse ' +
      'using your own permissions, writes nothing back, and sends nothing to any other system. ' +
      'Everything it changes is undone by refreshing the page.'));

    var aboutToggle = el(doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 13px',
      background: 'transparent',
      color: T.textMuted,
      border: '0',
      cursor: 'pointer',
      font: T.font,
      fontWeight: '600',
      textAlign: 'left'
    });
    var shield = svg(doc, ICON.shield);
    shield.style.flexShrink = '0';
    shield.style.color = T.textFaint;
    aboutToggle.appendChild(shield);
    aboutToggle.appendChild(el(doc, 'span', {}, 'About this tool and your data'));
    aboutToggle.appendChild(el(doc, 'span', { flex: '1 1 auto' }));
    var chevron = el(doc, 'span', { display: 'flex', color: T.textFaint, flexShrink: '0' });
    chevron.appendChild(svg(doc, ICON.chevronDown));
    aboutToggle.appendChild(chevron);
    hover(aboutToggle, 'transparent', '#f2f5f7');

    var aboutOpen = false;
    aboutToggle.onclick = function () {
      aboutOpen = !aboutOpen;
      aboutBody.style.display = aboutOpen ? 'block' : 'none';
      chevron.textContent = '';
      chevron.appendChild(svg(doc, aboutOpen ? ICON.chevronUp : ICON.chevronDown));
      aboutToggle.setAttribute('aria-expanded', aboutOpen ? 'true' : 'false');
      measure();
    };
    aboutToggle.setAttribute('aria-expanded', 'false');
    aboutToggle.title = 'What this tool needs, and what it does with your data';

    about.appendChild(aboutToggle);
    about.appendChild(aboutBody);

    scroll.appendChild(actions);
    scroll.appendChild(divider);
    scroll.appendChild(output);
    scroll.appendChild(about);

    /* ------------------------------------------------------ scroll hints -- */

    // There is nearly always more below the fold, and nothing else on a fixed
    // height panel says so. The fade plus the arrow do, and the arrow scrolls
    // when clicked rather than only pointing.
    var moreWrap = el(doc, 'div', {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      height: '74px',
      display: 'none',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '10px',
      pointerEvents: 'none',
      zIndex: '2',
      background: 'linear-gradient(to top, ' + T.bg + ' 24%, rgba(238,242,246,0.86) 58%, rgba(238,242,246,0))'
    });

    var moreButton = iconButton(doc, ICON.chevronDown, 'Scroll for more actions', function () {
      scroll.scrollBy
        ? scroll.scrollBy({ top: scroll.clientHeight * 0.82, behavior: 'smooth' })
        : (scroll.scrollTop += scroll.clientHeight * 0.82);
    }, {
      size: '28px',
      radius: '50%',
      background: T.bgCard,
      border: '#d3dce4',
      color: '#5c7183',
      hoverBackground: T.bgCard,
      hoverColor: T.accent,
      hoverBorder: T.buttonHoverLine
    });
    style(moreButton, {
      pointerEvents: 'auto',
      boxShadow: '0 2px 6px rgba(16,24,40,0.1)'
    });
    moreButton.setAttribute('aria-label', 'Scroll for more actions');
    moreWrap.appendChild(moreButton);

    // A nudge, so it reads as an invitation rather than as decoration. Through
    // the animation API rather than a stylesheet, which a content security
    // policy could refuse.
    try {
      if (moreButton.animate) {
        moreButton.animate(
          [{ transform: 'translateY(0)' }, { transform: 'translateY(3px)' }, { transform: 'translateY(0)' }],
          { duration: 1800, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
    } catch (e) { /* no animation support */ }

    scrollWrap.appendChild(progressTrack);
    scrollWrap.appendChild(scroll);
    scrollWrap.appendChild(moreWrap);

    /* ------------------------------------------------------------ status -- */

    var footer = el(doc, 'div', {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '9px 16px',
      borderTop: '1px solid ' + T.lineStrong,
      background: T.bgSunken,
      fontSize: '12.5px',
      color: T.textMuted
    });
    footer.setAttribute('data-sdt', 'status');

    var dot = el(doc, 'span', {
      flexShrink: '0',
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: T.accent
    });
    var statusText = el(doc, 'span', {
      flex: '1 1 auto',
      minWidth: '0',
      color: '#3d454d',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, '');
    statusText.setAttribute('data-sdt', 'message');
    footer.appendChild(dot);
    footer.appendChild(statusText);
    footer.appendChild(el(doc, 'span', {
      flexShrink: '0',
      fontSize: '11px',
      color: '#616a74',
      // Clear of the resize grip in the corner.
      paddingRight: '14px'
    }, VERSION));

    // Everything the minimise control hides, with the display each part is
    // put back to. Read now rather than at click time, so a part that was
    // already display:none for its own reasons is not resurrected.
    var BODY = [card, scrollWrap, footer].map(function (node) {
      return { node: node, display: node.style.display || '' };
    });

    /* ------------------------------------------------------ geometry -- */

    // Until the panel is first touched it is laid out by its own styles: top
    // right corner, calc() height. The moment it is dragged or resized it is
    // pinned to explicit left, top, width and height in pixels, anchored by
    // its TOP LEFT corner. That is what makes the grip in the bottom right
    // behave the way a window corner is expected to: dragging it moves the
    // bottom and right edges and leaves the other two where they are.

    var GAP = parseFloat(T.offset);

    // The current box, from the store where the user has set it and from the
    // measured element otherwise. Falls back to the default styles when there
    // has been no layout, so it is still meaningful before the panel is in the
    // document.
    function geometry() {
      var root = doc.documentElement;
      var box = panel.getBoundingClientRect();
      var laid = !!box.width;
      var w = store.panelWidth || (laid ? box.width : parseFloat(T.width));
      var h = store.panelHeight ||
        (laid ? box.height : Math.max(T.minHeight, (root.clientHeight || 0) - GAP * 2));
      return {
        left: (store.panelLeft != null) ? store.panelLeft
          : (laid ? box.left : Math.max(0, (root.clientWidth || 0) - w - GAP)),
        top: (store.panelTop != null) ? store.panelTop : (laid ? box.top : GAP),
        width: w,
        height: h
      };
    }

    // Writes the box out and remembers it. The max-width and max-height set in
    // the default styles are relative to the window, not to where the panel
    // now is, so they are dropped once the box is explicit - the clamps below
    // do that job instead.
    function applyGeometry(g) {
      store.panelLeft = g.left;
      store.panelTop = g.top;
      store.panelWidth = g.width;
      store.panelHeight = g.height;
      panel.style.left = g.left + 'px';
      panel.style.top = g.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.width = g.width + 'px';
      panel.style.maxWidth = 'none';
      panel.style.maxHeight = 'none';
      // Minimised, the panel is only as tall as its header. The expanded height
      // is still remembered above, and written back when it is expanded again.
      if (!collapsed) panel.style.height = g.height + 'px';
    }

    // Top left is the anchor, so the room to grow into runs from that corner to
    // the bottom and right edges of the window, less the gap the panel keeps
    // from every edge. A panel sitting against the right hand gutter therefore
    // has no room to widen until it is moved left, which is how a window
    // behaves.
    function sizeTo(w, h) {
      var root = doc.documentElement;
      var g = geometry();
      var maxW = Math.max(T.minWidth, (root.clientWidth || 0) - g.left - GAP);
      var maxH = Math.max(T.minHeight, (root.clientHeight || 0) - g.top - GAP);
      g.width = Math.min(maxW, Math.max(T.minWidth, w));
      g.height = Math.min(maxH, Math.max(T.minHeight, h));
      applyGeometry(g);
      scheduleMeasure();
    }

    // Clamped so the whole panel stays on screen. Letting it run off the bottom
    // would take the status line and the resize grip with it, off the right
    // would take the close button, and off the left would take the header.
    function moveTo(left, top) {
      var root = doc.documentElement;
      var g = geometry();
      // Minimised, the panel on screen is the height of its header, not the
      // height it will return to, so that is what the bottom clamp uses.
      var box = panel.getBoundingClientRect();
      var h = collapsed ? (box.height || g.height) : g.height;
      g.left = Math.min(Math.max(0, (root.clientWidth || 0) - g.width), Math.max(0, left));
      g.top = Math.min(Math.max(0, (root.clientHeight || 0) - h), Math.max(0, top));
      applyGeometry(g);
    }

    /* -------------------------------------------------------- minimise -- */

    // Out of the way without being closed: the dark header stays, everything
    // under it is hidden, and the panel shrinks to the header. The box is
    // pinned first, while it is still expanded, so the height to come back to
    // is the one it had rather than the header's.
    function setCollapsed(next) {
      if (next === collapsed) return;
      if (next) applyGeometry(geometry());

      collapsed = next;
      BODY.forEach(function (part) {
        part.node.style.display = next ? 'none' : part.display;
      });
      grip.style.display = next ? 'none' : 'flex';

      if (next) {
        panel.style.height = 'auto';
      } else {
        var g = geometry();
        applyGeometry(g);
        // Minimised, the panel could be dragged right down to the bottom of the
        // window. Coming back to full height from there would put its own
        // bottom off screen, so the position is clamped again now the height
        // is back.
        moveTo(g.left, g.top);
      }

      minimiseButton.textContent = '';
      minimiseButton.appendChild(svg(doc, next ? ICON.expand : ICON.minimise));
      minimiseButton.title = next ? 'Expand' : 'Minimise';
      minimiseButton.setAttribute('aria-label', minimiseButton.title);
      minimiseButton.setAttribute('aria-expanded', next ? 'false' : 'true');

      if (!next) {
        // The Unified Interface navigates between records without reloading,
        // so the record on screen may not be the one the panel was pointed at
        // when it was minimised.
        try { if (api.onExpand) api.onExpand(); } catch (e) { /* boot not finished */ }
        scheduleMeasure();
      }
    }

    /* ---------------------------------------------------------- resize -- */

    var grip = el(doc, 'div', {
      position: 'absolute',
      right: '3px',
      bottom: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '16px',
      color: '#98a3ad',
      cursor: 'nwse-resize',
      touchAction: 'none',
      zIndex: '4'
    });
    grip.setAttribute('data-sdt', 'resize');
    grip.title = 'Drag to resize - down and to the right makes the panel bigger';
    grip.setAttribute('aria-label', 'Resize the panel');
    grip.appendChild(svg(doc, ICON.grip));
    grip.onmouseenter = function () { grip.style.color = T.accent; };
    grip.onmouseleave = function () { grip.style.color = '#98a3ad'; };

    grip.onpointerdown = function (e) {
      if (e.button) return;
      if (e.preventDefault) e.preventDefault();

      var g = geometry();
      applyGeometry(g);
      var fromX = e.clientX;
      var fromY = e.clientY;
      var fromW = g.width;
      var fromH = g.height;

      // Captured on the grip so the drag survives passing over an iframe, of
      // which a model-driven form has several.
      try { grip.setPointerCapture(e.pointerId); } catch (err) { /* no capture */ }

      grip.onpointermove = function (ev) {
        sizeTo(fromW + (ev.clientX - fromX), fromH + (ev.clientY - fromY));
      };
      var stop = function () {
        grip.onpointermove = null;
        grip.onpointerup = null;
        grip.onpointercancel = null;
        try { grip.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
      };
      grip.onpointerup = stop;
      grip.onpointercancel = stop;
    };

    /* -------------------------------------------------------------- move -- */

    header.onpointerdown = function (e) {
      if (e.button) return;
      // The close button lives on the header and keeps its own behaviour.
      var node = e.target;
      while (node && node !== header) {
        if (node.tagName === 'BUTTON' || node.tagName === 'A') return;
        node = node.parentNode;
      }
      if (e.preventDefault) e.preventDefault();

      var g = geometry();
      applyGeometry(g);
      var fromLeft = g.left;
      var fromTop = g.top;
      var startX = e.clientX;
      var startY = e.clientY;

      // Captured on the header for the same reason the grip captures: a form
      // has iframes, and the pointer will cross them.
      try { header.setPointerCapture(e.pointerId); } catch (err) { /* no capture */ }
      header.style.cursor = 'grabbing';

      header.onpointermove = function (ev) {
        moveTo(fromLeft + (ev.clientX - startX), fromTop + (ev.clientY - startY));
      };
      var stopMove = function () {
        header.onpointermove = null;
        header.onpointerup = null;
        header.onpointercancel = null;
        header.style.cursor = 'move';
        try { header.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
        scheduleMeasure();
      };
      header.onpointerup = stopMove;
      header.onpointercancel = stopMove;
    };

    /* --------------------------------------------------------- measuring -- */

    // Drives the progress bar, the scroll arrow and whether the divider above
    // the output is drawn at all. Called on scroll, on resize, and whenever
    // anything inside the scroll region changes.
    function measure() {
      divider.style.display = output.firstChild ? 'block' : 'none';

      var view = scroll.clientHeight;
      var full = scroll.scrollHeight;
      var max = Math.max(1, full - view);
      var remaining = Math.max(0, full - view - scroll.scrollTop);
      var scrollable = full > view + 4;

      progressBar.style.width =
        (scrollable ? Math.min(100, Math.round((scroll.scrollTop / max) * 100)) : 100) + '%';
      moreWrap.style.display = remaining > 24 ? 'flex' : 'none';
    }

    var pending = false;
    function scheduleMeasure() {
      if (pending) return;
      pending = true;
      var run = function () { pending = false; measure(); };
      try {
        if (win.requestAnimationFrame) { win.requestAnimationFrame(run); return; }
      } catch (e) { /* fall through */ }
      setTimeout(run, 0);
    }

    scroll.onscroll = measure;

    // Output and listings change height constantly. Attributes are deliberately
    // not observed - measure() sets styles on nodes inside this subtree, which
    // would otherwise call itself forever.
    var watcher = null;
    try {
      if (win.MutationObserver) {
        watcher = new win.MutationObserver(scheduleMeasure);
        watcher.observe(scroll, { childList: true, subtree: true, characterData: true });
      }
    } catch (e) { /* no observer */ }

    // A box the user set is in pixels, so a smaller window has to pull it back
    // in - first the position, so the panel is on screen, then the size, which
    // is clamped from wherever it ended up. An untouched panel is sized in
    // calc() and needs no help, and a minimised one has no height to clamp.
    function onResize() {
      if (store.panelLeft != null) {
        var g = geometry();
        moveTo(g.left, g.top);
        if (!collapsed) sizeTo(g.width, g.height);
      }
      scheduleMeasure();
    }
    try { win.addEventListener('resize', onResize); } catch (e) { /* detached */ }

    function teardown() {
      try { if (watcher) watcher.disconnect(); } catch (e) { /* gone */ }
      try { win.removeEventListener('resize', onResize); } catch (e) { /* gone */ }
    }

    panel.appendChild(header);
    panel.appendChild(card);
    panel.appendChild(scrollWrap);
    panel.appendChild(footer);
    panel.appendChild(grip);
    doc.body.appendChild(panel);
    scheduleMeasure();

    var api = {
      doc: doc, win: win, panel: panel, actions: actions, output: output,
      scroll: scroll, table: tablePill, id: id, name: name, nameRow: nameRow,
      tableRow: nameRow, refreshHolder: refreshHolder, idRow: idRow,
      copyHolder: copyHolder, measure: scheduleMeasure,
      // The one line summary in the status bar. Errors turn the dot red; the
      // detail still goes into the output area above it.
      status: function (text, tone) {
        statusText.textContent = text || '';
        statusText.title = text || '';
        dot.style.background = tone === 'error' ? T.dangerDot : T.accent;
      },
      // Second argument picks the row: 'refresh' puts the message beside the
      // refresh control, anything else beside the copy control. Only one is
      // ever shown, so a stale message cannot sit next to the other button.
      note: function (text, where) {
        [noteRefresh, noteCopy].forEach(function (slot) {
          slot.textContent = '';
          slot.title = '';
          slot.style.display = 'none';
        });
        if (!text) return;
        var slot = (where === 'refresh') ? noteRefresh : noteCopy;
        slot.textContent = text;
        slot.title = text;
        slot.style.display = 'block';
      },
      buttons: [],
      // Set at boot. Run when the panel is expanded from minimised, so the
      // toolkit re-reads whatever record is on screen by then.
      onExpand: null,
      minimise: minimiseButton,
      collapsed: function () { return collapsed; },
      setCollapsed: setCollapsed
    };

    return api;
  }

  // A titled group of actions. Returns the grid to add buttons to.
  function addSection(ui, title) {
    var wrap = el(ui.doc, 'div', { marginBottom: '20px' });
    wrap.appendChild(el(ui.doc, 'div', {
      fontSize: '10.5px',
      fontWeight: '700',
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: T.textFaint,
      marginBottom: '9px'
    }, title));
    var grid = el(ui.doc, 'div', {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: T.gap
    });
    wrap.appendChild(grid);
    ui.actions.appendChild(wrap);
    return grid;
  }

  // Sliding two-state switch with a label either side. Clicking anywhere on it
  // moves the knob to the other end and calls back with true when it lands on
  // the right hand option.
  function addSwitch(doc, parent, leftLabel, rightLabel, onChange) {
    var right = false;

    var wrap = el(doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '4px 10px',
      background: T.bgCard,
      color: T.textMuted,
      border: '1px solid ' + T.buttonLine,
      borderRadius: '999px',
      cursor: 'pointer',
      font: T.font
    });

    var left = el(doc, 'span', { fontWeight: '600' }, leftLabel);

    var track = el(doc, 'span', {
      position: 'relative',
      display: 'inline-block',
      flexShrink: '0',
      width: '36px',
      height: '20px',
      borderRadius: '999px',
      background: T.accent
    });
    var knob = el(doc, 'span', {
      position: 'absolute',
      top: '3px',
      left: '3px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: '#ffffff',
      transition: 'left 0.15s ease'
    });
    track.appendChild(knob);

    var rightText = el(doc, 'span', { fontWeight: '600' }, rightLabel);

    wrap.appendChild(left);
    wrap.appendChild(track);
    wrap.appendChild(rightText);

    function paint() {
      knob.style.left = right ? '19px' : '3px';
      left.style.color = right ? T.textFaint : T.text;
      rightText.style.color = right ? T.text : T.textFaint;
      wrap.title = 'Showing ' + (right ? rightLabel : leftLabel);
    }

    wrap.onclick = function () {
      right = !right;
      paint();
      onChange(right);
    };

    paint();
    parent.appendChild(wrap);
    return { element: wrap, isRight: function () { return right; } };
  }

  // Every click that will write to the output area takes a ticket. An action
  // that writes later - the schema highlight report lands up to two and a half
  // seconds after the click - checks it still holds the current one first, so
  // a slow action cannot overwrite whatever the user asked for since. Display
  // actions have their own guard in active(), which covers one display action
  // replacing another; this covers everything else.
  var outputTicket = 0;

  function claimOutput() { return ++outputTicket; }
  function currentOutput() { return outputTicket; }
  function holdsOutput(ticket) { return ticket === outputTicket; }

  function addAction(ui, grid, label, icon, handler, wide) {
    var b = el(ui.doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '11px 11px',
      background: T.button,
      color: T.text,
      border: '1px solid ' + T.buttonLine,
      borderRadius: '9px',
      cursor: 'pointer',
      font: T.font,
      fontWeight: '500',
      lineHeight: '1.25',
      textAlign: 'left',
      transition: 'border-color 0.12s, background 0.12s'
    });

    var glyph = svg(ui.doc, icon);
    glyph.style.flexShrink = '0';
    glyph.style.color = T.accent;
    b.appendChild(glyph);
    // Kept so a toggle turning on can recolour the icon with the label.
    b.glyphNode = glyph;

    // The label lives in its own node so retitling a toggle does not wipe out
    // the icon alongside it.
    var text = el(ui.doc, 'span', {}, label);
    b.appendChild(text);
    b.labelNode = text;

    if (wide) b.style.gridColumn = '1 / -1';
    hover(b, T.button, T.buttonHover, T.buttonLine, T.buttonHoverLine);
    b.onclick = function () {
      // The Unified Interface can navigate to another record without reloading
      // the page, so re-read the record before acting on it. Otherwise the
      // copy, properties, all values and Web API actions would silently use
      // whichever record was open when the panel was last drawn.
      refreshRecord();
      // This click now owns the output area. Anything still in flight from an
      // earlier one will find its ticket stale and leave the output alone.
      claimOutput();
      // Anything other than a display action replaces whatever is in the
      // output area, so the lit display toggle is no longer showing anything.
      if (!b.isDisplayAction) releaseDisplay();
      handler();
    };
    grid.appendChild(b);
    ui.buttons.push(b);
    return b;
  }

  // Greys out every control. The handlers check authorisation too, so
  // re-enabling a button through the DOM does not get anyone anywhere.
  function setEnabled(ui, on) {
    ui.buttons.forEach(function (b) {
      b.disabled = !on;
      b.style.opacity = on ? '1' : '0.45';
      b.style.cursor = on ? 'pointer' : 'not-allowed';
    });
  }

  // Errors get a red tinted block with a warning icon in the output area, and
  // turn the status dot red, so they are not mistaken for an ordinary message.
  function fail(ui, text, title) {
    // An error replaces the output, so a display toggle left lit would be
    // claiming to show a list that is no longer there.
    releaseDisplay();
    ui.output.textContent = '';

    var block = el(ui.doc, 'div', {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 12px',
      background: T.dangerBg,
      border: '1px solid ' + T.dangerBorder,
      borderRadius: '9px',
      color: T.danger
    });

    var glyph = svg(ui.doc, ICON.warning);
    glyph.style.flexShrink = '0';
    glyph.style.marginTop = '2px';
    block.appendChild(glyph);

    var body = el(ui.doc, 'div', {});
    if (title) {
      body.appendChild(el(ui.doc, 'div', { fontWeight: '600', marginBottom: '4px' }, title));
    }
    body.appendChild(el(ui.doc, 'div', {}, text));
    block.appendChild(body);

    ui.output.appendChild(block);
    ui.status(title || text, 'error');
  }

  function deny(ui, reason) {
    setEnabled(ui, false);
    fail(ui, reason, 'Not available');
  }

  // A one line message. It belongs in the status bar at the foot of the panel,
  // not in the output area, which is for listings. Anything showing there is
  // no longer current once a new message arrives, so it is cleared.
  function say(ui, text) {
    ui.output.textContent = '';
    ui.status(text);
  }

  function rows(ui, pairs, heading) {
    ui.output.textContent = '';
    ui.status(heading || 'Ready.');
    if (heading) {
      ui.output.appendChild(el(ui.doc, 'div', {
        fontWeight: '600', marginBottom: '8px'
      }, heading));
    }
    if (!pairs.length) {
      ui.output.appendChild(el(ui.doc, 'div', {}, 'Nothing to show.'));
      return;
    }
    var list = el(ui.doc, 'div', {});
    pairs.forEach(function (pair) {
      var row = el(ui.doc, 'div', {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '8px 0',
        borderBottom: '1px solid ' + T.line
      });
      row.appendChild(el(ui.doc, 'div', { color: T.textMuted, flexShrink: '0', maxWidth: '45%' }, pair[0]));
      row.appendChild(el(ui.doc, 'div', { color: T.text, textAlign: 'right', wordBreak: 'break-word' }, pair[1]));
      list.appendChild(row);
    });
    if (list.lastChild) list.lastChild.style.borderBottom = '0';
    ui.output.appendChild(list);
  }

  // Rows grouped under a sub-heading, for output that is a list per column.
  function groups(ui, list, heading) {
    ui.output.textContent = '';
    ui.status(heading || 'Ready.');
    if (heading) {
      ui.output.appendChild(el(ui.doc, 'div', { fontWeight: '600', marginBottom: '10px' }, heading));
    }
    if (!list.length) {
      ui.output.appendChild(el(ui.doc, 'div', {}, 'Nothing to show.'));
      return;
    }
    list.forEach(function (group) {
      ui.output.appendChild(el(ui.doc, 'div', {
        fontWeight: '600', marginTop: '12px', marginBottom: '4px'
      }, group.title));
      group.pairs.forEach(function (pair) {
        var row = el(ui.doc, 'div', {
          display: 'flex',
          justifyContent: 'space-between',
          gap: '14px',
          padding: '4px 0 4px 12px',
          borderBottom: '1px solid ' + T.line
        });
        row.appendChild(el(ui.doc, 'div', { flexShrink: '0' }, pair[0]));
        row.appendChild(el(ui.doc, 'div', { textAlign: 'right' }, pair[1]));
        ui.output.appendChild(row);
      });
    });
  }

  // Output meant to be read here or taken elsewhere. The list view is laid out
  // like the other listings - label left, value right - and the JSON view is
  // for pasting into code. Copy takes whichever view is showing.
  //
  // The list view also has a filter box. It belongs to that view only: the JSON
  // view is for pasting a complete record definition elsewhere, so narrowing it
  // would quietly hand over a partial one. Copy follows whatever is on screen.
  function fieldLabel(item) {
    return item.display ? item.display + '  [' + item.logical + ']' : item.logical;
  }

  function fieldList(items) {
    return items.map(function (i) {
      return fieldLabel(i) + ' = ' + (i.value === null ? '(empty)' : i.value);
    }).join('\n');
  }

  function fieldJson(items) {
    var map = {};
    items.forEach(function (i) {
      map[i.logical] = { displayName: i.display || null, value: i.value };
    });
    return JSON.stringify(map, null, 2);
  }

  // Matched on both names, which is what the row shows. Typing "case" finds it
  // by display name and typing "ticketnumber" finds the same field by its
  // logical name, so neither has to be the one you happen to know.
  function matchesFilter(item, needle) {
    if (item.display && item.display.toLowerCase().indexOf(needle) > -1) return true;
    return !!item.logical && item.logical.toLowerCase().indexOf(needle) > -1;
  }

  function copyableList(ui, items, table, win) {
    ui.output.textContent = '';

    var format = 'list';
    var filter = '';

    // The filter is a list view control. In JSON view it is hidden and ignored,
    // and the typed text is kept so switching back restores the same view.
    function visible() {
      var needle = filter.trim().toLowerCase();
      if (format === 'json' || !needle) return items;
      return items.filter(function (i) { return matchesFilter(i, needle); });
    }

    function text() {
      return format === 'json' ? fieldJson(items) : fieldList(visible());
    }

    var withValues = items.filter(function (i) { return i.value !== null; }).length;

    // Heading and explanation get the full width on their own rows, so neither
    // is squeezed against the controls.
    var top = el(ui.doc, 'div', { marginBottom: '10px' });
    var headingNode = el(ui.doc, 'div', { fontWeight: '600' }, '');
    top.appendChild(headingNode);
    top.appendChild(el(ui.doc, 'div', {
      marginTop: '4px',
      fontSize: '12px',
      lineHeight: '1.45',
      color: T.textMuted
    }, 'Every field on the table is listed, not only the fields on the form. Fields the record has no value for are shown as empty.'));

    var controls = el(ui.doc, 'div', {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    });

    function smallButton(label, icon) {
      var b = el(ui.doc, 'button', {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        background: T.button,
        color: T.text,
        border: '1px solid ' + T.buttonLine,
        borderRadius: '7px',
        cursor: 'pointer',
        font: T.font,
        fontWeight: '600'
      });
      if (icon) {
        var glyph = svg(ui.doc, icon);
        glyph.style.flexShrink = '0';
        glyph.style.color = T.accent;
        b.appendChild(glyph);
      }
      var span = el(ui.doc, 'span', {}, label);
      b.appendChild(span);
      b.labelNode = span;
      hover(b, T.button, T.buttonHover, T.buttonLine, T.buttonHoverLine);
      controls.appendChild(b);
      return b;
    }

    // Sits to the left of the switch. marginRight auto pushes it there while
    // the row stays end aligned, so hiding it leaves the other controls put.
    var filterWrap = el(ui.doc, 'div', {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto'
    });

    var filterInput = el(ui.doc, 'input', {
      width: '150px',
      boxSizing: 'border-box',
      padding: '5px 24px 5px 9px',
      background: T.inputBg,
      color: T.inputText,
      border: '1px solid ' + T.inputBorder,
      borderRadius: '7px',
      font: T.font,
      outline: 'none'
    });
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by name';
    filterInput.title = 'Filter the list by display name or logical name. Escape clears it.';
    filterInput.setAttribute('aria-label', 'Filter fields by display name or logical name');
    filterWrap.appendChild(filterInput);

    var clearFilter = el(ui.doc, 'button', {
      position: 'absolute',
      right: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      padding: '0',
      background: 'transparent',
      color: T.textMuted,
      border: '0',
      borderRadius: '4px',
      cursor: 'pointer',
      visibility: 'hidden'
    });
    clearFilter.appendChild(svg(ui.doc, ICON.close));
    clearFilter.title = 'Clear the filter';
    clearFilter.setAttribute('aria-label', 'Clear the filter');
    hover(clearFilter, 'transparent', T.inputHover);
    filterWrap.appendChild(clearFilter);

    controls.appendChild(filterWrap);

    function setFilter(value) {
      filter = value;
      if (filterInput.value !== value) filterInput.value = value;
      clearFilter.style.visibility = value ? 'visible' : 'hidden';
      render();
    }

    filterInput.oninput = function () { setFilter(filterInput.value); };

    // The host app binds its own keyboard shortcuts, so keystrokes are kept in
    // the box rather than let through to the form behind the panel.
    filterInput.onkeydown = function (e) {
      e.stopPropagation();
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        setFilter('');
      }
    };

    clearFilter.onclick = function () {
      setFilter('');
      try { filterInput.focus(); } catch (e) { /* detached */ }
    };

    var formatSwitch = addSwitch(ui.doc, controls, 'List', 'JSON', function (right) {
      format = right ? 'json' : 'list';
      filterWrap.style.display = right ? 'none' : 'flex';
      render();
    });
    var copyButton = smallButton('Copy', ICON.copy);

    var body = el(ui.doc, 'div', {});

    function renderBody() {
      body.textContent = '';
      var list = visible();

      if (!list.length) {
        body.appendChild(el(ui.doc, 'div', {},
          items.length && filter.trim()
            ? 'No fields match "' + filter.trim() + '".'
            : 'Nothing to show.'));
        return;
      }

      if (format === 'json') {
        body.appendChild(el(ui.doc, 'div', {
          font: T.font,
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: 'text'
        }, text()));
        return;
      }

      list.forEach(function (item) {
        var row = el(ui.doc, 'div', {
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '6px 0',
          borderBottom: '1px solid ' + T.line
        });
        row.appendChild(el(ui.doc, 'div', {
          flexShrink: '0',
          maxWidth: '55%',
          wordBreak: 'break-word',
          color: T.textMuted
        }, fieldLabel(item)));
        row.appendChild(el(ui.doc, 'div', {
          textAlign: 'right',
          wordBreak: 'break-word',
          color: item.value === null ? T.textFaint : T.text
        }, item.value === null ? '(empty)' : item.value));
        body.appendChild(row);
      });
      if (body.lastChild) body.lastChild.style.borderBottom = '0';
    }

    function render() {
      var list = visible();
      if (list.length === items.length) {
        headingNode.textContent = items.length + ' fields on ' + table +
          ' - ' + withValues + ' hold a value';
      } else {
        var shownWithValues = list.filter(function (i) { return i.value !== null; }).length;
        headingNode.textContent = list.length + ' of ' + items.length + ' fields on ' +
          table + ' - ' + shownWithValues + ' hold a value';
      }
      copyButton.labelNode.textContent = 'Copy';
      ui.status(headingNode.textContent);
      renderBody();
    }
    copyButton.onclick = function () {
      try {
        win.navigator.clipboard.writeText(text()).then(
          function () { copyButton.labelNode.textContent = 'Copied'; },
          function () { copyButton.labelNode.textContent = 'Blocked'; }
        );
      } catch (e) {
        copyButton.labelNode.textContent = 'Blocked';
      }
    };

    ui.output.appendChild(top);
    ui.output.appendChild(controls);
    ui.output.appendChild(body);
    render();
  }

  // The default view is "the relationships that hold records", which cannot be
  // known until every count is in, so all of them are counted before anything
  // is drawn. A wide table is dozens of requests, so the wait is reported as it
  // goes rather than sitting on a blank panel.
  function countAll(ui, xrm, record, entitySet, list, active) {
    var counts = {};
    var done = 0;

    ui.output.textContent = '';
    var progress = el(ui.doc, 'div', { color: T.textMuted });
    ui.output.appendChild(progress);

    function report() {
      progress.textContent = 'Counting related records - ' + done + ' of ' + list.length + '...';
      // Counts already in flight still resolve after the display is switched
      // off. The output area they wrote to used to be discarded with them; the
      // status bar is shared, so it is only written to while this is what is
      // on screen.
      if (active()) ui.status(progress.textContent);
    }
    report();

    return throttle(list, COUNT_LANES, function (rel) {
      if (!active()) return null;
      return countRelated(xrm, entitySet, record.id, rel).then(function (result) {
        counts[rel.schema] = { count: result.count, capped: result.capped, note: null };
        done++;
        report();
      }, function () {
        // Nearly always a table this user has no read privilege on rather than
        // a broken query, so the row says so and the rest of the listing stands.
        counts[rel.schema] = { count: null, capped: false, note: 'no access' };
        done++;
        report();
      });
    }).then(function () {
      return counts;
    });
  }

  function countText(result) {
    if (!result) return 'unknown';
    if (result.note) return result.note;
    if (result.count === null) return 'unknown';
    if (result.capped) return 'over ' + COUNT_CAP;
    return String(result.count);
  }

  // A relationship whose count came back as a number above nought. Anything
  // that could not be counted is deliberately not in this set, so it is never
  // presented as though it holds records.
  function holdsRecords(result) {
    return !!result && !result.note && result.count !== null && result.count > 0;
  }

  // Shown in the default view. An uncounted relationship is not a confirmed
  // nought, so hiding it would turn a failure into an empty answer.
  function worthShowing(result) {
    return holdsRecords(result) || !result || !!result.note || result.count === null;
  }

  var RELATIONSHIP_SECTIONS = [
    { kind: '1:N', title: 'Child records (1:N)' },
    { kind: 'N:N', title: 'Many to many records (N:N)' }
  ];

  // Relationships grouped by type, with the number of records on the other end
  // of each. Counting has already happened by the time this runs, so the switch
  // between the two views costs nothing.
  function relationshipList(ui, record, list, counts, active) {
    ui.output.textContent = '';

    var showAll = false;

    var headingNode = el(ui.doc, 'div', { fontWeight: '600', marginBottom: '8px' });

    var controls = el(ui.doc, 'div', {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '10px'
    });
    addSwitch(ui.doc, controls, 'With records', 'All', function (right) {
      showAll = right;
      render();
    });

    var body = el(ui.doc, 'div', {});

    function sectionTitle(text) {
      return el(ui.doc, 'div', {
        fontSize: '10.5px',
        fontWeight: '700',
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: T.textFaint,
        marginTop: '14px',
        marginBottom: '6px'
      }, text);
    }

    function render() {
      var rows = showAll ? list : list.filter(function (rel) {
        return worthShowing(counts[rel.schema]);
      });

      var populated = list.filter(function (rel) {
        return holdsRecords(counts[rel.schema]);
      }).length;
      var uncounted = list.filter(function (rel) {
        var result = counts[rel.schema];
        return !result || result.note || result.count === null;
      }).length;

      // The narrowed view says how much it is hiding, and neither view counts
      // a relationship it could not count among the ones holding records.
      headingNode.textContent = (showAll
        ? list.length + ' relationships on ' + record.table
        : rows.length + ' of ' + list.length + ' relationships on ' + record.table) +
        ' - ' + populated + ' hold records' +
        (uncounted ? ', ' + uncounted + ' could not be counted' : '');
      ui.status(headingNode.textContent);

      body.textContent = '';

      if (!rows.length) {
        body.appendChild(el(ui.doc, 'div', {}, 'Nothing to show.'));
        return;
      }

      RELATIONSHIP_SECTIONS.forEach(function (section) {
        var inSection = rows.filter(function (rel) { return rel.kind === section.kind; });
        if (!inSection.length) return;

        var title = sectionTitle(section.title + ' - ' + inSection.length);
        if (!body.firstChild) title.style.marginTop = '0';
        body.appendChild(title);

        var group = el(ui.doc, 'div', {});
        inSection.forEach(function (rel) {
          var result = counts[rel.schema];
          // In the All view most rows are noughts, so the ones that actually
          // hold something are picked out. In the default view every row holds
          // records, and bolding all of them would say nothing.
          var stands = showAll && holdsRecords(result);

          var row = el(ui.doc, 'div', {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '6px 0',
            borderBottom: '1px solid ' + T.line
          });

          var label = el(ui.doc, 'div', {
            flexShrink: '0',
            maxWidth: '70%',
            wordBreak: 'break-word',
            color: T.textMuted,
            fontWeight: stands ? '700' : '400'
          }, rel.label);
          // The schema name is what you need when you go looking for the
          // relationship in the maker portal, so it is on the row without
          // taking up a column.
          label.title = rel.schema + '  -  ' + rel.kind + '  -  ' + rel.table;
          row.appendChild(label);

          row.appendChild(el(ui.doc, 'div', {
            textAlign: 'right',
            fontWeight: stands ? '700' : '400',
            color: countText(result) === '0' ? T.textFaint : T.text
          }, countText(result)));

          group.appendChild(row);
        });
        if (group.lastChild) group.lastChild.style.borderBottom = '0';
        body.appendChild(group);
      });
    }

    ui.output.appendChild(headingNode);
    ui.output.appendChild(controls);
    ui.output.appendChild(body);
    render();
  }

  /* ---------------------------------------------------------------- boot --- */

  var win;
  try {
    win = (window.top && window.top.document) ? window.top : window;
  } catch (e) {
    win = window;
  }
  var doc = win.document;

  var ui = build(doc, win);
  var store = getStore(win);
  var record = null;
  var authorised = false;

  // Hidden rather than left blank, so an unnamed record leaves no gap. The
  // table pill and the refresh control share the row, so the row itself stays
  // whether or not the table has a primary name column.
  function setName(value) {
    ui.name.textContent = value || '';
    ui.name.title = value || '';
    ui.name.style.display = value ? 'block' : 'none';
  }

  // Toggle state is kept on the window so it survives closing and reopening
  // the panel. The Unified Interface navigates between records without
  // reloading the page, so state left over from a different record has to be
  // discarded or the toggles would claim changes that are no longer applied.
  function syncStore(record, docs) {
    var id = record ? record.id : null;
    if (store.recordId === id) return false;

    stopSchemaWatch(store);
    if (docs) {
      clearHighlights(docs, 'schema');
      clearHighlights(docs, 'dirty');
    }
    store.labels = {};
    store.schemaOn = false;
    store.hidden = null;
    store.hiddenOn = false;
    store.locked = null;
    store.unlockedOn = false;
    store.mandatory = null;
    store.mandatoryOn = false;
    store.dirtyOn = false;
    store.recordId = id;
    return true;
  }

  // Each state toggle registers a closure that re-reads the store.
  var stateToggles = [];

  function resyncToggles() {
    stateToggles.forEach(function (sync) { sync(); });
  }

  function refreshRecord() {
    if (!authorised) {
      record = null;
      ui.table.textContent = 'not available';
      ui.id.textContent = 'not available';
      setName('');
      return;
    }
    var fw = findFormWindow();
    var xrm = fw && fw.Xrm;
    record = getRecord(xrm);
    if (syncStore(record, fw ? reachableDocs(fw) : null)) {
      resyncToggles();
      // The listing on screen was for the previous record.
      releaseDisplay();
    }
    if (record) {
      ui.table.textContent = record.table;
      ui.id.textContent = record.id;
      setName(record.name);
    } else {
      setName('');
      var name = xrm ? PAGE_NAMES[currentPageType(xrm)] : null;
      ui.table.textContent = 'none';
      ui.id.textContent = (name && name !== 'a record form')
        ? 'no record open - you are on ' + name
        : 'no saved record on screen';
    }
    ui.note('');
  }

  ui.buttons.push(ui.copyHolder.appendChild(iconButton(doc, ICON.copy, 'Copy record ID', function () {
    if (!authorised) return;
    refreshRecord();
    if (!record) { ui.note('Nothing to copy.'); return; }
    try {
      win.navigator.clipboard.writeText(record.id).then(
        function () { ui.note('Copied to clipboard.'); },
        function () { ui.note('Copy blocked - select the ID and press Ctrl+C.'); }
      );
    } catch (e) {
      ui.note('Copy blocked - select the ID and press Ctrl+C.');
    }
  }, { size: '24px', radius: '6px', hoverColor: T.accent })));

  // Re-read the record and drop anything listed for a previous one. Behind the
  // refresh control and behind expanding the panel, which is the same problem:
  // time has passed and the form may have moved on.
  function reload() {
    if (!authorised) return;
    refreshRecord();
    claimOutput();
    // Whatever is listed below belongs to whichever record was open when it
    // was requested, so clear it rather than leaving stale data on screen.
    releaseDisplay();
    say(ui, 'Pick an action.');
    ui.note('Refreshed.', 'refresh');
  }

  ui.onExpand = reload;

  ui.buttons.push(ui.refreshHolder.appendChild(iconButton(doc, ICON.refresh, 'Reload record details', reload,
    { size: '26px', radius: '7px', border: T.buttonLine, hoverColor: T.accent, hoverBorder: '#b9c3cc' })));

  // Every document the toolkit can reach, so DOM highlighting works whether
  // the form renders in the top window or inside a session iframe.
  function reachableDocs(formWin) {
    var docs = [];
    function add(d) {
      if (!d || !d.querySelectorAll) return;
      for (var i = 0; i < docs.length; i++) if (docs[i] === d) return;
      docs.push(d);
    }
    try { add(formWin && formWin.document); } catch (e) { /* cross-origin */ }
    add(doc);
    try {
      for (var i = 0; i < win.frames.length; i++) add(win.frames[i].document);
    } catch (e) { /* cross-origin */ }
    return docs;
  }

  // Runs fn with the live form window, reporting anything that goes wrong.
  function withForm(fn) {
    if (!authorised) return;
    var fw = findFormWindow();
    if (!fw || !fw.Xrm) {
      fail(ui, 'The Dynamics client could not be reached on this page.');
      return;
    }
    if (!hasForm(fw.Xrm)) {
      fail(ui, notAFormMessage(fw.Xrm));
      return;
    }
    try {
      fn(fw.Xrm, reachableDocs(fw));
    } catch (e) {
      fail(ui, 'Failed: ' + (e && e.message ? e.message : 'unknown error'));
    }
  }

  function withApi(fn) {
    if (!authorised) return;
    var fw = findFormWindow();
    if (!fw || !fw.Xrm || !fw.Xrm.WebApi) {
      fail(ui, 'The Dynamics Web API is not available on this page.');
      return;
    }
    if (!record) {
      // Distinguish "wrong kind of page" from "form open but never saved".
      fail(ui, hasForm(fw.Xrm)
        ? 'This record has not been saved yet, so it has no ID to look up.'
        : notAFormMessage(fw.Xrm));
      return;
    }
    try {
      fn(fw.Xrm);
    } catch (e) {
      fail(ui, 'Failed: ' + (e && e.message ? e.message : 'unknown error'));
    }
  }

  function failed(prefix) {
    return function (e) {
      fail(ui, prefix + ': ' + (e && e.message ? e.message : 'unknown error'));
    };
  }

  // Display actions render into the output area. Only one can be showing at a
  // time, so activating one resets the others back to their show label.
  // Runs before the toggle buttons read the store, so they are labelled against
  // the record that is actually open.
  (function () {
    var fw = findFormWindow();
    syncStore(getRecord(fw && fw.Xrm), fw ? reachableDocs(fw) : null);
  })();

  var displayActions = [];
  var activeDisplay = null;

  function setActiveDisplay(button) {
    activeDisplay = button;
    displayActions.forEach(function (d) {
      setToggle(d.button, d.button === button, d.hideLabel, d.showLabel);
    });
  }

  function releaseDisplay() {
    if (!displayActions || !displayActions.length || !activeDisplay) return;
    setActiveDisplay(null);
  }

  function addDisplayAction(ui, grid, showLabel, hideLabel, icon, run) {
    var button = addAction(ui, grid, showLabel, icon, function () {
      if (activeDisplay === button) {
        setActiveDisplay(null);
        say(ui, 'Pick an action.');
        return;
      }
      setActiveDisplay(button);
      // Async renders check this before writing, so a toggle off mid-flight is
      // not overwritten when the call returns.
      run(function () { return activeDisplay === button; });
    });
    button.isDisplayAction = true;
    displayActions.push({ button: button, showLabel: showLabel, hideLabel: hideLabel });
    return button;
  }

  // Marks a toggle as on or off: pale blue fill, a blue border and blue text
  // and icon while active. The hover pair is swapped too, so hovering an
  // active button does not drop it back to the inactive colour.
  function setToggle(button, on, onLabel, offLabel) {
    if (onLabel && button.labelNode) button.labelNode.textContent = on ? onLabel : offLabel;
    button.style.background = on ? T.buttonActive : T.button;
    button.style.borderColor = on ? T.buttonActiveBorder : T.buttonLine;
    button.style.color = on ? T.accentDark : T.text;
    if (button.glyphNode) button.glyphNode.style.color = on ? T.accentDark : T.accent;
    hover(button,
      on ? T.buttonActive : T.button,
      on ? T.buttonActiveHover : T.buttonHover,
      on ? T.buttonActiveBorder : T.buttonLine,
      on ? T.buttonActiveBorder : T.buttonHoverLine);
  }

  var formGroup = addSection(ui, 'Change the form');

  var unlockButton = addAction(ui, formGroup, 'Unlock read only fields', ACTION_ICON.unlock, function () {
    withForm(function (xrm) {
      if (store.unlockedOn) {
        var back = relock(xrm, store);
        setToggle(unlockButton, false, 'Re-lock fields', 'Unlock read only fields');
        say(ui, 'Locked ' + back + ' field' + (back === 1 ? '' : 's') + ' again.');
        return;
      }
      var n = unlockFields(xrm, store);
      if (!n) { say(ui, 'No read only fields on this form.'); return; }
      setToggle(unlockButton, true, 'Re-lock fields', 'Unlock read only fields');
      say(ui, 'Unlocked ' + n + ' read only field' + (n === 1 ? '.' : 's.'));
    });
  });
  stateToggles.push(function () {
    setToggle(unlockButton, store.unlockedOn, 'Re-lock fields', 'Unlock read only fields');
  });
  setToggle(unlockButton, store.unlockedOn, 'Re-lock fields', 'Unlock read only fields');

  var mandatoryButton = addAction(ui, formGroup, 'Remove mandatory fields', ACTION_ICON.optional, function () {
    withForm(function (xrm) {
      if (store.mandatoryOn) {
        var back = restoreMandatory(xrm, store);
        setToggle(mandatoryButton, false, 'Restore mandatory fields', 'Remove mandatory fields');
        say(ui, 'Set ' + back + ' field' + (back === 1 ? '' : 's') + ' back to mandatory.');
        return;
      }
      var n = removeMandatory(xrm, store);
      if (!n) { say(ui, 'No mandatory fields on this form.'); return; }
      setToggle(mandatoryButton, true, 'Restore mandatory fields', 'Remove mandatory fields');
      say(ui, 'Set ' + n + ' field' + (n === 1 ? '' : 's') + ' to optional.');
    });
  });
  stateToggles.push(function () {
    setToggle(mandatoryButton, store.mandatoryOn, 'Restore mandatory fields', 'Remove mandatory fields');
  });
  setToggle(mandatoryButton, store.mandatoryOn, 'Restore mandatory fields', 'Remove mandatory fields');

  var hiddenButton = addAction(ui, formGroup, 'Show hidden fields', ACTION_ICON.show, function () {
    withForm(function (xrm) {
      if (store.hiddenOn) {
        var back = reHide(xrm, store);
        setToggle(hiddenButton, false, 'Re-hide fields', 'Show hidden fields');
        say(ui, 'Hidden again: ' + back.fields + ' fields, ' + back.sections + ' sections, ' + back.tabs + ' tabs.');
        return;
      }
      var n = showHidden(xrm, store);
      setToggle(hiddenButton, true, 'Re-hide fields', 'Show hidden fields');
      say(ui, 'Made visible: ' + n.fields + ' fields, ' + n.sections + ' sections, ' + n.tabs + ' tabs.');
    });
  });
  stateToggles.push(function () {
    setToggle(hiddenButton, store.hiddenOn, 'Re-hide fields', 'Show hidden fields');
  });
  setToggle(hiddenButton, store.hiddenOn, 'Re-hide fields', 'Show hidden fields');

  var schemaButton = addAction(ui, formGroup, 'Show schema names', ACTION_ICON.schema, function () {
    withForm(function (xrm, docs) {
      var on = !store.schemaOn;
      var applied = setSchemaNames(xrm, docs, store, on);
      setToggle(schemaButton, on, 'Hide schema names', 'Show schema names');
      if (!on) { say(ui, 'Schema names hidden.'); scheduleSchemaHighlight(docs, on, store); return; }

      // Highlighting is retried for two and a half seconds before it reports,
      // which is long enough for the user to have asked for something else.
      var ticket = currentOutput();
      say(ui, 'Schema names shown on ' + applied.length + ' fields. Highlighting...');
      scheduleSchemaHighlight(docs, on, store, function (found) {
        if (!holdsOutput(ticket)) return;
        var missing = applied.filter(function (name) { return !found[name]; });
        var summary = 'Schema names shown on ' + applied.length + ' fields, ' +
          (applied.length - missing.length) + ' highlighted.';
        ui.output.textContent = '';
        ui.status(summary);
        ui.output.appendChild(el(ui.doc, 'div', {}, summary));
        if (missing.length) {
          ui.output.appendChild(el(ui.doc, 'div', { marginTop: '8px' },
            'Not highlighted yet (' + missing.length + ') - usually fields on an unopened tab, ' +
            'in the header, or with the label switched off. Open the tab and they will be ' +
            'highlighted automatically: ' + missing.join(', ')));
        }
      });
    });
  });
  stateToggles.push(function () {
    setToggle(schemaButton, store.schemaOn, 'Hide schema names', 'Show schema names');
  });
  setToggle(schemaButton, store.schemaOn, 'Hide schema names', 'Show schema names');

  addDisplayAction(ui, formGroup, 'Show choice field values', 'Hide choice field values',
    ACTION_ICON.options, function (active) {
      withForm(function (xrm) {
        if (!active()) return;
        var list = choiceFieldValues(xrm, store);
        groups(ui, list, list.length + ' choice columns on this form');
      });
    });

  var dirtyButton = addAction(ui, formGroup, 'Highlight unsaved values', ACTION_ICON.dirty, function () {
    withForm(function (xrm, docs) {
      if (store.dirtyOn) {
        clearHighlights(docs, 'dirty');
        store.dirtyOn = false;
        setToggle(dirtyButton, false, 'Clear highlighting', 'Highlight unsaved values');
        say(ui, 'Highlighting cleared.');
        return;
      }
      var result = highlightDirty(xrm, docs, store);
      if (!result.names.length) { say(ui, 'No unsaved changes on this form.'); return; }
      store.dirtyOn = true;
      setToggle(dirtyButton, true, 'Clear highlighting', 'Highlight unsaved values');
      var note = result.highlighted + ' of ' + result.names.length + ' highlighted on the form.';
      rows(ui, result.names.map(function (n) { return [n, 'changed']; }), 'Unsaved changes - ' + note);
    });
  });
  stateToggles.push(function () {
    setToggle(dirtyButton, store.dirtyOn, 'Clear highlighting', 'Highlight unsaved values');
  });
  setToggle(dirtyButton, store.dirtyOn, 'Clear highlighting', 'Highlight unsaved values');

  var recordGroup = addSection(ui, 'This record');

  addDisplayAction(ui, recordGroup, 'Show all fields', 'Hide all fields',
    ACTION_ICON.table, function (active) {
      withApi(function (xrm) {
        say(ui, 'Reading fields and values...');
        allFields(xrm, record).then(function (items) {
          if (!active()) return;
          copyableList(ui, items, record.table, win);
        }, function (e) { if (active()) failed('Could not read the fields')(e); });
      });
    });

  addDisplayAction(ui, recordGroup, 'Record properties', 'Hide record properties',
    ACTION_ICON.properties, function (active) {
      withApi(function (xrm) {
        say(ui, 'Loading record properties...');
        readProperties(xrm, record).then(function (r) {
          if (!active()) return;
          rows(ui, [
            ['Created by', display(r, '_createdby_value')],
            ['Created on', display(r, 'createdon')],
            ['Modified by', display(r, '_modifiedby_value')],
            ['Modified on', display(r, 'modifiedon')],
            ['Status', display(r, 'statecode')],
            ['Status reason', display(r, 'statuscode')]
          ], 'Record properties');
        }, function (e) { if (active()) failed('Could not read properties')(e); });
      });
    });

  addDisplayAction(ui, recordGroup, 'Show related record count', 'Hide related record count',
    ACTION_ICON.related, function (active) {
      withApi(function (xrm) {
        say(ui, 'Reading relationships...');
        Promise.all([
          readRelationships(xrm, store, record.table),
          // The count queries are built from the entity set name, not the
          // logical name, so it has to be resolved before any of them run.
          xrm.Utility.getEntityMetadata(record.table)
        ]).then(function (results) {
          var list = results[0];
          var entitySet = results[1] && results[1].EntitySetName;
          if (!active()) return null;
          if (!entitySet) throw new Error('the entity set name could not be resolved');

          var tables = [];
          var seen = {};
          list.forEach(function (rel) {
            if (!rel.table || seen[rel.table]) return;
            seen[rel.table] = true;
            tables.push(rel.table);
          });

          return tableDisplayNames(xrm, tables).then(function (names) {
            if (!active()) return null;
            labelRelationships(list, names);
            return countAll(ui, xrm, record, entitySet, list, active).then(function (counts) {
              if (!active()) return;
              relationshipList(ui, record, list, counts, active);
            });
          });
        }).then(null, function (e) {
          if (active()) failed('Could not read relationships')(e);
        });
      });
    });

  var configGroup = addSection(ui, 'Form configuration');

  addDisplayAction(ui, configGroup, 'Show JavaScript libraries', 'Hide JavaScript libraries',
    ACTION_ICON.libraries, function (active) {
      withApi(function (xrm) {
        say(ui, 'Reading form definition...');
        getFormXml(xrm, store).then(function (formXml) {
          if (!active()) return;
          var libs = readLibraries(formXml);
          rows(ui, libs.map(function (l) { return [l, '']; }), 'Libraries on form "' + formXml.name + '"');
        }, function (e) { if (active()) failed('Could not read the form definition')(e); });
      });
    });

  addDisplayAction(ui, configGroup, 'Show business rules', 'Hide business rules',
    ACTION_ICON.rules, function (active) {
      withApi(function (xrm) {
        say(ui, 'Loading business rules...');
        var formId = getFormId(xrm);
        readBusinessRules(xrm, record).then(function (result) {
          if (!active()) return;
          var list = (result && result.entities) || [];
          rows(ui, list.map(function (r) {
            var state = display(r, 'statecode');
            if (formId && r.formid && clean(r.formid) === formId) state += ' - this form';
            else if (r.formid) state += ' - another form';
            return [r.name || '(unnamed)', state];
          }), 'Business rules for ' + record.table);
        }, function (e) { if (active()) failed('Could not read business rules')(e); });
      });
    });

  addDisplayAction(ui, configGroup, 'Show event handlers', 'Hide event handlers',
    ACTION_ICON.events, function (active) {
      withApi(function (xrm) {
        say(ui, 'Reading form definition...');
        getFormXml(xrm, store).then(function (formXml) {
          if (!active()) return;
          rows(ui, readHandlers(formXml), 'Event handlers on form "' + formXml.name + '"');
        }, function (e) { if (active()) failed('Could not read the form definition')(e); });
      });
    });

  addAction(ui, recordGroup, 'Open in web API', ACTION_ICON.external, function () {
    withApi(function (xrm) {
      // Opened before the metadata call so the click still counts as a user
      // gesture and the popup blocker stays out of the way.
      var tab = null;
      try { tab = win.open('', '_blank'); } catch (e) { /* blocked */ }
      say(ui, 'Resolving entity set name...');
      webApiUrl(xrm, record).then(function (url) {
        if (tab) { tab.location.href = url; say(ui, 'Opened in a new tab.'); }
        else { rows(ui, [['Popup blocked', url]]); }
      }, function (e) {
        if (tab) tab.close();
        fail(ui, 'Could not resolve the Web API URL: ' + (e && e.message ? e.message : 'unknown error'));
      });
    });
  });

  // Nothing is usable until the role check has passed. This is a guard against
  // accidental use, not a security control - it runs in the browser and the
  // platform still enforces the user's real privileges on every call.
  setEnabled(ui, false);
  refreshRecord();
  say(ui, 'Checking your security roles...');

  (function gateAccess() {
    var fw = findFormWindow();
    if (!fw || !fw.Xrm || !fw.Xrm.WebApi) {
      deny(ui, 'The Dynamics client could not be reached on this page. Open a ' +
        'model-driven app record and run the toolkit again.');
      return;
    }
    isSystemAdministrator(fw.Xrm).then(function (isAdmin) {
      if (!isAdmin) {
        deny(ui, 'This toolkit is restricted to users with the System Administrator ' +
          'security role. Your account does not have that role in this environment, ' +
          'so the actions have been disabled.');
        return;
      }
      authorised = true;
      setEnabled(ui, true);
      refreshRecord();
      say(ui, 'Pick an action.');
    }, function (e) {
      deny(ui, 'Your security roles could not be confirmed (' +
        (e && e.message ? e.message : 'unknown error') +
        '). Access is blocked as a precaution.');
    });
  })();
})();
