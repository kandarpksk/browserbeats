var library = [];

/* Reads all of the files in a directory */
function indexFiles(files){
	var container = "#library";
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.indexOf("mp3") != -1) {
			library.push(file);
			$(container).append($('<div>' + file.name + '</div>').addClass("row"));
		}
	}
	
	saveLibrary();
}

/* Check if the browser supports offline storage */
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

/* Save the library so that we don't have to restore after each page refresh */
function saveLibrary() {
    if (!supportsLocalStorage()) {
        // No native support for HTML 5 storage :(
        alert("Upgrade your browser, bro.");
        return false;
    }
    
    console.log(JSON.stringify(library));
    localStorage.setItem("browserbeats.library", JSON.stringify(library));
}

/* Load local library on page load if available */

function loadLibrary() {
    if (!supportsLocalStorage()) {
        alert("Upgrade your browser, bro");
        return false;
    }
    
    library = JSON.parse(localStorage.getItem("browserbeats.library"));
    
    $.each(library, function(i, file) {
		$('#library').append($('<div>' + file.name + '</div>').addClass("row"));
    });
}

$(document).ready(function() {
   loadLibrary(); 
});

/* Don't edit below this line */