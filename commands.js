"use strict";

$$.api_approve(); // validate twitch token

// contains basic settings and functions about user/stream info
let settings = {
	token_valid: false, // by default false becomes true when validated
	api_clientid: "", // twitch clientId needed for API calls

	username: [],
	userprofiles: [],
	clip_count: 0,
	mark_count: 0, // stream markers marked
	word_count: 0,

	Tconnect: false, // if twitch is connected
	broadcaster_id: "",
	broadcaster_login: "",
	client_id: "",

	// fetch profile pictures from the twitch api
	fetchProfile: async function(username) {
		console.log(settings);
		this.username.push(username); // add new username

		// request profile picture
    	let request = await $$.api(
	"https://api.twitch.tv/helix/users?login="
		+ username,true);

		console.log(request);

		let profileSRC = request["data"][0]["profile_image_url"];
		console.log(profileSRC);

		// save profiles for later use
		this.userprofiles.push(profileSRC); 

		console.log(this.userprofiles);

		// return profile src
		return profileSRC;
	},

	// refresh all profile pictures, should be ran ever hour~ish
	refreshProfiles: function() {
		this.userprofiles = []; // empty array
		this.username.forEach(async function(username){
			// request profile picture
    		let request = await $$.api(
		"https://api.twitch.tv/helix/users?login=" + username,true);
			let profileSRC = request["data"][0]["profile_image_url"];
		
			// save profiles for later use
			this.userprofiles.push(profileSRC); 
		});

	}
};

/*	this file needs: dom.js & config.js
 *
 *
 * */


// init ComfyJS
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);

// runs everytime someone chats
ComfyJS.onChat = (user, message, flags, self, extra) => {
	// cache user details
	if (settings.username.indexOf(user) == -1)
		settings.fetchProfile(user);

	console.log(message);	
	if(chat.show == true) // only update chat if chat is shown.
	chat.addMsg(message, user, flags, self, extra);
};

// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {
	// cache user details
	if (settings.username.indexOf(user) == -1)
		settings.fetchProfile(user);
	$$.log(user, command, message, flags, extra);

	// chat -> displayer -> taskbar -> illubot & misc
	let approved = false;
	if(flags.broadcaster == true || 
	flags.mod == true ||
	flags.vip == true) {
		approved = true;
	}
		// approved users commands
		
		switch(command) {
			// toggles hiding & unhiding chat
			case "chat":
				if(approved)
				chat.toggle();
				break;
			// clear chat
			case "clear":
				if(approved)
				chat.clear();
				break;
			// triggers the displayers toggle()
			case "dtest":
				if(approved)
				disp.toggle();
				break;
			// tries to play a YT video on displayer 
			case "play":
				if(approved)
				disp.play(message);
				break;
			// make clip & post in chat 
			case "clip":
				if(approved)
				illu.clip();
				break;
		}
	}


