var settings = {
/* Config file for Wobblewall: https://github.com/Grat10borg/Wobblewall
 * do not share this file with anyone, treat it as a password.. */

	/* filters messages for bad code, do not turn off*/
	ruin_malicious_code: true,



	/*note: if you're running several wobblewall instances,
	 * turn off uneeded widgets so you don't get double results like
	 * two thanks for lurking messages*/

	/*note2: if you remove the id'ed elements from the HTML file
	 * the correct widgets should* turn off themselves.*/

	/* on-screen chat settings */
	chat_on: true,
	chat:  {
		emotes_on: true, // wobblewal will keep emotes as text
		// wobblewall will shorten names with _ or spaces
		shorten_names: true, 
	},
	
	/* on-screen video-player/image display settings*/
	displayer_on: true,
	disp: {

	},

	/* bot that does !lurk or !clip commands */
	tbot_on: true,
	tbot: {
		clip_cmd_on: true,
		mark_cmd_on: true,
		
		dice_cmd_on: true,
		lurk_cmd_on: true,
	},

	/* widgets that do misc things, like a music player or a clock*/
	clock_on: true,
	musicbox_on: true,
	musicbox_randomize: true,
}
