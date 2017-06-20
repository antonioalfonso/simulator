# Dashboard
Pseudo-Simulatore di guida by UninaCorse E-Team

###### Su Raspberry
  * ```git clone https://antonioalfonso@gitlab.com/uninacorseeteam/simulator.git```
  * Installare [NodeJS](https://nodejs.org/it/download/)

  * Da terminale
    * ```cd client```
    * ```npm install```
    * ```cd build && node main.js```


###### Su PC
  * ```git clone https://antonioalfonso@gitlab.com/uninacorseeteam/simulator.git```
  * Installare [NodeJS](https://nodejs.org/it/download/)
  * Aprire il terminale ed entrare nella directory di questo repository
  * Da terminale
    * ```cd server```
    * ```npm install```
  * Collegare Arduino
  * Typing from the terminal:
    * ```sudo npm install firmata -g```
    * ```firmata-party <BOARD> --debug```
    * ```cd build && node main.js```
