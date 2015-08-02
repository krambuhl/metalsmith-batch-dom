var debug = require('debug')('metalsmith-dom');
var match = require('minimatch');
var cheerio = require('cheerio');
var flatten = require('flatten');


/**
 * Expose `plugin`.
 */

module.exports = plugin;


/**
 * Metalsmith plugin that renames a glob of files using string interpolation
 * patterns and file metadata or function.
 *
 * @param {Object|Array} options
 *   @property {String} pattern
 *   @property {String|Function} filename
 *   @property {Boolean} copy
 *   @property {String} date
 * @return {Function}
 */

function plugin(options) {
  var instructions = normalize(options);
  return function(files, metalsmith, done) {
    instructions.forEach(function(modify) {
      Object.keys(files).forEach(function(file) {
        debug('checking file: ' + file);

        if (match(file, '**/*.{html,htm}')) {
          debug('processing file: ' + file);
          var html = cheerio.load(files[file].contents.toString());
          modify(html, files[file], file)
          files[file].contents = html.html();
        }
      });
    });

    done();
  };
}

/**
 * Normalizes options arguments
 *
 * @param {Object|Function|Array} options
 *   @property {String} selector Cheerio dom selctor
 *   @property {Option} * Cheerio dom api function as key and first argument as value

 * @return {Array} patterns
 */

function normalize(options) {
  if (Array.isArray(options)) {
    options = options.map(_normalize);
  } else {
    options = [_normalize(options)];
  }

  return flatten(options);

  function _normalize(map) {
    if (typeof map === 'function') {
      return map;
    } else if (typeof map === 'object') {
      return Object.keys(map).map(function(selector) {
        return transformObject(selector, map[selector]);
      });
    }
  }

  function transformObject(selector, opts) {
    var keys = Object.keys(opts);
    var firstKeys = ['filter', 'reject', 'map', 'not', 'has', 'first', 'last', 'eq'];
    
    var res = [];

    // prioritize filtering type functions before 
    // attribute type functions
    keys.forEach(function(key) {
      if (firstKeys.indexOf(key) !== -1) {
        res.unshift(key); 
      } else {
        res.push(key);
      }
    });

    return function($, data) {
      var $el = $(selector);
      res.forEach(function(fn) {
        $el = $el[fn](opts[fn]);
      });
    }
  }
}