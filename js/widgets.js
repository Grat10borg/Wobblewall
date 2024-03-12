"use strict";

var widget = {
	elem_time: $$.id("time"),
	elem_music: $$.id("music"),
	elem_music_player: "",
	music_json : {},
	current_song: 0, // count up to music_json.length and then repeat
	Unpause: false, // unpause music again, etc if displayer pauses music

	play: pauseplay.bind($),
}

/* code for onscreen clock  */
if(widget.elem_time != undefined || settings.clock_on == false) {
	setInterval(() => {
		let date = new Date().toLocaleTimeString();
		let splits = date.split(":");
		let frontNo = splits[0];
		if(splits[0][1] == null)
		frontNo = "0"+splits[0];
		let PMAM = splits[2].split(" ");
		widget.elem_time.innerHTML = frontNo+":"+splits[1]+" "+PMAM[1]
	}, 1000)
}

/* code for music player */
if(widget.elem_music != undefined || settings.musicbox_on == false) {
  async function musicplayer() {
	let text = await $$.txt("custom/music.json")
	.then((response) => {
		let music = JSON.parse(response);
		console.log(music)
		widget.music_json = music;
		
		let audio = $$.make("audio");
		let source = $$.make("source");

		/* put name of song on overlay */
		let p = $$.make("p");
		p.id = "musicTitle";

		if(settings.musicbox_randomize == false) {
		source.src = "custom/music/"+widget.music_json["music"
		][widget.current_song];

		p.innerHTML = music["music"][widget.current_song];
		widget.current_song++;
		}
		else {
		let rando = Math.floor(Math.random()
		* widget.music_json["music"].length);

		$$.log(widget.music_json);
		source.src= "custom/music/"+widget.music_json["music"][rando];
		p.innerHTML = music["music"][rando];
		}


		source.type = "audio/mpeg";
		source.id = "musicSource";
		audio.setAttribute("controls", "");
		audio.setAttribute("autoplay", "");
		audio.setAttribute("id", "musicPlayer");
		audio.append(source);

		widget.elem_music.append(audio);
		widget.elem_music_player = $$.id("musicPlayer");

		widget.elem_music_player.volume = 0.2;



		widget.elem_music.append(p);

		// what to do once music player ends
		widget.elem_music_player.onended = function() {

			if(settings.musicbox_randomize == false){
			$$.id("musicSource").src = 
			"custom/music/"+widget.music_json["music"][widget.current_song];

			$$.id("musicTitle").innerHTML = widget.music_json[
			"music"][widget.current_song]
			widget.current_song++;
			}
			else {
			let rando = Math.floor(Math.random() * music.length);

			$$.id("musicSource").src = 
			"custom/music/"+widget.music_json["music"][rando];

			$$.id("musicTitle").innerHTML = widget.music_json[
			"music"][rando]
			
			}



			widget.elem_music_player.load();

		};
	})
  }
 // run function
 musicplayer();
}

// pause muisc player
function pauseplay() {
	if(widget.elem_music_player.paused == true){
		widget.elem_music_player.play();
	}
	else {
		widget.elem_music_player.pause();
	}
}
