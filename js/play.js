var queue = [];
var playing = false;

function getaudio() {
	if (audio == null) {
		audio = document.getElementById("audio");
	}
}

/* Play a song */
function play(){
	getaudio();
	if (playing) {
		queue.shift();
	}
	queue.unshift(this.id);
	audio.src = this.id;
	audio.play();
	drawQueue();
}

/* Pauses the audio if playing, resumes if paused */
function pause(){
	getaudio();
	if (playing) {
		audio.pause();
		playing = false;
	} else {
		audio.play();
		playing = true;
	}
	drawQueue();
}

/* Adds a song to the queue and plays it if the queue was empty */
function enqueue(){
	getaudio();
	queue.push(this.id);
	if (queue.length == 1) {
		audio.src = this.id;
		audio.play();
		playing = true;
	}
	drawQueue();
}

/* Play the next song in the queue */
function next(){
	getaudio();
	if (queue.length > 1) {
		queue.shift();
		var url = queue[0];
		audio.src = url;
		audio.play();
		playing = true;
	} else if (queue.length > 0) {
		queue.shift();
		audio.pause();
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
