/*
 * grunt-terminal-browser
 *
 *
 * Copyright (c) 2017 yihouzenmeban
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'client.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                reporterOutput: ""
            }
        },

        terminal_browser: {
            options: {             //all options are optional
                port: 37901     //default is 37901, must set
            }
        }

    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['terminal_browser']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
