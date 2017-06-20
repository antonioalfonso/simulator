/**
 * @author Antonio Alfonso <antonioalfonso@outlook.it>
 */

 'use strict'

const fs      = require('fs');                          // Write/Read all files
const os      = require('os');                          // Operation System utility
const http    = require('http').createServer(handler);  // WebServer
const io      = require('socket.io');                   // Communication with WebServer
const arduino = require('firmata');                     // Comunication with Arduino
// const spawn   = require('child_process').spawn;         // Interface with Shell

// My utility and configuration
import * as util      from './util';

import { configRasp } from './config-raspberry';
import { pin }        from './pin-mapping';

// My interface
import { State, StateChangeHandler } from './interface';

/*==============================================================================
=================================WEB SERVER=====================================
==============================================================================*/

// Handler for website
function handler(req, res): void {
  // If '.' then redirect to the main page
  let reqFilePath = '.' + (req.url === '/'? '/index.html': req.url);

  fs.readFile(`app/${reqFilePath}`, (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end(`Error loading '${reqFilePath}'`);
      console.log(error);
      return;
    }

    res.writeHead(200, {'Content-Type' : util.getMimeType(reqFilePath)});
    res.end(data);
  });
};

const address: string = os.networkInterfaces().wlo1[0].address;
const command: string = `ssh pi@192.168.1.####' && node main.js ${address}`;

http.listen(8080, `${address}`, () => {
  console.log(`Server running at ${address}:8080`);
});

// Variable of state pin
let state: State = {
  accelerator  : 0,
  brake        : 0,
  swerve       : 'center',
  // Bind a listener to the Change Event
  onChange     : (handler: StateChangeHandler) => {
    state.onChange.handlers.push(handler);
  },
  // Trigger the Change Event. Call it when you change the state
  triggerChange: () => {
    let toCheck = [
      'accelerator',
      'brake',
      'swerve'
    ];

    let action: string;

    toCheck.forEach((param) => {
      if (state[param] !== state.triggerChange.oldState[param]) {
        console.log(`${param} --> ${state[param]}`);
        state.triggerChange.oldState[param] = state[param];  // Update


        if (param === 'accelerator' || param === 'brake') {
          action = 'traction';
        } else {
          action = 'swerve';
        }

        state.onChange.handlers.forEach((handler) => {
          handler(state, action);
        });
      }
    });
  }
};
state.onChange.handlers      = [];
state.triggerChange.oldState = {};


const socketDash = io(http);
const socketRasp = io('8081');

// Handler for Socket
socketDash.on('connection', (socket) => {
  console.log('Connected with Dashboard');

  // Handler function in state.triggerChange
  state.onChange((newState: State, action: string) => {

    let channel = {
      traction : () => {
        socket.emit('traction', {
          'accelerator' : newState.accelerator,
          'brake'       : newState.brake
        });
      },
      swerve      : () => {
        socket.emit('brake', {
          'swerve'      : newState.swerve
        });
      }
    };

    channel[action]();
  });

  socket.on('disconnect', () => {
    console.log('The Dashboard connection has stopped');
  });
});

socketRasp.on('connection', (socket) => {
  console.log('Connecter with Raspberry Pi');

  // Handler function in state.triggerChange
  state.onChange((newState: State, action: string) => {

    let channel = {
      traction : () => {
        socket.emit('traction', {
          'accelerator' : newState.accelerator,
          'brake'       : newState.brake
        });
      },
      swerve      : () => {
        socket.emit('swerve', {
          'swerve'      : newState.swerve
        });
      }
    };

    channel[action]();
  });


  socket.on('disconnect', () => {
    console.log('The Raspberry Pi connection has stopped');
  });
});

/*==============================================================================
===================================ARDUINO======================================
==============================================================================*/

// Handler for Arduino
arduino.requestPort((error, port) => {
  // If there's an error, interrupt all
  if (error) {
    console.log(error);
    return;
  } else {
    console.log('Arduino initializing');
  };

  // Request serial port name
  let board = new arduino(port.comName, {samplingInterval : 50});

  board.on('ready', () => {
    console.log('Arduino is ready');

    // Setup pins mode
    board.pinMode(pin.accelerator, board.MODES.INPUT);
    board.pinMode(pin.brake,       board.MODES.INPUT);
    board.pinMode(pin.swerve,      board.MODES.INPUT);


    board.analogRead(pin.accelerator, (value) => {
      state.accelerator = parseInt(util.map(value, 0, 790, 0, 1023));
      state.triggerChange();
    });

    board.analogRead(pin.brake, (value) => {
      state.brake = parseInt(util.map(value, 0, 790, 0, 1023));
      state.triggerChange();
    });

    board.analogRead(pin.swerve, (value) => {

      if (value <= 341) {
        state.swerve = 'left';
      } else if (value > 341 && value < 682) {
        state.swerve = 'center';
      } else {
        state.swerve = 'right';
      }

      state.triggerChange();
    });
  });
});
