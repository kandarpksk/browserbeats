var library = {};

/* Reads all of the files in a directory */
function indexFiles(files){
    
    modalToggle();

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
					
					library[fileurl] = entry;
					addSong(entry);
				},{dataReader: FileAPIReader(file)});
			})(url);
		}
	}
	
	var sorting = [[1,0]]; 
	
	setTimeout(function() {
	    $("#library").trigger("sorton",[sorting]); 
	}, 1000);
}

function modalToggle() {
    $("#addTo").toggle();
    $("#addToButton").toggle();
}


function addSong(entry) {
	var view = "#library-body";
	
	var container = $("<tr id=\"" + entry.url + "\" />");
	container.append($("<td></td>").text(entry.title));
	container.append($("<td></td>").text(entry.artist));
	container.append($("<td></td>").text(entry.album));
	container.click(enqueue);
	$(view).append(container);
	
	$("#library").trigger("update");
		
}

var audio;
var player;
var playpause;
var seekBar;
var seekBack;
var seekForward;
var seekInterval = 15; //number of seconds to seek forward or back
var timer;
var currentTimeContainer;
var currentTime;
var duration;
var durationContainer;
var muteButton;
var nowplaying;
// var volumeControl; //not used
//while it's tempting to crank the volume by default, 
//doing so can drown out screen readers, so it's better to keep it moderate
var volume=0.5; //0 to 1
var hasSlider;
/* //volumeControl is not currently used, so neither are these vars
//var volumeIsVisible = false;
//var volumeHasFocus = false; 
//var muteHasFocus = false; 
*/
function init() {
	//add controls to #controls div using Javascript 
	//but only for browsers that support <audio> 
	player = document.getElementById('controls');
	audio = document.getElementById('player');
	if (audio.canPlayType) { //this browser suports HTML5 audio
	
		audio.setAttribute('ontimeupdate','updateSeekBar()');
		//audio.setAttribute('onvolumechange','updateVolumeControl()'); //not used
	 
		playpause = document.createElement('input');
		playpause.setAttribute('type','button');
		playpause.setAttribute('id','playpause');
		playpause.setAttribute('value','');
		playpause.setAttribute('title','Play');
		playpause.setAttribute('onclick','playAudio()');
		playpause.setAttribute('accesskey','P');
		player.appendChild(playpause);

		seekBar = document.createElement('input');
		seekBar.setAttribute('type','range');
		seekBar.setAttribute('id','seekBar');
		seekBar.setAttribute('value','0'); //???
		seekBar.setAttribute('step','any');
		seekBar.setAttribute('ondurationchange','setupSeekBar()');
		seekBar.setAttribute('onchange','seekAudio(this)');
		player.appendChild(seekBar);

		if (seekBar.type !== 'text') { 
			//if browser doesn't support type="range" (i.e., Firefox), it will render as type="text"
			hasSlider = true;
		}
		else { 
			//input type="text" is ugly and not very usable on the controller bar. Remove it.  
			player.removeChild(seekBar); //seekBar.style.display='none'; 
		}
		//Now add rewind and fast forward buttons  
		//These will be hidden from users who have sliders, but visible to users who don't
		//We still want them, even if hidden, so users can benefit from their accesskeys
		seekBack = document.createElement('input');
		seekBack.setAttribute('type','button');
		seekBack.setAttribute('id','seekBack');
		seekBack.setAttribute('value','');
		seekBack.setAttribute('title','Previous');
		seekBack.setAttribute('onclick','playPrevious()');
		seekBack.setAttribute('onclick','playPrevious()');
		seekBack.setAttribute('accesskey','R');
		player.appendChild(seekBack);
		seekForward = document.createElement('input');
		seekForward.setAttribute('type','button');
		seekForward.setAttribute('id','seekForward');
		seekForward.setAttribute('value','');
		seekForward.setAttribute('title','Next');
		seekForward.setAttribute('onclick','playNext()');
		seekForward.setAttribute('accesskey','F');
		player.appendChild(seekForward);
		if (hasSlider == true) { 
			//Note: all major browsers support accesskey on elements hidden with visibility:hidden
			//seekBack.style.visibility='hidden';
			//seekForward.style.visibility='hidden';
		}
		timer = document.createElement('span');
		timer.setAttribute('id','timer');		
		currentTimeContainer = document.createElement('span');
		currentTimeContainer.setAttribute('id','currentTime');
		var startTime = document.createTextNode('0:00');
		currentTimeContainer.appendChild(startTime);
	
		durationContainer = document.createElement('span');
		durationContainer.setAttribute('id','duration');
		timer.appendChild(currentTimeContainer);
		timer.appendChild(durationContainer);
		player.appendChild(timer);

		muteButton = document.createElement('input');
		muteButton.setAttribute('type','button');
		muteButton.setAttribute('id','muteButton');
		muteButton.setAttribute('value','');
		muteButton.setAttribute('title','Mute');		
		muteButton.setAttribute('onclick','toggleMute()');
		muteButton.setAttribute('accesskey','M');
		player.appendChild(muteButton);
		
		volumeUp = document.createElement('input');
		volumeUp.setAttribute('type','button');
		volumeUp.setAttribute('id','volumeUp');
		volumeUp.setAttribute('value','');
		volumeUp.setAttribute('title','Volume Up');		
		volumeUp.setAttribute('onclick',"updateVolume('up')");
		volumeUp.setAttribute('accesskey','U');
		player.appendChild(volumeUp);

		volumeDown = document.createElement('input');
		volumeDown.setAttribute('type','button');
		volumeDown.setAttribute('id','volumeDown');
		volumeDown.setAttribute('value','');
		volumeDown.setAttribute('title','Volume Down');		
		volumeDown.setAttribute('onclick',"updateVolume('down')");
		volumeDown.setAttribute('accesskey','D');
		player.appendChild(volumeDown);
		
		nowplaying = document.createElement('span');
		nowplaying.setAttribute('id', "nowplaying");
		player.appendChild(nowplaying);
		
		//get and set default values 
		audio.volume = volume;
		//updateVolumeControl(volume); //not used
		
		//audio.duration returns a very very precice decimal value 
		//this is exposed by MSAA and read by NVDA, and impairs accessibility
		//Plus, it isn't necessary for our purposes
		duration = Math.floor(audio.duration);
		//Chrome and Safari return NaN for duration until audio.loadedmetadata is true.
		//Other browsers are able to get duration with 100% reliability in my tests, 
		//AND (interestingly) only Chrome and Safari support audio.loadedmetadata 
		//So, have to assign duration both inside and outside of the following event listener 
		if (isNaN(duration)) { 
			audio.addEventListener('loadedmetadata',function (e) { 
				duration = audio.duration;
				showTime(duration,durationContainer,hasSlider);
				seekBar.setAttribute('min',0);
				seekBar.setAttribute('max',duration);
			},false);
		}
		else { 
			showTime(duration,durationContainer,hasSlider);
			seekBar.setAttribute('min',0);
			seekBar.setAttribute('max',duration);
		}
	}
	else { 
		player.style.display='none';
	}	
}
function showTime(time,elem,hasSlider) { 
	var minutes = Math.floor(time/60);  
	var seconds = Math.floor(time % 60); 
	if (seconds < 10) seconds = '0' + seconds;
	var output = minutes + ':' + seconds; 
	if (elem == currentTimeContainer) elem.innerHTML = output;
	else elem.innerHTML = ' / ' + output;
}

/* Pause the song if it's playing or play if it's paused */
function playAudio() {
	if (audio.paused || audio.ended) { 
		audio.play();
		playpause.setAttribute('title','Pause');
		playpause.style.backgroundImage="url('images/audio_pause.gif')";
	}
	else { 
		audio.pause();
		playpause.setAttribute('title','Play');
		playpause.style.backgroundImage="url('images/audio_play.gif')";
	}
}

/* Plays the next song in the queue */
function playNext() {
	var url = queue.next();
	changeSong(url);
	queue.draw();
}

/* Plays the previous song in the queue */
function playPrevious() {
	var url = queue.previous();
	changeSong(url);
	queue.draw();
}

/* Changes the song in the player */
function changeSong(url) {
	audio.src = url;
	if (audio.paused || audio.ended) {
		playpause.setAttribute('title', 'Pause');
		playpause.style.backgroundImage="url('images/audio_pause.gif')";
	}
	audio.play();
	$("#nowplaying").text("Playing: " + library[url].artist + " - " + library[url].title);
	
	duration = Math.floor(audio.duration);
	
	if (isNaN(duration)) { 
		audio.addEventListener('loadedmetadata',function (e) { 
			duration = audio.duration;
			showTime(duration,durationContainer,hasSlider);
			seekBar.setAttribute('min',0);
			seekBar.setAttribute('max',duration);
		},false);
	}
	else { 
		showTime(duration,durationContainer,hasSlider);
		seekBar.setAttribute('min',0);
		seekBar.setAttribute('max',duration);
	}
}

function setupSeekBar() { 
	seekBar.max = video.duration;
}
function seekAudio(element) {
	//element is either seekBar, seekForward, or seekBack
	if (element == seekBar) { 
		var targetTime = element.value;
		if (targetTime < duration) audio.currentTime = targetTime;
	}
	else if (element == seekForward) { 
		var targetTime = audio.currentTime + seekInterval;
		if (targetTime < duration) audio.currentTime = targetTime;
		else audio.currentTime = duration;
	}
	else if (element == seekBack) { 
		var targetTime = audio.currentTime - seekInterval;
		if (targetTime > 0) audio.currentTime = targetTime;
		else audio.currentTime = 0;
	}
}
function updateSeekBar() { 
	//if browser displays input[type=range] as a slider, increment it
	if (seekBar.type !== 'text') { 
		seekBar.value = audio.currentTime;
	}
	//also increment counter 
	showTime(audio.currentTime,currentTimeContainer,hasSlider);
}
function toggleMute() { 
	if (audio.muted) { 
		audio.muted = false; //unmute the volume
		muteButton.setAttribute('title','Mute');
		audio.volume = volume;
		//volumeControl.value = volume; //not used
		muteButton.style.backgroundImage="url('images/audio_volume.gif')";
	}
	else { 
		audio.muted = true; //mute the volume
		muteButton.setAttribute('title','UnMute');
		//don't update var volume. Keep it at previous level 
		//so we can return to it on unmute
		muteButton.style.backgroundImage="url('images/audio_mute.gif')";
	}
}
function showVolume() { 
	//not used...
	//triggered when #muteButton or #volumeControl receives focus 
	volumeControl.style.display="block";
	volumeIsVisible = true;
	muteHasFocus = true;
	//volume doesn't have focus yet, but we'll say it does 
	//this will keep it visible so user can tab to it if needed
	//If it's hidden when mute button loses focus, there's nothing for user to tab to
	volumeHasFocus = true;
}
function hideVolume() { 
	//not used...
	//triggered when #muteButton or #volumeControl loses focus
	muteHasFocus = false;
	if (volumeHasFocus == false && muteHasFocus == false) { 
		volumeControl.style.display="none";
		volumeIsVisible = false;
	}
}
function setVolumeFocus() { 
	//not used...
	//user has moused over or tabbed to volumeControl
	volumeHasFocus = true;
	if (!volumeIsVisible) { 
		showVolume();
	}
}
function unsetVolumeFocus() {
	//not used...
	//user has moused or tabbed away from volumeControl
	volumeHasFocus = false;
	hideVolume();
}
function updateVolume(direction) {
	//volume is a range between 0 and 1
	if (direction == 'up') { 
		if (volume < 0.9) volume = (volume + 0.1);
		else volume = 1;
	}
	else { //direction is down
		if (volume > 0.1) volume = (volume - 0.1);
		else volume = 0;
	}
	audio.volume = volume;
	/* 
	//volumeControl not used
	audio.volume = volumeControl.value;
	volume = volumeControl.value;
	*/
}
function updateVolumeControl() { 
	//not used...
	volumeControl.value = audio.volume;
}

$(document).ready(function() { 
    $("#library").tablesorter();
    
    init();
    
  
});

/* Don't edit below this line */