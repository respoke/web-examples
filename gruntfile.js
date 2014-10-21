'use strict';
var path = require('path'),
    _ = require('underscore');

module.exports = function (grunt) {

    var files = [
        'app/js/app.js',
        'app/js/lib/**/*.js',
        'app/js/models/**/*.js',
        'app/js/collections/**/*.js',
        'app/css/**/*.css'
    ];

    grunt.initConfig({

        stylus: {
            compile: {
                files: {
                    'app/css/endpoint-messaging.css': 'app/css/endpoint-messaging.styl',
                    'app/css/endpoint-presence.css': 'app/css/endpoint-presence.styl',
                    'app/css/creating-a-buddy-list.css': 'app/css/creating-a-buddy-list.styl',
                    'app/css/group-messaging.css': 'app/css/group-messaging.styl',
                    'app/css/video-call.css': 'app/css/video-call.styl',
                    'app/css/main-index.css': 'app/css/main-index.styl'
                }
            }
        },

        autoprefixer: {
            styles: {
                expand: true,
                flatten: true,
                src: 'app/css/*.css',
                dest: 'app/css/'
            }
        },

        jshint: {
            files: ['app/js/**/*.js', 'app/modules/**/*.js'],
            options: {
                force: true,
                jshintrc: './.jshintrc',
                ignores: ['app/js/lib/md5.js']
            }
        },

        mocha: {
            all: {
                options: {
                    log: false,
                    threshhold: 90,
                    timeout: 5000,
                    urls: [
                        'http://localhost:9876/test/index.html',
                        'http://localhost:9876/test/group-messaging/index.html',
                    ]
                }
            }
        },

        watch: {
            options: {
                livereload: process.env.LIVERELOAD || 1338
            },
            scripts: {
                files: [
                    'app/js/**/*.js',
                    'test/**/*.js',
                    'app/modules/**/*.js'
                ],
                tasks: ['jshint', 'test', 'injector', 'jscs']
            },
            templates: {
                files: [
                    'app/templates/**/*.html'
                ]
            },
            css: {
                files: ['app/css/*.styl'],
                tasks: ['stylus', 'autoprefixer']
            }
        },

        express: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 9876,
                    server: path.resolve('./server/server'),
                    debug: false
                }
            }
        },

        injector: {
            options: {
                relative: true,
                addRootSlash: false,
                ignorePath: 'app'
            },
            creatingABuddyList: {
                template: 'app/modules/creating-a-buddy-list/index.html',
                files: {
                    'app/modules/creating-a-buddy-list/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/creating-a-buddy-list/**/*.js');
                        return arr;
                    }())
                }
            },
            endpointMessaging: {
                template: 'app/modules/endpoint-messaging/index.html',
                files: {
                    'app/modules/endpoint-messaging/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/endpoint-messaging/**/*.js');
                        return arr;
                    }())
                }
            },
            endpointPresence: {
                template: 'app/modules/endpoint-presence/index.html',
                files: {
                    'app/modules/endpoint-presence/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/endpoint-presence/**/*.js');
                        return arr;
                    }())
                }
            },
            videoCall: {
                template: 'app/modules/video-call/index.html',
                files: {
                    'app/modules/video-call/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/video-call/**/*.js');
                        return arr;
                    }())
                }
            },
            groupMessaging: {
                template: 'app/modules/group-messaging/index.html',
                files: {
                    'app/modules/group-messaging/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/group-messaging/**/*.js');
                        return arr;
                    }())
                }
            },
            test: {
                template: 'test/index.html',
                files: {
                    'test/index.html': (function () {
                        var arr = _.clone(files);
                        arr.push('app/modules/video-call/**/*.js');
                        arr.push('app/modules/**/*.js');
                        arr.push('test/specs/**/*.js');
                        return arr;
                    }())
                }
            }

        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: 'app/js/**/*.js'
                },
                options: {
                    watchTask: true
                }
            }
        },

        jscs: {
            src: 'app/js/**/*.js',
            options: {
                config: '.jscsrc'
            }
        }

    });

    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('server', ['jshint', 'injector', 'express', 'browserSync', 'watch']);
    grunt.registerTask('test', ['express', 'jshint', 'mocha']);
    grunt.registerTask('default', ['jshint', 'injector']);

};
