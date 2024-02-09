<<<<<<< HEAD
"use strict";

let illu = {
	
	clips: [], // array holding all clip responses

	// clip the last 30s / ~27s of the stream
	clip: async function() {
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
	},

	marks: [],
	
	// markiplier
	mark: async function() {
		// make a Twitch stream marker
		if(settings.api_valid) {
			$$.log("clipp!!");	

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
	},

	dice: function(max) {
		// return a random number between 0 and max 
	}
}
=======
"strict mode";

// illu is the bot, here a lot of misc commands will be handled
let illu = {
	clips: [],
	stamps: [],
	clip: function() {

	},
	stamp: function() {

	},

}

// pass a channel and this will clip it 
async function ClipperV2(channel) {
	let chanId = settings.broadcaster_id; 
	async function clip(broadcaster_id) {
	let clipJSON = await fetch(
		"https://api.twitch.tv/helix/users?login="+broadcaster_id,
		{
      		method: "POST",
      		headers: {
			// Api Token Needs Scope Clip:edit
        		Authorization: "Bearer " + config.MY_API_TOKEN,
        		"Client-ID": settings.client_id,
        		"Content-Type": "application/json"
			}
		    }
		)	
    		.then((respon) => respon.json())
    		.then((respon) => { return respon; }) // return success
    		.catch((err) => { $$.err(err); }); // log out problems

	  if (clipJSON["error"] == "Not Found") {
	    ComfyJS.Say("⚠ You cannot clip an Offline Channel!! :<");
	  }
	  else if (clipJSON["data"][0]["id"] != null) {
	    CreateStreamMarker(
	    "AutoClip-" + 
	    ClipCall["data"][0]["title"],
	    false);

	    $$.wait(2000); // wait 2 sec
	    ComfyJS.Say(
	    "Clipped!: https://clips.twitch.tv/" + clipJSON["data"][0]["id"]);
	    $$.log(clipJSON["data"][0]["edit_url"]);
	  }
	}
	if(chanId == "" || chanId == undefined || chanId == null) {
		chanId = await $$.api(
		"https://api.twitch.tv/helix/users?login="+channel,
		true) // get broadcaster_id incase there isn't one set
		.then(settings.broadcaster_id = chanId)
		.then(clip(chanId)); 
	}
	else {
		clip(chanId);
	}
}



// Ran when !clip is typed.
async function Clipper(extra) {
  if (settings.broadcaster_id == "" ||
      settings.broadcaster_id == undefined ||
      settings.broadcaster_id == null) {
    let response = await HttpCalling(
      "https://api.twitch.tv/helix/users?login=" + extra["channel"],
      true);
    settings.broadcaster_id = response["data"][0]["id"];
  }


  const clip_link = await fetch(
  "https://api.twitch.tv/helix/clips?broadcaster_id="
   + settings.broadcaster_id,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
	// Api Token Needs Scope Clip:edit
        "Client-ID": AclientId,
        "Content-Type": "application/json"
      },
    }
  )
    .then((respon) => respon.json())
    .then((respon) => {
      // Return Response on Success
      return respon;
    })
    .catch((err) => {
      // Print Error if any. And return 0
      $$.log(err);
    });
  if (clip_link["error"] == "Not Found") {
    ComfyJS.Say("⚠ You cannot clip an Offline Channel!! :<");
  } else if (ClipCall["data"][0]["id"] != null) {
    CreateStreamMarker("AutoClip-" + ClipCall["data"][0]["title"],
    false);

    wait(2000); // wait 2 sec
    ComfyJS.Say(
    "Clipped!: https://clips.twitch.tv/" + ClipCall["data"][0]["id"]);
    $$.log(ClipCall["data"][0]["edit_url"]);
  }
}

>>>>>>> 025fcb63629b0fc68d61687e838e150b082eb1ff
