"use strict";

// chat obj containing functions commands etc 
let chat = {
	elem: $$.id("chat"),
	chatbox: $$.id("chat").children[0],

	// tells if they chat should be showing & actively update
	show: true, 

	// basic chat functionability
	addMsg: addMsg.bind($), // add message to chat 
	clear: clear.bind($), // clears chat 
	toggle: toggle.bind($), // toggles visability of chat	
};

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
	if(isCommand == true) 
		returnMessage = ":"+command+" "+message;	

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
	profileIMG.width = 45;
	profileIMG.height = 45;
	profileIMG.classList.add("profile")

	let username = $$.make("p");
	username.classList.add("username");
	username.innerHTML = user.displayName;

	let badgeDiv = $$.make("div");
	badgeDiv.classList.add("badges");

	let msgText = $$.make("p");
	msgText.classList.add("message");
	msgText.innerHTML = returnMessage;

	// do in CSS instead
	msgText.style="color:"+user.color+";";
	chatborder.style="border-color:"+user.color+";";
	username.style="color:"+user.color+";margin-left:5px;";
	profileIMG.style="border-color:"+user.color+";";

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
