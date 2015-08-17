Runnable Web Application
========================

First, the runnable-web project requires that a redis server be running locally, to do so follow these steps:

1. Open a separate terminal
2. In the new terminal run: `redis-server`

Then, to get started working on runnable-web, run the following commands:

1. `sudo npm install grunt-cli bower -g`
2. `bower install`
3. `grunt`
4. `grunt server`

To allow you to use your own terminal change “this.options.termurl” in terminal.js in runnable-web.

`export NODE_ENV=development `
