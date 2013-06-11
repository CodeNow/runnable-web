var path = require('path');
// in
var sassDir = 'assets/stylesheets';
var fontsDir = 'assets/stylesheets/assets/fonts';
// out
var imagesDir = 'public/images';
var javascriptsDir = 'public';
var cssDir = javascriptsDir;
var rendrDir = 'node_modules/rendr';
var rendrModulesDir = rendrDir + '/node_modules';
var mergedCSSPath = 'public/styles.css';

module.exports = function(grunt) {
  // Project configuration.
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      runNode: {
        cmd: 'NODE_PATH=node_modules & node ./node_modules/nodemon/nodemon.js index.js',
        bg: true
      },
      debugNode: {
        cmd: 'NODE_PATH=node_modules & node --debug ./node_modules/nodemon/nodemon.js index.js & node-inspector',
        bg: true
      }
    },

    compass: {
      compile: {
        options: {
          sassDir: sassDir,
          cssDir: cssDir,
          imagesDir: imagesDir,
          javascriptsDir: javascriptsDir,
          fontsDir: fontsDir,
          outputStyle: 'compress'
        }
      },
      server: {
        options: {
          sassDir: sassDir,
          cssDir: cssDir,
          imagesDir: imagesDir,
          javascriptsDir: javascriptsDir,
          fontsDir: fontsDir,
          relativeAssets: true,
          debugInfo: true
          // outputStyle: 'compact'
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          // mergedCSSPath : ['public/**/*.css'] //set below.
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: false,
          commonjs: true,
          processName: function(filename) {
            return filename.replace('app/templates/', '').replace('.hbs', '');
          }
        },
        src: "app/templates/*.hbs",
        dest: "app/templates/compiledTemplates.js",
        filter: function(filepath) {
          var filename = path.basename(filepath);
          // Exclude files that begin with '__' from being sent to the client,
          // i.e. __layout.hbs.
          return filename.slice(0, 2) !== '__';
        }
      }
    },

    watch: {
      scripts: {
        files: 'app/**/*.js',
        tasks: ['rendr_stitch'],
        options: {
          interrupt: true
        }
      },
      templates: {
        files: 'app/**/*.hbs',
        tasks: ['handlebars'],
        options: {
          interrupt: true
        }
      },
      stylesheets: {
        files: sassDir + '/**/*.{scss,sass}',
        tasks: ['compass:server', 'cssmin'],
        options: {
          interrupt: true
        }
      }
    },

    rendr_stitch: {
      compile: {
        options: {
          dependencies: [
            'assets/vendor/**/*.js'
          ],
          npmDependencies: {
            underscore: '../rendr/node_modules/underscore/underscore.js',
            backbone: '../rendr/node_modules/backbone/backbone.js',
            handlebars: '../rendr/node_modules/handlebars/dist/handlebars.runtime.js',
            async: '../rendr/node_modules/async/lib/async.js'
          },
          aliases: [
            {from: rendrDir + '/client', to: 'rendr/client'},
            {from: rendrDir + '/shared', to: 'rendr/shared'}
          ]
        },
        files: [{
          dest: 'public/mergedAssets.js',
          src: [
            'app/**/*.js',
            rendrDir + '/client/**/*.js',
            rendrDir + '/shared/**/*.js'
          ]
        }]
      }
    }
  };
  gruntConfig.cssmin.combine.files[mergedCSSPath] = ['public/**/*.css'];
  grunt.initConfig(gruntConfig);

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-rendr-stitch');

  grunt.registerTask('clean-merged-css', 'Delete merged css file before merging new styles', function () {
    grunt.log.writeln('Deleting file "' + mergedCSSPath);
    grunt.file['delete'](mergedCSSPath, { force:true });
  });

  grunt.registerTask('compile', ['handlebars', 'rendr_stitch', 'compass', 'clean-merged-css', 'cssmin']);

  // Run the server and watch for file changes
  grunt.registerTask('server', ['bgShell:runNode', 'compile', 'watch']);
  // Debug
  grunt.registerTask('debug', ['bgShell:debugNode', 'compile', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);
};
