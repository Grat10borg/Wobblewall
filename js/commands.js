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
	emotes: [], // contains global emotes, and channel other emotes
	emotesNames: [], // contains only the emote names
	
	betterTVemotes: [], // contain better TV emotes
	badges: [], // channel & global twitch badges

	// counters
	clip_count: 0, // clips clipped
	mark_count: 0, // stream markers marked
	word_count: 0,
	

	Tconnect: false, // if twitch is connected
	broadcaster_id: "",
	broadcaster_login: "",
	client_id: "",

	// fetch profile pictures from the twitch api
	fetchProfile: fetchProfile.bind($),
	cleanMsg: cleanMsg.bind($),
};

// init ComfyJS
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);

// runs everytime someone chats
ComfyJS.onChat = (user, message, flags, self, extra) => {
	if (settings.usernames.indexOf(user) == -1) { // cache user details
		if (chat.show == true) {
			// initialize a varible fetch the async,
			// then make an embeded function that then calls-
			// the add message thing i think..
		let userinfo = settings.fetchProfile(user, flags, extra)
		.then((userinfo) => chat.addMsg(cleanMsg(message), userinfo,
		false, "", extra))
		}
		else  
		settings.fetchProfile(user, flags, extra);
		// if theres already a user cached
	}
	else  {
	if (chat.show == true) {
		let userinfo = settings.users[settings.usernames.indexOf(user)]
		// only update chat if chat is shown.
		chat.addMsg(cleanMsg(message), userinfo, false, "", extra);
	}	
};

// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {
	// cache user details
	if (settings.usernames.indexOf(user) == -1){
		if(chat.show == true) {
		let userinfo = settings.fetchProfile(user, flags, extra)
	.then((userinfo) => chat.addMsg(cleanMsg(message),
		userinfo, true, command, extra))
		}
		else 
		settings.fetchProfile(user, flags, extra);	
	}
	else  {
		if(chat.show == true) {
		let userinfo = settings.users[settings.usernames.indexOf(user)]
			chat.addMsg(cleanMsg(message), userinfo, true, command, extra);
		}
	}

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
			/* chat */
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

			/* taskbar */	

			/* displayer */
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
			// stop the current video or stop showing whatever else
			case "stop":
				if(approved)
				disp.stop();	
				break;
			// pause video, only works on videos/pausable things
			case "pause":
				if(approved)
				disp.pause();
				break;
			case "resume":
				if(approved)
				disp.resume();
				break;
			case "mute":
				if(approved)
				disp.mute();
				break;
			case "unmute":
				if(approved)
				disp.unmute();
				break;
			// set value between 0 (muted) and 100 (max)
			case "set":
				if(approved)
				disp.setVolume(message);
				break;

			/* bot */
			// clip your/or specifed channel 30/27~ sec back
			case "clip": 
				// note: make command also able to specify channel 
				if(approved)
				illu.clip(); // clip
				break;
			// mark your stream with a marker
			case "mark":
				if(approved)
				illu.mark(); // markiplier
				break;
			// give a random number between 0 and passed value
			case "dice":
				illu.dice(cleanMsg(message));
				break;
			// print a thanks for lurking message
			case "lurk":
				illu.lurk(user);
				break;
		}
	}
}


// fetch profile pictures from the twitch api
async function fetchProfile(username, flags, extra) {
	 // request profile picture
   	 let request = await $$.api(
	 "https://api.twitch.tv/helix/users?login="
	 + username,true)

	 // make shorter "filepath" version 
	 let res = request["data"][0];

	 if(settings.badges.length == 0){
	  let globalBadges = await $$.api(
	  "https://api.twitch.tv/helix/chat/badges/global", true);
      let channelBadges = await $$.api(
	  "https://api.twitch.tv/helix/chat/badges?broadcaster_id="
	  +settings.broadcaster_id, true);

	  settings.badges = [...globalBadges["data"],
		  			     ...channelBadges["data"]]; 
	 }
	
	 /* scarpped for the time being */
	 if(settings.betterTVemotes.length == 0) {
		//let betterTVChannel = await $$.api(
		//"https://api.betterttv.net/3/cached/users/twitch/"
		//+settings.broadcaster_id, false);
		//let betterTVGlobal = await $$.api(
		//"https://api.betterttv.net/3/cached/emotes/global", false);

		//settings.betterTVmotes = [...betterTVGlobal,
		//						  ...betterTVChannel]
	 }

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
}

/* cleans message for HTML or JS code, unless you're approved */
function cleanMsg(message) {
	// change <> into imitation ones
	if(message.match(/[<>]/i)){
		message = message.replaceAll(/</g, "＜");
		message = message.replaceAll(/>/g, "＞");
	}
	// changes javascript: to javascript⋮ hopefully ruining js code
	if(message.match(/javascript:/))
	message = message.replaceAll(":", "⋮");

	return message;
}
