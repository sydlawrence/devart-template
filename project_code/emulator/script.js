TestMode = function(name,onInit,onFinish) {
    console.log("New mode: "+name);
    window.beginTest = function() {
        grid.clear();
        if (onInit)
            onInit(grid);
    };
    window.finishTest = function() {
        onFinish(grid);
    };
};

var module = {
    exports:{}
};

var require = function(str) {
    if (str === "../standing-novation-mode") {
        return TestMode;
    } else if (str === "midi-launchpad") {
        return {
            colors:{
                off: "off",
                red: {
                    high: "red_high",
                    medium: "red_medium",
                    low: "red_low"
                },
                orange: {
                    high: "orange_high",
                    medium: "orange_medium",
                    low: "orange_low"
                },
                yellow: {
                    high: "yellow_high",
                    medium: "yellow_medium",
                    low: "yellow_low"
                },
                green: {
                    high: "green_high",
                    medium: "green_medium",
                    low: "green_low"
                }
            }
        };
    }
};

