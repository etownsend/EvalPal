// Checks for results data. If present, returns it to the extension.
function returnResults() {
  var results = document.getElementsByTagName("table");
  var resultsTest  = results[3].getElementsByTagName("tr");
  if (resultsTest.length > 0) {
    chrome.runtime.sendMessage({response: results[3].innerHTML})
  }
};

// Generates an integer which indicates a subjective degree of matching
// between two strings. Optimized for matching names with tokens
// truncated or out of order or both.
function getMatchValue(first, second) {
  var splitFirst = first.split(/[ ,]+/);
  var splitSecond = second.split(/[ ,]+/);
  var totalMatch = 0;
  // Compare each token to each of the others. For each token, add
  // the value of its highest match to totalMatch
  for (var i = 0; i < splitFirst.length; i ++) {
    var maxTokenMatch = 0;
    for (var j = 0; j < splitSecond.length; j ++) {
      var tokenMatch = 0;
      for (var k = 0; k < Math.min(splitFirst[i].length, splitSecond[j].length); k ++) {
        if (splitFirst[i].charAt(k) == splitSecond[j].charAt(k)) {
          tokenMatch ++;
        } else {
          tokenMatch = 0;
          break;
        };
      }
      if(tokenMatch > maxTokenMatch) {maxTokenMatch = tokenMatch};
    }
    totalMatch = totalMatch + maxTokenMatch;
  }
  return totalMatch;
}

// Uses a fuzzy search to match instructor with its id.
function getInstructorId(instructorSelect, name) {
  var maxMatchVal = 0;
  var maxItem = 0;
  // For each professor in the select table
  for (var i = 1; i < instructorSelect.length; i++) {
    // Calculate the extent of the match
    var matchVal = getMatchValue(instructorSelect[i].text, name);
    // Record the greatest match value
    if (matchVal > maxMatchVal) {
      maxItem = i;
      maxMatchVal = matchVal;
    }
  }
  return instructorSelect[maxItem].value;
};

// Setting up message passing
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log("got message");
    // Setting Instructor
    var instructorSelect = document.getElementsByName("instructorSelect")[0];
    instructorSelect.value = getInstructorId(instructorSelect, message.name);
    
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      instructorSelect.dispatchEvent(evt);
    }
    else instructorSelect.fireEvent("onchange");
});

// Triggering stuff if page already has been loaded
if(document.readyState == "complete" || document.readyState == "loaded") {
  returnResults();
} else {
  // Triggering stuff for when the page loads
  document.addEventListener('DOMContentLoaded', returnResults);
}