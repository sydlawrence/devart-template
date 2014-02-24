var midiConnector = require('midi-launchpad');
var ModeSelector = require("./modeSelector");
var _ = require("underscore");
var Backbone = require("backbone");

var Launchpad = function(port, across, down, ready) {
    var midi = midiConnector.connect(port);
    midi.on("ready",ready);
};

var grid = {
    across:0,
    modeSelector:undefined,
    down:0,
    calibrated: false,
    launchpads: {},
    each: function(cb) {
        var pads = [];
        for (var i in grid.launchpads) {
            for (var j in grid.launchpads[i]) {
                cb(grid.launchpads[i][j]);
            }
        }
        return pads;
    },
    getButton: function(x,y) {
        var lx = parseInt(x/8,10);
        var ly = parseInt(y/8,10);
        x = x%8;
        y = y%8;
        if (this.launchpads[lx] && this.launchpads[lx][ly])
            return this.launchpads[lx][ly].getButton(x,y);
        else
            return undefined;
    },
    clear: function() {
        grid.each(function(l){
            l.clear();
        });
    },
    light: function(color) {
        grid.each(function(l){
            l.allLight(color);
        });
    },
    displayString: function(str) {

    },
    calibrate: function(launchpads,onCalibrate) {


        var calibratedCount = 0;
        var calibrated = {};

        var finished = function() {
            grid.calibrated = true;
            grid.launchpads = calibrated;
            onCalibrate();
        };

        var calibrate = function(launchpad) {
            var row = calibratedCount % grid.across;
            var column = (calibratedCount - row) / grid.across;
            calibratedCount++;
            launchpad.x = row;
            launchpad.y = column;
            if (!calibrated[row]) calibrated[row] = {};
            calibrated[row][column] = launchpad;
            if (calibratedCount === grid.across && grid.down) {
                finished();
            }
        };

        for (var i in launchpads) {
            var l = launchpads[i];
            (function(l){
                l.allLight(grid.colors.red.high);
                var calibrated = false;
                l.on("press", function(btn){
                    if (calibrated) return;
                    calibrated = true;
                    btn.launchpad.allLight(l.colors.green.high);
                    setTimeout(function() {
                        l.clear();
                        setTimeout(function(){
                            calibrate(l);
                        },10);
                    },500);

                });
            })(l);
        }
    }
};

_.extend(grid, Backbone.Events);



module.exports = function(startingMidiPort, across, down) {
    grid.across = across;
    grid.down = down;
    var successes = 0;
    var launchpads = [];
    var done = function(){
        successes++;
        if (successes === across * down ) {
            grid.calibrate(launchpads, function() {
                grid.modeSelector = new ModeSelector(grid);
                grid.modeSelector.nextMode();
                // grid.displayString("hello world");
            });
        }
    };
    var createLaunchpad = function(across, down) {
        Launchpad((across*(down+1))+startingMidiPort,across, down, function(launchpad) {
            launchpad.across = across;
            launchpad.down = down;
            launchpads.push(launchpad);

            launchpad.on("press", function(btn){
                btn.launchpad = launchpad;
                grid.trigger("press", btn);
            });
            launchpad.on("state_change", function(btn){
                btn.launchpad = launchpad;
                grid.trigger("state_change", btn);
            });
            launchpad.on("release", function(btn){
                btn.launchpad = launchpad;
                grid.trigger("release", btn);
            });

            grid.colors = launchpad.colors;

            done();

        });
    };
    for (var i = 0; i < across; i++) {
        for (var j = 0; j < down; j++) {
            createLaunchpad(i, j);
        }
    }

    return grid;
};