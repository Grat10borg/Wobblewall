"use strict";

// chat obj containing functions commands etc 
let chat = {
	elem: $$.id("chat"),
	chatbox: $$.id("chat").children[0],
	// tells if they chat should be showing & actively update
	show: true, 

	// basic chat functionability
	toggle: toggle.bind($), // toggles visability of chat	
	clear: clear.bind($), // clears chat 

	// add a chat msg to the bottom of the chat
	addMsg: addMsg.bind($), 
};

// toggles chat visability
function toggle() {
	if (this.show == true) {
		$$.log("hiding chat...");	
		this.show = false;
		this.elem.classList.remove("chat-show");
	 $$.id("displayer").classList.add("display-fill");
		this.elem.classList.add("chat-hide");
	}
	else {
		$$.log("showing chat..");
		this.show = true;
	 $$.id("displayer").classList.remove("display-fill");
		this.elem.classList.remove("chat-hide");
		this.elem.classList.add("chat-show");
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


async function addMsg(message, user, flags, self, extra) {
	$$.log(chat.chatbox);
	// list item containing chat elements
	let chatmsg = $$.make("li");
	let chatborder = $$.make("div");
	chatborder.classList.add("chat-border");
		
	let userdatadiv = $$.make("div");
	userdatadiv.classList.add("user-data-line");

	// gather profile image if not stored in settings
	let profileIMG = $$.make("img");
	profileIMG.classList.add("profile");
	// gather saved profile src
	
	if(settings.userprofiles[settings.username.indexOf(user)] != -1)
	{
		// note fix profile pictures being undefined
		profileIMG.src = settings.userprofiles[
		settings.username.indexOf(user)];
	}

	console.log(settings.userprofiles[settings.username.indexOf(user)]);

	let username = $$.make("p");
	username.classList.add("username");
	username.innerHTML = user;

	let badgeDiv = $$.make("div");
	badgeDiv.classList.add("badges");

	let msgText = $$.make("p");
	msgText.classList.add("message");
	msgText.innerHTML = message;


	userdatadiv.append(profileIMG);
	userdatadiv.append(username);
	userdatadiv.append(badgeDiv);

	chatborder.append(userdatadiv);
	chatborder.append(msgText);
	chatmsg.append(chatborder);

	chat.chatbox.append(chatmsg);		
}
