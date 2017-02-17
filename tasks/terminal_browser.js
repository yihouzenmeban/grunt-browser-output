'use strict';
var hooker = require('hooker');
var convert = require('ansi-html');
var ws = require('ws');

var colors = {
    reset: ['transparent', 'transparent'],
    black: '181818',
    red: 'E36049',
    green: 'B3CB74',
    yellow: 'FFD080',
    blue: '7CAFC2',
    magenta: '7FACCA',
    cyan: 'C3C2EF',
    lightgrey: 'EBE7E3',
    darkgrey: '6D7891'
};

convert.setColors(colors);

module.exports = function(grunt) {

    grunt.registerTask('terminal_browser', 'Show grunt output to the browser.', function() {
        var options = this.options({
            port: 37901
        });

        var WebSocketServer = ws.Server;

        var wss;

        if (!options.ssl) {
            wss = new WebSocketServer({
                port: options.port
            });
        } else {
            var processRequest = function(req, res) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Not implemented');
            };
            var app = require('https').createServer({
                key: options.key,
                cert: options.cert,
                passphrase: options.passphrase
            }, processRequest).listen(options.port);

            wss = new WebSocketServer({
                server: app
            });
        }


        wss.broadcast = function(data) {
            for (var i in this.clients) {
                this.clients[i].send(JSON.stringify(data));
            }
        };

        hooker.hook(process.stdout, 'write', function() {

            var data = {};

            if (arguments[0] === '\x1b[2K') {
                data = {
                    removeLine: true
                };
            } else if (arguments[0] === '\x1b[1G') {
                return false;
            } else {
                var html = convert(arguments[0]);
                if (html[0] !== '<') {
                    html = '<span>' + html + '</span>';
                }
                html = html.replace(/color:#A50/gm, 'color:#F0E68C');
                data = {
                    line: html,
                    orig: arguments[0],
                    isError: arguments[0].indexOf('Warning:') === 5
                };
            }
            wss.broadcast(data);

        });

    });

};