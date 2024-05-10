"use strict";

$$.api_approve(); // validate twitch token

// contains cached variables
let cached = {
	api_valid: false, // by default false becomes true when validated
	api_clientid: "", // twitch clientId needed for API calls
	broadcaster_id: "", // twitch broadcaster, used in API calls
	broadcaster_login: "", // sometimes used in API calls

	// data
	users: [], // contains users data
	usernames: [], // contains only usernames for quick access
	badges: [], // channel & global twitch badges
	
	// data set by Twitch bot (tbot.js)
	clips: [], // array, holds all clip responses
	marks: [], // array, holds all marker responses

	// counters
	clip_count: 0, // clips clipped
	mark_count: 0, // stream markers marked
	word_count: 0,
	
	// fetch profile pictures from the twitch api
	fetchProfile: fetchProfile.bind($),
	cleanMsg: cleanMsg.bind($),


	// scrapped / WIP
	//emotes: [], // contains global emotes, and channel other emotes
	//emotesNames: [], // contains only the emote names
	//betterTVemotes: [], // contain better TV emotes
};

updateFollowers(); 

// init ComfyJS
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);

	/* what to do when event is triggered */

// run everytime someone subs
ComfyJS.onSub = (user, message, subTierInfo, extra) => {
	$$.id("sub").innerHTML = "";
	$$.id("sub").append($$.make("p").innerHTML = user+" subscribed.");	

	if(settings.alertbox_on) {
		// send data to alertbox file
		alerts.ding(subTierInfo, "sub", user);
	}
}

/* OnFollow events are only implimented on event ways that
* need a backend server, this is a *good enough* solution for now... */
// to help vote, and make your voice heard.
// https://discuss.dev.twitch.com/t/api-request-add-new-follower-topic-to-pubsub/26852/2

// update every 5 minutes, by default
setTimeout(updateFollowers, 5000);

async function updateFollowers() {
	// get the most recent follower, and only return one follower
	let follower =	await $$.api("https://api.twitch.tv/helix/channels/"+
	"followers?broadcaster_id="+cached.broadcaster_id+"&first=1", false);

	$$.log(follower["data"][0]["user_name"]);

	let user = follower["data"][0]["user_name"];

	$$.id("follow-text").innerHTML=username+" has followed!";

	if(settings.alertbox_on) {
		// send data to alertbox file
		alerts.ding("", "follow", user);
	}
} 


// runs everytime someone posts a message in twitch chat
ComfyJS.onChat = (user, message, flags, self, extra) => {
	if(settings.ruin_malicious_code == true)
		// removes possibly malicious code
		message = cleanMsg(message);

	// only if on-screen chat is visable
	if(chat.show == true && settings.chat_on == true) {
		// collect infomation if we don't have the user saved
		if (cached.usernames.indexOf(user) == -1) {
			// fetch user info
			cached.fetchProfile(user, flags, extra)
			.then((userinfo) => { 
				chat.addMsg(message, userinfo, false,
				"", extra);
			});
		}
		// if we already have user infomation do this
		else {
			// get user infomation from saved users
			let userinfo = cached.users[
			cached.usernames.indexOf(user)]

			if(settings.chat_on == true)
			chat.addMsg(message, userinfo, false, "", extra);
		}
  }
  // if on-screen chat isn't visable
  else if(cached.usernames.indexOf(user) == -1) { 
	cached.fetchProfile(user, flags, extra);
  }
};


// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {

	if(settings.ruin_malicious_code)
		// removes possibly malicious code
		message = cleanMsg(message);

	// if on-screen chat is visable
	if(chat.show == true) {
		// get user infomation if user isn't in saved users
		if (cached.usernames.indexOf(user) == -1) {
			// fetch user info
			cached.fetchProfile(user, flags, extra)
			.then((userinfo) => {
				chat.addMsg(message, userinfo, true,
				command, extra);
			});
		}	
		// get saved user infomation
		else  {
			let userinfo = cached.users[
			cached.usernames.indexOf(user)]
			
			chat.addMsg(message, userinfo, true,
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
			if(approved && settings.chat_on == true)
			chat.toggle();
			break;
		// clear chat
		case "clear":
			if(approved && settings.chat_on == true)
			chat.clear();
			break;

		/* widgets */	
		//	play music player 
		case "music":
			if(approved && settings.musicbox_on == true)
			widget.play();
			break;
				
		/* displayer */
		// triggers the displayers toggle()
		case "dtest":
			if(approved && settings.displayer_on == true)
			disp.toggle();
			break;
		// tries to play a YT video on displayer 
		case "play":
			if(approved && settings.displayer_on == true)
			disp.play(message);
			break;
		// stop the current video or stop showing whatever else
		case "stop":
			if(approved && settings.displayer_on == true)
			disp.stop();	
			break;
		// pause video, only works on videos/pausable things
		case "pause":
			if(approved){
				if(disp.playing == true 
				  && settings.displayer_on == true)
					disp.pause();
				if(widget.elem_music_player.paused == false 
				  && settings.musicbox_on)
					widget.play(); // pause/toggle
			}
			break;

		case "resume":
			if(approved && settings.displayer_on == true)
			disp.resume();
			break;

		case "mute":
			if(approved && settings.displayer_on == true)
			disp.mute();
			break;

		case "unmute":
			if(approved && settings.displayer_on == true)
			disp.unmute();
			break;
		// set value between 0 (muted) and 100 (max)
		case "set":
			if(approved && settings.displayer_on == true)
			disp.setVolume(message);
			break;

		/* alertbox */
		// test alertbox, useful in testing 
		case "alert":
			if(approved && settings.alertbox_on == true)
			alerts.ding("", "follow", cached.broadcaster_login);
			break;
		

		/* bot */
		// clip your/or specifed channel 30/27~ sec back
		case "clip": 
		// note: make command also able to specify channel 
			if(approved 
			&& settings.tbot_on == true 
			&& settings.tbot.clip_cmd_on == true)
			tbot.clip(); // clip
			break;
		// mark your stream with a marker
		case "mark":
			if(approved
			&& settings.tbot_on ==  true
			&& settings.tbot.mark_cmd_on == true)
			tbot.mark(message); // markiplier
			break;
		// give a random number between 0 and passed value
		case "dice":
			if(settings.tbot_on == true
			&& settings.tbot.dice_cmd_on == true)
			tbot.dice(message);
			break;
		// print a thanks for lurking message
		case "lurk":
			if(settings.tbot_on == true
			&& settings.tbot.lurk_cmd_on == true)
			tbot.lurk(user);
			break;
	}
}


/* Functions */

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
	
	 $$.log(res);

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



