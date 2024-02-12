"use strict";

let disp = {
	elem: $$.id("displayer"),
	displayer: $$.id("displayer").children[0],
	show: false, // by default displayer isn't shown

	// displayer basic functionability
	toggle: toggle.bind($), // toggle displayer visability
	play: play.bind($), // play a video on the displayer
};

function play() {
		// should filter and then play corisponding function handler
		link = trimLink(link);
		if(link == "invalid link")
			ComfyJS.Say("Link invalid, please give a youtube link!");
		else {

		// place a youtube player on the displayer
		

		// toggle display animation when ready
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

		return "https://www.youtube.com/watch?v="+id;
	}
	else {
		return "invalid link";
	}
}

function toggle() {
	console.log(this.displayer);
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

