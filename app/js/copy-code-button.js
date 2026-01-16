/**
 * Copy Code Button
 * Adds copy buttons to all code blocks and handles clipboard functionality
 */
(function() {
  /**
   * Initialize copy buttons for code blocks
   * @param {Element|Document} container - The container to search for code blocks (defaults to document)
   */
  function initCopyButtons(container) {
    container = container || document;

    container.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      // Skip if button already exists (prevent duplicates)
      if (pre.querySelector('.copy-code-button')) {
        return;
      }

      // Create the button
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code-button';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      button.textContent = 'Copy code';

      // Copy code to clipboard on click
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);

          // Update to success state
          button.textContent = 'Copied!';
          button.classList.add('copy-code-button--copied');

          // Reset after delay
          setTimeout(() => {
            button.textContent = 'Copy code';
            button.classList.remove('copy-code-button--copied');
          }, 2000);
        } catch (err) {
          console.error('Copy failed:', err);
          button.textContent = 'Error';
          setTimeout(() => {
            button.textContent = 'Copy code';
          }, 2000);
        }
      });

      // Insert the button inside the <pre> element (for absolute positioning)
      pre.insertBefore(button, pre.firstChild);
    });
  }

  /**
   * Re-highlight a code element using hljs if available
   * @param {Element} codeElement - The code element to highlight
   */
  function highlightCode(codeElement) {
    if (typeof hljs !== 'undefined' && codeElement) {
      // Remove existing hljs classes to allow re-highlighting
      codeElement.classList.remove('hljs');
      codeElement.removeAttribute('data-highlighted');

      hljs.highlightElement(codeElement);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCopyButtons();
    });
  } else {
    initCopyButtons();
  }

  // Expose functions globally for use by other scripts
  window.DfECodeBlocks = {
    initCopyButtons: initCopyButtons,
    highlightCode: highlightCode
  };
})();
