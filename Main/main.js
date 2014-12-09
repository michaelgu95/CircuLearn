var score = 0;
var lives = new Array();
var shapeDim = 75;
var startPlaying = false
var isNextable = true;
var cols = 2; // starting columns
var rows = 2; // starting rows
var timeValue = 1200;
var settingsShown = false;


$(document).ready(function() {
    next(cols, rows);
    $('#restart').click(function(){
        location.reload();
    });

    $('#resume').click(function(){
        startPlaying = false;
        next(cols, rows);
        $(".container").show();
    });

    $('#eyeGaze').click(function(){
        shapeDim = 175;

    })

    for(i=0;i<3;i++){
        lives[i] = new Image();
        lives[i].src = 'life.png';
        $("#lives").append($("<a>", {
            html: $("<img>", { src: lives[i].src, height: 30, width: 30, class: 'animated rollIn' })
        }));
    }


    $('.settingsIcon').click(function() {
                $(".container").hide();
                $("#resume").show();
    });
    
    new jBox('Modal',{ //creates Settings box
        width: 325,
        height: 200,
        attach: $('.settingsIcon'),
        title: '<div class = "settingsText animated zoomIn"> Settings</div>',
        content: $('#settings')
    });

    $(".timeSlider").bind("slider:changed", function (event, data) {
    // The currently selected value of the slider
        timeValue = data.value;
    });
});

function endGame(cols, rows) {
    $(".content").hide();
    $(".FinishScreen").show();
    $("#restart").fadeIn(3000);

    $(".ScoreReminder").text("Your highest block: " + cols + "x" + rows);
}

function next(c, r) {
    if (!isNextable) {
        return;
    }
    isNextable = false;
    $("#resume").hide();
    $(".content").fadeOut(1500, function() { // time after every correct answer
        $(".content").empty();
        $(".container").animate({
            height: ((shapeDim + 8) * r) + "px",
            width: ((shapeDim + 8) * c) + "px"
        }, 1000, function() {
            for (i = 0; i < (c * r); i++){
                $(".content").append(createShape("circle", shapeDim));
            }
            $('html, body').animate({ 
   				scrollTop: $(document).height()-$(window).height()}, "slow" // scroll to bottom after each level
			);
            $(".content").fadeIn(500);
            pickRandomShapes();
            //showContent();
        })
    });
}



function createShape(type, r) {
    return $("<div>").addClass("shape " + type).width(r).height(r).click(function() {
        if (startPlaying) {
			if (!$(this).hasClass('wrong') && !$(this).hasClass('selected')) {
  				if ($(this).attr("selected") == "selected") {
     				$(this).addClass("selected");
     				var score = parseInt($("#score").html());
     				score += 20;
     				$("#score").html(score); // update the score
  				} else {
     				$(this).addClass("wrong");
     				var score = parseInt($("#score").html());
     				score -= 10;
     				$("#score").html(score); // update the score
                    lives.splice(-1, 1);
                    $('#lives a').eq(lives.length).remove();
  				}
			}
            if (lives.length <= 0){
                return endGame(cols, rows);
            }
            var totalSelected = $(".shape[selected='selected']").length;
            if (($(".selected").length + $(".wrong").length) >= totalSelected) {
                startPlaying = false;
                $(".shape[selected='selected']:not(.selected)").addClass("selected");
                if ($(".wrong").length == 0) {
                    if((cols+rows)%4 == 0 || (cols+rows)%4 == 1 || (cols+rows)%4 == 2){
                        $(".content").html("\
                            <div style = 'position: absolute; left:750px; top: 265px'> <img class='animated lightSpeedIn' src='nyancat.gif' height='80' width='140'></div>\
                            <audio src = 'sounds/1-up.mp3' type = 'audio/mpeg' autoplay></audio>\
                            <audio src = 'sounds/1-up.ogg' type = 'audio/ogg' autoplay></audio>");
                    } else if((cols+rows)%4 == 3 && !$('#checkSwitch').is(':checked')){
                       $(".content").html("\
                            <div style = 'position: absolute; left: 785px; top: 280px'> <img class='animated wobble' src='1up.png' height='50' width='50'></div>\
                            <audio src='sounds/coin.mp3' type='audio/mpeg' autoplay></audio>\
                            <audio src='sounds/coin.ogg' type='audio/ogg' autoplay></audio>");                    
                       lives.splice(lives.length, 0, 1);
                       $("#lives").append($("<a>", {
                         html: $("<img>", { src: 'life.png', height: 30, width: 30, class: 'animated zoomIn' })
                        }));
                    }
                    if(!$('#checkSwitch').is(':checked')){
                        if (cols == rows) {
                            cols++;
                        }
                        else if (cols > rows){
                            rows++;
                        }
                    }
                }
                next(cols, rows);
            }
        }
    });
}

function pickRandomShapes() {
    var count = 0;
    var length = $(".content > .shape").length;
    for (count = 0; count < Math.ceil(length / 3);) {
        var random = Math.ceil(Math.random() * length);
        if (random < length) {
            if (!$(".content > .shape").eq(random).hasClass("selected")) {
                $(".content > .shape").eq(random).addClass("selected").attr("selected", "selected");
                count++;
            }
        }
    }
    window.setTimeout(hideRandomSelectedShapes, timeValue);
}

function hideRandomSelectedShapes() {
    
        $(".content > .shape").removeClass("selected");
        startPlaying = true;
        isNextable = true;
    
}
