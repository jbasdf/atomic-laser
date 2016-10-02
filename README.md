# Laser Experiments using Etherdream
-----------------------
This project contains a number of experiments that control a laser using the Etherdream

Uses code from https://github.com/possan/node-etherdream


# Getting Started:
-----------------------

You'll need an [EtherDream](http://ether-dream.com/) and a laser.

Assuming you have git and npm installed:

1. git clone https://github.com/jbasdf/atomic-laser.git my_project_name
2. npm install


# Control the laser using Javascript
-----------------------
The server folder contains a number of experiments to control the laser. Run these with the following commands?

  `node atomicjolt.js`

  `node atomicjolt2.js`

  `node clock.js`

  `node invader.js`

# Controlling the laser from a Javascript client
-----------------------

1. Start server with:

  `npm run laser`

2. Visit:

  http://localhost:8090


# Development:
-----------------------
Source code lives in the client directory. Modify html and js files in that directory to build your application.

An etherdream is required to run.

Based on this bit of awesome code:
https://github.com/possan/node-etherdream

Links:
  https://github.com/possan/ilda.js

  Games for future experiments:
    https://github.com/ohall/react-pong
    https://github.com/chriz001/Reacteroids


License and attribution
-----------------------
MIT