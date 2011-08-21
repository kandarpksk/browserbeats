var queue = new Queue();

/* The playback queue */
function Queue(){
	this.items = [];
	this.cno = -1;
	this.display = "#queue";
	
	this.length = function() {
		return this.items.length;
	}
	
	this.add = function(url) {
		this.items.push(url);
		if (this.cno < 0) {
			this.cno = 0;
		}
	}
	
	this.remove = function(pos) {
		if (pos >= 0 && pos < this.length() && pos != this.cno) {
			this.items.splice(pos, 1);
			if (pos < this.cno) {
				this.cno = this.cno - 1;
			}
			if (this.cno >= this.length()) {
				this.cno = 0;
			}
		}
	}
	
	this.next = function() {
		if (this.cno < this.length() - 1) {
			this.cno = this.cno + 1;
		}
		return this.items[this.cno];
	}
	
	this.previous = function() {
		if (this.cno > 0) {
			this.cno = this.cno - 1;
		}
		return this.items[this.cno];
	}
	
	this.current = function() {
		return this.items[this.cno];
	}
	
	this.draw = function() {
		var container = $(this.display);
		container.empty();
		
		for (var i = 0; i < this.length(); i++) {
			var tags = library[this.items[i]];
			var div = $("<div></div>");
			div.addClass("row");
			div.text(tags.artist + " - " + tags.title);
			if (i == this.cno) {
				div.css("font-weight", "bold");
			} else {
				var link = $("<a id=\"" + i + "\" href=\"#\">&times;</a>");
				link.click(dequeue);
				link.css("margin-left", "5px");
				div.append(link);
			}
			container.append(div);
		}
	}
}

/* Adds "this" song to the queue */
function enqueue() {
	queue.add(this.id);
	queue.draw();
	if (queue.length() == 1) {
		changeSong(this.id);
	}
}

/* Removes "this" song from the queue */
function dequeue() {
	queue.remove(this.id);
	queue.draw();
}

/* Callback at the end of a song */
function songEnd(){
	playNext();
}

/* Don't edit below this line */
