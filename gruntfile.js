var path = require('path');

module.exports = function (grunt) {

    var files = [
        'app/vendor/jquery/dist/jquery.min.js',
        'app/js/app.js', 'app/js/lib/**/*.js',
        'app/js/models/**/*.js',
        'app/js/collections/**/*.js',
        'app/js/views/**/*.js',
        'app/js/**/*.js',
        'app/css/**/*.css'
    ];

    var testFiles = files.slice();
        testFiles.push('test/specs/**/*.js');

    grunt.initConfig({

        stylus: {
            compile: {
                files: {
                    'app/css/endpoint-messaging.css': 'app/css/endpoint-messaging.styl',
                    'app/css/endpoint-presence.css': 'app/css/endpoint-presence.styl',
                    'app/css/creating-a-buddy-list.css': 'app/css/creating-a-buddy-list.styl'
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

            },
            index: {
                template: 'app/index.html',
                files: {
                    'app/index.html': files
                }
            },
            test: {
                template: 'test/index.html',
                files: {
                    'test/index.html': testFiles
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
        },

        uglify: {
            app: {
                files: {
                    'app/dist/app.min.js': files
                }
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('server', ['injector', 'express', 'browserSync', 'watch']);
    grunt.registerTask('test', ['jshint', 'mocha']);
    grunt.registerTask('default', ['jshint', 'injector', 'uglify', 'cssmin']);

};