
var utils = module.exports = {
  capitalize: function (str) {
    return typeof str === 'string' && str.length && str[0].toUpperCase() + str.slice(1);
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
      if (index !== 0) {
        match = delimeter+match;
      }
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
    if (!utils.exists(base64)) return null;
    return (isServer) ?
      utils._server_base64ToHex(base64) :
      utils._client_base64ToHex(base64);
  },
  _client_base64ToHex: function (base64) {
    console.log('CLIENT!')
    var underscore = /_/g;
    var dash = /-/g;
    try {
      base64 = base64.replace(dash,'+').replace(underscore,'/').replace(/[ \r\n]+$/, "");
      for (var i = 0, bin = atob(base64), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
      }
      return hex.join("");
    }
    catch (err) {
      return false;
    }
  },
  _server_base64ToHex: function (base64) {
    console.log('SERVER!')
    var underscore = /_/g;
    var dash = /-/g;
    return (new Buffer(base64.toString().replace(dash,'+').replace(underscore,'/'), 'base64')).toString('hex');
  },
  hexToBase64: function (hex) {
    if (!utils.exists(hex)) return null;
    return (isServer) ?
      utils._server_hexToBase64(hex) :
      utils._client_hexToBase64(hex);
  },
  _client_hexToBase64: function(hex) {
    var plus = /\+/g;
    var slash = /\//g;
    return btoa(String.fromCharCode.apply(null,
      hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    ).replace(plus,'-').replace(slash,'_');
  },
  _server_hexToBase64: function (hex) {
    var plus = /\+/g;
    var slash = /\//g;
    return (new Buffer(hex.toString(), 'hex')).toString('base64').replace(plus,'-').replace(slash,'_');
  },
  isObjectId: function (str) {
    str = str.toString && str.toString();
    return Boolean(str.match(/^[a-fA-F0-9]{24}$/));
  },
  isObjectId64: function (str) {
    str = str && str.toString && str.toString();
    console.log(str)
    console.log(Boolean(str && str.length === 16));
    console.log(Boolean(str && str.length === 16 && utils.base64ToHex(str)));
    console.log(Boolean(str && str.length === 16 && utils.isObjectId(utils.base64ToHex(str))));
    return Boolean(str && str.length === 16 && utils.isObjectId(utils.base64ToHex(str)));
  },
  tagsToString: function (tags, prelastword) {
    prelastword = prelastword || 'and'
    if (tags.length === 0) {
      return ''
    }
    else if (tags.length === 1) {
      return tags[0].name
    }
    else {
      tags = tags.map(function (tag) {
        return tag.name;
      });
      var last = tags.pop();
      tags.join(', ');
      tags += prelastword + ' ' +last;
      return tags;
    }
  }
};