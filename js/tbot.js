"use strict";

// overview of twitch bot
let tbot = {

	/* functions */
	clip: clip.bind($), // function, clips stream
	mark: mark.bind($), // function, stream-markers the stream
	
	// for fun functions
	dice: dice.bind($),
	lurk: lurk.bind($),
}

/* tbot functions */

// clip the last 30s / ~27s of the stream
async function clip() {
	// only clip if token is valid.
	$$.log(cached.api_valid);
	if(cached.api_valid) {
		// POST call to make and return a twitch clip
		let clip_resp = await fetch(
		"https://api.twitch.tv/helix/clips?broadcaster_id="
		+cached.broadcaster_id,{
		 method: "POST",
			headers: {
				Authorization: "Bearer " + config.MY_API_TOKEN,
				"Client-ID": cached.api_clientid,
				"Content-Type": "application/json"
		},}) 
		.then((respon) => respon.json())
		.then((respon) => {
			// return Twitch's response
			console.log(respon);
			return respon; 
		})
		// error handling for fetch
		.catch((err) => {$$.log(err)})

		// error handling for responses
		if(clip_resp["error"] == "Not Found") 
			$$.err("⚠ You cannot clip an Offline Channel!! :<");
		if(clip_resp == undefined)
			$$.err("Error, clip response was nothing");
		
		// if response was as expected
		else if(clip_resp["data"][0]["id"] != null) {
			// save "slug" of the returned clip link
			let clip_id = clip_resp["data"][0]["id"];

			// creates a stream marker of the clip-taking
			this.mark("clip created here.");

			// save clips
			cached.clips.push(clip_resp);
			cached.clip_count++;

			ComfyJS.Say("Clipped: https://clips.twitch.tv/"+clip_id);
			$$.log(clip_resp["data"][0]["edit_url"]);
		}
		else {
			$$.err("Unexpected response:", clip_resp);
		}
		
	}
	else {
		$$.err("Error: api key wasn't found valid.");
	}
}


// markiplier
async function mark(desc) {

	if(desc == "" || desc == undefined)
		desc = "no description given.";

	if(cached.api_valid) {
		// POST call to make and return a twitch clip
		let mark_resp = await fetch(
		"https://api.twitch.tv/helix/streams/marker"
		+cached.broadcaster_id,{
		 method: "POST",
			headers: {
				Authorization: "Bearer " + config.MY_API_TOKEN,
				"Client-ID": cached.api_clientid,
				"Content-Type": "application/json",
		},
		// pass a user id and a description for marker desc
		body: JSON.stringify({"user_id": cached.broadcaster_id,
			"description": desc})
		}) 
		.then((respon) => respon.json())
		.then((respon) => {
			return respon;
		})
		// error handling for fetch
		.catch((err) => {$$.log(err)}) 
		
		// error handling for responses
		if(mark_resp["error"] == "Not Found") 
			$$.err("⚠ You cannot mark an Offline Channel!! :<");

		if(mark_resp == undefined)
			$$.err("Error, mark response was nothing");

		// if response is as expected
		else if(mark_resp["data"][0]["id"] != null) {
			cached.marks.push(mark_resp);
			cached.mark_count++;
		}
		else 
			$$.err("unexpected response:", mark_resp);
	}
}

/* for fun functions */

function dice(max) {
	// return a random number between 0 and max 
	if(!isNaN(max)) {
		ComfyJS.Say("The Dice rolls..."+
		Math.floor(Math.random() * max + 1) + "!!");
	}
	else
		ComfyJS.Say("please give a NUMBER :)");
}

function lurk(user) {
	ComfyJS.Say("okey! please enjoy the stream @"+user+"!!");
}
