#!/usr/bin/env node
'use strict';

const request = require('request');
const options = {
  url: 'https://icanhazdadjoke.com/',
  headers: {
    'Accept': 'text/plain'
  }
};

function callback(error, response, body) {
  let message;

  if (error) {
    message = error;
  } else if (response && response.statusCode !== 200) {
    message = `Error ${response.statusCode} connecting.`;
  } else {
    message = body;
  }

  console.log("\n" + message + "\n");
}

request(options, callback);