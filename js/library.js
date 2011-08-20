var library = [];

/* Reads all of the files in a directory */
function indexFiles(files){
	var container = "#library";
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.indexOf("mp3") != -1) {
			var entry = {};
			// Get the blob url of the file
			if (window.createObjectURL) {
				entry.url = window.createObjectURL(file);
			} else if (window.createBlobURL) {
				entry.url = window.createBlobURL(file);
			} else if (window.URL && window.URL.createObjectURL) {
				entry.url = window.URL.createObjectURL(file);
			} else if (window.webkitURL && window.webkitURL.createObjectURL) {
				entry.url = window.webkitURL.createObjectURL(file);
			}
			// Get the tags
			ID3.loadTags(entry.url, function() {
				var tags = ID3.getAllTags(entry.url);
				entry.artist = tags.artist;
				entry.title = tags.title;
				entry.album = tags.album;
			},{dataReader: FileAPIReader(file)});
			library.push(entry);
		}
	}
	
	updateView();
}

/* Updates the view of the library */
function updateView() {
	var view = "#library";
	
	$(view).empty();
	var header = $("<div></div>").addClass("row");
	header.append($("<div></div>").addClass("span2 columns").text("Artist"));
	header.append($("<div></div>").addClass("span2 columns").text("Title"));
	header.append($("<div></div>").addClass("span2 columns").text("Album"));
	$(view).append(header);
	
	for (var i = 0; i < library.length; i++) {
		var entry = library[i];
		var container = $("<div></div>").addClass("row");
		
		container.attr("id", entry.url);
		
		container.append($("<div></div>").addClass("span2 columns").text(entry.artist));
		container.append($("<div></div>").addClass("span2 columns").text(entry.title));
		container.append($("<div></div>").addClass("span2 columns").text(entry.album));
		
		$(view).append(container);
	}
}

/* Play a song */
function play(){
	var player = "#player";
	
	$(player).attr("src", this.id);
	return false;
}

/* Don't edit below this line */