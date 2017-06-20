"use strict";
exports.__esModule = true;
var gpio = require('wiring-pi');
/** importing pin mapping object */
var pin_mapping_1 = require("./pin-mapping");
/** This class represents all possible actions that the car can perform */
var Task = (function () {
    /** When the class is initialized, the setup phase takes place */
    function Task() {
        gpio.pinMode(pin_mapping_1.pin.traction.forward, gpio.OUTPUT);
        gpio.pinMode(pin_mapping_1.pin.traction.backward, gpio.OUTPUT);
        gpio.pinMode(pin_mapping_1.pin.traction.enable, gpio.PWM_OUTPUT);
        gpio.pinMode(pin_mapping_1.pin.swerve.enable, gpio.OUTPUT);
        gpio.pinMode(pin_mapping_1.pin.swerve.left, gpio.OUTPUT);
        gpio.pinMode(pin_mapping_1.pin.swerve.right, gpio.OUTPUT);
    }
    /**
     * With this method the car stops
     */
    Task.prototype.stop = function () {
        gpio.pwmWrite(pin_mapping_1.pin.traction.enable, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.traction.forward, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.traction.backward, pin_mapping_1.pin.LOW);
        console.log('STOP');
    };
    /**
     * With this method the car goes forward
     * @param {number} pwmValue Pedal signal
     */
    Task.prototype.forward = function (pwmValue) {
        gpio.pwmWrite(pin_mapping_1.pin.traction.enable, pwmValue);
        gpio.digitalWrite(pin_mapping_1.pin.traction.forward, pin_mapping_1.pin.HIGH);
        gpio.digitalWrite(pin_mapping_1.pin.traction.backward, pin_mapping_1.pin.LOW);
        console.log('FORWARD');
    };
    /**
     * With this method the car goes backward
     * @param {number} pwmValue Pedal signal
     */
    Task.prototype.backward = function (pwmValue) {
        gpio.pwmWrite(pin_mapping_1.pin.traction.enable, pwmValue);
        gpio.digitalWrite(pin_mapping_1.pin.traction.forward, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.traction.backward, pin_mapping_1.pin.HIGH);
        console.log('BACKWARD');
    };
    /**  With this method the car goes straight */
    Task.prototype.center = function () {
        gpio.digitalWrite(pin_mapping_1.pin.swerve.enable, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.left, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.right, pin_mapping_1.pin.LOW);
        console.log('CENTER');
    };
    /** With this method the car goes left */
    Task.prototype.left = function () {
        gpio.digitalWrite(pin_mapping_1.pin.swerve.enable, pin_mapping_1.pin.HIGH);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.left, pin_mapping_1.pin.HIGH);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.right, pin_mapping_1.pin.LOW);
        console.log('LEFT');
    };
    /** With this method the car goes right */
    Task.prototype.right = function () {
        gpio.digitalWrite(pin_mapping_1.pin.swerve.enable, pin_mapping_1.pin.HIGH);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.left, pin_mapping_1.pin.LOW);
        gpio.digitalWrite(pin_mapping_1.pin.swerve.right, pin_mapping_1.pin.HIGH);
        console.log('RIGHT');
    };
    return Task;
}());
exports.Task = Task;
