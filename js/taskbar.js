"use strict";

var task = {
	elem: $$.id("taskbar"),
	elem_time: $$.id("time"),
	elem_music: $$.id("music"),
	elem_music_player: "",
	music_json : {},

	play: pauseplay.bind($),
}

/* code for onscreen clock  */
if(task.elem_time != undefined) {
	setInterval(() => {
		let date = new Date().toLocaleTimeString();
		let splits = date.split(":");
		let frontNo = splits[0];
		if(splits[0][1] == null)
		frontNo = "0"+splits[0];
		let PMAM = splits[2].split(" ");
		task.elem_time.innerHTML = frontNo+":"+splits[1]+" "+PMAM[1]
	}, 1000)
}

/* code for music player */
if(task.elem_music != undefined) {
  async function musicplayer() {
	let text = await $$.txt("custom/music.json")
	.then((response) => {
		let music = JSON.parse(response);
		console.log(music)
		task.music_json = music;
		
		let audio = $$.make("audio");
		let source = $$.make("source");

		source.src = "custom/music/"+music["music"][8];
		source.type = "audio/mpeg";
		source.id = "musicSource";
		audio.setAttribute("controls", "");
		audio.setAttribute("autoplay", "");
		audio.setAttribute("id", "musicPlayer");
		audio.append(source);

		task.elem_music.append(audio);
		task.elem_music_player = $$.id("musicPlayer");

		task.elem_music_player.volume = 0.2;

		// what to do once music player ends
		task.elem_music_player.onended = function() {

			console.log(task.music_json);
			console.log("custom/music/"+task.music_json["music"][9])
			$$.id("musicSource").src = 
			"custom/music/"+task.music_json["music"][9];
			task.elem_music_player.load();

		};
	})
  }
 // run function
 musicplayer();
}

// pause muisc player
function pauseplay() {
	if(task.elem_music_player.paused == true){
		task.elem_music_player.play();
	}
	else {
		task.elem_music_player.pause();
	}
}
