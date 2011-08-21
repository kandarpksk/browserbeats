var library = [];

/* Reads all of the files in a directory */
function indexFiles(files){

	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (file.name.substr(file.name.length-3) == "mp3") {
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
	var view = "#library-body";
	
	var container = $("<tr id=\"" + entry.url + "\" />");
	container.append($("<td></td>").text(entry.title));
	container.append($("<td></td>").text(entry.artist));
	container.append($("<td></td>").text(entry.album));
	container.click(play);
	$(view).append(container);
	
	$("#library").trigger("update");
	
	var sorting = [[1,0]]; 
	
	setTimeout(function() {
	    $("#library").trigger("sorton",[sorting]); 
	}, 1000);
	
}

/* Updates the view of the library */
function updateView() {
	var view = "#library-body";
	
	$(view).empty();
		
	for (var i = 0; i < library.length; i++) {
		var entry = library[i];
		
		var container = $("<tr id=\"" + entry.url + "\" />");
		container.append($("<td></td>").text(entry.artist));
		container.append($("<td></td>").text(entry.title));
		container.append($("<td></td>").text(entry.album));
		container.click(play);
		$(view).append(container);
	}
	
}

/* Play a song */
function play(){
	var player = document.getElementById("player");
	
	player.src = this.id;
	player.play();
	return false;
}

$(document).ready(function() { 
    $("#library").tablesorter();
});

/* Don't edit below this line */