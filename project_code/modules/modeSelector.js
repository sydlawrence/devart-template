var Zen = require('./modes/Zen');

var ModeSelector = function(launchpad) {

  var modes = [];

  var activeMode;
  var activeModeIndex = -1;
  var that = this;
  this.switchMode = function(mode) {
    console.log(mode.name);
    if (!launchpad.calibrated) return;

    if (activeMode) {
      activeMode.active = false;
      if (activeMode.deactivate) activeMode.deactivate();
    }

    var modeIndex = 0;
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] == mode) {
        modeIndex = i;
        break;
      }
    }
    activeModeIndex = modeIndex;
    mode.active = true;
    mode.run();
    activeMode = mode;
  };

  this.nextMode = function() {
    var i = (activeModeIndex+1) % modes.length;
    var mode = modes[i];
    this.switchMode(mode);
  };

  this.addMode = function(obj) {
    modes.push(obj);
  };


  this.addMode(new Zen(launchpad));

  return this;
};

module.exports = ModeSelector;