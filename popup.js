// Registers event listeners to buttons on page load
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("lookupButton");
  var bgPage = chrome.extension.getBackgroundPage();
  button.addEventListener('click', bgPage.dwp.initializePages, false);
}, false);