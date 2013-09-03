var path = require('path');
var _ = require('underscore');
var livereloadPort = 35731;
// in
var sassDir   = 'assets/scss';
var sassIndex = path.join(sassDir, 'index.scss');
var fontsDir  = undefined;//'assets/stylesheets/assets/fonts';
// out
var imagesDir       = 'public/images';
var javascriptsDir  = 'public';
var cssDir          = 'public/styles';
var rendrDir        = 'node_modules/rendr';
var compassCSS      = 'public/styles/index.css';
var mergedCSSPath   = 'public/styles/index.css';
var minCSS = [
  'assets/vendor/bootstrap/bootstrap.min.css', // custom
  'assets/vendor/bootstrap/bootstrap-theme.min.css', // custom
  'assets/vendor/bootstrap-select/bootstrap-select-theme.min.css',
  'assets/bower/textillate/assets/animate.css',
  'assets/bower/autocompletejs/css/autocomplete.css',
  'node_modules/nprogress/nprogress.css',
  compassCSS // must be last
];
//stitch
var aceScripts = [
  'assets/bower/ace-builds/src-min-noconflict/ace.js',
  'assets/bower/ace-builds/src-min-noconflict/theme-textmate.js',
  'assets/vendor/aceWithFuckingSemicolons/*.js',
];
var frontendScripts = [
  'assets/vendor/*.js',
  'assets/bower/jquery/jquery.min.js',
  'assets/bower/bootstrap/dist/bootstrap.min.js',
  'assets/bower/bootstrap-select/bootstrap-select.min.js',
  'assets/bower/textillate/assets/jquery.lettering.js',
  'assets/bower/textillate/jquery.textillate.js',
  'assets/bower/isotope/jquery.isotope.min.js',
  'assets/bower/frontend-track/frontend-track.js',
  'assets/bower/autocompletejs/js/autocomplete.js'
]
.concat(aceScripts);
module.exports = function(grunt) {
  // Project configuration.
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      server: {
        cmd: 'NODE_ENV='+process.env.NODE_ENV+' LIVERELOAD_PORT='+livereloadPort+' node ./node_modules/nodemon/nodemon.js index.js',
        bg: true,
        execOpts: {
          maxBuffer: 1000*1024
        }
      },
      debug: {
        cmd: 'NODE_ENV='+process.env.NODE_ENV+' LIVERELOAD_PORT='+livereloadPort+' node ./node_modules/nodemon/nodemon.js --debug index.js & ./node_modules/nodemon/nodemon.js -d 1 -x node-inspector index.js',
        bg: true,
        execOpts: {
          maxBuffer: 1000*1024
        }
      },
      sdebug: {
        cmd: 'sudo NODE_ENV='+process.env.NODE_ENV+' LIVERELOAD_PORT='+livereloadPort+' node ./node_modules/nodemon/nodemon.js --debug index.js & ./node_modules/nodemon/nodemon.js -d 1 -x node-inspector index.js',
        bg: true,
        execOpts: {
          maxBuffer: 1000*1024
        }
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
      build: {
        files: {
          // mergedCSSPath : minCSS // set below
        }
      }
    },

    concat: {
      dev: {
        files: {
          // mergedCSSPath : minCSS // set below
        }
      }
    },

    copy: {
      dev: {
        src: 'public/mergedAssets.js',
        dest: 'public/mergedAssets.min.js'
      }
    },

    uglify: {
      build: {
        options: {
          preserveComments: false,
          report: true,
          sourceMapPrefix: 1, //instead of public
          sourceMap: 'public/mergedAssets.min.map',
          sourceMappingURL: '/mergedAssets.min.map'
        },
        files: {
          'public/mergedAssets.min.js' : ['public/mergedAssets.js']
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
      scripts: {
        files: ['app/**/*.js', '!node_modules/rendr/node_modules/*', 'node_modules/rendr/**/*.js'],
        tasks: ['rendr_stitch', 'copy:dev'],
        options: {
          interrupt: true
        }
      },
      templates: {
        files: ['app/templates/**/*.hbs'],
        tasks: ['handlebars'],
        options: {
          interrupt: true
        }
      },
      stylesheets: {
        files: _.without([sassDir + '/**/*.{scss,sass}'].concat(minCSS), compassCSS),
        tasks: ['compass:server', 'concat:dev'],
        options: {
          interrupt: true
        }
      },
      livereload: {
        files: [mergedCSSPath, 'public/mergedAssets.min.js', 'public/images/*'],
        tasks: ['noop'],
        options: {
          interrupt: true,
          livereload: 35371
        }
      }
    },

    rendr_stitch: {
      compile: {
        options: {
          dependencies: frontendScripts,
          npmDependencies: {
            underscore: '../rendr/node_modules/underscore/underscore.js',
            'underscore.string': '../underscore.string/lib/underscore.string.js',
            backbone: '../rendr/node_modules/backbone/backbone.js',
            handlebars: '../rendr/node_modules/handlebars/dist/handlebars.runtime.js',
            async: '../rendr/node_modules/async/lib/async.js',
            moment: '../moment/moment.js',
            marked: '../marked/lib/marked.js',
            'node-uuid': '../node-uuid/uuid.js',
            nprogress: '../nprogress/nprogress.js'
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
    },

    jshint: {
      all: ['app/**/*.js']
    }
  };
  gruntConfig.cssmin.build.files[mergedCSSPath] = minCSS; //minifies css for prod
  gruntConfig.concat.dev.files[mergedCSSPath] = minCSS; //concats css for dev
  grunt.initConfig(gruntConfig);

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-rendr-stitch');
  grunt.registerTask('noop', 'noop', function () {});
  // generate app/channelImages.js
  grunt.registerTask('channel-images-hash', 'Create channel images hash to prevent 404s', function () {
    var fs = require('fs');
    var done = this.async();
    var imageDir = path.join(__dirname, 'public/images');
    fs.readdir(imageDir, function (err, files) {
      var imageHash = {};
      var iconDash = /^icon-/
      files
        .filter(function (filename) {
          return iconDash.test(filename);
        })
        .forEach(function (filename) {
          var channelName = filename
            .replace(iconDash, '')
            .replace(/[.](png|gif|jpg)$/, '');
          imageHash[channelName] = true;
        });
      var fileString = 'module.exports='+JSON.stringify(imageHash)+';';
      var filePath = path.join(__dirname,'app/channelImages.js');
      fs.writeFile(filePath, fileString, done);
    });
  });
  // generate configs/commitHash.js
  grunt.registerTask('commit-hash-file', 'Create json that contains github commit hash number', function () {
    var fs = require('fs');
    var done = this.async();
    var exec = require('child_process').exec;
    exec("git log -n 1 | grep commit | sed -e s/^commit\\ // | sed -e s/\\ .*$//", function (err, commitHash) {
      if (err) { done(err); } else {
        var versionFile = 'module.exports="'+commitHash.trim()+'";';
        var filePath = path.join(__dirname, 'configs/commitHash.js');
        fs.writeFile(filePath, versionFile, done);
      }
    });
  });
  // jslint
  grunt.registerTask('jshint', ['jshint:all']);
  // Compile - shared tasks for all
  grunt.registerTask('compile', ['handlebars', 'channel-images-hash', 'commit-hash-file', 'rendr_stitch', 'compass']);
  // Shared tasks for server and debug
  grunt.registerTask('dev', ['compile', 'concat', 'copy']);
  // Run the server and watch for file changes
  grunt.registerTask('server', ['dev', 'bgShell:server', 'watch']);
  // Debug
  grunt.registerTask('debug', ['dev', 'bgShell:debug', 'watch']);
  grunt.registerTask('sdebug', ['dev', 'bgShell:sdebug', 'watch']); // sudo debug for port 80
  // Build for production
  grunt.registerTask('build', ['compile', 'cssmin', 'uglify']);
  // Default task(s).
  grunt.registerTask('default', ['build']);
};
