var Mode = require("../standing-novation-mode");
var COLORS = require('midi-launchpad').colors;

var colors = [
  COLORS.red.high,
  COLORS.yellow.high,
  COLORS.green.high,
  COLORS.orange.high,
];

var grid;

var showRandom = function(launchpad) {
  var i = Math.floor(Math.random()*1024);
  var color = colors[Math.floor(Math.random()*colors.length)];
  var x = i%(launchpad.across*8);
  var y = Math.floor(i/(launchpad.across*8))%(launchpad.down*8);
  var btn = launchpad.getButton(x, y);
  if (btn) btn.light(color);
};

var playAudio = function(launchpad){

  grid.playAudio(__dirname+"/CAPlogo.mp3");
};

var interval;


var isActive = false;
var onPress = function(launchpad, btn){
  if (!btn.special && isActive) {
    playAudio(launchpad);
  }
};

var onInit = function(launchpad) {
  isActive = true;
  grid = launchpad;
  playAudio();
  clearInterval(interval);
  interval = setInterval(function() {
    for (var i = 0; i < 50; i++) {
      showRandom(launchpad);
    }
  },100);
};

var onFinish = function(launchpad) {
  isActive = false;
  clearInterval(interval);
};

module.exports = new Mode("Turbo Disco", onPress, onInit, onFinish);
