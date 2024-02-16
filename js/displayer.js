"use strict";

let disp = {
	elem: $$.id("displayer"),
	displayer: $$.id("displayer").children[0],
	show: false, // by default displayer isn't shown

	// displayer basic functionability
	toggle: toggle.bind($), // toggle displayer visability
	play: play.bind($), // play a video on the displayer
};

function play(link) {
		// should filter and then play corisponding function handler
		let trimedLink = trimLink(link);
		if(trimedLink == "invalid link")
			ComfyJS.Say("Link invalid, please give a youtube link!");
		else {
		// clear previous video just incase
		disp.displayer.innerHTML = "";

		let iframe = $$.make("iframe");
		iframe.width = 560;
		iframe.height = 315;
		iframe.src = trimedLink;
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allow", "accelerometer");
		iframe.autoplay = true;	
		//iframe.setAttribute("autoplay");
		//iframe.setAttribute("encrypted-media");
		//iframe.setAttribute("gyroscope");
		//iframe.setAttribute("picture-in-picture");
		//iframe.setAttribute("web-share");


		
		disp.displayer.append(iframe);

		console.log(trimedLink);	
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

		return "https://www.youtube.com/embed/"+id;
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

