const componentExamples = {
  checkboxes: [
    {
      id: "header",
      title: "For single question pages",
      description: `
        <p class="govuk-body">
          If presenting only one question on the page, designate the contents of the <code>legend</code> as the page heading. 
          This practice ensures users of screen readers hear the contents only once.
        </p>
        <p class="govuk-body">You will need to include an empty <code>{% title %}</code> block in your web template to remove the default page header and avoid duplication.</p>
      `,
      html: `
<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">
        Which types of waste do you transport?
      </h1>
    </legend>
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-1" name="schema-name" type="checkbox" value="carcasses">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-1">
          Waste from animal carcasses
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-2" name="schema-name" type="checkbox" value="mines">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-2">
          Waste from mines or quarries
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-3" name="schema-name" type="checkbox" value="farm">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-3">
          Farm or agricultural waste
        </label>
      </div>
    </div>
  </fieldset>
</div>
      `,
      layout: "layoutExample"
    },
    {
      id: "standard",
      title: "For multiple question pages",
      description: `<p class="govuk-body">If presenting more than one question on the page, do not set the contents of the <code>legend</code> as the page heading.</p>`,
      html:
`<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend">
      Which types of waste do you transport?
    </legend>
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-1" name="schema-name" type="checkbox" value="carcasses">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-1">
          Waste from animal carcasses
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-2" name="schema-name" type="checkbox" value="mines">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-2">
          Waste from mines or quarries
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-3" name="schema-name" type="checkbox" value="farm">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-3">
          Farm or agricultural waste
        </label>
      </div>
    </div>
  </fieldset>
</div>`,
      layout: "layoutExampleWithTitle"
    },
    {
      id: "hint",
      title: "Using hint text",
      description:
        `<p class="govuk-body">
          Use hint text to provide relevant assistance to the majority of users, such as clarifying how their information will be used or where to locate it. 
          The hint text block is demonstrated in the example below.
        </p>
        <p class="govuk-body">Please ensure the following:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Use the hint text block appropriately</li>
          <li>Place the hint block correctly within your HTML component</li>
          <li>Add the <code>aria-describedby</code> attribute where necessary, for accessibility. For checkboxes this is against the <code>fieldset</code>.</li>
        </ul>
        <p class="govuk-body">
          Avoid lengthy paragraphs and lists in hint text, as screen readers will read out the entire content, potentially frustrating users. 
          Additionally, refrain from including links within hint text, as screen readers do not indicate that the text is a clickable link.
        </p>`,
      html:
`<div class="govuk-form-group">
  <fieldset class="govuk-fieldset" aria-describedby="schema-name-hint">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">
        Which types of waste do you transport?
      </h1>
    </legend>
    <div id="schema-name-hint" class="govuk-hint">
      Select all that apply.
    </div>
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-1" name="schema-name" type="checkbox" value="carcasses">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-1">
          Waste from animal carcasses
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-2" name="schema-name" type="checkbox" value="mines">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-2">
          Waste from mines or quarries
        </label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="schema-name-3" name="schema-name" type="checkbox" value="farm">
        <label class="govuk-label govuk-checkboxes__label" for="schema-name-3">
          Farm or agricultural waste
        </label>
      </div>
    </div>
  </fieldset>
</div>`,
      layout: "layoutExample"
    }
  ],
  contents:[

  ]
};

export default componentExamples;