"use strict";

// chat obj containing functions commands etc 
let chat = {
	elem: $$.id("chat"),
	// tells if they chat should be showing & actively update
	show: true, 
	// toggles visablity of the chat
	toggle: function() {
		if (this.show == true) {
			$$.log("hiding chat...");	
			this.show = false;
			this.elem.classList.remove("chat-show");
			this.elem.classList.add("chat-hide");
		}
		else {
			$$.log("showing chat..");
			this.show = true;
			this.elem.classList.remove("chat-hide");
			this.elem.classList.add("chat-show");
		}
	},	
	// clear out chat messages
	clear: function() {
		$$.log("clearning chat...");	
	},
	// add a chat msg to the bottom of the chat
	addMsg: function(message, user) {
		
	}
};

