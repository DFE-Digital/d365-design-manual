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
  var VERSION = 'v1.30';
  var API_VERSION = 'v9.2';
  var MARK = 'data-sdt-highlight';
  var WRAP = 'data-sdt-wrap';

  /* --------------------------------------------------------------- theme --- */

  var T = {
    // Slightly translucent. Set as an rgba background rather than an opacity
    // on the panel, which would fade the text and buttons along with it.
    bg: 'rgba(15, 42, 74, 0.75)',
    bgCard: '#1f4a7d',
    bgHover: '#24537f',
    line: '#3b6b9c',
    text: '#ffffff',
    accent: '#bfe0ff',
    button: '#0e7ae0',
    buttonHover: '#1a8bf5',
    buttonActive: '#3ba2f8',
    buttonActiveHover: '#4dabf9',
    buttonActiveBorder: '#eaf5ff',
    danger: '#ffc2c2',
    dangerBg: 'rgba(255, 92, 92, 0.16)',
    dangerBorder: '#ff6b6b',
    schemaHighlight: 'rgba(120, 190, 255, 0.28)',
    dirtyHighlight: 'rgba(255, 214, 10, 0.40)',
    width: '550px',
    offset: '28px',
    radius: '12px',
    pad: '22px',
    gap: '14px',
    font: '14px "Segoe UI", system-ui, -apple-system, sans-serif',
    mono: '13.5px Consolas, "Cascadia Mono", monospace'
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
    if (!win.__sdtD365Toolkit) win.__sdtD365Toolkit = { recordId: null, labels: {}, schemaOn: false, hidden: null, hiddenOn: false, locked: null, unlockedOn: false, mandatory: null, mandatoryOn: false, dirtyOn: false, formXml: {}, watchers: [] };
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

  function tableSchema(xrm, table) {
    var request = (typeof fetch === 'function') ? fetch : null;
    if (!request) {
      return Promise.reject(new Error('this browser does not support the metadata request'));
    }

    var url = xrm.Utility.getGlobalContext().getClientUrl() +
      '/api/data/' + API_VERSION +
      "/EntityDefinitions(LogicalName='" + table + "')/Attributes" +
      '?$select=LogicalName,DisplayName';

    return request(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('metadata request returned ' + response.status);
      }
      return response.json();
    }).then(function (data) {
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

  function hover(node, from, to) {
    node.onmouseenter = function () { node.style.background = to; };
    node.onmouseleave = function () { node.style.background = from; };
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

  // Toolkit mark. Original artwork - a badge with three adjuster sliders,
  // matching the stroke weight of the icons above. Deliberately generic rather
  // than any organisation's identity.
  function logo(doc) {
    var s = doc.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', '52');
    s.setAttribute('height', '52');
    s.setAttribute('aria-label', 'SDT D365 Toolkit');

    var badge = doc.createElementNS(SVG_NS, 'rect');
    badge.setAttribute('x', '1.1');
    badge.setAttribute('y', '1.1');
    badge.setAttribute('width', '21.8');
    badge.setAttribute('height', '21.8');
    badge.setAttribute('rx', '5.5');
    badge.setAttribute('fill', 'none');
    badge.setAttribute('stroke', T.text);
    badge.setAttribute('stroke-width', '1.5');
    badge.setAttribute('opacity', '0.9');
    s.appendChild(badge);

    // Each row is a track broken either side of a knob.
    var rows = [
      { y: 8, knob: 9 },
      { y: 12, knob: 15 },
      { y: 16, knob: 11 }
    ];

    rows.forEach(function (row) {
      [[5, row.knob - 2.6], [row.knob + 2.6, 19]].forEach(function (seg) {
        if (seg[1] - seg[0] < 0.5) return;
        var line = doc.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', seg[0]);
        line.setAttribute('y1', row.y);
        line.setAttribute('x2', seg[1]);
        line.setAttribute('y2', row.y);
        line.setAttribute('stroke', T.text);
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0.75');
        s.appendChild(line);
      });

      var knob = doc.createElementNS(SVG_NS, 'circle');
      knob.setAttribute('cx', row.knob);
      knob.setAttribute('cy', row.y);
      knob.setAttribute('r', '2.1');
      knob.setAttribute('fill', T.accent);
      knob.setAttribute('stroke', T.text);
      knob.setAttribute('stroke-width', '1.2');
      s.appendChild(knob);
    });

    return s;
  }

  var ICON = {
    copy: ['M6 6h7v7h-7z', 'M10.5 6V3.5h-7v7H6'],
    refresh: ['M13 8A5 5 0 1 1 8 3', 'M8 0.9L10.8 3L8 5.1'],
    close: ['M4 4l8 8', 'M12 4l-8 8'],
    // warning triangle
    warning: ['M8 2.4L14.6 13.6H1.4z', 'M8 6.6v3.3', 'M8 11.7h.01']
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
    // external link
    external: ['M9.4 3.2h3.4v3.4', 'M12.8 3.2L7.5 8.5', 'M12.2 9.4v3a1.4 1.4 0 0 1-1.4 1.4H3.9a1.4 1.4 0 0 1-1.4-1.4V5.5a1.4 1.4 0 0 1 1.4-1.4h3']
  };

  /* ------------------------------------------------------------------ UI --- */

  function iconButton(doc, icon, tooltip, handler) {
    var b = el(doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      padding: '0',
      background: 'transparent',
      color: T.text,
      border: '1px solid transparent',
      borderRadius: '6px',
      cursor: 'pointer'
    });
    b.title = tooltip;
    b.appendChild(svg(doc, icon));
    b.onmouseenter = function () { b.style.background = T.bgHover; };
    b.onmouseleave = function () { b.style.background = 'transparent'; };
    b.onclick = handler;
    return b;
  }

  function labelled(doc, prefix, valueProps) {
    var wrap = el(doc, 'div', { color: T.text, wordBreak: 'break-all' });
    wrap.appendChild(el(doc, 'span', { fontWeight: '600' }, prefix));
    var value = el(doc, 'span', valueProps || {}, '');
    wrap.appendChild(value);
    return { wrap: wrap, value: value };
  }

  function build(doc, win) {
    var old = doc.getElementById(PANEL_ID);
    if (old) old.parentNode.removeChild(old);

    var panel = el(doc, 'div', {
      position: 'fixed',
      top: T.offset,
      right: T.offset,
      zIndex: '2147483647',
      width: T.width,
      maxHeight: '80vh',
      overflowY: 'auto',
      padding: T.pad,
      boxSizing: 'border-box',
      background: T.bg,
      backdropFilter: 'blur(9px)',
      WebkitBackdropFilter: 'blur(9px)',
      color: T.text,
      border: '1px solid ' + T.line,
      borderRadius: T.radius,
      boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
      font: T.font,
      lineHeight: '1.5'
    });
    panel.id = PANEL_ID;

    var header = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '18px'
    });
    // Logo and the two title lines form one lockup on the left, with only the
    // close control on the right.
    var lockup = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      minWidth: '0'
    });
    lockup.appendChild(logo(doc));

    var titles = el(doc, 'div', { minWidth: '0' });
    titles.appendChild(el(doc, 'div', {
      fontSize: '11.5px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: '1.2',
      opacity: '0.7'
    }, 'Solutions Delivery Team'));
    titles.appendChild(el(doc, 'div', {
      fontSize: '23px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      lineHeight: '1.2',
      marginTop: '2px'
    }, 'Dynamics 365 Toolkit'));
    lockup.appendChild(titles);

    header.appendChild(lockup);
    header.appendChild(iconButton(doc, ICON.close, 'Close', function () {
      panel.parentNode.removeChild(panel);
    }));

    var card = el(doc, 'div', {
      background: T.bgCard,
      border: '1px solid ' + T.line,
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '18px'
    });

    // Table name on the first row with the refresh control, record ID on the
    // second with the copy control beside it so it is obvious what gets copied.
    var cardTop = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    });
    // Record name leads the card, with refresh alongside it so it is clear the
    // record is what gets reloaded. No prefix - at this size it reads as the
    // title of the card rather than another labelled field. Truncated rather
    // than wrapped, with the full value on hover.
    var nameRow = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px'
    });
    var name = el(doc, 'div', {
      flex: '1',
      minWidth: '0',
      fontSize: '17px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      lineHeight: '1.3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, '');
    var refreshHolder = el(doc, 'div', { display: 'flex', flexShrink: '0' });
    nameRow.appendChild(name);
    nameRow.appendChild(refreshHolder);

    var table = labelled(doc, 'Table Name: ');
    style(table.wrap, { flex: '1', minWidth: '0' });
    cardTop.appendChild(table.wrap);
    style(cardTop, { marginTop: '6px' });

    var idRow = el(doc, 'div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      marginTop: '8px'
    });
    var id = labelled(doc, 'Record ID: ', { font: T.mono, userSelect: 'all' });
    style(id.wrap, { flex: '1', minWidth: '0' });
    var copyHolder = el(doc, 'div', { display: 'flex', flexShrink: '0' });
    idRow.appendChild(id.wrap);
    idRow.appendChild(copyHolder);

    // Hidden until there is something to say, so it leaves no gap under the ID.
    var copied = el(doc, 'div', { display: 'none', marginTop: '8px', fontSize: '12.5px', color: T.text }, '');

    card.appendChild(nameRow);
    card.appendChild(idRow);
    card.appendChild(cardTop);
    card.appendChild(copied);

    // Sections are appended here, each with its own grid.
    var actions = el(doc, 'div', { marginBottom: '2px' });

    var divider = el(doc, 'div', { height: '1px', background: T.line, margin: '0 0 16px' });
    var output = el(doc, 'div', { minHeight: '20px', fontSize: '13.5px', color: T.text });

    var footer = el(doc, 'div', {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '16px',
      marginTop: '18px',
      paddingTop: '14px',
      borderTop: '1px solid ' + T.line,
      fontSize: '12.5px',
      lineHeight: '1.5',
      color: T.text
    });

    var notices = el(doc, 'div', {});
    notices.appendChild(el(doc, 'div', {},
      'This tool is only accessible to users with a System Administrator security role.'));
    notices.appendChild(el(doc, 'div', { marginTop: '6px' },
      'This tool has not been accessibility tested. Its features only provide shortcuts to ' +
      'functionality that is already available by other means.'));
    notices.appendChild(el(doc, 'div', { marginTop: '6px' },
      'This tool does not store or save any data. It reads from the form and from Dataverse ' +
      'using your own permissions, writes nothing back, and sends nothing to any other system. ' +
      'Everything it changes is undone by refreshing the page.'));

    footer.appendChild(notices);
    footer.appendChild(el(doc, 'div', {
      flexShrink: '0',
      whiteSpace: 'nowrap',
      opacity: '0.75'
    }, VERSION));

    panel.appendChild(header);
    panel.appendChild(card);
    panel.appendChild(actions);
    panel.appendChild(divider);
    panel.appendChild(output);
    panel.appendChild(footer);
    doc.body.appendChild(panel);

    return {
      doc: doc, win: win, panel: panel, actions: actions, output: output,
      table: table.value, id: id.value, name: name, nameRow: nameRow,
      tableRow: cardTop, refreshHolder: refreshHolder, idRow: idRow,
      copyHolder: copyHolder, refreshHolder: refreshHolder,
      note: function (text) {
        copied.textContent = text || '';
        copied.style.display = text ? 'block' : 'none';
      },
      buttons: []
    };
  }

  // A titled group of actions. Returns the grid to add buttons to.
  function addSection(ui, title) {
    var wrap = el(ui.doc, 'div', { marginBottom: '18px' });
    wrap.appendChild(el(ui.doc, 'div', {
      fontSize: '11.5px',
      fontWeight: '700',
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: T.text,
      opacity: '0.85',
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
      padding: '5px 10px',
      background: 'transparent',
      color: T.text,
      border: '1px solid ' + T.line,
      borderRadius: '999px',
      cursor: 'pointer',
      font: T.font
    });

    var left = el(doc, 'span', { fontWeight: '600' }, leftLabel);

    var track = el(doc, 'span', {
      position: 'relative',
      display: 'inline-block',
      flexShrink: '0',
      width: '38px',
      height: '20px',
      borderRadius: '999px',
      background: T.button
    });
    var knob = el(doc, 'span', {
      position: 'absolute',
      top: '3px',
      left: '3px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: T.text,
      transition: 'left 0.15s ease'
    });
    track.appendChild(knob);

    var rightText = el(doc, 'span', { fontWeight: '600' }, rightLabel);

    wrap.appendChild(left);
    wrap.appendChild(track);
    wrap.appendChild(rightText);

    function paint() {
      knob.style.left = right ? '21px' : '3px';
      left.style.opacity = right ? '0.55' : '1';
      rightText.style.opacity = right ? '1' : '0.55';
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

  function addAction(ui, grid, label, icon, handler, wide) {
    var b = el(ui.doc, 'button', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 12px',
      background: T.button,
      color: T.text,
      border: '1px solid transparent',
      borderRadius: '7px',
      cursor: 'pointer',
      font: T.font,
      fontWeight: '600',
      textAlign: 'center'
    });

    var glyph = svg(ui.doc, icon);
    glyph.style.flexShrink = '0';
    b.appendChild(glyph);

    // The label lives in its own node so retitling a toggle does not wipe out
    // the icon alongside it.
    var text = el(ui.doc, 'span', {}, label);
    b.appendChild(text);
    b.labelNode = text;

    if (wide) b.style.gridColumn = '1 / -1';
    hover(b, T.button, T.buttonHover);
    b.onclick = function () {
      // The Unified Interface can navigate to another record without reloading
      // the page, so re-read the record before acting on it. Otherwise the
      // copy, properties, all values and Web API actions would silently use
      // whichever record was open when the panel was last drawn.
      refreshRecord();
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
      b.style.opacity = on ? '1' : '0.4';
      b.style.cursor = on ? 'pointer' : 'not-allowed';
    });
  }

  // Errors get a red tinted block with a warning icon, so they are not mistaken
  // for the ordinary white status text.
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
      borderRadius: '7px',
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
  }

  function deny(ui, reason) {
    setEnabled(ui, false);
    fail(ui, reason, 'Not available');
  }

  function say(ui, text) {
    ui.output.textContent = '';
    ui.output.appendChild(el(ui.doc, 'div', { color: T.text }, text));
  }

  function rows(ui, pairs, heading) {
    ui.output.textContent = '';
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
      row.appendChild(el(ui.doc, 'div', { color: T.text, flexShrink: '0', maxWidth: '45%' }, pair[0]));
      row.appendChild(el(ui.doc, 'div', { color: T.text, textAlign: 'right', wordBreak: 'break-word' }, pair[1]));
      list.appendChild(row);
    });
    if (list.lastChild) list.lastChild.style.borderBottom = '0';
    ui.output.appendChild(list);
  }

  // Rows grouped under a sub-heading, for output that is a list per column.
  function groups(ui, list, heading) {
    ui.output.textContent = '';
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

  function copyableList(ui, items, table, win) {
    ui.output.textContent = '';

    var format = 'list';

    function text() {
      return format === 'json' ? fieldJson(items) : fieldList(items);
    }

    var withValues = items.filter(function (i) { return i.value !== null; }).length;

    // Heading and explanation get the full width on their own rows, so neither
    // is squeezed against the controls.
    var top = el(ui.doc, 'div', { marginBottom: '10px' });
    var headingNode = el(ui.doc, 'div', { fontWeight: '600' }, '');
    top.appendChild(headingNode);
    top.appendChild(el(ui.doc, 'div', {
      marginTop: '4px',
      fontSize: '12.5px',
      lineHeight: '1.45',
      opacity: '0.8'
    }, 'Every field on the table is listed, not only the fields on the form. Fields the record has no value for are shown as empty.'));

    var controls = el(ui.doc, 'div', {
      display: 'flex',
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
        padding: '6px 10px',
        background: T.button,
        color: T.text,
        border: '1px solid transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        font: T.font,
        fontWeight: '600'
      });
      if (icon) {
        var glyph = svg(ui.doc, icon);
        glyph.style.flexShrink = '0';
        b.appendChild(glyph);
      }
      var span = el(ui.doc, 'span', {}, label);
      b.appendChild(span);
      b.labelNode = span;
      hover(b, T.button, T.buttonHover);
      controls.appendChild(b);
      return b;
    }

    var formatSwitch = addSwitch(ui.doc, controls, 'List', 'JSON', function (right) {
      format = right ? 'json' : 'list';
      render();
    });
    var copyButton = smallButton('Copy', ICON.copy);

    var body = el(ui.doc, 'div', {});

    function renderBody() {
      body.textContent = '';
      var list = items;

      if (!list.length) {
        body.appendChild(el(ui.doc, 'div', {}, 'Nothing to show.'));
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
          wordBreak: 'break-word'
        }, fieldLabel(item)));
        row.appendChild(el(ui.doc, 'div', {
          textAlign: 'right',
          wordBreak: 'break-word',
          opacity: item.value === null ? '0.65' : '1'
        }, item.value === null ? '(empty)' : item.value));
        body.appendChild(row);
      });
      if (body.lastChild) body.lastChild.style.borderBottom = '0';
    }

    function render() {
      headingNode.textContent = items.length + ' fields on ' + table +
        ' - ' + withValues + ' hold a value';
      copyButton.labelNode.textContent = 'Copy';
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

  // Hidden rather than left blank, so an unnamed record leaves no gap.
  function setName(value) {
    ui.name.textContent = value || '';
    ui.name.title = value || '';
    ui.nameRow.style.display = value ? 'flex' : 'none';

    // Tables with no primary name column have no name row to hide the refresh
    // control in, so it moves to the table name row rather than disappearing.
    var host = value ? ui.nameRow : ui.tableRow;
    if (ui.refreshHolder.parentNode !== host) host.appendChild(ui.refreshHolder);
    ui.tableRow.style.justifyContent = value ? 'flex-start' : 'space-between';

    // With no name above it, the ID row leads the card and needs no gap.
    ui.idRow.style.marginTop = value ? '8px' : '0';
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
  })));

  ui.buttons.push(ui.refreshHolder.appendChild(iconButton(doc, ICON.refresh, 'Reload record details', function () {
    if (!authorised) return;
    refreshRecord();
    // Whatever is listed below belongs to whichever record was open when it
    // was requested, so clear it rather than leaving stale data on screen.
    releaseDisplay();
    say(ui, 'Pick an action.');
    ui.note('Refreshed.');
  })));

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

  // Marks a toggle as on or off: lighter blue fill plus a light blue border
  // while active. The hover pair is swapped too, so hovering an active button
  // does not drop it back to the inactive colour.
  function setToggle(button, on, onLabel, offLabel) {
    if (onLabel && button.labelNode) button.labelNode.textContent = on ? onLabel : offLabel;
    button.style.background = on ? T.buttonActive : T.button;
    button.style.borderColor = on ? T.buttonActiveBorder : 'transparent';
    hover(button,
      on ? T.buttonActive : T.button,
      on ? T.buttonActiveHover : T.buttonHover);
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

      say(ui, 'Schema names shown on ' + applied.length + ' fields. Highlighting...');
      scheduleSchemaHighlight(docs, on, store, function (found) {
        var missing = applied.filter(function (name) { return !found[name]; });
        ui.output.textContent = '';
        ui.output.appendChild(el(ui.doc, 'div', {},
          'Schema names shown on ' + applied.length + ' fields, ' +
          (applied.length - missing.length) + ' highlighted.'));
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

  var configGroup = addSection(ui, 'Form configuration');

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
//# sourceMappingURL=sdt-toolkit.js.map
