# Wobblewall

![image](https://github.com/Grat10borg/Wobblewall/assets/109081987/4871c339-1d7c-435d-aa9b-a1b4c494ce9b)

[Video credit to  桃寝ちのい / momone chinoi](https://www.youtube.com/watch?v=xQBw0r2aV60) 

[Overlay credit to Grat10berg](https://vt.social/@Grat10berg)

<hr>

Wobblewall is an open-source overlay built on [Comfy.js](https://github.com/instafluff/comfyjs), it's added through an OBS or SLOBS browser-source. 
it has a Chatbox, Media-displayer, Alertbox, and more is planned. this project is W.I.P and using it currently is not advised.

## Download & Setup
you can currently only download Wobblewall through [github](https://github.com/Grat10borg/Wobblewall/releases)

for Wobblewall to work you will need to make a config file like this. it should be named `config.js` and put in the root folder of Wobblewall.
```
var config = {
/* Config file for Wobblewall: https://github.com/Grat10borg/Wobblewall
 * do not share this file with anyone, treat it as a password.. */

    // Chat needs both Channel:manage:broadcast to do stream markers 
    //and clips:edit to clip to your channel with the !clip command
    MY_API_TOKEN : "<twitch-apitoken>", 
    TWITCH_LOGIN : "<user-username>", // the channel it connects to
    YOUROAUTH: "<user-oauthtoken>",
	  CLIENTID: "<twitch-clientid>",
    BOTOAUTH : "<bot-oauthtoken>",
    BOTLOGIN : "<bot-username>"
}
```
Inside OBS or SLOBS, place Wobblewall behind your overlay and change the styling and placement of elements so it fits into the overlay.
some test commands to test specific widgets are:
- `!dtest` to test the media-displayer
- `!alert` to test the alertbox
- `!clear` to clear chat or test clear animation.

some personalization options can be found in `settings.js`.

## Commands 
Wobblewall commands can be triggered by typing `!<command-name>`  a list of commands can be found [here](https://github.com/Grat10borg/Wobblewall/wiki/Wobblewall-beta-0.1-%E2%80%90-Commands)
