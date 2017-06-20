"use strict";
exports.__esModule = true;
/**
 * Pin mapping
 * @type {Pin}
 *
 * traction
 *    enable   --> [12, GPIO1]
 *    forward  --> [16, GPIO4]
 *    backward --> [18, GPIO5]
 * swerve
 *    enable   --> [11, GPIO0]
 *    left     --> [13, GPIO2]
 *    right    --> [15, GPIO3]
 * HIGH --> [True]
 * LOW  --> [False]
 */
exports.pin = {
    traction: {
        enable: 1,
        forward: 4,
        backward: 5
    },
    swerve: {
        enable: 0,
        left: 2,
        right: 3
    },
    HIGH: 1,
    LOW: 0
};
