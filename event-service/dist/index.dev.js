"use strict";

var express = require('express');

var endpoints = require('./setup/endpoints');

var middlewares = require('./setup/middlewares');

var start = require('./setup/start');

process.on('warning', function (e) {
  return console.warn(e.stack);
});
var server = express();
middlewares(server);
endpoints(server);
start(server);