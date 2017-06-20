/**
 * @author Antonio Alfonso <antonioalfonso@outlook.it>
 */
'use strict';
exports.__esModule = true;
var fs = require('fs'); // Write/Read all files
var os = require('os'); // Operation System utility
var http = require('http').createServer(handler); // WebServer
var io = require('socket.io'); // Communication with WebServer
var arduino = require('firmata'); // Comunication with Arduino
// const spawn   = require('child_process').spawn;         // Interface with Shell
// My utility and configuration
var util = require("./util");
var pin_mapping_1 = require("./pin-mapping");
/*==============================================================================
=================================WEB SERVER=====================================
==============================================================================*/
// Handler for website
function handler(req, res) {
    // If '.' then redirect to the main page
    var reqFilePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    fs.readFile("app/" + reqFilePath, function (error, data) {
        if (error) {
            res.writeHead(500);
            res.end("Error loading '" + reqFilePath + "'");
            console.log(error);
            return;
        }
        res.writeHead(200, { 'Content-Type': util.getMimeType(reqFilePath) });
        res.end(data);
    });
}
;
var address = os.networkInterfaces().wlo1[0].address;
var command = "ssh pi@192.168.1.####' && node main.js " + address;
http.listen(8080, "" + address, function () {
    console.log("Server running at " + address + ":8080");
});
// Variable of state pin
var state = {
    accelerator: 0,
    brake: 0,
    swerve: 'center',
    // Bind a listener to the Change Event
    onChange: function (handler) {
        state.onChange.handlers.push(handler);
    },
    // Trigger the Change Event. Call it when you change the state
    triggerChange: function () {
        var toCheck = [
            'accelerator',
            'brake',
            'swerve'
        ];
        var action;
        toCheck.forEach(function (param) {
            if (state[param] !== state.triggerChange.oldState[param]) {
                console.log(param + " --> " + state[param]);
                state.triggerChange.oldState[param] = state[param]; // Update
                if (param === 'accelerator' || param === 'brake') {
                    action = 'traction';
                }
                else {
                    action = 'swerve';
                }
                state.onChange.handlers.forEach(function (handler) {
                    handler(state, action);
                });
            }
        });
    }
};
state.onChange.handlers = [];
state.triggerChange.oldState = {};
var socketDash = io(http);
var socketRasp = io('8081');
// Handler for Socket
socketDash.on('connection', function (socket) {
    console.log('Connected with Dashboard');
    // Handler function in state.triggerChange
    state.onChange(function (newState, action) {
        var channel = {
            traction: function () {
                socket.emit('traction', {
                    'accelerator': newState.accelerator,
                    'brake': newState.brake
                });
            },
            swerve: function () {
                socket.emit('brake', {
                    'swerve': newState.swerve
                });
            }
        };
        channel[action]();
    });
    socket.on('disconnect', function () {
        console.log('The Dashboard connection has stopped');
    });
});
socketRasp.on('connection', function (socket) {
    console.log('Connecter with Raspberry Pi');
    // Handler function in state.triggerChange
    state.onChange(function (newState, action) {
        var channel = {
            traction: function () {
                socket.emit('traction', {
                    'accelerator': newState.accelerator,
                    'brake': newState.brake
                });
            },
            swerve: function () {
                socket.emit('swerve', {
                    'swerve': newState.swerve
                });
            }
        };
        channel[action]();
    });
    socket.on('disconnect', function () {
        console.log('The Raspberry Pi connection has stopped');
    });
});
/*==============================================================================
===================================ARDUINO======================================
==============================================================================*/
// Handler for Arduino
arduino.requestPort(function (error, port) {
    // If there's an error, interrupt all
    if (error) {
        console.log(error);
        return;
    }
    else {
        console.log('Arduino initializing');
    }
    ;
    // Request serial port name
    var board = new arduino(port.comName, { samplingInterval: 50 });
    board.on('ready', function () {
        console.log('Arduino is ready');
        // Setup pins mode
        board.pinMode(pin_mapping_1.pin.accelerator, board.MODES.INPUT);
        board.pinMode(pin_mapping_1.pin.brake, board.MODES.INPUT);
        board.pinMode(pin_mapping_1.pin.swerve, board.MODES.INPUT);
        board.analogRead(pin_mapping_1.pin.accelerator, function (value) {
            state.accelerator = parseInt(util.map(value, 0, 790, 0, 1023).toString());
            state.triggerChange();
        });
        board.analogRead(pin_mapping_1.pin.brake, function (value) {
            state.brake = parseInt(util.map(value, 0, 790, 0, 1023).toString());
            state.triggerChange();
        });
        board.analogRead(pin_mapping_1.pin.swerve, function (value) {
            if (value <= 341) {
                state.swerve = 'left';
            }
            else if (value > 341 && value < 682) {
                state.swerve = 'center';
            }
            else {
                state.swerve = 'right';
            }
            state.triggerChange();
        });
    });
});
