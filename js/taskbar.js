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
		task.elem_time.innerHTML = date.substring(0, 5)
		+" "+date.substring(9); 
	}, 1000)
}
