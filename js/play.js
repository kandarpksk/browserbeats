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
}

/* Callback at the end of a song */
function songEnd(){
	next();
}

/* Don't edit below this line */
