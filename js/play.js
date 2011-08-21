var queue = [];
var player;
var playing = false;

function getPlayer() {
	if (player == null) {
		player = document.getElementById("player");
	}
}

/* Play a song */
function play(){
	getPlayer();
	if (playing) {
		queue.shift();
	}
	queue.unshift(this.id);
	player.src = this.id;
	player.play();
	drawQueue();
}

/* Pauses the player if playing, resumes if paused */
function pause(){
	getPlayer();
	if (playing) {
		player.pause();
		playing = false;
	} else {
		player.play();
		playing = true;
	}
	drawQueue();
}

/* Adds a song to the queue and plays it if the queue was empty */
function enqueue(){
	getPlayer();
	queue.push(this.id);
	if (queue.length == 1) {
		player.src = this.id;
		player.play();
		playing = true;
	}
	drawQueue();
}

/* Play the next song in the queue */
function next(){
	getPlayer();
	if (queue.length > 1) {
		queue.shift();
		var url = queue[0];
		player.src = url;
		player.play();
		playing = true;
	} else if (queue.length > 0) {
		queue.shift();
		player.pause();
		playing = false;
	}
	drawQueue();
}

/* Callback at the end of a song */
function songEnd(){
	next();
}

function drawQueue() {
	var queue_div = $("#queue");
	
	queue_div.empty();
	
	for (var i = 0; i < queue.length; i++) {
		var tags = library[queue[i]];
		var txt = tags.artist + " - " + tags.title;
		if (i == 0) {
			if (playing) {
				txt = "Playing: " + txt;
			} else {
				txt = "Paused: " + txt;
			}
		}
		
		queue_div.append($("<div></div>").addClass("row").text(txt));
	}
}

/* Don't edit below this line */
