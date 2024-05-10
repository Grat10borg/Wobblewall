
let alerts = {
	elem: $$.id("alert"),

	ding: ding.bind($)
}

$$.log(alerts);

function ding(data, type, user) {

	$$.log(data);

	let text = "";
	let image = "";
	let amount = ""; // how many raiders, or bits etc

	/* alert types */
	/* when someone follows */
	if(type == "follow") {
		image = settings.alerts.follow_img;
		text = settings.alerts.follow_msg;
	}

	/* when someone subscribes to a channel*/
	if(type == "sub") {
		image = settings.alerts.sub_img;
		text = settings.alerts.sub_msg;
	}

	/* when someone donates twitch bits */
	if(type == "cheer") {
		image = settings.alerts.cheer_img;
		text = settings.alerts.cheer_msg;
	}

	/* when someone raids the channel */
	if(type == "raid") {
		image = settings.alerts.raid_img;
		text = settings.alerts.raid_msg;
	}

	/* when someone raids the channel */
	if(type == "hosted") {
		image = settings.alerts.host_img;
		text = settings.alerts.host_msg;
	}

	text = text.replace("$USER", user);

	$$.id("alert-text").innerHTML = text;
	$$.id("alert-img").src = image;

	let alerts = $$.id("alert");

	if($$.id("alert").classList.contains("show")) {
		alerts.classList.remove("show");
	}
	/* this offsetWidth helps delay the function enough
	 * to fix animation delay problems*/
	alerts.offsetWidth;	
	alerts.classList.add("show");

}

