var _ = require("underscore");
var Backbone = require("backbone");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");
var Mode = require("../standing-novation-mode");



var COLORS = require('midi-launchpad').colors;

var colors = [
  COLORS.green.high,
  COLORS.orange.high,
  COLORS.green.high,
  COLORS.red.high
];

var currentColor = 0;

var waveDelay = 100;

var lightNeighbour = function(launchpad, button, uuid, dx, dy) {
  var neighbourX = button.x+(button.launchpad.x*8)+dx;
  var neighbourY = button.y+(button.launchpad.y*8)+dy;

  var b = launchpad.getButton(neighbourX, neighbourY);
  if (b === undefined || b.special || b._uuid[uuid] !== undefined) return;
  b.light(colors[currentColor]);
  b._uuid[uuid] = uuid;
  lightNeighbours(launchpad, b, uuid);
};

var lightNeighbours = function(launchpad, button, uuid) {
  var t = setTimeout(function() {
    lightNeighbour(launchpad, button, uuid, -1, 0);
    lightNeighbour(launchpad, button, uuid,+1, 0);
    lightNeighbour(launchpad, button, uuid,0, -1);
    lightNeighbour(launchpad, button, uuid,0, +1);
  },waveDelay);
};

var playAudio = function(){
  var i = (Math.floor(Math.random() * 5)+1) % 6;
  var stream = fs.createReadStream(__dirname+"/"+i+".mp3");
  stream.pipe(new lame.Decoder()).pipe(new Speaker());
};

var startWave = function(launchpad, btn) {
  playAudio();
  if (btn.special !== false) return;
  currentColor = (currentColor + 1) % colors.length;
  btn.light(colors[(currentColor + 1) % colors.length]);
  var uuid = (new Date()).getTime() + "" + parseInt(Math.random()*100000,10);
  btn._uuid[uuid] = uuid;
  lightNeighbours(launchpad, btn, uuid);
};


module.exports = new Mode("Zen Garden", startWave);
