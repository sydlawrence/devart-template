var _ = require("underscore");
var Backbone = require("backbone");
var fs = require("fs");
var lame = require("lame");
var Speaker = require("speaker");

var Zen = function(launchpad) {

  this.name = "Zen Garden";

  this.active = false;

  var that = this;
  _.extend(this, Backbone.Events);

  this.run = function() {
    launchpad.light(launchpad.colors.yellow.high);
  };

  var colors = [
    //0,
    launchpad.colors.green.high,
    launchpad.colors.orange.high,
    launchpad.colors.green.high,
    launchpad.colors.red.high
  ];

  var currentColor = 0;

  var waveDelay = 100;

  var lightNeighbour = function(button, uuid, dx, dy) {
    var neighbourX = button.x+(button.launchpad.x*8)+dx;
    var neighbourY = button.y+(button.launchpad.y*8)+dy;

    var b = launchpad.getButton(neighbourX, neighbourY);
    if (b === undefined || b.special || b._uuid[uuid] !== undefined) return;
    b.light(colors[currentColor]);
    b._uuid[uuid] = uuid;
    lightNeighbours(b, uuid);
  };


  var lightNeighbours = function(button, uuid) {
    var t = setTimeout(function() {
      lightNeighbour(button, uuid, -1, 0);
      lightNeighbour(button, uuid,+1, 0);
      lightNeighbour(button, uuid,0, -1);
      lightNeighbour(button, uuid,0, +1);
    },waveDelay);
  };

  launchpad.on('press', function(button) {
    if (!that.active) return;

    // var audio = new Audio;
    // audio.addEventListener("canplaythrough", function() {
    //   audio.play();
    // });
    // var src = "/ripple/"+i+".mp3";
    // audio.src = src;
    var i = (Math.floor(Math.random() * 5)+1) % 6;
    var stream = fs.createReadStream(__dirname+"/"+i+".mp3");
    stream.pipe(new lame.Decoder()).pipe(new Speaker());

    if (button.special !== false) return;
    currentColor = (currentColor + 1) % colors.length;
    button.light(colors[(currentColor + 1) % colors.length]);
    var uuid = (new Date()).getTime() + "" + parseInt(Math.random()*100000,10);
    button._uuid[uuid] = uuid;

    lightNeighbours(button, uuid);
  });

  return this;
};

module.exports = Zen;