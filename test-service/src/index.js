var express = require('express');
var endpoints = require('./setup/endpoints');
var middlewares = require('./setup/middlewares');
var start = require('./setup/start');
var server = express();
middlewares(server);
endpoints(server);
start(server);
