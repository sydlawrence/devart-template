var midiConnector = require('midi-launchpad');

var _ = require("underscore");
var Backbone = require("backbone");

var Launchpad = function(port, across, down, ready) {
    var midi = midiConnector.connect(port);
    midi.on("ready",ready);
};

var grid = {
    across:0,
    down:0,
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
        return this.launchpads[lx][ly].getButton(x,y);
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
            grid.launchpads = calibrated;
            onCalibrate();
        };

        var calibrate = function(launchpad) {
            var row = calibratedCount % grid.across;
            var column = (calibratedCount - row) / grid.across;
            calibratedCount++;
            launchpad.across = row;
            launchpad.down = column;
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
                        calibrate(l);
                        l.clear();
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
                console.log("let's light it: "+grid.colors.red.high);
                // var btn = grid.getButton(12,2);
                // btn.launchpad.allLight(grid.colors.yellow.high);
                // btn.light(grid.colors.red.high);
                for (var i in grid.launchpads) {
                    grid.launchpads[i][0].getButton(6,2).light(grid.colors.red.high);
                }
                grid.launchpads[1][0].getButton(5,3).light(grid.colors.yellow.high);
                grid.launchpads[0][0].getButton(4,2).light(grid.colors.red.high);
            });
        }
    };
    var createLaunchpad = function(across, down) {
        Launchpad((across*(down+1))+startingMidiPort,across, down, function(launchpad) {
            launchpad.across = across;
            launchpad.down = down;
            launchpads.push(launchpad);

            launchpad.on("press", function(btn){
                grid.trigger("press", {btn:btn,launchpad:launchpad});
            });
            launchpad.on("state_change", function(btn){
                grid.trigger("state_change", {btn:btn,launchpad:launchpad});
            });
            launchpad.on("release", function(btn){
                grid.trigger("release", {btn:btn,launchpad:launchpad});
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

    grid.on("press", function(e){
        e.btn.light(grid.colors.yellow.high);
        console.log(e.launchpad.across+":"+e.btn.x+" "+e.launchpad.down+ ":"+e.btn.y+" pressed");
    });

    grid.on("release", function(e){
        e.btn.light(grid.colors.off);
        console.log(e.launchpad.across+":"+e.btn.x+" "+e.launchpad.down+ ":"+e.btn.y+" released");
    });

    return grid;
};