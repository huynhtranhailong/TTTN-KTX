module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            javascript: {
                files: ['src/layout/js/*.js', 'src/module/**/js/*.js'],
                tasks: ['uglify'],
                options: {
                    debounceDelay: 250
                }
            },
            jsLibrary: {
                files: ['src/layout/js/lib/*.js'],
                tasks: ['copy:jsLibrary'],
                options: {
                    debounceDelay: 250
                }
            },

            sass: {
                files: ['src/layout/sass/*.sass', 'src/module/**/sass/*.sass'],
                tasks: ['sass'],
                options: {
                    debounceDelay: 250
                }
            }
        },

        jshint: {
            files: ['src/layout/js/*.js', 'src/module/**/js/*.js'],
            options: {
                globals: {
                    jQuery: true
                },
                ignores: [ 'Gruntfile.js' ]
            }
        },

        uglify: {
            layout: {
                options: {
                    sourceMap: false,
                    report: 'gzip',
                    compress: {
                        dead_code: true,
                        unused: true
                    }
                },
                files: grunt.file.expandMapping(['src/layout/js/*.js'], 'src/layout/js/bin/', {
                    rename: function(destBase, destPath) {
                        return destPath.replace('src/layout/js/', 'src/layout/js/bin/').replace('.js', '.min.js');
                    }
                })
            },
            module: {
                options: {
                    sourceMap: false,
                    report: 'gzip',
                    compress: {
                        dead_code: true,
                        unused: true
                    }
                },
                files: grunt.file.expandMapping(['src/module/**/js/*.js'], 'src/module/**/js/bin/', {
                    rename: function(destBase, destPath) {
                        return destPath.replace('/js/', '/js/bin/').replace('.js', '.min.js');
                    }
                })
            }
        },

        sass: {
            layout: {
                options: {
                    noCache: true,
                    style: 'compressed'
                },
                files: {
                    'src/layout/sass/bin/home.min.css': 'src/layout/sass/home.sass',
                    'src/layout/sass/bin/dashboard.min.css': 'src/layout/sass/dashboard.sass'
                }
            },
            module: {
                options: {
                    noCache: true,
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: grunt.file.expandMapping(['src/module/**/sass/main.sass'], 'src/module/**/sass/bin/', {
                    rename: function (destBase, destPath) {
                        return destPath.replace('/sass/', '/sass/bin/').replace('.sass', '.min.css');
                    }
                })
            }
        },

        copy: {
            jsLibrary: {
                scr: 'src/layout/js/lib',
                dest: 'public/js/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerMultiTask('copy', 'Copy files.', function() {
        var scr = this.data.scr, dest = this.data.dest;
        grunt.file.recurse(scr, function(abspath, rootdir, subdir, filename) {
            grunt.file.copy(abspath, dest+filename);
        });
    });

    grunt.registerTask('default', ['watch', 'jshint', 'uglify', 'copy', 'sass']);
};