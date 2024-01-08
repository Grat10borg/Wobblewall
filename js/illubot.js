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

