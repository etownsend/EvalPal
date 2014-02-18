// This file contains the code that gets injected into the body of the page

// Edit contents of main table on duckweb class lookup page
var table = document.getElementsByTagName("tbody"); 
var rows = table[5].getElementsByTagName("tr"); 
for (var i = 3; i < rows.length; i++) { 
  var cells = rows[i].getElementsByTagName("td");
  /*
  for (var j = 0; j < cells.length; j ++) {
    cells[j].innerHTML = cells[j].innerHTML + " oh my...";
  }*/
  if (cells.length == 13) {
    cells[2].innerHTML += "<br>" + cells[2].innerHTML;
    cells[3].innerHTML += "<br>" +cells[3].innerHTML;
    cells[10].innerHTML += "<br>" +cells[10].innerHTML;
  } else {
    cells[8].innerHTML += "<br>" +cells[8].innerHTML;
  }
}