"use strict";

// chat obj containing functions commands etc 
let chat = {
	elem: $$.id("chat"),
	chatbox: "",

	// tells if they chat should be showing & actively update
	show: true, 

	// basic chat functionability
	addMsg: addMsg.bind($), // add message to chat 
	clear: clear.bind($), // clears chat 
	toggle: toggle.bind($), // toggles visability of chat	
};

/* automatic turn off if chat id isn't found. */
if(chat.elem == undefined) {
	// turn off chat
	settings.chat_on = false;

	$$.log(settings);
	$$.err("no chat element found");
}
else {
	let ul = $$.make("ul");
	ul.id = "chatbox";
	chat.elem.append(ul);

	chat.chatbox = $$.id("chatbox"); 
}

// toggles chat visability
function toggle() {
	if (chat.show == true) {
		$$.log("hiding chat...");	
		chat.show = false;
		chat.elem.classList.remove("chat-show");
	 $$.id("displayer").classList.add("display-fill");
		chat.elem.classList.add("chat-hide");
	}
	else {
		$$.log("showing chat..");
		chat.show = true;
	 $$.id("displayer").classList.remove("display-fill");
		chat.elem.classList.remove("chat-hide");
		chat.elem.classList.add("chat-show");
	}
}

// clears chat
function clear() {
	$$.log("clearing chat...");	
	chat.chatbox.classList.add("chat-clear");

	chat.chatbox.addEventListener("transitionend",
	function() {
		$$.log("event ran");
		chat.chatbox.innerHTML = "";
		chat.chatbox.classList.remove("chat-clear");
	});
} 


async function addMsg(message, user, isCommand, command, extra) {

	$$.log(extra);
	// handle message text
	let returnMessage = message;
	let usrname = user.displayName;
	if(isCommand == true) 
		returnMessage = ":"+command+" "+message;	

	if(settings.chat.shorten_names == true) {
		let res = user.displayName.split(/[_\s]/);
		usrname = res[0];
	}
	// add emotes to message if there are any
	if(extra["userState"]["emotes-raw"] != null 
	   && settings.chat.emotes_on == true)
	returnMessage = addEmotes(message, extra);

	// chat setup
	let chatmsg = $$.make("li");
	let chatborder = $$.make("div");
	chatborder.classList.add("chat-border");
		
	let userdatadiv = $$.make("div");
	userdatadiv.classList.add("user-data-line");

	
	let profileIMG = $$.make("img");
	profileIMG.src = user.profile_img;

	// should be done by CSS
	profileIMG.classList.add("profile")

	let username = $$.make("p");
	username.classList.add("username");
	username.innerHTML = usrname;

	let badgeDiv = $$.make("div");
	badgeDiv.classList.add("badges");

	let msgText = $$.make("p");

	if(command == true)
	msgText.classList.add("command");
	else 
	msgText.classList.add("message");

	msgText.innerHTML = returnMessage;

	// do in CSS instead
	
	//msgText.style="color:"+user.color+";";
	//chatborder.style="border-color:"+user.color+";";
	//username.style="color:"+user.color+";margin-left:5px;";
	//profileIMG.style="border-color:"+user.color+";";

	userdatadiv.append(profileIMG);
	userdatadiv.append(username);
	userdatadiv.append(badgeDiv);

	chatborder.append(userdatadiv);
	chatborder.append(msgText);
	chatmsg.append(chatborder);

	chat.chatbox.append(chatmsg);		
}

// add Twitch emotes with the help of the API
function addEmotes(message, extra) {
	let emotes = extra["userState"]["emotes-raw"].split("/");	
	let newMessage = message;

	emotes.map((emotes) => {
		let res = emotes.split(":");
		let locations = res[1].split(",");
		let indexs = locations[0].split("-");

		// finds emote name in message
		let emoteName = message.substring(parseInt(indexs[0]),
		 								  parseInt(indexs[1]) + 1);
		// makes direct link to emote image
		let emoteImage;	
		// add SRC and classes
		if(extra.isEmoteOnly == true)
		emoteImage = "<img class='emote-only'"+ 
		"src='https://static-cdn.jtvnw.net/emoticons/v2/"
		+ res[0] + "/default/dark/3.0'></img>";

		else
		emoteImage = "<img class='emote'"+ 
		"src='https://static-cdn.jtvnw.net/emoticons/v2/"
		+ res[0] + "/default/dark/3.0'></img>";

		newMessage = newMessage.replaceAll(emoteName, emoteImage);	
	});

	message = newMessage;
	return message;
}
