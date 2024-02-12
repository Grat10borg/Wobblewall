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
	usernames: [], // contains only usernames for quick access

	// counters
	clip_count: 0, // clips clipped
	mark_count: 0, // stream markers marked
	word_count: 0,

	Tconnect: false, // if twitch is connected
	broadcaster_id: "",
	broadcaster_login: "",
	client_id: "",

	// fetch profile pictures from the twitch api
	fetchProfile: async function(username, flags, extra) {

	 // request profile picture
   	 let request = await $$.api(
	 "https://api.twitch.tv/helix/users?login="
	 + username,true)

	 // make shorter "filepath" version 
	 let res = request["data"][0];

	 // log user data
	 let user_log = {
		"profile_img": res["profile_image_url"],
		"offline_img": res["offline_image_url"],
		"displayName": extra.displayName,
		"desc": res["description"],
		"color": extra.userColor,
		"login": extra.channel,
		"id": extra.userId,

		// status
		"broadcaster_type": res["broadcaster_type"],
		"badges": extra.userBadges,
		"extra": extra,
		"flags": flags,
	}

	settings.users.push(user_log);     // save userdata for later use
	settings.usernames.push(username); // save username for quick access

	
	$$.log(settings.usernames.indexOf(username));
	// return profile src
	return user_log;
	},

	// refresh all profile pictures, should be ran ever hour~ish
	refreshProfiles: function() {
		
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

	//let channelInfo = settings.fetchProfile(user, flags, extra);
	//console.log(channelInfo);


	//settings.users.push(user_log);
	//$$.log(user_log);

	// cache user details
	if (settings.usernames.indexOf(user) == -1)
		if (chat.show == true) {
			// initialize a varible fetch the async,
			// then make an embeded function that then calls-
			// the add message thing i think..
			let userinfo = settings.fetchProfile(user, flags, extra)
				.then((userinfo) => chat.addMsg(message, userinfo))
		}
		else  
		settings.fetchProfile(user, flags, extra)
		// if theres already a user cached
		else  {
		if (chat.show == true) {
			userinfo = settings.users[settings.usernames.indexOf(user)]
			// only update chat if chat is shown.
			chat.addMsg(message, userinfo);
		}	
	}
};

// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {
	// cache user details
	if (settings.usernames.indexOf(user) == -1)
		settings.fetchProfile(user, flags,  extra);
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


