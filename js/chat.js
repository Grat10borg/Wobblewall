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
	let returnMessage
	if(isCommand == true) 
		returnMessage = ":"+command+" "+message;	
	else 
		returnMessage = message;

	console.log(user);

	fetchEmotes();
		
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
	profileIMG.style = "padding: 5px; border-radius: 15px"

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

	userdatadiv.append(profileIMG);
	userdatadiv.append(username);
	userdatadiv.append(badgeDiv);

	chatborder.append(userdatadiv);
	chatborder.append(msgText);
	chatmsg.append(chatborder);

	chat.chatbox.append(chatmsg);		
}

// fetch any emotes that might be missing
async function fetchEmotes() {
 // run on first runthrough
 if(settings.emotes.length == 0) {
	 // gather typical emotes
   	 let request = await $$.api(
	 "https://api.twitch.tv/helix/chat/emotes?broadcaster_id="
	 +settings.broadcaster_id,true);
	 let request2 = await $$.api(
	 "https://api.twitch.tv/helix/chat/emotes/global", true)

	 // combine emote request data into an array
	 let emotes = [...request["data"], ...request2["data"]];
	 settings.emotes = emotes; 

	 // compact foreach function that seperates out all the emote names
	 emotes.map((emote) => {
		 settings.emotesNames.push(emote["name"]);
	 }); 
 }
	


	 console.log(settings.emotesNames);
}
