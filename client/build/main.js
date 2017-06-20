/**
 * @author Antonio Alfonso <antonioalfonso@outlook.it>
 */
'use strict';
exports.__esModule = true;
var io = require('socket.io-client'); // Client for server Socket.IO
var os = require('os'); // Operation System utility
var gpio = require('wiring-pi'); // Interface GPIO
// gpio mapping mode wpi
gpio.setup('wpi');
// My utility
var task_class_1 = require("./task-class");
// My class
var task = new task_class_1.Task();
/*==============================================================================
==========================COMMUNICATION WITH SERVER=============================
==============================================================================*/
// Get IP address
var addressHost = process.argv[2] || '192.168.1.103';
// Connection at WebServer
var socket = io.connect("http://" + addressHost + ":8081");
// If socket !== undefined, print connection initializing
if (socket) {
    console.log('Connection initializing');
}
socket.on('connect', function () {
    console.log('Established connection');
    socket.on('disconnect', function () {
        console.log('The host connection has stopped');
    });
});
// Listening the WebServer
socket.on('traction', function (data) {
    var accelerator = data.accelerator, brake = data.brake;
    var pwmValue = (accelerator - brake);
    if (pwmValue < -20 && accelerator < 20) {
        task.backward(pwmValue);
    }
    else if (pwmValue >= 20) {
        task.forward(pwmValue);
    }
    else {
        task.stop();
    }
});
socket.on('swerve', function (data) {
    var swerve = data.swerve;
    task[swerve]();
});
