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

		return "https://www.youtube.com/embed/"+id+"?autoplay=1";
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

