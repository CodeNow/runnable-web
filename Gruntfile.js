var path = require('path');
var _ = require('underscore');
var livereloadPort = 35731;
// in
var sassDir   = 'assets/scss';
var sassIndex = path.join(sassDir, 'index.scss');
var fontsDir  = undefined;//'assets/stylesheets/assets/fonts';
// out
var layoutPath = 'app/templates/__layout_editable.hbs';
var verLayoutPath = 'app/templates/__layout.hbs';
var imagesDir       = 'public/images';
var javascriptsDir  = 'public';
var cssDir          = 'public/styles';
var mergedAssetsPath= "public/mergedAssets.js";
var minAssetsPath   = "public/mergedAssets.min.js";
var rendrDir        = 'node_modules/rendr';
var compassCSS      = 'public/styles/index.css';
var mergedCSSPath   = 'public/styles/index.css';
var minCSS = [
  'assets/vendor/bootstrap/bootstrap.min.css', // custom
  'assets/vendor/bootstrap/bootstrap-theme.min.css', // custom
  'assets/bower/bootstrap-select/bootstrap-select.min.css',
  'assets/vendor/typeahead.js-bootstrap.css',
  'assets/bower/textillate/assets/animate.css',
  'assets/bower/autocompletejs/css/autocomplete.css',
  'node_modules/nprogress/nprogress.css',
  'assets/bower/alertify.js/themes/alertify.core.css',
  'assets/bower/alertify.js/themes/alertify.default.css',
  compassCSS // must be last
];
//stitch
var aceScripts = [
  'assets/bower/ace-builds/src-min-noconflict/ace.js',
  'assets/vendor/aceWithFuckingSemicolons/*.js',
];
var frontendScripts = [
  'assets/bower/jquery/jquery.js',
  'assets/vendor/jquery-ui-custom/js/jquery-ui-1.10.3.custom.min.js',
  'assets/vendor/*.js', //include jquery plugins, must be after jquery
  'assets/bower/sockjs/sockjs.js',
  'assets/bower/es5-shim/es5-shim.js',
  'assets/bower/es5-shim/es5-sham.js',
  'assets/bower/alertify.js/lib/alertify.js',
  'assets/bower/bootstrap/js/collapse.js',
  'assets/bower/bootstrap/js/dropdown.js',
  'assets/bower/bootstrap/js/tab.js',
  'assets/bower/bootstrap/js/tooltip.js',
  'assets/bower/bootstrap/js/modal.js',
  'assets/bower/bootstrap/js/transition.js',
  'assets/bower/typeahead.js/dist/typeahead.min.js',
  'assets/bower/bootstrap-select/bootstrap-select.min.js',
  'assets/bower/textillate/assets/jquery.lettering.js',
  'assets/bower/textillate/jquery.textillate.js',
  'assets/bower/isotope/jquery.isotope.min.js',
  'assets/bower/jquery.stellar/jquery.stellar.min.js',
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
          sourcemap: true,
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
      },
      layout: {
        src: layoutPath,
        dest: verLayoutPath
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
        files: ['app/**/*.js', 'app/templates/compiledTemplates.js', '!node_modules/rendr/node_modules/*', 'node_modules/rendr/**/*.js'],
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
    var providerIconsDir = path.join(__dirname, 'public/images/provider-icons/');
    fs.readdir(providerIconsDir, function (err, files) {
      var imageHash = {};
      var iconDash = /^icon-/
      files.forEach(function (filename) {
        if (iconDash.test(filename)) {
          var channelName = filename
            .replace(iconDash, '')
            .replace(/[.](png|gif|jpg)$/, '');
          imageHash[channelName] = true;
        }
      });
      var fileString = 'module.exports='+JSON.stringify(imageHash)+';';
      var filePath = path.join(__dirname,'app/channelImages.js');
      grunt.file.write(filePath, fileString);
      done();
    });
  });
  // generate configs/commitHash.js
  var commitHashPath = 'configs/commitHash.js';
  grunt.registerTask('commit-hash-file', 'Create json that contains github commit hash number', function () {
    var donecount = 0;
    var fs = require('fs');
    var done = this.async();
    var exec = require('child_process').exec;
    exec("git log -n 1 | grep commit | sed -e s/^commit\\ // | sed -e s/\\ .*$//", function (err, commitHash) {
      if (err) { done(err); } else {
        var versionFile = 'module.exports="'+commitHash.trim()+'";';
        var filePath = path.join(__dirname, commitHashPath);
        grunt.file.write(filePath, versionFile);
        done();
      }
    });
  });
  // versioned assets - must be run after commitHash
  grunt.registerTask('version', 'Versions assets and creates __layout_versioned that points to them', function () {
    var fs = require('fs');
    var p = require('path');
    var commitHash = require('./'+commitHashPath);
    function matches (re) { return function (str) { return re.test(str); } }
    function toPath (path) { return function (filename) { return p.join(path, filename); }; }
    function deletePath (filepath) {
      grunt.file.delete(filepath)
      grunt.log.writeln('deleted', p.relative(__dirname, filepath));
    }
    // delete old versioned files
    var publicDir = p.join(__dirname, 'public');
    var stylesDir = p.join(__dirname, 'public/styles');
    fs.readdirSync(publicDir)
      .filter(matches(/^mergedAssets\.min\..*\.js$/))
      .map(toPath(publicDir))
      .forEach(deletePath);
    fs.readdirSync(stylesDir)
      .filter(matches(/^index\..*\.css/))
      .map(toPath(stylesDir))
      .forEach(deletePath);
    // create  versioned files
    var stylesPath, assetsPath, verStylesPath, verAssetsPath;
    stylesPath = p.join(__dirname, mergedCSSPath);
    assetsPath = p.join(__dirname, minAssetsPath);
    verStylesPath = stylesPath.replace(/[.]css$/, '.'+commitHash+'.css');
    verAssetsPath = assetsPath.replace(/[.]js$/, '.'+commitHash+'.js');
    grunt.file.copy(stylesPath, verStylesPath);
    grunt.file.delete(stylesPath);
    grunt.log.writeln('moved', p.relative(__dirname, stylesPath)+' > '+p.relative(__dirname, verStylesPath))
    grunt.file.copy(assetsPath, verAssetsPath);
    grunt.file.delete(assetsPath);
    grunt.log.writeln('moved', p.relative(__dirname, stylesPath)+' > '+p.relative(__dirname, verStylesPath))
    // create versioned layout
    var layoutString = fs.readFileSync(p.join(__dirname, layoutPath)).toString()
      .replace(/mergedAssets[.]min[.]js/g, 'mergedAssets.min.'+commitHash+'.js')
      .replace(/index[.]css/g, 'index.'+commitHash+'.css');
    grunt.file.write(p.join(__dirname, verLayoutPath), layoutString);
    grunt.log.writeln('overwrote', verLayoutPath)
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
  grunt.registerTask('build', ['compile', 'cssmin', 'uglify', 'version']);
  // Default task(s).
  grunt.registerTask('default', ['build']);
};
