var path = require('path');
// in
var sassDir   = 'assets/stylesheets';
var sassIndex = path.join(sassDir, 'index.scss');
var fontsDir  = 'assets/stylesheets/assets/fonts';
// out
var imagesDir       = 'public/images';
var javascriptsDir  = 'public';
var cssDir          = javascriptsDir + '/.css';
var rendrDir        = 'node_modules/rendr';
var rendrModulesDir = rendrDir + '/node_modules';
var compassCSS      = 'public/.css/index.css';
var mergedCSSPath   = 'public/styles/index.css';
//stitch
var aceScripts = [
  'assets/bower/ace-builds/src-min-noconflict/ace.js',
  'assets/bower/ace-builds/src-min-noconflict/theme-textmate.js',
  'assets/vendor/aceWithFuckingSemicolons/*.js'
  // 'assets/bower/ace-builds/src-min-noconflict/mode-stylus.js'
];
var frontendScripts = [
  'assets/vendor/*.js',
  'assets/vendor/jquery-ui/js/*.js',
  'assets/bower/frontend-track/frontend-track.js'
]
.concat(aceScripts);

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
        cmd: 'NODE_PATH=node_modules & node ./node_modules/nodemon/nodemon.js --debug index.js & node-inspector',
        bg: true
      }
    },

    compass: {
      compile: {
        options: {
          sassDir: sassDir,
          specify: [sassIndex],
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
          specify: [sassIndex],
          cssDir: cssDir,
          imagesDir: imagesDir,
          javascriptsDir: javascriptsDir,
          fontsDir: fontsDir
          // relativeAssets: true
          // debugInfo: true
          // outputStyle: 'compact'
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          // mergedCSSPath : compassCSS // set below
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
        src: "app/templates/**/*.hbs",
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
      options: {
        livereload: 35731
      },
      scripts: {
        files: ['app/**/*.js', '!node_modules/rendr/node_modules/*', 'node_modules/rendr/**/*.js'],
        tasks: ['rendr_stitch'],
        options: {
          interrupt: true
        }
      },
      templates: {
        files: ['!app/templates/compiledTemplates.js', 'app/templates/**/*.js'],
        tasks: ['handlebars'],
        options: {
          interrupt: true
        }
      },
      stylesheets: {
        files: sassDir + '/**/*.{scss,sass}',
        tasks: ['clean-merged-css', 'compass:server', 'move-css'],
        options: {
          interrupt: true
        }
      },
      // livereload: {
      //   files: [
      //     'public/mergedAssets.js',
      //     mergedCSSPath,
      //     'public/images/*.*'
      //   ],
      //   options: {
      //     livereload: 35731
      //   },
      //   tasks: []
      // }
    },

    rendr_stitch: {
      compile: {
        options: {
          dependencies: frontendScripts,
          npmDependencies: {
            underscore: '../rendr/node_modules/underscore/underscore.js',
            backbone: '../rendr/node_modules/backbone/backbone.js',
            handlebars: '../rendr/node_modules/handlebars/dist/handlebars.runtime.js',
            async: '../rendr/node_modules/async/lib/async.js'
          },
          aliases: [
            {from: rendrDir + '/client', to: 'rendr/client'},
            {from: rendrDir + '/shared', to: 'rendr/shared'}
            // {from: aceDir,               to:'ace'}
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
  gruntConfig.cssmin.combine.files[mergedCSSPath] = [compassCSS]; //minifies css
  grunt.initConfig(gruntConfig);

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-rendr-stitch');

  grunt.registerTask('clean-merged-css', 'Delete merged css file before merging new styles', function () {
    grunt.log.writeln('Deleting file "' + mergedCSSPath + '"');
    grunt.file['delete'](mergedCSSPath, { force:true });
  });

  grunt.registerTask('move-css', 'Copy compass index.css to styles dir in public', function () {
    grunt.log.writeln('Copying file "' + compassCSS + '" to "' + mergedCSSPath + '"');
    grunt.file.copy(compassCSS, mergedCSSPath);
  });

  // Compile - shared tasks for all
  grunt.registerTask('compile', ['handlebars', 'rendr_stitch', 'clean-merged-css', 'compass']);

  // Shared tasks for server and debug
  grunt.registerTask('dev-mode', ['compile', 'move-css', 'watch']);
  // Run the server and watch for file changes
  grunt.registerTask('server', ['bgShell:runNode', 'dev-mode']);
  // Debug
  grunt.registerTask('debug', ['bgShell:debugNode', 'dev-mode']);
  // Build for production
  grunt.registerTask('build', ['compile', 'cssmin']);
  // Default task(s).
  grunt.registerTask('default', ['build']);
};
