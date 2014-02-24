var Mode = require("../standing-novation-mode");
var COLORS = require('midi-launchpad').colors;

var colors = [
  COLORS.red.high,
  COLORS.orange.high,
  COLORS.yellow.high,
  COLORS.green.high,
  COLORS.off
];

var nextColor = function(current) {
  for (var i = 0; i < colors.length; i++) {
    if (colors[i] === current) {
      break;
    }
  }
  return colors[(i+1)%colors.length];
};

module.exports = new Mode("Drawing Canvas", function (launchpad, btn){
  colors.each(function(color, i){
    if (color === btn._state)
      return btn.light(colors[(i+1)%colors.length]);
  });
});
