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
    $('#reset').click(function(){
        next(cols, rows);
    });
    $('#restart').click(function(){
        location.reload();
    });



    for(i=0;i<5;i++){
        lives[i] = new Image();
        lives[i].src = 'life.png';
        $("#lives").append($("<a>", {
            html: $("<img>", { src: lives[i].src, height: 30, width: 30, class: 'animated rollIn' })
        }));
    }


    new jBox('Modal',{ //creates Settings box
    width: 300,
    height: 200,
    attach: $('.settings'),
    title: '<h3>Settings</h3>',
    content: $('.timeValue')
    });

     $(".timeSlider").bind("slider:changed", function (event, data) {
  // The currently selected value of the slider
    timeValue = data.value;
    });
});

function endGame() {
    $(".content").hide();
    $(".FinishScreen").show();
}

function next(c, r) {
    if (!isNextable) {
        return;
    }
    isNextable = false;
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
                return endGame();
            }
            var totalSelected = $(".shape[selected='selected']").length;
            if (($(".selected").length + $(".wrong").length) >= totalSelected) {
                startPlaying = false;
                $(".shape[selected='selected']:not(.selected)").addClass("selected");
                if ($(".wrong").length == 0) {
                    if((cols+rows)%4 == 0 || (cols+rows)%4 == 1 || (cols+rows)%4 == 2){
                        $(".content").html("<div style = 'position: absolute; left:750px; top: 255px'> <img class = 'animated lightSpeedIn' src = 'nyancat.gif' height = '80' width = '140'> </div>");
                    } else if((cols+rows)%4 == 3){
                       $(".content").html("<div style = 'position: absolute; left: 785px; top: 270px'> <img class = 'animated wobble' src = '1up.png' height = '50' width = '50'> </div>");                    
                       lives.splice(lives.length, 0, 1);
                       $("#lives").append($("<a>", {
                         html: $("<img>", { src: 'life.png', height: 30, width: 30, class: 'animated zoomIn' })
                        }));
                    }
                    if (cols == rows) {
                        cols++;
                    }
                    else if (cols > rows){
                        rows++;
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