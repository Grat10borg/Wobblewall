"use strict";

$$.api_approve(); // validate twitch token

// contains basic settings and functions about user/stream info
let cached = {
	api_valid: false, // by default false becomes true when validated
	api_clientid: "", // twitch clientId needed for API calls
	broadcaster_id: "", // twitch broadcaster, used in API calls
	broadcaster_login: "", // sometimes used in API calls

	// data
	users: [], // contains users data
	usernames: [], // contains only usernames for quick access
	emotes: [], // contains global emotes, and channel other emotes
	emotesNames: [], // contains only the emote names
	
	// data set by Twitch bot (tbot.js)
	clips: [], // array, holds all clip responses
	marks: [], // array, holds stream markings

	
	betterTVemotes: [], // contain better TV emotes
	badges: [], // channel & global twitch badges

	// counters
	clip_count: 0, // clips clipped
	mark_count: 0, // stream markers marked
	word_count: 0,
	
	// fetch profile pictures from the twitch api
	fetchProfile: fetchProfile.bind($),
	cleanMsg: cleanMsg.bind($),
};


// init ComfyJS
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);


// runs everytime someone posts a message in twitch chat
ComfyJS.onChat = (user, message, flags, self, extra) => {
	// only if on-screen chat is visable
	if(chat.show == true) {
		// collect infomation if we don't have the user saved
		if (cached.usernames.indexOf(user) == -1) {
			// fetch user info
			cached.fetchProfile(user, flags, extra)
			.then((userinfo) => { 
				chat.addMsg(cleanMsg(message), userinfo, false,
				"", extra);
			});
		}
		// if we already have user infomation do this
		else {
			// get user infomation from saved users
			let userinfo = cached.users[
			cached.usernames.indexOf(user)]

			chat.addMsg(cleanMsg(message), userinfo, false, "", extra);
		}
  }
  // if on-screen chat isn't visable
  else if(cached.usernames.indexOf(user) == -1) { 
	cached.fetchProfile(user, flags, extra);
  }
};


// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {
	// if on-screen chat is visable
	if(chat.show == true) {
		// get user infomation if user isn't in saved users
		if (cached.usernames.indexOf(user) == -1) {
			// fetch user info
			cached.fetchProfile(user, flags, extra)
			.then((userinfo) => {
				chat.addMsg(cleanMsg(message), userinfo, true,
				command, extra);
			});
		}	
		// get saved user infomation
		else  {
			let userinfo = cached.users[
			cached.usernames.indexOf(user)]
			
			chat.addMsg(cleanMsg(message), userinfo, true,
			command, extra);
		}
	}	
	// if on-screen chat isn't visable
	else if(cached.users.indexOf(user) == -1) {
		cached.fetchProfile(user, flags, extra);	
	}

	// chat -> displayer -> taskbar -> illubot & misc
	let approved = false;
	if(flags.broadcaster == true || flags.mod == true 
	|| flags.vip == true) {
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
		//	play music player 
		case "music":
			if(approved)
			widget.play();
			break;
				
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
			if(approved){
				if(disp.playing == true)
					disp.pause();
				if(widget.elem_music_player.paused == false)
					widget.play(); // pause/toggle
			}
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
			tbot.clip(); // clip
			break;
		// mark your stream with a marker
		case "mark":
			if(approved)
			tbot.mark(cleanMsg(message)); // markiplier
			break;
		// give a random number between 0 and passed value
		case "dice":
			tbot.dice(cleanMsg(message));
			break;
		// print a thanks for lurking message
		case "lurk":
			tbot.lurk(user);
			break;
	}
}



// fetch profile pictures from the twitch api
async function fetchProfile(username, flags, extra) {
	 // request profile picture
   	 let request = await $$.api(
	 "https://api.twitch.tv/helix/users?login=" + username, true);

	 // make shorter "filepath" version 
	 let res = request["data"][0];

	 if(cached.badges.length == 0) {
	  let globalBadges = await $$.api(
	  "https://api.twitch.tv/helix/chat/badges/global", true);
      let channelBadges = await $$.api(
	  "https://api.twitch.tv/helix/chat/badges?broadcaster_id="
	  +cached.broadcaster_id, true);

	  cached.badges = [...globalBadges["data"],
		  		     ...channelBadges["data"]]; 
	 }
	
	 /* scarpped for the time being */
	 if(cached.betterTVemotes.length == 0) {
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

	cached.users.push(user_log);     // save userdata for later use
	cached.usernames.push(username); // save username for quick access

	
	$$.log(cached.usernames.indexOf(username));
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
