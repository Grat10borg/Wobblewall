"use strict";

let illu = {
	
	clips: [], // array, holds all clip responses
	marks: [], // array, holds stream markings

	clip: clip.bind($), // function, clips stream
	mark: mark.bind($), // function, stream-markers the stream
	
	// for fun functions
	dice: dice.bind($),
	lurk: lurk.bind($),
}

// illu bot function

// clip the last 30s / ~27s of the stream
async function clip() {
	// only clip if token is valid.
	$$.log(settings);
	if(settings.api_valid) {
		$$.log("clipp!!");	

		// POST call to make and return a twitch clip
		let clip_resp = await fetch(
		"https://api.twitch.tv/helix/clips?broadcaster_id="
		+settings.broadcaster_id,{
		 method: "POST",
			headers: {
				Authorization: "Bearer " + config.MY_API_TOKEN,
				"Client-ID": settings.api_clientid,
				"Content-Type": "application/json"
		},}) 
		.then((respon) => respon.json())
		.then((respon) => {
			return respon; // return clip data
		})
		.catch((err) => {$$.log(err)}) // error handling
		
		if(clip_resp["error"] == "Not Found") 
		ComfyJS.Say("⚠ You cannot clip an Offline Channel!! :<");

		if(clip_resp == undefined)
		ComfyJS.Say("Error, clip response was nothing");

		// if it returned anything
		else if(clip_resp["data"][0]["id"] != null) {
		  let clip_id = clip_resp["data"][0]["id"];
			// note: create stream maker here
			this.mark();
			$$.wait(2000);
		// save clips
		this.clips.push(clip_resp);
		settings.clip_count++;

		ComfyJS.Say("Clipped: https://clips.twitch.tv/"+clip_id);
		$$.log(clip_resp["data"][0]["edit_url"]);
		}
		
	}
}


// markiplier
async function mark() {
	// make a Twitch stream marker
	if(settings.api_valid) {
		// POST call to make and return a twitch clip
		let mark_resp = await fetch(
		"https://api.twitch.tv/helix/streams/marker"
		+settings.broadcaster_id,{
		 method: "POST",
			headers: {
				Authorization: "Bearer " + config.MY_API_TOKEN,
				"Client-ID": settings.api_clientid,
				"Content-Type": "application/json",
		},
		// pass a user id and a description for marker desc
		body: JSON.stringify({"user_id": settings.broadcaster_id,
			"description": "markiplier command"})
		}) 
		.then((respon) => respon.json())
		.then((respon) => {
			return respon;
		})
		.catch((err) => {$$.log(err)}) // error handling
		
		if(mark_resp["error"] == "Not Found") 
		ComfyJS.Say("⚠ You cannot mark an Offline Channel!! :<");

		if(mark_resp == undefined)
		ComfyJS.Say("Error, mark response was nothing");

		// if it returned anything
		else if(mark_resp["data"][0]["id"] != null) {
		$$.wait(2000);
		this.marks.push(mark_resp);
		settings.mark_count++;
		}
	}
}

function dice(max) {
	// return a random number between 0 and max 
	$$.log(max);
	ComfyJS.Say("The Dice rolls..."+
	Math.floor(Math.random() * max + 1) + "!!");
}

function lurk(user) {
	ComfyJS.Say("okey! please enjoy the stream @"+user+"!!");
}
