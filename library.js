var library=[];

/* Reads all of the files in a directory */
function indexFiles(files){
	var container = "#library";
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.indexOf("mp3") != -1) {
			library.push(file);
		}
	}
	
	updateView();
}

/* Updates the view of the library */
function updateView() {
	var container = "#library";
	var player = "#player";
	
	for (var i = 0; i < library.length; i++) {
		var url;
		if (window.createObjectURL) {
			url = window.createObjectURL(library[i]);
		} else if (window.createBlobURL) {
			url = window.createBlobURL(library[i]);
		} else if (window.URL && window.URL.createObjectURL) {
			url = window.URL.createObjectURL(library[i]);
		} else if (window.webkitURL && window.webkitURL.createObjectURL) {
			url = window.webkitURL.createObjectURL(library[i]);
		}
		var link = $("<a></a>").text(library[i].name);
		link.attr("href", url);
		link.click(function () {
			$(player).attr("src", this.href);
			return false;
		});
		
		$(container).append(link);
		$(container).append($("<br/>"));
	}
}
