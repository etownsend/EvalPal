// Registers event listeners to buttons on page load
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("lookupButton");
  button.addEventListener('click', function() {
    chrome.extension.getBackgroundPage().dwp.initializePages();
    window.close();
  }, false);
}, false);