#!/usr/bin/env node

const http = require('http');
const querystring = require('querystring');

if (process.argv.length !== 5) {
  throw new Error('Wrong parameters. They should look like: \'place 0 0 NORTH\'');
}

function validateCoordinate(value) {
  return ['0', '1', '2', '3', '4'].includes(value);
}

function validateFacing(value) {
  return ['NORTH', 'EAST', 'SOUTH', 'WEST'].includes(value);
}

const [, , x, y, facing] = process.argv;

if (!validateCoordinate(x) || !validateCoordinate(y) || !validateFacing(facing)) {
  throw new RangeError('The x and the y coordinates should be between 0..4, the facing parameter should be either of NORTH|EAST|SOUTH|WEST')
}

const postData = querystring.stringify({
  x,
  y,
  facing
});

const errMsg = 'An error occurred placing me on to the table';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/place',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const request = http.request(options, response => {
  if (response.statusCode !== 200) {
    console.error(errMsg);
  }
});

request.on('error', ({message}) => {
  console.error(`${errMsg}: ${message}`);
});

request.write(postData);
request.end();