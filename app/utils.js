var global = this;
var utils = module.exports = {
  capitalize: function (str) {
    return typeof str == 'string' && str.length && str[0].toUpperCase() + str.slice(1);
  },
  compose : function() {
    var funcs = Array.prototype.slice.apply(arguments);
    return function(arg) {
      return funcs.reduce(function(arg, fn) {
        return fn(arg);
      }, arg);
    };
  },
  add: function(prev, curr) { return prev+curr; },
  and: function(prev, curr) { return prev+curr; },
  addAll: function() {
    return Array.prototype.slice.apply(arguments).reduce(utils.add);
  },
  andAll: function() {
    return Array.prototype.slice.apply(arguments).reduce(utils.and);
  },
  hexToBase64: function(str) {
    var plus = /\+/g;
    var slash = /\//g;
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    ).replace(plus,'-').replace(slash,'_');
  },
  isHex: function(str) {
    var strSplit = str.split('');
    var parseHex = function(v) { return parseInt(v,16); };
    var parseHexIsFinite = utils.compose(parseHex, isFinite);
    return strSplit.map(parseHexIsFinite).reduce(utils.and);
  },
  notEmptyString: function(thing) {
    return (thing !== '');
  },
  exists: function(thing) {
    return (thing !== null && thing !== undefined);
  },
  defaultValue: function(thing, defaultVal) {
    return utils.exists(thing) ? thing : defaultVal;
  },
  pathJoin: function() {
    var args = Array.prototype.slice.apply(arguments);
    var ret  = args.filter(utils.exists).join('/')
      .replace(/(\/){2,}/g, '/') //replace double slashes
      .replace(/^(http(s){0,1}[:]\/)([^\/])/, '$1/$3') //fix links whose double slashes were replaced
    ;
    return ret;
  },
  parseJSON: function (string, cb) {
    try {
      var json = JSON.parse(string);
      cb(null, json);
    }
    catch(err) {
      cb(err);
    }
  },
  // thing, keys..
  keyPathExists : function(thing) {
    if (!utils.exists(thing)) return false;
    var keys = Array.prototype.slice.apply(arguments);
    keys.shift(); //pop off 'thing'
    var thingAtPath = thing;
    var nonExistingPathFound = keys.some(function (key) {
      thingAtPath = thingAtPath[key];
      if (!utils.exists(thingAtPath)) return true;
    });

    return !nonExistingPathFound;
  },
  escapeRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },
  uncapitalize : function(str) {
    return str[0].toLowerCase() + str.slice(1);
  },
  camelCase : function(str, capitalize) {
    console.log(str);
    var regex = /[ -_][a-z]/g;
    var newStr = '';
    var lastIndex = 0;
    str.replace(regex, function(match, index) {
      newStr += (str.substring(lastIndex, index));
      lastIndex = index+2;
      match  =  match.replace(/[ -_]/, '');
      newStr += (match.toUpperCase());
      newStr += ('');
    });
    newStr += (str.substring(lastIndex));

    if (utils.exists(capitalize)) {
      return capitalize? utils.capitalize(newStr) : utils.uncapitalize(newStr);
    }
    else {
      return newStr;
    }
  },
  unCamelCase : function(str, delimeter, capitalize) {
    delimeter = utils.exists(delimeter) ? delimeter : '-';
    var regex = /[A-Z]/g;
    var newStr = '';
    var lastIndex = 0;

    str.replace(regex, function(match, index) {
      console.log(match);
      newStr += (str.substring(lastIndex, index));
      lastIndex = index+1;
      if (index !== 0)
        match = delimeter+match;
      newStr += match.toLowerCase();
    });
    newStr += (str.substring(lastIndex));

    if (utils.exists(capitalize)) {
      return capitalize? utils.capitalize(newStr) : utils.uncapitalize(newStr);
    }
    else {
      return newStr;
    }
  },
  successToCB : function (cb) {
    return function (model, response, options) {
      cb(null, model, response);
    };
  },
  errorToCB : function (cb) {
    return function (model, xhr, options) {
      if (xhr.message) {
        cb(xhr.message);
      }
      else {
        utils.parseJSON(xhr.responseText, function (err, json) {
          var defaultMessage = 'Error, please try again.';
          if (err) { cb(defaultMessage); } else {
            cb(json.message || defaultMessage);
          }
        });
      }
    };
  },
  successErrorToCB: function (cb, context) {
    if (context) cb = cb.bind(context);
    return {
      success: utils.successToCB(cb),
      error  : utils.errorToCB(cb)
    };
  },
  cbOpts: function (cb, context) {
    if (context) cb = cb.bind(context);
    return {
      success: utils.successToCB(cb),
      error  : utils.errorToCB(cb)
    };
  },
  urlFriendly: function (str) {
    if (!str) return '';
    var urlUnfriendlyChars = /[ @:?!'\(\)<>#%&=;{}\^\`\|\/\\]/g;
    var moreThanOneDash = /-{2,}/g;
    str = str
      .replace(urlUnfriendlyChars, '-')
      .replace(/[.]/g, '') // replace periods
      .replace(moreThanOneDash, '-')
      .toLowerCase()
    ;
    return encodeURIComponent(str);
  },
  base64ToHex: function(base64) {
    var underscore = /_/g;
    if (global.isServer) {
      if (!utils.exists(base64)) return null;
      var minus = /-/g;
      return (new Buffer(base64.toString().replace(minus,'+').replace(underscore,'/'), 'base64')).toString('hex');
    }
    else {
      var dash = /-/g;
      try {
        for (var i = 0, bin = atob(base64.replace(dash,'+').replace(underscore,'/').replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
          var tmp = bin.charCodeAt(i).toString(16);
          if (tmp.length === 1) tmp = "0" + tmp;
          hex[hex.length] = tmp;
        }
        return hex.join("");
      }
      catch (err) {
        return false;
      }
    }
  },

  isObjectId: function (str) {
    // console.log(str.length)
    // console.log(Boolean(str.match))
    // console.log(str.match(/^[a-fA-F0-9]{24}$/))
    return Boolean(str && str.length === 24 && str.match && str.match(/^[a-fA-F0-9]{24}$/));
  },

  isObjectId64: function (str) {
    return Boolean(str && str.length === 16 && utils.isObjectId(utils.base64ToHex(str)));
  }
};