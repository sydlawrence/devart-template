module.exports = function(launchpad) {

  this.name = "Drawing";

  this.active = false;
  var that = this;

  this.run = function() {
    launchpad.clear();
  };

  var colors = [
    launchpad.colors.red.high,
    launchpad.colors.orange.high,
    launchpad.colors.yellow.high,
    launchpad.colors.green.high,
    launchpad.colors.off
  ];

  var nextColor = function(current) {
    var currentIndex = 0;
    for (var i = 0; i < colors.length; i++) {
      if (colors[i] === current) {
        currentIndex = i;
      }
    }

    return colors[(currentIndex+1)%colors.length];
  };

  launchpad.on('press', function(button) {
    if (!that.active) return;
    button.light(nextColor(button._state));
  });


  return this;
}