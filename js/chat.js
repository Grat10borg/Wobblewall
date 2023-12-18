"use strict";

// chat obj containing functions commands etc 
let chat = {
	elem: $$.id("chat"),
	chatbox: $$.id("chat").children[0],
	// tells if they chat should be showing & actively update
	show: true, 
	// toggles visablity of the chat
	toggle: function() {
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
	},	
	// clear out chat messages
	clear: function() {
		$$.log("clearing chat...");	
		this.chatbox.classList.add("chat-clear");

		this.chatbox.addEventListener("transitionend",
		function() {
			$$.log("event ran");
			chat.chatbox.innerHTML = "";
			chat.chatbox.classList.remove("chat-clear");
		});
	},
	// add a chat msg to the bottom of the chat
	addMsg: function(message, user, flags, self, extra) {
		$$.log(this.chatbox);
		// list item containing chat elements
		let chatmsg = $$.make("li");
		let chatborder = $$.make("div");
		chatborder.classList.add("chat-border");
		
		let userdatadiv = $$.make("div");
		userdatadiv.classList.add("user-data-line");

		let profileIMG = $$.make("img");
		profileIMG.classList.add("profile");

		let username = $$.make("p");
		username.classList.add("username");
		username.innerHTML = user;

		let badgeDiv = $$.make("div");
		badgeDiv.classList.add("badges");

		let msgText = $$.make("p");
		msgText.classList.add("message");
		msgText.innerHTML = message;

		chatmsg.append(chatborder);

		userdatadiv.append(profileIMG);
		userdatadiv.append(username);
		userdatadiv.append(badgeDiv);

		chatmsg.append(userdatadiv);
		chatmsg.append(msgText);

		this.chatbox.append(chatmsg);		
	}
};

