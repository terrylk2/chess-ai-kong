'use strict';
module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: ['src/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    clean: ['dist'],
    browserify: {
        options: {
            browserifyOptions: {
                standalone: 'chessAiKong'
            }
        },
        dist: {
            src: 'src/index.js',
            dest: 'dist/<%= pkg.name %>.js'
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    mochacov: {
      coverage: {
        options: {
          coveralls: true
        }
      },
      test: {
        options: {
           reporter: 'spec'
        }
      },
      options: {
        files: 'test/**/*.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    }
  });

  grunt.registerTask('default', ['clean', 'jshint', 'test', 'browserify', 'uglify']);
  grunt.registerTask('test', ['mochacov:test']);
  grunt.registerTask('travis', ['default', 'mochacov:coverage']);
};
