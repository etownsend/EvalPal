// This file contains the code that gets injected into the 
// body of the duckweb class registration page

// Edit contents of main table on duckweb class lookup page

$(function() {
var table = document.getElementsByTagName("tbody"); 
var rows = table[5].getElementsByTagName("tr"); 
var count;
var course, number, prof;

for (var i = 3; i < rows.length; i++) {
	count = 0;
	var cells = rows[i].getElementsByTagName("td");
	
	for(var j = 0; j<cells.length; j++) {
		count += cells[j].colSpan;
		
		if (count == 3) {
			course = cells[j].innerHTML;
    		cells[j].innerHTML = "<a class='eval' href='javascript:void(0)'>" + course + "</a>";
		} else if (count == 4) {
			number = cells[j].innerHTML;
			cells[j].innerHTML = "<a class='eval' href='javascript:void(0)'>" + number + "</a>";
		} else if (count == 11) {
			prof = cells[j].innerHTML; 
			cells[j].innerHTML = "<a class='eval' href='javascript:void(0)'>" + prof + "</a>";
		}
	}
}

$('a.eval').css({"background-color": "#f4f199"});

    $(document).on('click', '.eval', function () {
        $(this).addClass("on");
        $(this).tooltip({
            items: '.eval.on',
			content: function() {
                return 'content will go here'
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
        $(this).trigger('mouseenter');
    });
    //hide
    $(document).on('click', '.eval.on', function () {
        $(this).tooltip('close');
        $(this).removeClass("on");
    });
    //prevent mouseout and other related events from firing their handlers
    $(".eval").on('mouseout', function (e) {
        e.stopImmediatePropagation();
    });


});