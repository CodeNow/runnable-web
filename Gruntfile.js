var path = require('path');
var _ = require('underscore');
var livereloadPort = 35731;
// in
var sassDir   = 'assets/scss';
var sassIndex = path.join(sassDir, 'index.scss');
var fontsDir;//'assets/stylesheets/assets/fonts';
// out
var layoutPath       = 'app/templates/__layout_editable.hbs';
var verLayoutPath    = 'app/templates/__layout.hbs';
var imagesDir        = 'public/images';
var javascriptsDir   = 'public';
var cssDir           = 'public/styles';
var mergedAssetsPath = "public/mergedAssets.js";
var minAssetsPath    = "public/mergedAssets.min.js";
var rendrDir         = 'node_modules/rendr';
var compiledCSS      = 'public/styles/index.css';
var mergedCSSPath    = 'public/styles/index.css';
var minCSS           = [
  'public/vendor/bootstrap/bootstrap.min.css', // custom
  'public/vendor/bootstrap/bootstrap-theme.min.css', // custom
  'public/vendor/typeahead.js-bootstrap.css',
  'public/vendor/bower/autocompletejs/css/autocomplete.css',
  'node_modules/nprogress/nprogress.css',
  'public/vendor/glyphicons.css',
  compiledCSS // must be last
];
//stitch
var aceScripts = [
  'public/vendor/bower/ace-builds/src-min-noconflict/ace.js',
  'public/vendor/ace-bundle/*.js'
];
var frontendScripts = [
  'public/vendor/bower/jquery/jquery.js',
  'public/vendor/jquery-ui-custom/js/jquery-ui-1.10.3.custom.min.js',
  'public/vendor/modernizr/modernizr.custom.64268.js',
  'public/vendor/*.js', //include jquery plugins, must be after jquery
  'public/vendor/bower/sockjs/sockjs.js',
  'public/vendor/bower/bootstrap/js/collapse.js',
  'public/vendor/bower/bootstrap/js/dropdown.js',
  'public/vendor/bower/bootstrap/js/tab.js',
  'public/vendor/bower/bootstrap/js/tooltip.js',
  'public/vendor/bower/bootstrap/js/popover.js',
  'public/vendor/bower/bootstrap/js/modal.js',
  'public/vendor/bower/bootstrap/js/transition.js',
  'public/vendor/bower/typeahead.js/dist/typeahead.min.js',
  'public/vendor/bower/jquery.stellar/jquery.stellar.min.js',
  'public/vendor/bower/frontend-track/frontend-track.js',
  'public/vendor/bower/autocompletejs/js/autocomplete.js',
  'public/vendor/bootstrap/bootstrap-dialog.js', // https://github.com/nakupanda/bootstrap3-dialog
  'public/vendor/bower/fastclick/lib/fastclick.js'
]
.concat(aceScripts);


module.exports = function(grunt) {
  // Project configuration.
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 2 versions']
        },
        files: {
          'public/styles/index.css' : 'public/styles/index.css'
        }
      }
    },

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

    sass: {
      dist: {
        options: {
          lineNumbers: true,
          style: 'expanded'
        },
        files: {
          'public/styles/index.css' : sassIndex
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
          sourceMappingURL: '/mergedAssets.min.map',
          semicolons: false
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
        files: _.without([sassDir + '/**/*.{scss,sass}'].concat(minCSS), compiledCSS),
        tasks: ['sass', 'concat:dev', 'autoprefixer'],
        options: {
          // livereload: true,
          interrupt: true
        }
      // },
      // livereload: {
      //   files: [mergedCSSPath, 'public/mergedAssets.min.js', 'public/images/*'],
      //   tasks: ['noop'],
      //   options: {
      //     interrupt: true,
      //     livereload: 35371
      //   }
      }
    },

    rendr_stitch: {
      compile: {
        options: {
          dependencies: frontendScripts,
          npmDependencies: {
            underscore: '../underscore/underscore.js',
            'underscore.string': '../underscore.string/lib/underscore.string.js',
            backbone: '../rendr/node_modules/backbone/backbone.js',
            handlebars: '../rendr/node_modules/handlebars/dist/handlebars.runtime.js',
            async: '../async/lib/async.js',
            moment: '../moment/moment.js',
            marked: '../marked/lib/marked.js',
            'node-uuid': '../node-uuid/uuid.js',
            nprogress: '../nprogress/nprogress.js',
            diff: '../diff/diff.js',
            'query-string': '../query-string/query-string.js',
            keypather: '../keypather/index.js'
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

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-rendr-stitch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.registerTask('noop', 'noop', function () {});
  // copy ace files top public
  grunt.registerTask('copy-ace-files', 'Copy ace editor files to public');
  // generate app/channelImages.js
  grunt.registerTask('channel-images-hash', 'Create channel images hash to prevent 404s', function () {
    var fs = require('fs');
    var done = this.async();
    var providerIconsDir = path.join(__dirname, 'public/images/provider-icons/');
    fs.readdir(providerIconsDir, function (err, files) {
      var imageHash = {};
      var iconDash = /^icon-/;
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
    function matches (re) { return function (str) { return re.test(str); }; }
    function toPath (path) { return function (filename) { return p.join(path, filename); }; }
    function deletePath (filepath) {
      grunt.file.delete(filepath);
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
    grunt.log.writeln('moved', p.relative(__dirname, stylesPath)+' > '+p.relative(__dirname, verStylesPath));
    grunt.file.copy(assetsPath, verAssetsPath);
    grunt.file.delete(assetsPath);
    grunt.log.writeln('moved', p.relative(__dirname, stylesPath)+' > '+p.relative(__dirname, verStylesPath));
    // create versioned layout
    var layoutString = fs.readFileSync(p.join(__dirname, layoutPath)).toString()
      .replace(/mergedAssets[.]min[.]js/g, 'mergedAssets.min.'+commitHash+'.js')
      .replace(/index[.]css/g, 'index.'+commitHash+'.css');
    grunt.file.write(p.join(__dirname, verLayoutPath), layoutString);
    grunt.log.writeln('overwrote', verLayoutPath);
  });
  // jslint
  grunt.registerTask('jshint', ['jshint:all']);
  // Compile - shared tasks for all
  grunt.registerTask('compile', ['handlebars', 'channel-images-hash', 'commit-hash-file', 'rendr_stitch', 'sass']);
  // Shared tasks for server and debug
  grunt.registerTask('dev', ['compile', 'concat', 'copy', 'autoprefixer']);
  // Run the server and watch for file changes
  grunt.registerTask('server', ['dev', 'bgShell:server', 'watch']);
  // Debug
  grunt.registerTask('debug', ['dev', 'bgShell:debug', 'watch']);
  grunt.registerTask('sdebug', ['dev', 'bgShell:sdebug', 'watch']); // sudo debug for port 80
  // Build for production
  grunt.registerTask('build', ['compile', 'cssmin', 'autoprefixer', 'uglify', 'version']);
  // Default task(s).
  grunt.registerTask('default', ['build']);
};
