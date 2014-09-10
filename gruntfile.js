var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({

        jshint: {
            files: ['app/js/**/*.js'],
            options: {
                force: true,
                jshintrc: './.jshintrc',
                ignores: []
            }
        },

        mocha: {
            all: {
                options: {
                    threshhold: 90,
                    timeout: 5000,
                    urls: [
                        'http://localhost:9876/test/index.html'
                    ]
                }
            }
        },

        watch: {
            options: {
                livereload: 1338
            },
            scripts: {
                files: [
                    'app/js/**/*.js',
                    'test/**/*.js'
                ],
                tasks: ['test', 'injector', 'jscs']
            },
            templates: {
                files: [
                    'app/templates/**/*.html'
                ]
            },
            css: {
              files: ['app/scss/**/*.scss', 'app/scss/**/**/*.scss'],
              tasks: ['compass', 'injector']
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

            },
            index: {
                template: 'app/index.html',
                files: {
                    'app/index.html': ['app/vendor/jquery/dist/jquery.min.js', 'app/js/app.js', 'app/js/lib/**/*.js', 'app/js/models/**/*.js', 'app/js/**/*.js', 'app/css/**/*.css']
                }
            },
            test: {
                template: 'test/index.html',
                files: {
                    'test/index.html': ['app/vendor/jquery/dist/jquery.min.js', 'app/js/app.js', 'app/js/lib/**/*.js', 'app/js/models/**/*.js', 'app/js/**/*.js', 'test/specs/**/*.js']
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

    grunt.registerTask('server', ['injector', 'express', 'browserSync', 'watch']);
    grunt.registerTask('test', ['jshint', 'mocha']);
    grunt.registerTask('default', ['jshint', 'injector']);

};