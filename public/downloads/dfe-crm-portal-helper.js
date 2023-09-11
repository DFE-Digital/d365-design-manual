var DfEPortal = DfEPortal || {};  // if variable is not defined then set it to an empty object, otherwise do nothing.

DfEPortal = {

  ValidateData: function (inputsToValidate) {

    return new Promise((resolve, reject) => {
      $.when(DfEPortal.CheckEachInput(inputsToValidate)).then(() => {
        if (inputsToValidate.filter(e => e.resolve === false).length == 0) {
          DfEPortal.Errors.HideErrorSummary();
          resolve();
        } else {
          DfEPortal.Errors.ShowErrorSummary();
          reject();
        }
      })
    })
  },

  CheckEachInput: function (inputsObj) {
    $.each(inputsObj, function (i) {
      DfEPortal.RunValidation(inputsObj[i])
        .then((identifier) => {
          const inputErrorContainer = $(`#${identifier}-error`);
          if (inputErrorContainer.length > 0) {
            inputsObj[i].resolve = true;
            DfEPortal.Errors.ClearInputError(identifier, inputsObj[i].type);
            DfEPortal.Errors.RemoveErrorSummaryDetail(identifier);
          } else {
            console.error(`Cannot find error container for ${identifier}`);
            inputsObj[i].resolve = false;
            DfEPortal.Errors.AddErrorSummaryDetail(identifier, "Internal error. Please contact the DfE.");
          }
        })
        .catch((error) => {
          inputsObj[i].resolve = false;
          const inputErrorContainer = $(`#${error.input}-error`);
          if (inputErrorContainer.length > 0) {
            DfEPortal.Errors.ClearInputError(error.input, inputsObj[i].type);
            DfEPortal.Errors.ShowInputError(error.input, inputsObj[i].type, error.errorMessage);
            DfEPortal.Errors.AddErrorSummaryDetail(error.input, error.errorMessage);
          } else {
            console.error(`Cannot find error container for ${error.input}`);
            inputsObj[i].resolve = false;
            DfEPortal.Errors.AddErrorSummaryDetail(error.input, "Internal error. Please contact the DfE.");
          }
        })
    })
  },

  RunValidation: function (inputObj) {
    if (inputObj.type == 'number') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const isNumberObj = this.ValidationHelper.IsNumber(inputObj.identifier, inputObj.friendlyName);
            if (!isNumberObj.value) {
              reject(isNumberObj);
            } else {
              const minMaxValueObj = this.ValidationHelper.MinMaxValueChecks(inputObj.identifier, inputObj.friendlyName)
              if (!minMaxValueObj.value) {
                reject(minMaxValueObj);
              } else {
                resolve(inputObj.identifier);
              }  
            }
          }
        });
      }
    } else if (inputObj.type == 'whole-number') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const isNumberObj = this.ValidationHelper.IsNumber(inputObj.identifier, inputObj.friendlyName);
            if (!isNumberObj.value) {
              reject(isNumberObj);
            } else {
              const isWholeNumberObj = this.ValidationHelper.IsWholeNumber(inputObj.identifier, inputObj.friendlyName);
              if (!isWholeNumberObj.value) {
                reject(isWholeNumberObj);
              } else {
                const minMaxCharacterObj = this.ValidationHelper.MinMaxCharacterChecks(inputObj.identifier, inputObj.friendlyName)
                if (!minMaxCharacterObj.value) {
                  reject(minMaxCharacterObj);
                } else {
                  const minMaxValueObj = this.ValidationHelper.MinMaxValueChecks(inputObj.identifier, inputObj.friendlyName)
                  if (!minMaxValueObj.value) {
                    reject(minMaxValueObj);
                  } else {
                    resolve(inputObj.identifier);
                  }
                }
              }
            }
          }
        });
      }
    } else if (inputObj.type == 'decimal-number') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const isNumberObj = this.ValidationHelper.IsNumber(inputObj.identifier, inputObj.friendlyName);
            if (!isNumberObj.value) {
              reject(isNumberObj);
            } else {
              const isDecimalNumberObj = this.ValidationHelper.IsDecimalNumber(inputObj.identifier, inputObj.friendlyName);
              if (!isDecimalNumberObj.value) {
                reject(isDecimalNumberObj);
              } else {
                const minMaxValueObj = this.ValidationHelper.MinMaxValueChecks(inputObj.identifier, inputObj.type, inputObj.friendlyName)
                if (!minMaxValueObj.value) {
                  reject(minMaxValueObj);
                } else {
                  resolve(inputObj.identifier);
                }
              }
            }
          }
        });
      }
    } else if (inputObj.type == 'text') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const minMaxObj = this.ValidationHelper.MinMaxCharacterChecks(inputObj.identifier, inputObj.type, inputObj.friendlyName)
            if (!minMaxObj.value) {
              reject(minMaxObj);
            } else {
              resolve(inputObj.identifier);
            }
          }
        });
      }
    } else if (inputObj.type == 'text-area') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const characterCountObj = this.ValidationHelper.CharacterCountContainerCheck(inputObj.identifier, inputObj.friendlyName);
            if (!characterCountObj.value) {
              reject(characterCountObj);
            } else {
              const minMaxObj = this.ValidationHelper.MinMaxCharacterChecks(inputObj.identifier, inputObj.type, inputObj.friendlyName);
              if (!minMaxObj.value) {
                reject(minMaxObj);
              } else {
                resolve(inputObj.identifier);
              }
            }
          }
        });
      }
    } else if (inputObj.type == 'email') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const isEmailObj = this.ValidationHelper.IsEmail(inputObj.identifier);
            if (!isEmailObj.value) {
              reject(isEmailObj);
            } else {
              resolve(inputObj.identifier);
            }
          }
        });
      }
    } else if (inputObj.type == 'tel') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const isTelephoneObj = this.ValidationHelper.IsTelephone(inputObj.identifier);
            if (!isTelephoneObj.value) {
              reject(isTelephoneObj);
            } else {
              resolve(inputObj.identifier);
            }
          }
        });
      }
    } else if (inputObj.type == 'radio' || inputObj.type == 'checkbox' || inputObj.type == 'select') {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            resolve(inputObj.identifier);
          }
        });
      }
    } else if (inputObj.type == "date") {
      const identifierValidObj = this.ValidationHelper.IsIdentifierValid(inputObj.identifier, inputObj.type);
      if (!identifierValidObj.value) {
        console.error(identifierValidObj.errorMessage);
        DfEPortal.Errors.ShowErrorSummary();
        DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
      } else {
        return new Promise((resolve, reject) => {
          const nullCheckObj = this.ValidationHelper.NullCheck(inputObj.identifier, inputObj.type, inputObj.friendlyName, inputObj.required);
          if (!nullCheckObj.value) {
            reject(nullCheckObj);
          } else {
            const validDateInputsObj = this.ValidationHelper.ValidateDateInputs(inputObj.identifier, inputObj.friendlyName);
            if (!validDateInputsObj.value) {
              reject(validDateInputsObj);
            } else {
              const validDateObj = this.ValidationHelper.IsDateValid(inputObj.identifier, inputObj.friendlyName);
              if (!validDateObj.value) {
                reject(validDateObj);
              } else {
                resolve(inputObj.identifier);
              }
            }
          }
        });
      }
    } else {
      console.error(`'${inputObj.type}' is not a valid data validation type`);
      DfEPortal.Errors.ShowErrorSummary();
      DfEPortal.Errors.AddErrorSummaryDetail(inputObj.identifier, "Internal error. Please contact the DfE.");
    }
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

  IsIdentifierValid: function (input, type) {
    if (type == "radio" || type == "checkbox") {
      return {
        value: $(`input[name='${input}']`).length == 0 ? false : true,
        errorMessage: $(`input[name='${input}']`).length == 0 ? `'${input}' identifier cannot be found` : null
      }
    } else if (type == "date") {
      return {
        value: $(`input[name='${input}']`).length < 3 ? false : true,
        errorMessage: $(`input[name='${input}']`).length < 3 ? `'${input}' cannot be found for 1 or more date identifiers` : null
      }
    } else {
      return {
        value: $(`#${input}`).length == 0 ? false : true,
        errorMessage: $(`#${input}`).length == 0 ? `'${input}' identifier cannot be found` : null
      }
    }
  },

  NullCheck: function (input, type, friendlyName, required) {
    if (required) {
      if (type == "radio") {
        return {
          input: input,
          value: $(`input[name='${input}']:checked`).val() ? true : false,
          errorMessage: $(`input[name='${input}']`).is(':checked') ? null : `Choose ${friendlyName.toLowerCase()}`
        };
      } else if (type == "checkbox") {
        return {
          input: input,
          value: $(`input[name='${input}']:checked`).val() ? true : false,
          errorMessage: $(`input[name='${input}']`).is(':checked') ? null : `Select ${friendlyName.toLowerCase()}`
        };
      } else if (type == "select") {
        return {
          input: input,
          value: $(`#${input} option:selected` ).val() == "" ? false : true,
          errorMessage: $(`#${input} option:selected`).val() == "" ? `Select ${friendlyName.toLowerCase()}` : null
        }
      } else if (type == "date") {
        let dateObj = {};
        const inputs = $(`input[name="${input}"]`);
        inputs.each(function () {
          if ($(this).attr('id').contains('day')) {
            $.extend(dateObj, { day: $(this).val() });
          } else if ($(this).attr('id').contains('month')) {
            $.extend(dateObj, { month: $(this).val() });
          } else if ($(this).attr('id').contains('year')) {
            $.extend(dateObj, { year: $(this).val() });
          }
        });
        const nullDateValues = Object.keys(dateObj).filter(key => {
          return !dateObj[key];
        });
        const dateObjCount = Object.keys(dateObj).length;
        const nullCount = nullDateValues.length;
        if (nullCount > 0 && dateObjCount == nullCount) {
          return {
            input: input,
            value: false,
            errorMessage: `Enter ${friendlyName.toLowerCase()}`
          }
        } else if (nullCount > 0 && dateObjCount != nullCount) {
          var messageStr = `${this.ToProperCase(friendlyName)} must contain a `;
          $.each(nullDateValues, function (index, value) {
            if (index === nullCount - 1) {
              messageStr += `${value}`;
            } else {
              messageStr += `${value} and `;
            }
          });
          return {
            input: input,
            value: false,
            errorMessage: messageStr
          }
        } else {
          return {
            input: input,
            value: true,
            errorMessage: null
          }
        }
      } else {
        return {
          input: input,
          value: $(`#${input}`).val() ? true : false,
          errorMessage: !$(`#${input}`).val() ? `Enter ${friendlyName.toLowerCase()}` : null
        }
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  ValidateDateInputs: function (input, friendlyName) {

    let dateObj = {};
    const inputs = $(`input[name="${input}"]`);
    inputs.each(function () {
      if ($(this).attr('id').contains('day')) {
        $.extend(dateObj, { day: $(this).val() });
      } else if ($(this).attr('id').contains('month')) {
        $.extend(dateObj, { month: $(this).val() });
      } else if ($(this).attr('id').contains('year')) {
        $.extend(dateObj, { year: $(this).val() });
      }
    });

    const dateValues = Object.keys(dateObj).filter(key => {
      return dateObj[key];
    });
    const dateValueCount = dateValues.length;
    if (dateValueCount > 0) {
      let invalidDates = [];
      $.each(dateObj, function (index, value) {
        const int = parseInt(value);
        const isNumber = !isNaN(int);
        if (index == "day") {
          (!isNumber || int < 1 || int > 31) && invalidDates.push(index);
        } else if (index == "month") {
          (!isNumber || int < 1 || int > 12) && invalidDates.push(index);
        } else if (index == "year") {
          (!isNumber || value.length < 4 || value.length > 4) && invalidDates.push(index);
        }
      });

      if (invalidDates.length > 0) {
        var messageStr = `${this.ToProperCase(friendlyName)} must contain a valid `;
        $.each(invalidDates, function (index, value) {
          if (index === invalidDates.length - 1) {
            messageStr += `${value}`;
          } else {
            messageStr += `${value} and `;
          }
        });
        return {
          input: input,
          value: false,
          errorMessage: messageStr
        }
      } else {
        return {
          input: input,
          value: true,
          errorMessage: null
        }
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsDateValid: function (input, friendlyName) {
    let dateObj = {};
    const inputs = $(`input[name="${input}"]`);
    inputs.each(function () {
      if ($(this).attr('id').contains('day')) {
        $.extend(dateObj, { day: $(this).val() });
      } else if ($(this).attr('id').contains('month')) {
        $.extend(dateObj, { month: $(this).val() });
      } else if ($(this).attr('id').contains('year')) {
        $.extend(dateObj, { year: $(this).val() });
      }
    });

    const dateValues = Object.keys(dateObj).filter(key => {
      return dateObj[key];
    });
    const dateValueCount = dateValues.length;
    if (dateValueCount > 0) {

      let dateObjCount = Object.keys(dateObj).length;

      if (dateObjCount == 3) {

        const padNumber = (num, places) => String(num).padStart(places, '0');

        let formattedDateObj = {};

        $.each(dateObj, function (index, value) {
          if (index == "day" || index == "month" && value.length < 2) {
            $.extend(formattedDateObj, { [index]: padNumber(value, 2) });
          } else {
            $.extend(formattedDateObj, { [index]: value });
          }
        });

        const date = `${formattedDateObj.year}-${formattedDateObj.month}-${formattedDateObj.day}`;

        // Date format: YYYY-MM-DD
        const datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

        // Check if the date string format is a match
        const matchArray = date.match(datePattern);
        if (!matchArray) {
          return {
            input: input,
            value: false,
            errorMessage: `${this.ToProperCase(friendlyName)} must be a real date`
          }
        }

        // Remove any non digit characters
        var dateString = date.replace(/\D/g, '');

        // Parse integer values from the date string
        var year = parseInt(dateString.substring(0, 4));
        var month = parseInt(dateString.substring(4, 6));
        var day = parseInt(dateString.substring(6, 8));

        // Define the number of days per month
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
          daysInMonth[1] = 29;
        }

        if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
          return {
            input: input,
            value: false,
            errorMessage: `${this.ToProperCase(friendlyName)} must be a real date`
          }
        } else {
          return {
            input: input,
            value: true,
            errorMessage: null
          }
        }
      } else {
        //Note: Need to add validation here where there are just two date inputs for just Day and Month
        return {
          input: input,
          value: true,
          errorMessage: null
        }
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val();
    if (value.length > 0) {
      return {
        input: input,
        value: isNaN($(`#${input}`).val()) ? false : true,
        errorMessage: isNaN($(`#${input}`).val()) ? `${this.ToProperCase(friendlyName)} must be a number` : null
      };
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsWholeNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val();
    if (value.length > 0) {
      var result = (value - Math.floor(value)) !== 0;
      return {
        input: input,
        value: !result ? true : false,
        errorMessage: !result ? null : `${this.ToProperCase(friendlyName)} must be a whole number`
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsDecimalNumber: function (input, friendlyName) {
    const value = $(`#${input}`).val()
    if (value.length > 0) {
      var result = (value - Math.floor(value)) !== 0;
      return {
        input: input,
        value: result ? true : false,
        errorMessage: result ? null : `${this.ToProperCase(friendlyName)} must be a decimal number`
      };
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  IsEmail: function (input) {
    const inputLength = $(`#${input}`).val().length;
    if (inputLength > 0) {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return {
        input: input,
        value: $(`#${input}`).val().match(mailformat) ? true : false,
        errorMessage: $(`#${input}`).val().match(mailformat) ? null : 'Enter a valid email address'
      }
    } else {
      return {
        input: input,
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
        input: input,
        value: inputVal.match(telephoneFormat) || inputVal.match(mobileFormat) ? true : false,
        errorMessage: inputVal.match(telephoneFormat) || inputVal.match(mobileFormat) ? null : "Enter a telephone number in the correct format, like 01632 960 001, 07700 900 982 or +44 808 157 0192"
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  CharacterCountContainerCheck: function (input, friendlyName) {
    const characterCountContainer = $(`#${input}`).closest('govuk-character.count');
    if (characterCountContainer) {
      const inputLength = $(`#${input}`).val().length;
      if (inputLength > 0) {
        const maxLength = $(`#${input}`).closest('.govuk-character-count').attr("data-maxlength");
        return {
          input: input,
          value: inputLength > maxLength ? false : true,
          errorMessage: inputLength > maxLength ? `${this.ToProperCase(friendlyName)} must be ${maxLength} characters or less` : null
        }
      } else {
        return {
          input: input,
          value: true,
          errorMessage: null
        }
      }
    } else {
      return {
        input: input,
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
        input: input,
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
        input: input,
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
          input: input,
          value: inputLength > maxLengthFormatted ? false : true,
          errorMessage: inputLength > maxLengthFormatted ? `${this.ToProperCase(friendlyName)} must be ${maxLengthFormatted} characters or less` : null
        }
      } else {
        return {
          input: input,
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
        input: input,
        value: inputLength < minLengthFormatted ? false : true,
        errorMessage: inputLength < minLengthFormatted ? `${this.ToProperCase(friendlyName)} must be ${minLengthFormatted} characters or more` : null
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  InputBetweenCharacterCheck: function (input, friendlyName, minLength, maxLength) {
      const inputLength = $(`#${input}`).val().length;
      if (inputLength > 0) {
        const minLengthFormatted = parseInt(minLength);
        const maxLengthFormatted = parseInt(maxLength);
        if (minLengthFormatted == maxLengthFormatted) {
          return {
            input: input,
            value: inputLength == minLength ? true : false,
            errorMessage: inputLength == minLength ? null : `${this.ToProperCase(friendlyName)} must be ${minLength} characters`
          }
        }
        return {
          input: input,
          value: inputLength >= minLengthFormatted && inputLength <= maxLengthFormatted ? true : false,
          errorMessage: inputLength >= minLengthFormatted && inputLength <= maxLengthFormatted ? null : `${this.ToProperCase(friendlyName)} must be between ${minLengthFormatted} and ${maxLengthFormatted} characters`
        }
      } else {
        return {
          input: input,
          value: true,
          errorMessage: null
        }
      }
  },

  InputMaxValueCheck: function (input, friendlyName, maxValue) {
    const inputValue = $(`#${input}`).val();
    if (inputValue > 0) {
      const maxValueFormatted = parseInt(maxValue);
      return {
        input: input,
        value: inputValue > maxValueFormatted ? false : true,
        errorMessage: inputValue > maxValueFormatted ? `${this.ToProperCase(friendlyName)} must be ${maxValueFormatted} or fewer` : null
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  InputMinValueCheck: function (input, friendlyName, minValue) {
    const inputValue = $(`#${input}`).val();
    if (inputValue > 0) {
      const minValueFormatted = parseInt(minValue);
      return {
        input: input,
        value: inputValue < minValueFormatted ? false : true,
        errorMessage: inputValue < minValueFormatted ? `${this.ToProperCase(friendlyName)} must be ${minValueFormatted} or more` : null
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  InputBetweenValueCheck: function (input, friendlyName, minValue, maxValue) {
    const inputValue = $(`#${input}`).val();
    if (inputValue > 0) {
      const minValueFormatted = parseInt(minValue);
      const maxValueFormatted = parseInt(maxValue);
      if (minValueFormatted == maxValueFormatted) {
        return {
          input: input,
          value: inputValue == minValueFormatted ? true : false,
          errorMessage: inputValue == minValueFormatted ? null : `${this.ToProperCase(friendlyName)} must be ${minValueFormatted}`
        }
      }
      return {
        input: input,
        value: inputValue >= minValueFormatted && inputValue <= maxValueFormatted ? true : false,
        errorMessage: inputValue >= minValueFormatted && inputValue <= maxValueFormatted ? null : `${this.ToProperCase(friendlyName)} must be between ${minValueFormatted} and ${maxValueFormatted}`
      }
    } else {
      return {
        input: input,
        value: true,
        errorMessage: null
      }
    }
  },

  FileUploadNullCheck: function (input, friendlyName) {
    const fileLength = document.getElementById(`${input}`).files.length;
    return {
      input: input,
      valid: fileLength > 0 ? true : false,
      errorMessage: fileLength > 0 ? null : `Select a file for ${friendlyName.toLowerCase()}`
    }
  },

  FileSizeCheck(input, friendlyName, maxFileSize) {
    var file = document.getElementById(`${input}`).files[0];
    const fileSize = file.size;
    const fileSizeLimit = maxFileSize;
    return {
      input: input,
      valid: fileSize > fileSizeLimit ? false : true,
      errorMessage: fileSize > fileSizeLimit ? `${friendlyName} must be smaller than 32MB` : null
    }
  },

  ToProperCase: function (text) {
    return text[0].toUpperCase() + text.substr(1)
  },
}

DfEPortal.Errors = {

  // Inputs
  ShowInputError: function (input, type, message) {
    if (type == "radio" || type == "checkbox") {
      $(`input[name='${input}']`).closest('.govuk-form-group').addClass('govuk-form-group--error');
      $(`#${input}-error`).removeClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').after(message);
    } else if (type == "select" ) {
      $(`#${input}`).closest('.govuk-form-group').addClass('govuk-form-group--error');
      $(`#${input}`).addClass('govuk-select--error');
      $(`#${input}-error`).removeClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').after(message);
    } else if (type == "date") {
      $(`#${input}`).closest('.govuk-form-group').addClass('govuk-form-group--error');
      $(`#${input}`).find('input').addClass('govuk-input--error');
      $(`#${input}-error`).removeClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').after(message);
    } else if (type == "text-area") {
      $(`#${input}`).closest('.govuk-form-group').addClass('govuk-form-group--error');
      $(`#${input}`).addClass('govuk-textarea--error');
      $(`#${input}-error`).removeClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').after(message);
    } else {
      $(`#${input}`).closest('.govuk-form-group').addClass('govuk-form-group--error');
      $(`#${input}`).addClass('govuk-input--error');
      $(`#${input}-error`).removeClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').after(message);
    }
  },

  ClearInputError: function (input, type) {
    if (type == "radio" || type == "checkbox") {
      $(`input[name='${input}']`).closest('.govuk-form-group').removeClass('govuk-form-group--error');
      $(`#${input}-error`).addClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').get(0).nextSibling.textContent = "";
    } else if (type == "select" ) {
      $(`#${input}`).closest('.govuk-form-group').removeClass('govuk-form-group--error');
      $(`#${input}`).removeClass('govuk-select--error');
      $(`#${input}-error`).addClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').get(0).nextSibling.textContent = "";
    } else if (type == "date") {
      $(`#${input}`).closest('.govuk-form-group').removeClass('govuk-form-group--error');
      $(`#${input}`).find('input').removeClass('govuk-input--error');
      $(`#${input}-error`).addClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').get(0).nextSibling.textContent = "";
    } else if (type == "text-area") {
      $(`#${input}`).closest('.govuk-form-group').removeClass('govuk-form-group--error');
      $(`#${input}`).removeClass('govuk-textarea--error');
      $(`#${input}-error`).addClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').get(0).nextSibling.textContent = "";
    } else {
      $(`#${input}`).closest('.govuk-form-group').removeClass('govuk-form-group--error');
      $(`#${input}`).removeClass('govuk-input--error');
      $(`#${input}-error`).addClass('govuk-visually-hidden');
      $(`#${input}-error`).find('span').get(0).nextSibling.textContent = "";
    }
  },

  //Error Summary
  HideErrorSummary: function () {
    $('.govuk-error-summary').addClass('govuk-visually-hidden');
  },

  ShowErrorSummary: function () {
    $('.govuk-error-summary').removeClass('govuk-visually-hidden');
    $('html, body').animate({
      scrollTop: $('.govuk-error-summary').offset().top
    }, 1000);
    $('.govuk-error-summary').focus();
  },

  AddErrorSummaryDetail: function (input, message) {
    if (input === "") {
      const listElem = $(document.createElement('li'));
      const linkElem = $(document.createElement('a'));
      const errorMessage = $(document.createTextNode(message));
      linkElem.append(errorMessage);
      linkElem.attr('href', `#`);
      listElem.append(linkElem);
      $('.govuk-error-summary__list').append(listElem);
    } else {
      if ($(`a[href='#${input}-error']`).attr('href') == `#${input}-error`) {
        $(`a[href='#${input}-error']`).text(message);
      } else {
        const listElem = $(document.createElement('li'));
        const linkElem = $(document.createElement('a'));
        const errorMessage = $(document.createTextNode(message));
        linkElem.append(errorMessage);
        linkElem.attr('href', `#${input}-error`);
        listElem.append(linkElem);
        $('.govuk-error-summary__list').append(listElem);
      }
    }
  },

  RemoveErrorSummaryDetail: function (input) {
    $(`a[href='#${input}-error']`).closest('li').remove();
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

  ConstructData: function (obj) {
    return new Promise((resolve, reject) => {
      let data = {};
      $.each(obj, function (i) {
        if (obj[i].type == "text" || obj[i].type == "text-area" || obj[i].type == "email" || obj[i].type == "tel") {
          $.extend(data, {
            [obj[i].identifier]: `${$(`#${obj[i].identifier}`).val()}`
          });
        } else if (obj[i].type == "whole-number") {
          const inputMode = $(`#${obj[i].identifier}`).attr("inputmode");
          if (inputMode == "numeric") {
            $.extend(data, {
              [obj[i].identifier]: parseInt($(`#${obj[i].identifier}`).val())
            })
          } else {
            $.extend(data, {
              [obj[i].identifier]: $(`#${obj[i].identifier}`).val()
            })
          }
        } else if (obj[i].type == "decimal-number" || obj[i].type == "number") {
          const inputMode = $(`#${obj[i].identifier}`).attr("inputmode");
          if (inputMode == "numeric") {
            $.extend(data, {
              [obj[i].identifier]: parseFloat($(`#${obj[i].identifier}`).val())
            })
          } else {
            $.extend(data, {
              [obj[i].identifier]: $(`#${obj[i].identifier}`).val()
            })
          }
        } else if (obj[i].type == "date") {
          let dateObj = {};
          const inputs = $(`input[name="${obj[i].identifier}"]`);
          inputs.each(function () {
            if ($(this).attr('id').contains('day')) {
              $.extend(dateObj, { day: $(this).val() });
            } else if ($(this).attr('id').contains('month')) {
              $.extend(dateObj, { month: $(this).val() });
            } else if ($(this).attr('id').contains('year')) {
              $.extend(dateObj, { year: $(this).val() });
            }
          });
          const dateValues = Object.keys(dateObj).filter(key => {
            return dateObj[key];
          });
          const dateValueCount = dateValues.length;
          if (dateValueCount > 0) {
            const padNumber = (num, places) => String(num).padStart(places, '0');
            let formattedDateObj = {};
            $.each(dateObj, function (index, value) {
              if (index == "day" || index == "month" && value.length < 2) {
                $.extend(formattedDateObj, { [index]: padNumber(value, 2) });
              } else {
                $.extend(formattedDateObj, { [index]: value });
              }
            });

            if (obj[i].targetType == "text") {
              $.extend(data, {
                [obj[i].identifier]: `${formattedDateObj.day}/${formattedDateObj.month}/${formattedDateObj.year}`
              });
            } else {
              $.extend(data, {
                [obj[i].identifier]: new Date(`${formattedDateObj.year}-${formattedDateObj.month}-${formattedDateObj.day}`).toISOString().split('T')[0]
              });
            }
          } else {
            $.extend(data, {
              [obj[i].identifier]: null
            });
          }
        } else if (obj[i].type == "radio" || obj[i].type == "checkbox") {
          if (obj[i].targetType != null) {
            if (obj[i].targetType == "lookup") {
              if (obj[i].targetEntity != null) {
                if ($(`input[name='${obj[i].identifier}']`).is(':checked')) {
                  $.extend(data, {
                    [`${obj[i].identifier}@odata.bind`]: `/${obj[i].targetEntity}(${$(`input[name='${obj[i].identifier}']:checked`).val()})`
                  });
                } else {
                  $.extend(data, {
                    [`${obj[i].identifier}@odata.bind`]: null
                  });
                }
              } else {
                console.error("targetEntity is missing from the data object");
                DfEPortal.Errors.ShowErrorSummary();
                DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
                reject();
              }
            } else if (obj[i].targetType == "bool") {
              const value = $(`input[name='${obj[i].identifier}']:checked`).val()
              $.extend(data, {
                [obj[i].identifier]: value == "1" ? true : false
              });
            } else if (obj[i].targetType == "select") {
              $.extend(data, {
                [obj[i].identifier]: parseInt($(`input[name='${obj[i].identifier}']:checked`).val())
              });
            } else if (obj[i].targetType == "text") {
              const checkedId = $(`input[name='${obj[i].identifier}']:checked`).attr('id');
              $.extend(data, {
                [obj[i].identifier]: $.trim($(`label[for='${checkedId}']`).text())
              });
            } else {
              console.error(`'${obj[i].targetType}' is not a valid targetType for type '${obj[i].type}'`);
              DfEPortal.Errors.ShowErrorSummary();
              DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
              reject();
            }
          } else {
            console.error("targetType is missing from the data object");
            DfEPortal.Errors.ShowErrorSummary();
            DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
            reject();
          }
        } else if (obj[i].type == "select") {
          if (obj[i].targetType != null) {
            if (obj[i].targetType == "lookup") {
              if (obj[i].targetEntity != null) {
                if ($(`#${obj[i].identifier}`).val() != null) {
                  $.extend(data, {
                    [`${obj[i].identifier}@odata.bind`]: `/${obj[i].targetEntity}(${$(`#${obj[i].identifier} option:selected` ).val()})`
                  });
                } else {
                  $.extend(data, {
                    [`${obj[i].identifier}@odata.bind`]: null
                  });
                }
              } else {
                console.error("targetEntity is missing from the data object");
                DfEPortal.Errors.ShowErrorSummary();
                DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
                reject();
              }
            } else if (obj[i].targetType == "select") {
              $.extend(data, {
                [obj[i].identifier]: parseInt($(`#${obj[i].identifier} option:selected`).val())
              });
            } else if (obj[i].targetType == "text") {
              $.extend(data, {
                [obj[i].identifier]: $(`#${obj[i].identifier} option:selected`).text()
              });
            } else {
              console.error(`'${obj[i].targetType}' is not a valid targetType for type '${obj[i].type}'`);
              DfEPortal.Errors.ShowErrorSummary();
              DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
              reject();
            }
          } else {
            console.error("targetType is missing from the data object");
            DfEPortal.Errors.ShowErrorSummary();
            DfEPortal.Errors.AddErrorSummaryDetail(obj[i].identifier, "Internal error. Please contact the DfE.");
            reject();
          }
        }
      })

      function waitForData() {
        setTimeout(() => {
          if (Object.keys(data).length > 0) {
            resolve(data);
          } else {
            waitForData();
          }
        }, 1000);
      }

      waitForData();
    })
  },

  Update: function (id, entityName, dataObj) {
    return new Promise((resolve, reject) => {
      webapi.safeAjax({
        type: "PATCH",
        url: `/_api/${entityName}(${id})`,
        contentType: "application/json",
        data: JSON.stringify(dataObj),
        success: function (res, status, xhr) {
          resolve();
        },
        error: function (res, status, error) {
          reject(error);
        }
      });
    })
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
          reject(error);
        }
      });
    })
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
          reject(error);
        }
      });
    })
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
          reject(error);
        }
      });
    })
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

  ProcessFileAndUpload(inputName, entityName, entityId) {

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
          DfEPortal.WebApi.UploadFile(fileContent, fileName, entityId, entityName, inputName)
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

  UploadFile(fileContent, fileName, entityID, entityName, inputName) {
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

  DeleteFile: function (inputName, entityID, entityName) {
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
}