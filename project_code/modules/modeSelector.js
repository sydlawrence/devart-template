
var Modes = require('./modes/Modes');

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

  this.addModeByString = function(str) {
    var Mode = require('./modes/'+str);
    this.addMode(new Mode(launchpad));
  };

  for (var i in Modes) {
    this.addModeByString(Modes[i]);
  }

  launchpad.on("press", function(btn) {
    if( btn.special &&
      btn.y === 0 &&
      btn.x === 8 &&
      btn.launchpad.x === 1 &&
      btn.launchpad.y === 0
    ) {
      that.nextMode();
    }
  });


  return this;
};

module.exports = ModeSelector;