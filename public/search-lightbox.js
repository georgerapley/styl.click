$(document).ready(function(){
  
  // search lightbox
	$("#product-search").click(function(){
    
    // if lightbox already active, do nothing
    if ($('#lightbox-overlay').length > 0) {
    return false
    }
    
    else {
      window.startOverlay();
      window.removeOverlay();
    }
    
		return false;
	});
  
  $(".ui-menu-element").click(function(){
    console.log("Val:" + $(".product-label").val());
    
    return false;
	});
  
});

function startOverlay() {
//add the elements to the dom
	$("body")
		.append('<div id="lightbox-overlay"></div>')
		.css({"overflow-y":"hidden"});
  
//animate the semitransparant layer
	$("#lightbox-overlay ").animate({"opacity":"0.6"}, 400, "linear");
};

function removeOverlay() {
  // close lightbox if user clicks autocomplete or the overlay
	$("#lightbox-overlay, .ui-autocomplete").click(function(){
    
		$("#lightbox-overlay").animate({"opacity":"0"}, 200, "linear", function(){
			$("#lightbox-overlay").remove();
		});
	});
  
  // close lightbox if user submits text search
  var formProduct = document.getElementById('search-product');
  formProduct.addEventListener('submit', function (e) {
    $("#lightbox-overlay").animate({"opacity":"0"}, 200, "linear", function(){
      $("#lightbox-overlay").remove();
    });
  })
};

function removeAutocomplete() {
  // close autocomplete if user submits manual text search
  var formProduct = document.getElementById('search-product');
  formProduct.addEventListener('submit', function (e) {
      $(".ui-menu-item").remove();
  })
};