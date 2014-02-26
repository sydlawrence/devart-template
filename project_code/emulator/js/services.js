'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.


angular.module('standingNovation.services', ['ngResource'])
.factory('Button', function() {
	return function(launchpad, x, y) {
		var type = "normal";
		this.x = x;
		this.y = y;
		this._uuid = {};
		this._state = "off";
		this.globalX = launchpad.x*8 + this.x;
		this.globalY = launchpad.y*8 + this.y;
		this.light = function(state) {
			this._state = state;
		};
		this.dark = function() {
			this._state = "off";
		};
		this.clear = function() {
			this._state = "off";
		};
		this.pressed = function() {
			launchpad.trigger("press", this);
		};
		this.released = function() {
			launchpad.trigger("release", this);
		};
		var isPressed = false;
		this.mousedown = function() {
			isPressed = true;
			this.pressed();
		};
		this.mouseup = function() {
			isPressed = false;
			this.released();
		};
		this.mouseout = function() {
			if (isPressed) {
				this.mouseup();
			}
		};
		_.extend(this, Backbone.Events);

	};
})
.factory('Launchpad', function($resource, $http, $rootScope, Button){

	return function(grid, x,y) {
		var launchpad = {
			buttons: [],
			x:x,
			y:y,
			eachButton: function(cb) {
				for (var i in launchpad.buttons) {
					for (var j in launchpad.buttons[i]) {
						if (typeof launchpad.buttons[i][j] === "object")
							cb(launchpad.buttons[i][j]);
					}
				}
			},
			getButton: function(x, y) {
				if (launchpad.buttons[x] && launchpad.buttons[x][y])
					return this.buttons[x][y];
			},
			playAudio: grid.playAudio,
			light:function(color) {
				launchpad.eachButton(function(btn) {
					btn.light(color);
				});
			},
			clear: function() {
				launchpad.eachButton(function(btn){
					btn.light("off");
				});
			},
		};
		for (var i = 0;i<9;i++) {
			for (var j = 0; j < 9; j++) {
				if (launchpad.buttons[i] === undefined)
					launchpad.buttons[i] = [];
				launchpad.buttons[i][j] = new Button(launchpad, i,j);
			}
		}
		_.extend(launchpad, Backbone.Events);
		launchpad.on("press", function(btn){
			grid.trigger("press", launchpad, btn);
		});
		launchpad.on("release", function(btn){
			grid.trigger("release", launchpad, btn);
		});
		return launchpad;
	};
})
.factory('Grid', function($resource, $http, $rootScope, Launchpad){
	return function() {
		var config = {
			arrangement: [4,4] // across, down
		};

		var grid = {
			launchpads:launchpads,
			playAudio: function(filename) {
				var audio = new Audio();
				audio.src = filename;
				audio.play();
			},
			eachPad: function(cb) {
				for (var i in grid.launchpads) {
					for (var j in grid.launchpads[i]) {
						if (typeof grid.launchpads[i][j] === "object")
							cb(grid.launchpads[i][j]);
					}
				}
			},
			getButton: function(globalX, globalY) {
				var lx = Math.round(globalX/8);
				var ly = Math.round(globalY/8);
				var bx = globalX%8;
				var by = globalY%8;
				if (grid.launchpads[lx] && grid.launchpads[lx][ly]) {
					var l = grid.launchpads[lx][ly];
					return l.getButton(bx, by);
				}
			},
			light: function(str) {
				grid.eachPad(function(l){
					l.light(str);
				});
			},
			dark: function() {
				grid.eachPad(function(l){
					l.clear();
				});
			},
			clear: function() {
				grid.eachPad(function(l){
					l.clear();
				});
			}
		};
		_.extend(grid, Backbone.Events);

		var launchpads = [];
		for (var i =0; i < config.arrangement[0]; i++) {
			for (var j =0; j < config.arrangement[1]; j++) {
				if (launchpads[i] === undefined) launchpads[i] = [];
				launchpads[i][j] = new Launchpad(grid,i,j);
			}
		}
		grid.launchpads = launchpads;

		return grid;
	}

})
.value('version', '0.1');
