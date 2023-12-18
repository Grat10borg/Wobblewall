"use strict";

let settings = {
	userprofiles: [],
	clip_count: 0,
	word_count: 0,
};

/*	this file needs: dom.js & config.js
 *
 *
 * */


// init ComfyJS
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);

// runs everytime someone chats
ComfyJS.onChat = (user, message, flags, self, extra) => {
	console.log(message);	
	if(chat.show == true) // only update chat if chat is shown.
	chat.addMsg(message, user, flags, self, extra);
};

// runs everytime someone writes a command (!<command>)
ComfyJS.onCommand = (user, command, message, flags, extra) => {
	$$.log(user, command, message, flags, extra);

	// chat -> displayer -> taskbar -> illubot & misc
	if(flags.broadcaster == true ||
	flags.mod == true ||
	flags.vip == true) {
		// approved users commands
		
		switch(command) {
			// toggles hiding & unhiding chat
			case "chat":
				chat.toggle();
				break;
			// clear chat
			case "clear":
				chat.clear();
				break;
		}
	}
	else {
		// commands anyone can use

	}
}
