var library = [];

/* Reads all of the files in a directory */
function indexFiles(files){
	var view = "#library";
	
	$(view).empty();
	var header = $("<div></div>").addClass("row");
	header.append($("<div></div>").addClass("span2 columns").text("Artist"));
	header.append($("<div></div>").addClass("span2 columns").text("Title"));
	header.append($("<div></div>").addClass("span2 columns").text("Album"));
	$(view).append(header);
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.indexOf("mp3") != -1) {
			var url;
			// Get the blob url of the file
			if (window.createObjectURL) {
				url = window.createObjectURL(file);
			} else if (window.createBlobURL) {
				url = window.createBlobURL(file);
			} else if (window.URL && window.URL.createObjectURL) {
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL && window.webkitURL.createObjectURL) {
				url = window.webkitURL.createObjectURL(file);
			}
			// Get the tags
			(function(fileurl){
				ID3.loadTags(fileurl, function() {
					var entry = {};
					entry.url = fileurl;
					entry.artist = ID3.getTag(fileurl, "artist");
					entry.title = ID3.getTag(fileurl, "title");
					entry.album = ID3.getTag(fileurl, "album");
					
					library.push(entry);
					addSong(entry);
				},{dataReader: FileAPIReader(file)});
			})(url);
		}
	}
}

function addSong(entry) {
	var view = "#library";
	
	var container = $("<div id=\"" + entry.url + "\" />").addClass("row");
	container.append($("<div></div>").addClass("span2 columns").text(entry.artist));
	container.append($("<div></div>").addClass("span2 columns").text(entry.title));
	container.append($("<div></div>").addClass("span2 columns").text(entry.album));
	container.click(enqueue);
	$(view).append(container);
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
		
		var container = $("<div id=\"" + entry.url + "\" />").addClass("row");
		container.append($("<div></div>").addClass("span2 columns").text(entry.artist));
		container.append($("<div></div>").addClass("span2 columns").text(entry.title));
		container.append($("<div></div>").addClass("span2 columns").text(entry.album));
		container.click(enqueue);
		$(view).append(container);
	}
}

/* Don't edit below this line */