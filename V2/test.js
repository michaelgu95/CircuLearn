var shapeDim = 75;
var startPlaying = false;
var isNextable = true;
var cols = 2;
var rows = 2;
$(document).ready(function(){
	next(cols, rows);
	$('#reset').click(function(){
		next(cols,rows);
	});
});

function next(c,r){
	if(!isNextable){
		return;
	}
	isNextable =false;
	$(".content").fadeOut(1500, function(){


	$(".content").empty();
	$(".container").animate({
		height: ((shapeDim +8) * r) + "px",
		width: ((shapeDim +8) * c) + "px"
	},
		1000, function() {
		for(i = 0; i < (c*r); i++){
			$(".content").append(createShape("circle", shapeDim));
		}
		($".content").fadeIn(200);
		pickRandomShapes();


		})
	});
}

function createShape(type,r) {
	return $("<div>").addClass("shape " + type).width(r).height(r).click(function(){
		if(startPlaying){
			if($(this).attr("selected")== "selected"{
				$(this).addClass("selected");
	
			}

			else{
				$(this).addClass("wrong");

			}
			var totalSelected = $(".shape[selected='selected']").length;
			if(($(".selected").length + $(".wrong").length >= totalSelected);
				
		}
	})
}