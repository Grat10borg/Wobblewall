"use strict";

let task = {
	elem: $$.id("taskbar"),
	elem_time: $$.id("time"),
	elem_music: $$.id("music"),
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
		
		let audio = $$.make("audio");
		let source = $$.make("source");
		source.src = "custom/music/"+music["music"][0];
		source.type = "audio/mpeg";

		audio.setAttribute("controls", "");
		audio.setAttribute("autoplay", "");

		audio.append(source);
		task.elem_music.append(audio);

	})
  }
 // run function
 musicplayer();
}


