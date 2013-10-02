var Channel = require('./models/channel');

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
  pluck: function (key) {
    return function (obj) {
      return obj[key];
    };
  },
  lowercase: function (str) {
    return str.toLowerCase();
  },
  inside: function (arrOrStr) {
    return function (thing) {
      return ~arrOrStr.indexOf(thing);
    };
  },
  not: function (fn, ctx) {
    ctx = ctx || this;
    return function () {
      return !fn.apply(ctx, arguments);
    };
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
    var err, json;
    try {
      json = JSON.parse(string);
    }
    catch(parseErr) {
      err = parseErr;
    }
    finally {
      cb(err, json);
    }
  },
  // thing, keys..
  keyPathExists : function(thing) {
    if (!utils.exists(thing)) { return false; }
    var keys = Array.prototype.slice.apply(arguments);
    keys.shift(); //pop off 'thing'
    var thingAtPath = thing;
    var nonExistingPathFound = keys.some(function (key) {
      thingAtPath = thingAtPath[key];
      if (!utils.exists(thingAtPath)) { return true; }
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
    return function (model, response) {
      cb(null, model, response);
    };
  },
  errorToCB : function (cb) {
    return function (model, xhr) {
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
    if (context) { cb = cb.bind(context); }
    return {
      success: utils.successToCB(cb),
      error  : utils.errorToCB(cb)
    };
  },
  cbOpts: function (cb, context) {
    if (context) { cb = cb.bind(context); }
    return {
      success: utils.successToCB(cb),
      error  : utils.errorToCB(cb)
    };
  },
  urlFriendly: function (str) {
    if (!str) { return ''; }
    var urlUnfriendlyChars = /[ @:?!'\(\)<>#%&=;{}\^\`\|\/\\]/g;
    var moreThanOneDash = /-{2,}/g;
    str = str
      .replace(urlUnfriendlyChars, '-')
      .replace(/[.,]/g, '-') // replace periods, commas
      .replace(moreThanOneDash, '-')
      .toLowerCase()
    ;
    return encodeURIComponent(str);
  },
  base64ToHex: function(base64) {
    if (!utils.exists(base64)) { return null; }
    return (isServer) ?
      utils._server_base64ToHex(base64) :
      utils._client_base64ToHex(base64);
  },
  _client_base64ToHex: function (base64) {
    var underscore = /_/g;
    var dash = /-/g;
    try {
      base64 = base64.replace(dash,'+').replace(underscore,'/').replace(/[ \r\n]+$/, "");
      for (var i = 0, bin = atob(base64), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) { tmp = "0" + tmp; }
        hex[hex.length] = tmp;
      }
      return hex.join("");
    }
    catch (err) {
      return false;
    }
  },
  _server_base64ToHex: function (base64) {
    var underscore = /_/g;
    var dash = /-/g;
    return (new Buffer(base64.toString().replace(dash,'+').replace(underscore,'/'), 'base64')).toString('hex');
  },
  hexToBase64: function (hex) {
    if (!utils.exists(hex)) { return null; }
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
    return Boolean(str && str.length === 16 && utils.isObjectId(utils.base64ToHex(str)));
  },
  tagsToString: function (tags, prelastword) {
    prelastword = prelastword || 'and';
    if (tags.length === 0) {
      return '';
    }
    else if (tags.length === 1) {
      return tags[0].name;
    }
    else {
      var maxLength = 14;
      var last;
      if (tags.length > maxLength) {
        tags = tags.slice(0, maxLength);
        last = 'more';
      }
      tags = tags.map(utils.pluck('name'));
      last = last || tags.pop();
      tags = tags.join(', ');
      tags += ' ' + prelastword + ' ' +last;
      return tags;
    }
  },
  allImagesLoaded: function ($imgs, cb) {
    var max = $imgs.length;
    var count = 0;
    $imgs.each(function () {
      var $img = $(this);
      if ($img[0].complete) {
        checkAllLoaded();
      } else {
        $img.once('load', checkAllLoaded);
      }
    });
    function checkAllLoaded () {
      if (++count >= max) cb();
    }
  },
  isCurrentURL: function (app, url) {
    var currentUrl = utils.getCurrentUrlPath(app);
    return utils.urlsMatch(currentUrl, url);
  },
  getCurrentUrlPath: function (app) {
    return (isServer) ?
      app.req && app.req.url :
      Backbone.history.fragment;
  },
  getCurrentUrl: function (app) {
    return (isServer) ?
      app.req.protocol+'://'+app.req.host+utils.getCurrentUrlPath(app) :
      window.location.href;
  },
  urlsMatch: function (url1, url2) {
    url1 = url1 && url1.toLowerCase && url1.toLowerCase();
    url2 = url2 && url2.toLowerCase && url2.toLowerCase();
    return url1 === url2 ||
      url1+'/' === url2 ||
      '/'+url1 === url2 ||
      url1 === url2+'/' ||
      url1 === '/'+url2;
  },
  clientSetCookie: function (c_name, value, exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
  },
  clientGetCookie: function (c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
      {
      c_start = c_value.indexOf(c_name + "=");
      }
    if (c_start == -1)
      {
      c_value = null;
      }
    else
      {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
      {
    c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
  },
  customChannel: function (app) {
    // put it here so that it's just in one place
    return new Channel({
      _id        : "111122223333444455556666",
      name       : "Add your own",
      description: "Want to get Featured? Click here to find out how.",
      aliases    : ['add your own'],
      count      : 1337,
      url        : '/publish'
    }, { app:app });
  }
};