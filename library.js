var library=[];

/* Reads all of the files in a directory */
function indexFiles(files){
	var library = [];
	var container = "#library";
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.indexOf("mp3") != -1) {
			library.push(file);
			$(container).append($('<div>' + file.name + '</div>').addClass("row"));
		}
	}
}