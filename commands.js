"use strict";

$$.api_approve(); // validate twitch token

// contains basic settings and functions about user/stream info
let settings = {
	api_valid: false, // by default false becomes true when validated
	api_clientid: "", // twitch clientId needed for API calls
	broadcaster_id: "", // twitch broadcaster, used in API calls
	login: "", // sometimes used in API calls

	// data
	users: [], // contains users data

	username: [],
	userprofiles: [],

	// counters
	clip_count: 0, // clips clipped
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

	//	 return profile src
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
	console.log(user, flags, self,  extra);	

	// log user data
	let user_log = {
		"profile_img": settings.fetchProfile(user),
		"login": user,
		"color": self.userColor
	}

	settings.users.push(user_log);
	$$.log(user_log);

	// cache user details
	if (settings.username.indexOf(user) == -1)
		settings.fetchProfile(user);

	console.log(chat);	
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
		$$.log(command);	
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
			// clip your/or specifed channel 30/27~ sec back
			case "clip": 
				// note: make command also able to specify channel 
				if(approved)
				illu.clip();
				break;
			// mark your stream with a marker
			case "mark":
				if(approved)
				illu.mark(); // markiplier
				break;
		}
	}


