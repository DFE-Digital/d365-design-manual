var DfEPortal = DfEPortal || {};  // if variable is not defined then set it to an empty object, otherwise do nothing.

DfEPortal = {

  ValidateData: async function (inputsToValidate) {
    try {
      DfEPortal.Errors.HideErrorSummary();
      const results = await Promise.all(inputsToValidate.map(inputObj => this.CheckInput(inputObj)));
      if (results.every(result => result.resolve === true)) {
        DfEPortal.Errors.HideErrorSummary();
        return Promise.resolve();
      } else {
        DfEPortal.Errors.ShowErrorSummary();
        return Promise.reject();
      }
    } catch (error) {
      console.error(error);
      DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      DfEPortal.Errors.ShowErrorSummary();
      return Promise.reject();
    }
  },

  CheckInput: async function (inputObj) {
    try {
      const successObj = await this.RunValidation(inputObj);
      inputObj.resolve = true;
      DfEPortal.Errors.ClearInputError(successObj.identifier, inputObj.type);
      DfEPortal.Errors.RemoveErrorSummaryDetail(successObj.identifier);
      return inputObj;
    } catch (errorObj) {
      inputObj.resolve = false;
      DfEPortal.Errors.ShowInputError(errorObj.identifier, inputObj.type, errorObj.errorMessage);
      DfEPortal.Errors.AddErrorSummaryDetail(errorObj.identifier, errorObj.errorMessage);
      return inputObj;
    }
  },

  RunValidation: async function (inputObj) {
    const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
    
    if (!identifierValidObj.value) {
      DfEPortal.Errors.ShowErrorSummary();
      DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      return Promise.reject(identifierValidObj);
    }
    
    const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
    if (!nullCheckObj.value) {
      return Promise.reject(nullCheckObj);
    }
    
    if (inputObj.type === 'number') {
      return this.ValidateNumber(inputObj);
    }
    if (inputObj.type === 'whole-number') {
      return this.ValidateWholeNumber(inputObj);
    }
    if (inputObj.type === 'decimal-number') {
      return this.ValidateDecimalNumber(inputObj);
    }
    if (inputObj.type === 'text') {
      return this.ValidateText(inputObj);
    }
    if (inputObj.type === 'text-area') {
      return this.ValidateTextArea(inputObj);
    }
    if (inputObj.type === 'email') {
      return this.ValidateEmail(inputObj);
    }
    if (inputObj.type === 'tel') {
      return this.ValidateTelephone(inputObj);
    }
    if (inputObj.type === 'radio' || inputObj.type === 'checkbox' || inputObj.type === 'select') {
      return Promise.resolve(inputObj);
    }
    if (inputObj.type === "date") {
      return this.ValidateDate(inputObj);
    }
  },

  ValidateNumber: async function (inputObj) {
    const identifier = inputObj.identifier;
    const friendlyName = inputObj.friendlyName;

    // Validate if it's a number
    const isNumberObj = DfEPortal.ValidationHelper.IsNumber(identifier, friendlyName);
    if (!isNumberObj.value) {
        return Promise.reject(isNumberObj);
    }

    // Perform MinMaxValueChecks
    const minMaxValueCheckObj = DfEPortal.ValidationHelper.MinMaxValueChecks(identifier, friendlyName);
    if (!minMaxValueCheckObj.value) {
        return Promise.reject(minMaxValueCheckObj);
    }

    // If it reaches this point, the number input is valid
    return Promise.resolve(inputObj);
  },

  ValidateWholeNumber: async function (inputObj) {
    const identifier = inputObj.identifier;
    const friendlyName = inputObj.friendlyName;

    // Validate if it's a number
    const isNumberObj = DfEPortal.ValidationHelper.IsNumber(identifier, friendlyName);
    if (!isNumberObj.value) {
        return Promise.reject(isNumberObj);
    }

    // Validate if it's a whole number
    const isWholeNumberObj = DfEPortal.ValidationHelper.IsWholeNumber(identifier, friendlyName);
    if (!isWholeNumberObj.value) {
        return Promise.reject(isWholeNumberObj);
    }

    // Perform MinMaxCharacterChecks
    const minMaxCharacterCheckObj = DfEPortal.ValidationHelper.MinMaxCharacterChecks(identifier, friendlyName);
    if (!minMaxCharacterCheckObj.value) {
        return Promise.reject(minMaxCharacterCheckObj);
    }

    // Perform MinMaxValueChecks
    const minMaxValueCheckObj = DfEPortal.ValidationHelper.MinMaxValueChecks(identifier, friendlyName);
    if (!minMaxValueCheckObj.value) {
        return Promise.reject(minMaxValueCheckObj);
    }

    // If it reaches this point, the whole number input is valid
    return Promise.resolve(inputObj);
  },

  ValidateDecimalNumber: async function (inputObj) {
    const identifier = inputObj.identifier;
    const friendlyName = inputObj.friendlyName;

    // Validate if it's a number
    const isNumberObj = DfEPortal.ValidationHelper.IsNumber(identifier, friendlyName);
    if (!isNumberObj.value) {
        return Promise.reject(isNumberObj);
    }

    // Validate if it's a decimal number
    const isDecimalNumberObj = DfEPortal.ValidationHelper.IsDecimalNumber(identifier, friendlyName);
    if (!isDecimalNumberObj.value) {
        return Promise.reject(isDecimalNumberObj);
    }

    // Perform MinMaxValueChecks
    const minMaxValueCheckObj = DfEPortal.ValidationHelper.MinMaxValueChecks(identifier, friendlyName);
    if (!minMaxValueCheckObj.value) {
        return Promise.reject(minMaxValueCheckObj);
    }

    // If it reaches this point, the decimal number input is valid
    return Promise.resolve(inputObj);
  },

  ValidateText: async function (inputObj) {
    const identifier = inputObj.identifier;
    const targetType = inputObj.targetType;
    const friendlyName = inputObj.friendlyName;
    const targetEntity = inputObj.targetEntity;
    const targetEntitySearchField = inputObj.targetEntitySearchField;
    const targetEntityPrimaryKey = inputObj.targetEntityPrimaryKey;

    // If it's a lookup text input, perform TextInputSearchValidation
    if (targetType === 'lookup') {
        const searchValidationObj = await DfEPortal.ValidationHelper.TextInputSearchValidation(identifier, targetEntity, targetEntitySearchField, targetEntityPrimaryKey, friendlyName);
        if (!searchValidationObj.value) {
            return Promise.reject(searchValidationObj);
        }
        // Assign the target entity ID to the inputObj
        inputObj.targetEntityId = searchValidationObj.targetEntityId;
    }

    // Perform MinMaxCharacterChecks
    const minMaxCharacterCheckObj = DfEPortal.ValidationHelper.MinMaxCharacterChecks(identifier, friendlyName);
    if (!minMaxCharacterCheckObj.value) {
        return Promise.reject(minMaxCharacterCheckObj);
    }

    // If it reaches this point, the text input is valid
    return Promise.resolve(inputObj);
  },

  ValidateTextArea: async function (inputObj) {
    const identifier = inputObj.identifier;
    const friendlyName = inputObj.friendlyName;

    // Validate character count container
    const characterCountCheckObj = DfEPortal.ValidationHelper.CharacterCountContainerCheck(identifier, friendlyName);
    if (!characterCountCheckObj.value) {
        return Promise.reject(characterCountCheckObj);
    }

    // Perform MinMaxCharacterChecks
    const minMaxCharacterCheckObj = DfEPortal.ValidationHelper.MinMaxCharacterChecks(identifier, inputObj.type, friendlyName);
    if (!minMaxCharacterCheckObj.value) {
        return Promise.reject(minMaxCharacterCheckObj);
    }

    // If it reaches this point, the text area input is valid
    return Promise.resolve(inputObj);
  },

  ValidateEmail: async function (inputObj) {
    const identifier = inputObj.identifier;

    // Validate email format
    const isEmailObj = DfEPortal.ValidationHelper.IsEmail(identifier);
    if (!isEmailObj.value) {
        return Promise.reject(isEmailObj);
    }

    // If it reaches this point, the email input is valid
    return Promise.resolve(inputObj);
  },

  ValidateTelephone: async function (inputObj) {
    const identifier = inputObj.identifier;

    // Validate telephone format
    const isTelephoneObj = DfEPortal.ValidationHelper.IsTelephone(identifier);
    if (!isTelephoneObj.value) {
        return Promise.reject(isTelephoneObj);
    }

    // If it reaches this point, the telephone input is valid
    return Promise.resolve(inputObj);
  },

  ValidateOption: async function (inputObj) {
    // No addition functions other than NullCheck at this stage
    // The option input is valid
    //return Promise.resolve(inputObj);
  },

  ValidateDate: async function (inputObj) {
    const identifier = inputObj.identifier;
    const friendlyName = inputObj.friendlyName;

    // Validate date format
    const dateInputsObj = DfEPortal.ValidationHelper.ValidateDateInputs(identifier, friendlyName);
    if (!dateInputsObj.value) {
        return Promise.reject(dateInputsObj);
    }

    // Validate if the date is valid
    const isDateValidObj = DfEPortal.ValidationHelper.IsDateValid(identifier, friendlyName);
    if (!isDateValidObj.value) {
        return Promise.reject(isDateValidObj);
    }

    // If it reaches this point, the date input is valid
    return Promise.resolve(inputObj);
  },

  DisableButton: function (btnId) {
    $(`#${btnId}`).addClass("govuk-button--disabled");
    $(`#${btnId}`).attr("disabled", "disabled");
  },

  EnableButton: function (btnId) {
    $(`#${btnId}`).removeClass("govuk-button--disabled");
    $(`#${btnId}`).removeAttr("disabled");
  },

  ShowLoadingSpinner: function (loaderId) {
    $(`#${loaderId}`).removeClass('govuk-visually-hidden');
  },

  HideLoadingSpinner: function (loaderId) {
    $(`#${loaderId}`).addClass('govuk-visually-hidden');
  }
}

DfEPortal.ValidationHelper = {

  InputTypes: {
    Radio: "radio",
    Checkbox: "checkbox",
    Date: "date",
    Select: "select",
    Text: "text"
  },

  IsIdentifierValid: function (input, type) {
      const selector = type === this.InputTypes.Radio || type === this.InputTypes.Checkbox
          ? `input[name='${input}']`
          : `#${input}`;

      const elements = $(selector);
      const exists = elements.length > 0;
      const errorMessage = exists ? null : `'${input}' identifier cannot be found`;

      return { identifier: input, value: exists, errorMessage };
  },

  NullCheck: function (input, type, friendlyName, required) {
    if (!required) {
        return { identifier: input, value: true, errorMessage: null };
    }

    const $input = $(`#${input}`);
    const inputName = `input[name='${input}']`;

    if (type === this.InputTypes.Radio || type === this.InputTypes.Checkbox) {
        const checked = $(inputName).is(':checked');
        return {
            identifier: input,
            value: checked,
            errorMessage: checked ? null : `Select ${friendlyName.toLowerCase()}`
        };
    } else if (type === this.InputTypes.Select) {
        const selectedValue = $input.find('option:selected').val();
        return {
            identifier: input,
            value: selectedValue !== "",
            errorMessage: selectedValue !== "" ? null : `Choose ${friendlyName.toLowerCase()}`
        };
    } else if (type === this.InputTypes.Date) {
        const dateObj = { day: null, month: null, year: null };
        const inputs = $(`input[name="${input}"]`);
        inputs.each(function () {
            const id = $(this).attr('id');
            if (id.includes('-day')) {
                dateObj.day = $(this).val();
            } else if (id.includes('-month')) {
                dateObj.month = $(this).val();
            } else if (id.includes('-year')) {
                dateObj.year = $(this).val();
            }
        });

        const hasNullValues = Object.values(dateObj).some(val => val === null);
        if (hasNullValues) {
            const nullFields = Object.keys(dateObj).filter(key => dateObj[key] === null);
            const messageStr = `${this.ToProperCase(friendlyName)} must contain a ${nullFields.join(' and ')}`;
            return {
                identifier: input,
                value: false,
                errorMessage: messageStr
            };
        }

        return { identifier: input, value: true, errorMessage: null };
    } else {
        const inputValue = $input.val();
        return {
            identifier: input,
            value: inputValue ? true : false,
            errorMessage: inputValue ? null : `Enter ${friendlyName.toLowerCase()}`
        };
    }
  },


  ValidateDateInputs: function (input, friendlyName) {
    const dateObj = { day: null, month: null, year: null };
    const inputs = $(`input[name="${input}"]`);

    inputs.each(function () {
        const id = $(this).attr('id');
        if (id.includes('-day')) {
            dateObj.day = $(this).val();
        } else if (id.includes('-month')) {
            dateObj.month = $(this).val();
        } else if (id.includes('-year')) {
            dateObj.year = $(this).val();
        }
    });

    const invalidDates = [];

    for (const [key, value] of Object.entries(dateObj)) {
        const int = parseInt(value);
        const isNumber = !isNaN(int);

        if (key === "day") {
            if (!isNumber || int < 1 || int > 31) {
                invalidDates.push(key);
            }
        } else if (key === "month") {
            if (!isNumber || int < 1 || int > 12) {
                invalidDates.push(key);
            }
        } else if (key === "year") {
            if (!isNumber || value.length !== 4) {
                invalidDates.push(key);
            }
        }
    }

    if (invalidDates.length > 0) {
        const invalidDateStr = invalidDates.map(key => `${key}`).join(' and ');
        const messageStr = `${this.ToProperCase(friendlyName)} must contain a valid ${invalidDateStr}`;

        return {
            identifier: input,
            value: false,
            errorMessage: messageStr
        };
    } else {
        return {
            identifier: input,
            value: true,
            errorMessage: null
        };
    }
  },

  IsDateValid: function (input, friendlyName) {
    const dateObj = { day: null, month: null, year: null };
    const inputs = $(`input[name="${input}"]`);

    inputs.each(function () {
        const id = $(this).attr('id');
        if (id.includes('-day')) {
            dateObj.day = $(this).val();
        } else if (id.includes('-month')) {
            dateObj.month = $(this).val();
        } else if (id.includes('-year')) {
            dateObj.year = $(this).val();
        }
    });

    const dateValues = Object.values(dateObj).filter(value => value !== null);

    if (dateValues.length > 0) {
        const dateObjCount = Object.keys(dateObj).length;

        if (dateObjCount === 3) {
            const year = parseInt(dateObj.year);
            const month = parseInt(dateObj.month);
            const day = parseInt(dateObj.day);

            const isLeapYear = (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0));
            const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
                return {
                    identifier: input,
                    value: false,
                    errorMessage: `${this.ToProperCase(friendlyName)} must be a real date`
                };
            }

            // Construct a standardized date string
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Validate the date string format
            const datePattern = /^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
            if (!datePattern.test(dateStr)) {
                return {
                    identifier: input,
                    value: false,
                    errorMessage: `${this.ToProperCase(friendlyName)} must be a real date`
                };
            }
        } else {
            // Need to add validation here for cases with just Day and Month
        }
    }

    return {
        identifier: input,
        value: true,
        errorMessage: null
    };
  },

  IsNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val();

    if (value.length > 0 && !isNaN(value)) {
        return {
            identifier: input,
            value: true,
            errorMessage: null
        };
    } else {
        return {
            identifier: input,
            value: false,
            errorMessage: `${this.ToProperCase(friendlyName)} must be a number`
        };
    }
  },


  IsWholeNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val();

    if (value.length > 0 && Number.isInteger(Number(value))) {
        return {
            identifier: input,
            value: true,
            errorMessage: null
        };
    } else {
        return {
            identifier: input,
            value: false,
            errorMessage: `${this.ToProperCase(friendlyName)} must be a whole number`
        };
    }
  },

  IsDecimalNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val();

    if (value.length > 0 && !isNaN(value) && value.includes('.')) {
        return {
            identifier: input,
            value: true,
            errorMessage: null
        };
    } else {
        return {
            identifier: input,
            value: false,
            errorMessage: `${this.ToProperCase(friendlyName)} must be a decimal number`
        };
    }
  },


  IsEmail: function (input) {
    const inputLength = $(`#${input}`).val().length;
    if (inputLength > 0) {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return {
        identifier: input,
        value: $(`#${input}`).val().match(mailformat) ? true : false,
        errorMessage: $(`#${input}`).val().match(mailformat) ? null : 'Enter a valid email address'
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsTelephone: function (input) {
    const inputVal = $(`#${input}`).val();
    if (inputVal.length > 0) {
      const telephoneFormat = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
      const mobileFormat = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
      return {
        identifier: input,
        value: inputVal.match(telephoneFormat) || inputVal.match(mobileFormat) ? true : false,
        errorMessage: inputVal.match(telephoneFormat) || inputVal.match(mobileFormat) ? null : "Enter a telephone number in the correct format, like 01632 960 001, 07700 900 982 or +44 808 157 0192"
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  CharacterCountContainerCheck: function (input, friendlyName) {
    const characterCountContainer = $(`#${input}`).closest('govuk-character-count');
    if (characterCountContainer) {
      const inputLength = $(`#${input}`).val().length;
      if (inputLength > 0) {
        const maxLength = $(`#${input}`).closest('.govuk-character-count').attr("data-maxlength");
        return {
          identifier: input,
          value: inputLength > maxLength ? false : true,
          errorMessage: inputLength > maxLength ? `${this.ToProperCase(friendlyName)} must be ${maxLength} characters or less` : null
        }
      } else {
        return {
          identifier: input,
          value: true,
          errorMessage: null
        }
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  MinMaxCharacterChecks: function (input, friendlyName) {
    const maxLength = $(`#${input}`).attr('maxchar');
    const minLength = $(`#${input}`).attr('minchar');
    if (minLength || maxLength) {
      if (maxLength && !minLength) {
        return this.InputMaxCharacterCheck(input, friendlyName, minLength);
      } else if (!maxLength && minLength) {
        return this.InputMinCharacterCheck(input, friendlyName, minLength);
      } else if (maxLength && minLength) {
        return this.InputBetweenCharacterCheck(input, friendlyName, minLength, maxLength);
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  MinMaxValueChecks: function (input, friendlyName) {
    const maxValue = $(`#${input}`).attr('maxvalue');
    const minValue = $(`#${input}`).attr('minvalue');
    if (minValue || maxValue) {
      if (maxValue && !minValue) {
        return this.InputMaxValueCheck(input, friendlyName, maxValue);
      } else if (!maxValue && minValue) {
        return this.InputMinValueCheck(input, friendlyName, minValue);
      } else if (maxValue && minValue) {
        return this.InputBetweenValueCheck(input, friendlyName, minValue, maxValue);
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  InputMaxCharacterCheck: function (input, friendlyName, maxLength) {
      const inputLength = $(`#${input}`).val().length;
      if (inputLength > 0) {
        const maxLengthFormatted = parseInt(maxLength);
        return {
          identifier: input,
          value: inputLength > maxLengthFormatted ? false : true,
          errorMessage: inputLength > maxLengthFormatted ? `${this.ToProperCase(friendlyName)} must be ${maxLengthFormatted} characters or less` : null
        }
      } else {
        return {
          identifier: input,
          value: true,
          errorMessage: null
        }
      }
  },

  InputMinCharacterCheck: function (input, friendlyName, minLength) {
    const inputLength = $(`#${input}`).val().length;
    if (inputLength > 0) {
      const minLengthFormatted = parseInt(minLength);
      return {
        identifier: input,
        value: inputLength < minLengthFormatted ? false : true,
        errorMessage: inputLength < minLengthFormatted ? `${this.ToProperCase(friendlyName)} must be ${minLengthFormatted} characters or more` : null
      }
    } else {
      return {
        identifier: input,
        value: true,
        errorMessage: null
      }
    }
  },

  InputBetweenCharacterCheck: function (input, friendlyName, minLength, maxLength) {
      const inputLength = $(`#${input}`).val().length;
      const minLengthFormatted = parseInt(minLength);
      const maxLengthFormatted = parseInt(maxLength);

      if (!inputLength > 0) {
        return {
          identifier: input,
          value: true,
          errorMessage: null
        }
      }
      
      if (minLengthFormatted == maxLengthFormatted) {
        return {
          identifier: input,
          value: inputLength == minLength ? true : false,
          errorMessage: inputLength == minLength ? null : `${this.ToProperCase(friendlyName)} must be ${minLength} characters`
        }
      }

      return {
        identifier: input,
        value: inputLength >= minLengthFormatted && inputLength <= maxLengthFormatted ? true : false,
        errorMessage: inputLength >= minLengthFormatted && inputLength <= maxLengthFormatted ? null : `${this.ToProperCase(friendlyName)} must be between ${minLengthFormatted} and ${maxLengthFormatted} characters`
      }
  },

  InputMaxValueCheck: function (input, friendlyName, maxValue) {
    const inputValue = $(`#${input}`).val();
    const maxValueFormatted = parseInt(maxValue);

    if (!inputValue > 0) {
      return { identifier: input, value: true, errorMessage: null }
    }

    return { 
      identifier: input, 
      value: inputValue > maxValueFormatted ? false : true, 
      errorMessage: inputValue > maxValueFormatted ? `${this.ToProperCase(friendlyName)} must be ${maxValueFormatted} or fewer` : null 
    }
  },

  InputMinValueCheck: function (input, friendlyName, minValue) {
    const inputValue = $(`#${input}`).val();
    const minValueFormatted = parseInt(minValue);

    if (!inputValue > 0) {
      return { identifier: input, value: true, errorMessage: null }
    }
    
    if (inputValue < minValueFormatted) {
      return { identifier: input, value: false, errorMessage: `${this.ToProperCase(friendlyName)} must be ${minValueFormatted} or more` }
    } else {
      return { identifier: input, value: true, errorMessage: null }
    }
  },

  InputBetweenValueCheck: function (input, friendlyName, minValue, maxValue) {
    const inputValue = $(`#${input}`).val();
    const minValueFormatted = parseInt(minValue);
    const maxValueFormatted = parseInt(maxValue);

    if (!inputValue > 0) {
      return { identifier: input, value: true, errorMessage: null }
    }

    if (minValueFormatted == maxValueFormatted) {
      return { 
        identifier: input,
        value: inputValue == minValueFormatted ? true : false,
        errorMessage: inputValue == minValueFormatted ? null : `${this.ToProperCase(friendlyName)} must be ${minValueFormatted}`
      }
    }

    return {
      identifier: input,
      value: inputValue >= minValueFormatted && inputValue <= maxValueFormatted ? true : false,
      errorMessage: inputValue >= minValueFormatted && inputValue <= maxValueFormatted ? null : `${this.ToProperCase(friendlyName)} must be between ${minValueFormatted} and ${maxValueFormatted}`
    }
  },

  TextInputSearchValidation: async function(input, targetEntity, targetEntitySearchField, targetEntityPrimaryKey, friendlyName) {
    const inputVal = $(`#${input}`).val();
  
    if (!inputVal) {
      return {
        identifier: input,
        value: true,
        errorMessage: null 
      }
    }
  
    const searchQuery = `?$select=${targetEntityPrimaryKey}&$filter=(${targetEntitySearchField} eq '${inputVal}')`;
    
    try {
      const res = await webapi.safeAjax({
        type: "GET",
        url: `/_api/${targetEntity}${searchQuery}`,
        contentType: "application/json"
      });
  
      return {
        identifier: input,
        value: res.value.length > 0,
        errorMessage: res.value.length > 0 ? null : this.ToProperCase(`${friendlyName} cannot be found`),
        targetEntityId: res.value.length > 0 ? res.value[0][targetEntityPrimaryKey] : null
      };
    } catch (error) {
      console.error(error);
      return {
        identifier: input,
        value: false,
        errorMessage: "Error performing search. Please contact the DfE."
      };
    }
  },

  FileUploadNullCheck: function (input, friendlyName) {
    const fileLength = document.getElementById(`${input}`).files.length;
    return {
      identifier: input,
      valid: fileLength > 0 ? true : false,
      errorMessage: fileLength > 0 ? null : `Select a file for ${friendlyName.toLowerCase()}`
    }
  },

  FileSizeCheck(input, friendlyName, maxFileSize) {
    var file = document.getElementById(`${input}`).files[0];
    const fileSize = file.size;
    const fileSizeLimit = maxFileSize;
    return {
      identifier: input,
      valid: fileSize > fileSizeLimit ? false : true,
      errorMessage: fileSize > fileSizeLimit ? `${friendlyName} must be smaller than 32MB` : null
    }
  },

  ToProperCase: function (text) {
    return text[0].toUpperCase() + text.substr(1)
  },
}

DfEPortal.Errors = {

  ShowInputError: function (input, type, message) {
    const formGroup = type === "radio" || type === "checkbox"
      ? $(`input[name='${input}']`).closest('.govuk-form-group')
      : $(`#${input}`).closest('.govuk-form-group');
  
    const errorContainerId = `${input}-error`;
    let errorContainer = $(`#${errorContainerId}`);
  
    if (errorContainer.length === 0) {
      errorContainer = $('<p/>', {
        id: errorContainerId,
        class: 'govuk-error-message',
      });
  
      const errorSpan = $('<span/>', {
        class: 'govuk-visually-hidden',
        text: 'Error:',
      });
  
      errorContainer.append(errorSpan);
  
      if (type === "radio") {
        formGroup.find('.govuk-radios').before(errorContainer);
      } else if (type === "checkbox") {
        formGroup.find('.govuk-checkboxes').before(errorContainer);  
      } else if (type === "date") {
        formGroup.find('.govuk-date-input').before(errorContainer)
      } else if (type === "select") {
        formGroup.find('.govuk-select').before(errorContainer)
      } else if (type === "text-area") {
        formGroup.find('textarea').before(errorContainer);
      } else if (type === "text" || type === "tel" || type === "email" || type === "number" || type === "whole-number" || type === "decimal-number" || type === "search") {
        formGroup.find('input').before(errorContainer);
      }
    }

    errorContainer.text('');
    errorContainer.append(message);
    formGroup.addClass('govuk-form-group--error');
  
    if (type === "select") {
      $(`#${input}`).addClass('govuk-select--error');
    } else if (type === "date") {
      $(`#${input} input`).addClass('govuk-input--error');
    } else if (type === "text-area") {
      $(`#${input}`).addClass('govuk-textarea--error');
    } else if (type ==="text" || type ==="tel" || type ==="email" || type ==="number" || type ==="whole-number" || type ==="decimal-number" || type ==="search") {
      $(`#${input}`).addClass('govuk-input--error');
    }
  },
  

  ClearInputError: function (input, type) {
    const formGroup = type === "radio" || type === "checkbox"
        ? $(`input[name='${input}']`).closest('.govuk-form-group')
        : $(`#${input}`).closest('.govuk-form-group');
  
    const errorContainerId = `${input}-error`;
    const errorContainer = $(`#${errorContainerId}`);
  
    if (errorContainer.length > 0) {
        errorContainer.remove();
    }
  
    formGroup.removeClass('govuk-form-group--error');
  
    if (type === "select") {
        $(`#${input}`).removeClass('govuk-select--error');
    } else if (type === "date") {
        $(`#${input} input`).removeClass('govuk-input--error');
    } else if (type === "text-area") {
        $(`#${input}`).removeClass('govuk-textarea--error');
    } else if (type === "text" || type === "tel" || type === "email" || type === "number" || type === "whole-number" || type === "decimal-number" || type === "search") {
        $(`#${input}`).removeClass('govuk-input--error');
    }
  },


  HideErrorSummary: function () {
    $('.govuk-error-summary').addClass('govuk-visually-hidden');
  },

  ShowErrorSummary: function (scrollOptions) {
    $('.govuk-error-summary').removeClass('govuk-visually-hidden');
    
    if (scrollOptions && typeof scrollOptions === 'object') {
      const { offset = 0, duration = 1000 } = scrollOptions;
      
      $('html, body').animate(
        {
          scrollTop: $('.govuk-error-summary').offset().top + offset
        },
        duration
      );
    } else {
      $('html, body').animate({
        scrollTop: $('.govuk-error-summary').offset().top
      }, 1000);
    }

    $('.govuk-error-summary').trigger('focus');
  },

  AddErrorSummaryDetail: function (input, message) {
    const errorSummaryList = $('.govuk-error-summary__list');
    const errorSummaryLink = errorSummaryList.find(`a[href='#${input}-error']`);
    
    if (input === "") {
      const listElem = $('<li><a href="#">' + message + '</a></li>');
      errorSummaryList.append(listElem);
    } else if (errorSummaryLink.length) {
      errorSummaryLink.text(message);
    } else {
      const listElem = $('<li><a href="#' + input + '-error">' + message + '</a></li>');
      errorSummaryList.append(listElem);
    }
  },

  RemoveErrorSummaryDetail: function (input) {
    const errorSummaryLink = $(`a[href='#${input}-error']`);
    if (errorSummaryLink.length) {
      errorSummaryLink.closest('li').remove();
    }
  },

  ShowWebApiError: function () {
    this.AddErrorSummaryDetail("submit-btn", "There has been a problem submitting your information. Please contact the DfE.");
    this.ShowErrorSummary();
  }  
}

DfEPortal.WebApi = {

  Init: function () {
    (function (webapi, $) {
      function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();

        shell.getTokenDeferred().done(function (token) {
          // add headers for AJAX
          if (!ajaxOptions.headers) {
            $.extend(ajaxOptions, {
              headers: {
                "__RequestVerificationToken": token
              }
            });
          } else {
            ajaxOptions.headers["__RequestVerificationToken"] = token;
          }
          $.ajax(ajaxOptions)
            .done(function (data, textStatus, jqXHR) {
              validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
            }).fail(deferredAjax.reject); //AJAX
        }).fail(function () {
          deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
        });

        return deferredAjax.promise();
      }
      webapi.safeAjax = safeAjax;
    })(window.webapi = window.webapi || {}, jQuery)
    // Notification component
    var notificationMsg = (function () {
      var $processingMsgEl = $('#processingMsg'),
        _msg = 'Processing...',
        _stack = 0,
        _endTimeout;
      return {
        show: function (msg) {
          $processingMsgEl.text(msg || _msg);
          if (_stack === 0) {
            clearTimeout(_endTimeout);
            $processingMsgEl.show();
          }
          _stack++;
        },
        hide: function () {
          _stack--;
          if (_stack <= 0) {
            _stack = 0;
            clearTimeout(_endTimeout);
            _endTimeout = setTimeout(function () {
              $processingMsgEl.hide();
            }, 500);
          }
        }
      }
    })();
  },

  ConstructData: async function (obj) {
    return new Promise(async (resolve, reject) => {
      let data = {};

      function handleInternalError(errorMessage) {
        console.error(errorMessage);
        DfEPortal.Errors.ShowWebApiError();
        reject();
      }
  
      function handleText(objItem) {
        if (objItem.targetType === "lookup") {
          const { identifier, targetEntity, targetEntityId } = objItem;
          const isTargetEntityIdDefined = targetEntityId !== undefined;
      
          const dataKey = isTargetEntityIdDefined ? `${identifier}@odata.bind` : identifier;
          const dataValue = isTargetEntityIdDefined
            ? `/${targetEntity}(${targetEntityId})`
            : null;
      
          $.extend(data, { [dataKey]: dataValue });
        } else {
          $.extend(data, { [objItem.identifier]: $(`#${objItem.identifier}`).val() });
        }
      }

      
      function handleNumber(objItem) {
        const inputMode = $(`#${objItem.identifier}`).attr("inputmode");
        const isNumericInput = inputMode === "numeric";
      
        const dataValue = isNumericInput
          ? parseInt($(`#${objItem.identifier}`).val())
          : $(`#${objItem.identifier}`).val();
      
        $.extend(data, { [objItem.identifier]: dataValue });
      }
  
      function handleDecimalNumber(objItem) {
        const inputMode = $(`#${objItem.identifier}`).attr("inputmode");
        const isNumericInput = inputMode === "numeric";
      
        const dataValue = isNumericInput
          ? parseFloat($(`#${objItem.identifier}`).val())
          : $(`#${objItem.identifier}`).val();
      
        $.extend(data, { [objItem.identifier]: dataValue });
      }
  
      function handleDate(objItem) {
        let dateObj = {};
        const inputs = $(`input[name="${objItem.identifier}"]`);
        
        inputs.each(function () {
          const id = $(this).attr('id');
          if (id.includes('-day')) {
            dateObj.day = $(this).val();
          } else if (id.includes('-month')) {
            dateObj.month = $(this).val();
          } else if (id.includes('-year')) {
            dateObj.year = $(this).val();
          }
        });
      
        const dateValues = Object.values(dateObj).filter(Boolean);
        const dateValueCount = dateValues.length;
      
        if (dateValueCount > 0) {
          const padNumber = (num, places) => String(num).padStart(places, '0');
          
          const formattedDateObj = Object.keys(dateObj).reduce((formatted, index) => {
            if ((index === "day" || index === "month") && dateObj[index].length < 2) {
              formatted[index] = padNumber(dateObj[index], 2);
            } else {
              formatted[index] = dateObj[index];
            }
            return formatted;
          }, {});
      
          const dateString = `${formattedDateObj.day}/${formattedDateObj.month}/${formattedDateObj.year}`;
          
          if (objItem.targetType === "text") {
            $.extend(data, { [objItem.identifier]: dateString });
          } else {
            const isoDate = new Date(`${formattedDateObj.year}-${formattedDateObj.month}-${formattedDateObj.day}`).toISOString().split('T')[0];
            $.extend(data, { [objItem.identifier]: isoDate });
          }
        } else {
          $.extend(data, { [objItem.identifier]: null });
        }
      }
  
      function handleRadio(objItem) {
        if (objItem.targetType !== null) {
          switch (objItem.targetType) {
            case "lookup":
              if (objItem.targetEntity !== null) {
                const inputName = `input[name='${objItem.identifier}']`;
                const isChecked = $(inputName).is(':checked');
                const checkedValue = isChecked ? $(inputName + ':checked').val() : null;
      
                const odataBindValue = isChecked
                  ? `/${objItem.targetEntity}(${checkedValue})`
                  : null;
      
                $.extend(data, {
                  [`${objItem.identifier}@odata.bind`]: odataBindValue,
                });
              } else {
                handleInternalError(`'targetEntity' is missing from the data object`);
              }
              break;
              
            case "bool":
              const value = $(`input[name='${objItem.identifier}']:checked`).val();
              $.extend(data, {
                [objItem.identifier]: value === "1" ? true : false,
              });
              break;
      
            case "select":
              $.extend(data, {
                [objItem.identifier]: parseInt($(`input[name='${objItem.identifier}']:checked`).val()),
              });
              break;
      
            case "text":
              const checkedId = $(`input[name='${objItem.identifier}']:checked`).attr('id');
              $.extend(data, {
                [objItem.identifier]: $(`label[for='${checkedId}']`).text().trim(),
              });
              break;
      
            default:
              handleInternalError(`'${objItem.targetType}' is not a valid targetType for type '${objItem.type}'`);
              break;
          }
        } else {
          handleInternalError(`'targetType' is missing from the data object`);
        }
      }
  
      function handleCheckbox(objItem) {
        if (objItem.targetType !== null) {
          const length = $(`input[name='${objItem.identifier}']:checked`).length;
          switch (objItem.targetType) {
            case "bool":
              if (length === 1) {
                const value = $(`input[name='${objItem.identifier}']:checked`).val();
                $.extend(data, {
                  [objItem.identifier]: value === "1" ? true : false,
                });
              } else {
                handleInternalError(`${objItem.targetType} targetType can only contain one selection`);
              }
              break;
      
            case "select": 
              if (length === 1) {
                $.extend(data, {
                  [objItem.identifier]: parseInt($(`input[name='${objItem.identifier}']:checked`).val()),
                });
              } else {
                let options = [];
                $.each($(`input[name='${objItem.identifier}']:checked`), (index, input) => {
                  options.push(parseInt($(input).val()));
                });
                $.extend(data, {
                  [objItem.identifier]: options,
                });
              }
              break;
      
            case "text": 
              if (length === 1) {
                const checkedId = $(`input[name='${objItem.identifier}']:checked`).attr('id');
                const labelText = $(`label[for='${checkedId}']`).text().trim();
                $.extend(data, {
                  [objItem.identifier]: labelText,
                });
              } else {
                let options = [];
                $.each($(`input[name='${objItem.identifier}']:checked`), (index, input) => {
                  const checkedId = $(input).attr('id');
                  const labelText = $(`label[for='${checkedId}']`).text().trim();
                  options.push(labelText);
                });
                $.extend(data, {
                  [objItem.identifier]: options,
                });
              }
              break;
      
            default:
              handleInternalError(`'${objItem.targetType}' is not a valid targetType for type '${objItem.type}'`);
              break;
          }
        } else {
          handleInternalError(`'targetType' is missing from the data object`);
        }
      }
  
      function handleSelect(objItem) {
        if (objItem.targetType !== null) {
          switch (objItem.targetType) {
            case "lookup":
              if (objItem.targetEntity !== null) {
                const selectedValue = $(`#${objItem.identifier} option:selected`).val();
                const odataBindValue = selectedValue
                  ? `/${objItem.targetEntity}(${selectedValue})`
                  : null;
                $.extend(data, {
                  [`${objItem.identifier}@odata.bind`]: odataBindValue,
                });
              } else {
                handleInternalError(`'targetEntity' is missing from the data object`);
              }
              break;
      
            case "select":
              $.extend(data, {
                [objItem.identifier]: parseInt($(`#${objItem.identifier} option:selected`).val()),
              });
              break;
      
            case "text":
              $.extend(data, {
                [objItem.identifier]: $(`#${objItem.identifier} option:selected`).text(),
              });
              break;
      
            default:
              handleInternalError(`'${objItem.targetType}' is not a valid targetType for type '${objItem.type}'`);
              break;
          }
        } else {
          handleInternalError(`'targetType' is missing from the data object`);
        }
      }
  
      $.each(obj, function (i, objItem) {
        if (objItem.type === "text") {
          handleText(objItem);
        } else if (objItem.type === "text-area" || objItem.type === "email" || objItem.type === "tel") {
          $.extend(data, {
            [objItem.identifier]: $(`#${objItem.identifier}`).val(),
          });
        } else if (objItem.type === "whole-number") {
          handleNumber(objItem);
        } else if (objItem.type === "decimal-number" || objItem.type === "number") {
          handleDecimalNumber(objItem);
        } else if (objItem.type === "date") {
          handleDate(objItem);
        } else if (objItem.type === "radio") {
          handleRadio(objItem);
        } else if (objItem.type === "checkbox") {
          handleCheckbox(objItem);
        } else if (objItem.type === "select") {
          handleSelect(objItem);
        }
      });
  
      async function waitForData() {
        while (Object.keys(data).length === 0) {
          // Wait for the data object to be populated
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        resolve(data);
      }
  
      waitForData();
    });
  },
  

  Update: function (id, entityName, dataObj) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "PATCH",
        url: `/_api/${entityName}(${id})`,
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function () {
          resolve();
        },
        error: function (res, status, error) {
          DfEPortal.Errors.ShowWebApiError();
          reject(error);
        },
      });
    });
  },

  Create: function (entityName, dataObj) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "POST",
        url: `/_api/${entityName}`,
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function (res, status, xhr) {
          resolve(xhr.getResponseHeader("entityid"));
        },
        error: function (res, status, error) {
          DfEPortal.Errors.ShowWebApiError();
          reject(error);
        },
      });
    });
  },

  Retrieve: function (entityName, searchQuery) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "GET",
        url: `/_api/${entityName}${searchQuery}`,
        contentType: "application/json",
        success: function (res, status, xhr) {
          resolve(res);
        },
        error: function (res, status, error) {
          DfEPortal.Errors.ShowWebApiError();
          reject(error);
        },
      });
    });
  },

  Delete: function (id, entityName) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "DELETE",
        url: `/_api/${entityName}(${id})`,
        contentType: "application/json",
        success: function (res) {
          resolve();
        },
        error: function (res, status, error) {
          DfEPortal.Errors.ShowWebApiError();
          reject(error);
        },
      });
    });
  },

  FileUploadValidation: function (input, friendlyName, maxFileSize) {
    return new Promise((resolve, reject) => {
      const nullCheckObj = DfEPortal.ValidationHelper.FileUploadNullCheck(input, friendlyName);
      if (!nullCheckObj.valid) {
        reject(nullCheckObj);
      } else {
        const fileSizeObj = DfEPortal.ValidationHelper.FileSizeCheck(input, friendlyName, maxFileSize);
        if (!fileSizeObj.valid) {
          reject(fileSizeObj);
        } else {
          resolve(input);
        }
      }
    });
  },

  ProcessFileAndUploadToColumn(inputName, entityName, entityId) {

    return new Promise((resolve, reject) => {
      // Get the name of the selected file
      //var fileName = encodeURIComponent($(`#${inputName}`)).files[0].name;
      var fileName = encodeURIComponent(document.getElementById(inputName).files[0].name);
      // Get the content of the selected file
      //var file = $(`#${inputName}`).files[0];
      var file = document.getElementById(inputName).files[0];
      // If the user has selected a file
      if (file) {
        // Read the file as a byte array
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        // The browser has finished reading the file, we can now do something with it...
        reader.onload = function (e) {
          // The browser has finished reading the file, we can now do something with it...
          var fileContent = e.target.result;

          // Run the function to upload to the Portal Web API, passing the GUID of the newly created record and the file's contents and name as inputs 
          DfEPortal.WebApi.UploadColumnFile(fileContent, fileName, entityId, entityName, inputName)
            .then((fileObj) => {
              resolve(fileObj);
            })
            .catch(errorObj => {
              reject(errorObj);
            });
        }
      } else {
        reject({
          input: inputName,
          errormessage: "File content not found"
        })
      }
    });
  },

  UploadColumnFile(fileContent, fileName, entityID, entityName, inputName) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "PUT",
        url: `/_api/${entityName}(${entityID})/${inputName}?x-ms-file-name=${fileName}`,
        contentType: "application/octet-stream",
        data: fileContent,
        processData: false,
        success: function (data, textStatus, xhr) {
          // Provide some visual feedback re successful upload
          console.log("File uploaded!");
          resolve({
            input: inputName,
            fileName: fileName
          });
        },
        error: function (xhr, textStatus, errorThrown) {
          reject({
            input: inputName,
            errorMessage: "Error uploading file"
          })
        }
      });
    });
  },

  DeleteColumnFile: function (inputName, entityID, entityName) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "DELETE",
        url: `/_api/${entityName}(${entityID})/${inputName}`,
        contentType: "application/json",
        success: function (data, textStatus, xhr) {
          resolve(inputName);
        },
        error: function (xhr, textStatus, errorThrown) {
          reject({
            input: inputName,
            errorMessage: "Error deleting file"
          })
        }
      });
    })
  },

  ProcessFileAndUploadToNotes(inputName, entityName, entityId) {

    return new Promise((resolve, reject) => {
      // Get the name of the selected file
      var fileName = encodeURIComponent(document.getElementById(inputName).files[0].name);

      // Get the mimetype of the selected file
      var mimeType = $(`#${inputName}`).files[0].type;

      // Get the content of the selected file
      var file = $(`#${inputName}`).files[0];

      // If the user has selected a file
      if (file) {
        // Read the file as a byte array
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        // The browser has finished reading the file, we can now do something with it...
        reader.onload = function (e) {
          // The browser has finished reading the file, we can now do something with it...
          var fileContent = e.target.result;

          // Run the function to upload to the Portal Web API, passing the GUID of the newly created record and the file's contents and name as inputs 
          DfEPortal.WebApi.UploadNotesFile(fileContent, fileName, mimeType, entityId, entityName, inputName)
            .then((fileObj) => {
              resolve(fileObj);
            })
            .catch(errorObj => {
              reject(errorObj);
            });
        }
      } else {
        reject({
          input: inputName,
          errormessage: "File content not found"
        })
      }
    });
  },

  UploadNotesFile(fileContent, fileName, mimeType, entityID, entityName, inputName) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        "notetext": "*WEB*",
        "filename": fileName,
        "mimetype": mimeType,
        "documentbody": fileContent,
        "objecttypecode": entityName,
        [`objectid_${entityName}@odata.bind`]: `/${entityName}s("${entityID}")`

      }
      webapi.safeAjax({
        type: "POST",
        url: "/_api/annotations",
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function (data, textStatus, xhr) {
          // Provide some visual feedback re successful upload
          console.log("File uploaded!");
          resolve({
            input: inputName,
            fileName: fileName
          });
        },
        error: function (xhr, textStatus, errorThrown) {
          reject({
            input: inputName,
            errorMessage: "Error uploading file"
          })
        }
      });
    });
  },
}