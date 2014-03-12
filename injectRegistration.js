// This file contains the code that gets injected into the 
// body of the duckweb class registration page

// Edit contents of main table on duckweb class lookup page

// Keeps track of the most recently opened tooltip so it can
// be edited
var lastToolTipId;

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		// message.response contains the html for the table.
		console.log(lastToolTipId);
		$("#" + lastToolTipId).tooltip('close');
		$("#" + lastToolTipId).tooltip({content: "<a href='javascript:void(0);' id ='x " + lastToolTipId +"' class='x'></a>" + message.response});
		$("#" + lastToolTipId).tooltip('open');
});


function getProfLink(name, idx) {
	var res = name.split("(");
	var prof = res[0].trim();
	if (prof == "TBA" || prof == "STAFF" || prof == "")
		return name;
	return "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + name + "</a>";
}




$(function() {
var table = document.getElementsByTagName("tbody"); 
var rows = table[5].getElementsByTagName("tr"); 
var count;
var idx = 0;
var course, number, prof;

for (var i = 3; i < rows.length; i++) {
	count = 0;
	var cells = rows[i].getElementsByTagName("td");
	
	for(var j = 0; j<cells.length; j++) {
		count += cells[j].colSpan;
		
		if (count == 3) {
			course = cells[j].innerHTML;
			cells[j].innerHTML = "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + course + "</a>";
			idx++;
		} else if (count == 4) {
			number = cells[j].innerHTML;
			cells[j].innerHTML = "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + number + "</a>";
			idx++;
		} else if (count == 11) {
			prof = cells[j].innerText; 
			cells[j].innerHTML = getProfLink(prof, idx);
			idx++;
		}
	}
}

$('a.eval').css({"background-color": "#f4f199"});
	
	// Create tooltip
	$(document).on('click', '.eval', function () {
		// Note: slicing string removes things like ' (P)' from the end of the name
		var profName = $(this).context.innerText;
		chrome.runtime.sendMessage({name: profName.slice(0,-4)});
		$(this).addClass("on");
		$(this).tooltip({
			items: '.eval.on',
			content: function() {
				var x = "<a href='javascript:void(0);' id ='x " + $(this).attr("id") +"' class='x'></a>";
				return x + '<img src="http://i61.tinypic.com/2emoq3r.gif" alt="loading..." />';
			},
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function( position, feedback ) {
				$( this ).css( position );
				$( "<div>" )
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
				}
			}
		});
		$(this).tooltip('open');
		// Evan's hack to edit tooltip Feel free to improve
		lastToolTipId = $(this).attr("id");
	});

	// Hide tooltip
	$(document).on('click', '.x', function () {
		res = $(this).attr("id").split(" ");
		var id = res[1];
		$("#" + id).tooltip("close");
		$("#" + id).removeClass("on");
	}); 
		
	//prevent mouseout and other related events from firing their handlers
	$(".eval").on('mouseout', function (e) {
		e.stopImmediatePropagation();
	});
	$(".eval").on('mouseenter', function (e) {
		e.stopImmediatePropagation();
	});

});
