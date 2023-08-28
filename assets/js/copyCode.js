document.addEventListener("DOMContentLoaded", function() {
    // Select all code blocks
    var codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(code) {
        // Wrap code block in a .code-container
        var container = document.createElement('div');
        container.className = 'code-container';
        code.parentNode.insertBefore(container, code);
        container.appendChild(code);

        // Add copy button to the container
        var button = document.createElement('button');
        button.className = 'copy-button';
        button.innerText = 'Copy';
        container.appendChild(button);
    });

    // Add event listener for the copy functionality
    var copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            var code = e.target.previousElementSibling.innerText;
            var textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          });
    });
});
