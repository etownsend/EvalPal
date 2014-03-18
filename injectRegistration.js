/*
 * Eval Pal - injectRegistration.js
 * CIS 422 Winter 2014
 * Written by: Sarah Yablok & Evan Townsend
 * This file contains the code that gets injected into the body of 
 * the DuckWeb page. Including tooltips the associated highlight links
 * It also sends messages to injectEvalStage3.js to share information.
 */


/* Global variable queue which keeps track of the most recently opened
 tooltip so it can be edited */
var messageOut = false;
var toolTipQueue = [];
var messageQueue = [];

// Hash table of the University's various departments and their abbreviations
var dept = {};
dept['AA'] = "Allied Arts";
dept['AAA'] = "Architecture & Allied Arts";
dept['AAAP'] = "Historic Preservation";
dept['AAD'] = "Arts & Administration";
dept['ACTG'] = "Accounting";
dept['AEIS'] = "Acad Eng for Intl Stu";
dept['AFR'] = "African Studies";
dept['AIM'] = "Applied Information Management";
dept['ANTH'] = "Anthropology";
dept['ARB'] = "Arabic";
dept['ARCH'] = "Architecture";
dept['ARH'] = "Art History";
dept['ART'] = "Art";
dept['ARTC'] = "Ceramics";
dept['ARTD'] = "Digital Arts";
dept['ARTF'] = "Fibers";
dept['ARTM'] = "Metalsmithing & Jewelry";
dept['ARTO'] = "Photography";
dept['ARTP'] = "Painting";
dept['ARTR'] = "Printmaking";
dept['ARTS'] = "Sculpture";
dept['ASIA'] = "Asian Studies";
dept['ASL'] = "American Sign Language";
dept['ASTR'] = "Astronomy";
dept['BA'] = "Business Administration";
dept['BE'] = "Business Environment";
dept['BI'] = "Biology";
dept['CARC'] = "Career Center";
dept['CAS'] = "College of Arts & Sciences";
dept['CDS'] = "Communication Disorders & Sci";
dept['CFT'] = "Couples & Family Therapy";
dept['CH'] = "Chemistry";
dept['CHN'] = "Chinese";
dept['CHNF'] = "Chinese Flagship";
dept['CINE'] = "Cinema Studies";
dept['CIS'] = "Computer & Information Science";
dept['CIT'] = "Computer Information Tech";
dept['CLAS'] = "Classics";
dept['COLT'] = "Comparative Literature";
dept['CPSY'] = "Counseling Psychology";
dept['CRES'] = "Conflict & Dispute Resolution";
dept['CRWR'] = "Creative Writing";
dept['CSCH'] = "College Scholars";
dept['DAN'] = "Dance Professional";
dept['DANC'] = "Dance Activity";
dept['DANE'] = "Danish";
dept['DIST'] = "Distance Education";
dept['DSC'] = "Decision Sciences";
dept['EALL'] = "East Asian Lang & Literature";
dept['EC'] = "Economics";
dept['EDLD'] = "Educational Leadership";
dept['EDST'] = "Education Studies";
dept['EDUC'] = "Education";
dept['ENG'] = "English";
dept['ENVS'] = "Environmental Studies";
dept['ES'] = "Ethnic Studies";
dept['ESC'] = "Community Internship Program";
dept['EURO'] = "European Studies";
dept['FHS'] = "Family & Human Services";
dept['FIN'] = "Finance";
dept['FINN'] = "Finnish";
dept['FLR'] = "Folklore";
dept['FR'] = "French";
dept['FSEM'] = "Freshman Seminar";
dept['GEOG'] = "Geography";
dept['GEOL'] = "Geology";
dept['GER'] = "German";
dept['GRK'] = "Greek";
dept['GSS'] = "General Social Science";
dept['HBRW'] = "Hebrew";
dept['HC'] = "Honors College";
dept['HIST'] = "History";
dept['HPHY'] = "Human Physiology";
dept['HUM'] = "Humanities";
dept['IARC'] = "Interior Architecture";
dept['INTL'] = "International Studies";
dept['IST'] = "Interdisciplinary Studies";
dept['ITAL'] = "Italian";
dept['J'] = "Journalism";
dept['JDST'] = "Judaic Studies";
dept['JGS'] = "Japanese Global Scholars";
dept['JPN'] = "Japanese";
dept['KRN'] = "Korean";
dept['LA'] = "Landscape Architecture";
dept['LAS'] = "Latin American Studies";
dept['LAT'] = "Latin";
dept['LAW'] = "Law";
dept['LEAD'] = "Leadership Development";
dept['LERC'] = "Labor Educ & Research Center";
dept['LIB'] = "Library";
dept['LING'] = "Linguistics";
dept['LT'] = "Language Teaching";
dept['MATH'] = "Mathematics";
dept['MDVL'] = "Medieval Studies";
dept['MGMT'] = "Management";
dept['MIL'] = "Military Science";
dept['MKTG'] = "Marketing";
dept['MUE'] = "Music Education";
dept['MUJ'] = "Music Jazz Studies";
dept['MUP'] = "Music Performance";
dept['MUS'] = "Music";
dept['NAS'] = "Native American Studies";
dept['NORW'] = "Norwegian";
dept['OIMB'] = "Oregon Inst of Marine Biology";
dept['OLIS'] = "Oregon Ldrship Sustainability";
dept['PD'] = "Product Design";
dept['PDX'] = "UO Portland Programs";
dept['PEAE'] = "PE Aerobics";
dept['PEAQ'] = "PE Aquatics";
dept['PEAS'] = "PE SCUBA";
dept['PEC'] = "PE Certification";
dept['PEF'] = "PE Fitness";
dept['PEI'] = "PE Individual Activities";
dept['PEIA'] = "PE Intercollegiate Athletics";
dept['PEL'] = "PE Leadership";
dept['PEMA'] = "PE Martial Arts";
dept['PEMB'] = "PE Mind-Body";
dept['PEO'] = "PE Outdoor Pursuits";
dept['PEOL'] = "PE Outdoor Pursuits - Land";
dept['PEOW'] = "PE Outdoor Pursuits - Water";
dept['PERS'] = "PE Racquet Sports";
dept['PERU'] = "PE Running";
dept['PETS'] = "PE Team Sports";
dept['PEW'] = "PE Weight Training";
dept['PHIL'] = "Philosophy";
dept['PHYS'] = "Physics";
dept['PORT'] = "Portuguese";
dept['PPPM'] = "Planning Public Policy Mgmt";
dept['PS'] = "Political Science";
dept['PSY'] = "Psychology";
dept['REES'] = "Russ, E Euro & Eurasia Studies";
dept['REL'] = "Religious Studies";
dept['RL'] = "Romance Languages";
dept['RUSS'] = "Russian";
dept['SAPP'] = "Substance Abuse Prev Prog";
dept['SBUS'] = "Sports Business";
dept['SCAN'] = "Scandinavian";
dept['SCYP'] = "Sustainable City Year Program";
dept['SERV'] = "Service Learning";
dept['SOC'] = "Sociology";
dept['SPAN'] = "Spanish";
dept['SPED'] = "Special Education";
dept['SPSY'] = "School Psychology";
dept['SWAH'] = "Swahili";
dept['SWED'] = "Swedish";
dept['TA'] = "Theater Arts";
dept['TLC'] = "Univ Teaching & Learning Ctr";
dept['WGS'] = "Women's & Gender Studies";
dept['WR'] = "Writing";


/* Returns the x-button html for the tooltip id provided. */
function xButton (id) {
	return "<a href='javascript:void(0);' id ='x " + id + "' class='x'></a>";
}


/* Set the background image of the x-button */
function xButtonBG () {
	$('.ui-tooltip a.x').css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
	$(".ui-tooltip a.x").hover(function(){
		$(this).css("background-position","bottom center");
    	},function(){
    		$(this).css("background", "url(" + chrome.extension.getURL('images/x.jpg') + ") no-repeat top center");
  		});
}



/* Recieves Messages, manages message queues, and prompts page updates when the
user clicks any of the highlighted links. */
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		messageOut = false;
		// Distinguish ack from response
		if(message.response == "ack") {
			// Do nothing
		} else {
			// Update Tooltip with contents from message
			var lastToolTipId = toolTipQueue.shift();
			$("#" + lastToolTipId).tooltip('close'); //close and reopen the tooltip to update content

			var attr = $("#" + lastToolTipId).attr('title');
			if (typeof attr == 'undefined' || attr == false)
				$("#" + lastToolTipId).tooltip({content: xButton(lastToolTipId) + formatAverages(message.response)});
			else 
				$("#" + lastToolTipId).tooltip({content: xButton(lastToolTipId) + formatAveragesCourses(message.response, $("#" + lastToolTipId).attr("title"))});
				
			$("#" + lastToolTipId).tooltip('open'); //reopen tooltip
			xButtonBG();
		}
		// Send next queued message
		if(messageQueue.length > 0) {
			messageOut = true;
			chrome.runtime.sendMessage(messageQueue.shift());
		}
});

/* This function formats the averages data in HTML format for the 
 professors tooltips */
function formatAverages(av) {
	if (av == "No results found") // Error handling for no professor found
		return "No results found";
	
	// Title
	var str = "<h3>Instructor Evaluations For " + av[av.length-1] + "</h3><br /><table>";
	// Quality of courses
	str += "<tr><td class='right'><b>Quality of Courses Taught by this Professor:</b></td>";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[0]/5.0)) + "%;'></span></span>" + av[0] + " out of 5</td></tr>";
	// Quality of Teaching
	str += "<tr><td class='right'><b>Quality of Teaching:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[1]/5.0)) + "%;'></span></span>" + av[1] + " out of 5</td></tr>";
	// Organization
	str += "<tr><td class='right'><b>Professor's Organization:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[2]/5.0)) + "%;'></span></span>" + av[2] + " out of 5</td></tr>";
	// Use of class time
	str += "<tr><td class='right'><b>Use of Class Time:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[3]/5.0)) + "%;'></span></span>" + av[3] + " out of 5</td></tr>";
	// Availability outside of class
	str += "<tr><td class='right'><b>Availability Outside of Class:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[4]/5.0)) + "%;'></span></span>" + av[4] + " out of 5</td></tr>";
	// Clarity of Evaluation Guidelines
	str += "<tr><td class='right'><b>Clarity of Evaluation Guidelines:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[5]/5.0)) + "%;'></span></span>" + av[5] + " out of 5</td></tr>";
	// Amount Learned.
	str += "<tr><td style='border-bottom:none;' class='right'><b>Amount Learned in Courses Taught by this Professor:</b> ";
	str += "<td style='border-bottom:none;'><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[6]/5.0)) + "%;'></span></span>" + av[6] + " out of 5</td></tr>";
	return str;
}

/* This function formats the averages data in HTML format for the 
 courses tooltips */
function formatAveragesCourses(av, n) {
	if (av == "No results found") // Error handling for no course found
		return "No results found";
		
	// Title
	var str = "<h3>Course Evaluations For " + n + "</h3><br /><table>";
	// Quality of the Course
	str += "<tr><td class='right'><b>Quality of this course:</b></td>";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[0]/5.0)) + "%;'></span></span>" + av[0] + " out of 5</td></tr>";
	// Quality of the Teaching
	str += "<tr><td class='right'><b>Quality of Teaching:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[1]/5.0)) + "%;'></span></span>" + av[1] + " out of 5</td></tr>";
	// Organization
	str += "<tr><td class='right'><b>Course Oragnization:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[2]/5.0)) + "%;'></span></span>" + av[2] + " out of 5</td></tr>";
	// Clarity of Evaluation
	str += "<tr><td class='right'><b>Clarity of Evaluation Guidelines:</b> ";
	str += "<td><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[5]/5.0)) + "%;'></span></span>" + av[5] + " out of 5</td></tr>";
	// Amount Learned
	str += "<tr><td style='border-bottom:none;' class='right'><b>Amount Learned in this course:</b> ";
	str += "<td style='border-bottom:none;'><span class='gray-bar'> <span class='rating' style='width:" + Math.round(100*(av[6]/5.0)) + "%;'></span></span>" + av[6] + " out of 5</td></tr>";
	return str;
}


/* Get the appropriate highlighted link HTML for professors */
function getProfLink(name, idx) {
	var res = name.split("("); // Split at "(" in case of (P) at the end.
	var prof = res[0].trim();
	if (prof == "TBA" || prof == "STAFF" || prof == "")
		return name;
	return "<a class='eval' id='" + idx + "' href='javascript:void(0)'>" + name + "</a>";
}

/* Smoothly uses the messaging system to send a message to the eval page */
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


/* This is the main function which sets up all of the tooltips and injects
 all of the highlighted links on the document's load. This also sets up event
 handling for clicks on links, the x-button, and rearranging tabs.*/
$(document).ready(function() {
	// Sort through the duckweb table to get the right columns to highlight
	var table = document.getElementsByTagName("tbody"); 
	var rows = table[5].getElementsByTagName("tr"); 
	var count;
	var idx = 0;
	var course, number, prof;

	// Loop through rows
	for (var i = 3; i < rows.length; i++) {
		count = 0;
		var cells = rows[i].getElementsByTagName("td");
		// Loop through columns
		for(var j = 0; j<cells.length; j++) {
			count += cells[j].colSpan;
			if (count == 3) {
				course = cells[j].innerHTML;
			// Highlight the course #
			} else if (count == 4) {
				number = cells[j].innerHTML;
				if (cells[j].innerText.trim() != "")
					cells[j].innerHTML = "<a class='eval' title='" + course + " " + number + "' id='" + idx + "' href='javascript:void(0)'>" + number + "</a>";
				idx++;
			// Highlight the Professor Name
			} else if (count == 11) {
				prof = cells[j].innerText; 
				cells[j].innerHTML = getProfLink(prof, idx);
				idx++;
			}
		}
	}

	// Set the background color to yellow on all Eval Pal links
	$('a.eval').css({"background-color": "#f4f199"});
		
	// Create the tooltip upon clicking
	$(document).on('click', '.eval', function () {
		// Detecting if is class number or professor name
		// Note: slicing string removes things like ' (P)' from the end of the name
		var msg = $(this).context.innerText;
		if(isNaN(msg)){
			// Message is a Professor's Name
			var profMsg = {request: true, name: msg.slice(0,-4)};
			sendMessage(profMsg);
		}	else {
			// Message is a class number

			var classMsg1 = {request: true, subject: dept[$(this).attr("title").split(" ")[0]]};
			var classMsg2 = {request: true, number: msg};
			sendMessage(classMsg1);
			sendMessage(classMsg2);
		}

		// Constructing tooltip
		$(this).addClass("on");
		$(this).tooltip({
			items: '.eval.on',
			content: function() {
				// Set the content to default to the loading image.
				return xButton($(this).attr("id")) + '<img src="' + chrome.extension.getURL('images/loading2.gif') + '" alt="loading..." />';
			},
			position: {
				// Set the positioning of the tooltip relative to the link
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

		$(this).tooltip('open'); // Open the tooltip!
		
		xButtonBG(); // Update the tooltip image
		
		// Add tooltip to queue so it can be edited when message returns
		toolTipQueue.push($(this).attr("id"));
	});

	// This sets the tooltip which is clicked on to be brought to the front
	// via the z-index css property
	$(document).on('click', '.ui-tooltip', function () {
		$('.ui-tooltip').each(function () {
			$('#' + $(this).attr("id")).css("z-index", "0");
		});
		//$('#' + $(this).attr("id")).css("position", "relative");
		$('#' + $(this).attr("id")).css("z-index", "1");
	}); 

	// Hide tooltip when the x-button is clicked.
	$(document).on('click', '.x', function () {
		res = $(this).attr("id").split(" ");
		var id = res[1];
		$("#" + id).tooltip("close");
		$("#" + id).removeClass("on");
	}); 
		
	// Prevent mouseout and other related events from firing their handlers.
	$(".eval").on('mouseout', function (e) {
		e.stopImmediatePropagation();
	});
	$(".eval").on('mouseenter', function (e) {
		e.stopImmediatePropagation();
	});
});
