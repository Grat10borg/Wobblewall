"use strict";

let disp = {
	elem: $$.id("displayer"),
	displayer: $$.id("displayer").children[0],
	show: false, // by default displayer isn't shown

	// displayer basic functionability
	playing: false, // if displayer is currently displaying something
	toggle: toggle.bind($), // toggle displayer visability
	play: play.bind($), // play a video on the displayer
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
			disp.toggle();
		}
	}
}


function oldplay(link) {
		// should filter and then play corisponding function handler
		let trimedLink = trimLink(link);
		if(trimedLink == "invalid link")
			ComfyJS.Say("Link invalid, please give a youtube link!");
		else {
		// clear previous video just incase
		disp.displayer.innerHTML = "";
	
		$$.log(disp.displayer.width);

		let iframe = $$.make("iframe");
		iframe.style = "width: 95%; height: 95%;";
		iframe.src = trimedLink;
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allow", "autoplay;" +
		" accelorometer; encrypted-media; gyroscope:")
		iframe.allowfullscreen = true;
		iframe.autoplay = true;	
		

		disp.displayer.append(iframe);
			
		console.log(trimedLink);	
		// place a youtube player on the displayer
		

		disp.toggle();	

		}		
}

// removes extra uneeded info like list ids etc
function trimLink(link) {
	let regex = /com\/watch\?v=/i;
	link = link.trim(); // remove whitespaces.
	
	console.log(link.search(regex));

	if(link.search(regex) != -1) {
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

// youtube iframe functions 
function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	$$.log(YT.PlayerState);
	if (event.data == YT.PlayerState.ENDED) {
		disp.toggle()
		disp.displayer.innerHTML = "";
	}
}

function stopVideo() {
	player.stopVideo();
}
