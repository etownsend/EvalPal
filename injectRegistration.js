// This file contains the code that gets injected into the 
// body of the duckweb class registration page

// Edit contents of main table on duckweb class lookup page

// Keeps track of the most recently opened tooltip so it can
// be edited
var messageOut = false;
var toolTipQueue = [];
var messageQueue = [];


// Recieves Messages, manages message queues, and prompts page updates.
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		messageOut = false;
		// Distinguish ack from response
		if(message.response === "ack") {
			// Do nothing
		} else {
			// Update Tooltip with contents from message
			var lastToolTipId = toolTipQueue.shift();
			console.log(lastToolTipId);
			$("#" + lastToolTipId).tooltip('close');
			$("#" + lastToolTipId).tooltip({content: "<a href='javascript:void(0);' id ='x " + lastToolTipId +"' class='x'></a>" + formatAverages(message.response)});
			$("#" + lastToolTipId).tooltip('open');
		}
		// Send next queued message
		if(messageQueue.length > 0) {
			messageOut = true;
			console.log("Sending Queued Message");
			chrome.runtime.sendMessage(messageQueue.shift());
		}
});


function formatAverages(av) {
	if (av == "No results found")
		return "No results found";
	var str = "<h3>Instructor Evaluations For " + av[av.length-1] + "</h3><br /><table>";
	str += "<tr><td class='right'><b>Quality of Courses Taught by this Professor:</b></td>";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[0]/5.0)) + "%;'></span></span>" + av[0] + " out of 5</td></tr>";
	str += "<tr><td class='right'><b>Quality of Teaching:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[1]/5.0)) + "%;'></span></span>" + av[1] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Professor's Organization:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[2]/5.0)) + "%;'></span></span>" + av[2] + " out of 5</td></tr>";


	str += "<tr><td class='right'><b>Use of Class Time:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[3]/5.0)) + "%;'></span></span>" + av[3] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Availability Outside of Class:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[4]/5.0)) + "%;'></span></span>" + av[4] + " out of 5</td></tr>";

	str += "<tr><td class='right'><b>Clarity of Evaluation Guidelines:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[5]/5.0)) + "%;'></span></span>" + av[5] + " out of 5</td></tr>";

	str += "<tr><td style='border-bottom:none;' class='right'><b>Amount Learned in Courses Taught by this Professor:</b> ";
	str += "<td style='border-bottom:none;'><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[6]/5.0)) + "%;'></span></span>" + av[6] + " out of 5</td></tr>";

	return str;
}


function getProfLink(name, idx) {
	var res = name.split("(");
	var prof = res[0].trim();
	if (prof == "TBA" || prof == "STAFF" || prof == "")
		return name;
	return "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + name + "</a>";
}

// Smoothly uses the messaging system to send a message to the eval page
function sendMessage(message) {
	// If the messaging system is busy
	if (messageOut) {
		// Cache message to be sent later
		messageQueue.push(message)
	} else {
		// Otherwise send message
		messageOut = true;
		chrome.runtime.sendMessage(message);
	}
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

	// Creates tooltip. Prompts actions for items on page when clicked
	$('a.eval').css({"background-color": "#f4f199"});
		
	// Create tooltip
	$(document).on('click', '.eval', function () {
		// Detecting if is class number or professor name

		// Note: slicing string removes things like ' (P)' from the end of the name
		var msg = $(this).context.innerText;
		console.log("Sending Message "+msg)
		if(isNaN(msg)){
			// Message is a Professor's Name
			var profMsg = {request: true, name: msg.slice(0,-4)};
			sendMessage(profMsg);
		}	else {
			// Message is a class number
			var classMsg1 = {request: true, subject: "Computer & Information Science"};
			var classMsg2 = {request: true, number: msg};
			sendMessage(classMsg1);
			sendMessage(classMsg2);
		}

		// Constructing tooltip
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
		
		// Add tooltip to queue so it can be edited when message returns
		toolTipQueue.push($(this).attr("id"));
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
