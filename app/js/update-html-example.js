/**
 * Update HTML Example
 * Allows users to replace 'schema-name' placeholder with their CRM field schema name
 */
(function() {
  // Find all "Update" buttons with the class "update-html-example"
  var updateButtons = document.querySelectorAll('.update-html-example');

  // Iterate over each "Update" button
  updateButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Find the nearest input field to the clicked button
      var inputField = button.parentElement.querySelector('input[type="text"]');

      // Get the value entered by the user
      var newValue = inputField.value;

      // Find the parent div container (the one with ID containing "html")
      var htmlDiv = button.closest('div[id*="html"]');

      // Find the code element within the html div
      var codeElement = htmlDiv.querySelector('code');

      if (codeElement) {
        // Store original plain text content if not already stored
        if (!codeElement.hasAttribute('data-original-text')) {
          codeElement.setAttribute('data-original-text', codeElement.textContent);
        }

        var originalText = codeElement.getAttribute('data-original-text');
        var newText;

        // Check if the input value is empty
        if (newValue.trim() === '') {
          // Restore the original content
          newText = originalText;
        } else {
          // Replace any occurrences of "schema-name" with the new value
          newText = originalText.replace(/schema-name/g, newValue);
        }

        // Set the plain text content
        codeElement.textContent = newText;

        // Re-apply syntax highlighting if hljs is available
        if (typeof hljs !== 'undefined') {
          // Remove the data-highlighted attribute so hljs will re-process
          codeElement.removeAttribute('data-highlighted');

          // Use highlightElement which handles language detection
          hljs.highlightElement(codeElement);
        }
      }
    });
  });
})();
