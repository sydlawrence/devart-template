var Mode = function(name,onPress,onInit,onFinish) {

    return function(launchpad) {
        this.launchpad = launchpad;

        this.name = name;
        var that = this;
        this.active = false;

        this.run = function() {
            this.active = true;
            that.launchpad.clear();
            if (onInit) onInit();
        };

        this.deactivate = function() {
            this.active = false;
            that.launchpad.clear();
            if (onFinish) onFinish();
        };

        that.launchpad.on('press', function(button) {
            if (!that.active) return;
            onPress(that.launchpad, button);
        });

        return this;
    };
};

module.exports = Mode;