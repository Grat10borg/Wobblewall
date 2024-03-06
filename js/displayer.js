"use strict";

let disp = {
	elem: $$.id("displayer"),
	displayer: $$.id("displayer").children[0],
	show: false, // by default displayer isn't shown

	// displayer basic functionability
	playing: false, // if displayer is currently displaying something
	toggle: toggle.bind($), // toggle displayer visability
		
	play: play.bind($), // play a video on the displayer
	stop: stopVideo.bind($),
	pause: pauseVideo.bind($),
	resume: resumeVideo.bind($),
	mute: muteVideo.bind($),
	unmute: unmuteVideo.bind($),
};
// youtube player
var player;

function play(link) {
	let trimedLink = trimLink(link);
	if(trimedLink == "invalid link")
		ComfyJS.Say("Link invalid, please give a youtube link!");
	else {
	// clear previous video just incase
	disp.displayer.innerHTML = "";
	
	  let div_player = $$.make("div");
	  div_player.id="player";
	  disp.displayer.append(div_player);
			
	  player = new YT.Player('player', {
          height: '95%',
          width: '95%',
          videoId: trimLink(link),
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

		console.log(player)
		// toggle display animation when ready
		if(disp.show == false || disp.playing == false) {
			disp.playing = true;
			if(task.elem_music_player.paused == false) {
				task.Unpause = true;
				task.play();
			}
			disp.toggle();
		}
	}
}

// removes extra uneeded info like list ids etc
function trimLink(link) {
	let regex = /com\/watch\?v=/i;
	link = link.trim(); // remove whitespaces.
	
	console.log(link.search(regex));

	if(link.search(regex) != -1) {
		// split video ID out of link
		link = link.split("=");
		link = link[1].split("&");
		let id = link[0];		
		console.log(id);

		return id;
	}
	else {
		return "invalid link";
	}
}

function toggle() {
	console.log(disp.displayer);
	if (disp.show == true) {
		$$.log("hiding displayer...");	
		disp.show = false;
		disp.displayer.classList.remove("disp-show");
		disp.displayer.classList.add("disp-hide");
	}
	else {
		$$.log("showing displayer...");
		disp.show = true;
		disp.displayer.classList.remove("disp-hide");
		disp.displayer.classList.add("disp-show");
	}
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// mostly to help with debuging
function onPlayerStateChange(event) {
	$$.log(YT.PlayerState);
	$$.log(event.data);
    if (event.data == YT.PlayerState.ENDED  
		|| event.data == YT.PlayerState.CUED) {
		if(task.Unpause == true){
			task.play();
			task.Unpause = false;
		}
    }

}

function stopVideo() {
	// stop video and hide player
	player.stopVideo();
	disp.toggle();
}

function pauseVideo() {
	player.pauseVideo();
}

function resumeVideo() {
	player.playVideo();
}

function muteVideo() {
	player.mute();
}

function unmuteVideo() {
	player.unMute();
}

// set volume for player between max and none
function setVolume(vol) {
	let loudness = vol.toFixed;

	if(loudness > -1 && vol < 101)
		player.setVolume(loudness);
	else
		ComfyJS.Say("Please only use numbers between 0-100 :/");
}
