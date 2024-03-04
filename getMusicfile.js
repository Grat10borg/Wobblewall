"use strict";

const musicFolder = "./custom/music"
const fs = require('fs');

let music = [];

// read all files inside the music folder 
fs.readdirSync(musicFolder).forEach(file => {
	music.push(file);
});

// add music array to JS object
let obj = {music};

// make the JS object into a json object
console.log(JSON.stringify(obj));

// export music json file to the custom folder
fs.writeFile("custom/music.json", JSON.stringify(obj),
	function(err){if(err){console.error(err)}});
