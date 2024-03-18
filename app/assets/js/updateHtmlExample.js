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

      if(codeElement) {
        // Check if the input value is empty
        if (newValue.trim() === '') {
          // Restore the original HTML content
          if (codeElement.hasAttribute('data-original-content')) {
              codeElement.innerHTML = codeElement.getAttribute('data-original-content');
          }
        } else {
          // Check if the code element has the data-original-content attribute
          if (codeElement && codeElement.hasAttribute('data-original-content')) {
              // Restore the original HTML content before performing the replacement
              codeElement.innerHTML = codeElement.getAttribute('data-original-content');
          }

          // Store the original HTML content as a data attribute
          if (codeElement) {
              codeElement.setAttribute('data-original-content', codeElement.innerHTML);
          }

          // Replace any occurrences of "schema-name" with the new value
          if (codeElement) {
              codeElement.innerHTML = codeElement.innerHTML.replace(/schema-name/g, newValue);
          }
        } 
      }
    });
  });
})();