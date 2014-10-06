var shapeDim = 75;
var startPlaying = false
var isNextable = true;
var cols = 2; // starting columns
var rows = 2; // starting rows
$(document).ready(function() {
    next(cols, rows);
    $('#reset').click(function(){
        next(cols, rows);
    });
});

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
            $(".content").fadeIn(200);
            pickRandomShapes();
        })
    });
}

function createShape(type, r) {
    return $("<div>").addClass("shape " + type).width(r).height(r).click(function() {
            if (startPlaying) {
                if ($(this).attr("selected") == "selected"){
                    $(this).addClass("selected");
                }
                else {
                	$(this).addClass("wrong");
                }
                var totalSelected = $(".shape[selected='selected']").length;
                if (($(".selected").length + $(".wrong").length) >= totalSelected) {
                    startPlaying = false;
                    $(".shape[selected='selected']:not(.selected)").addClass("selected");
                    if ($(".wrong").length == 0) {
                        $(".content").html("<span id='message'>That is correct!</span>");
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
    window.setTimeout(hideRandomSelectedShapes, 1200);
}

function hideRandomSelectedShapes() {
    $(".content > .shape").removeClass("selected");
    startPlaying = true;
    isNextable = true;
}