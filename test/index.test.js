var dom = require('../index.js');
var test = require('tape');

var Metalsmith = require('metalsmith');
var cheerio = require('cheerio');

function plugtest(options, fn) {
  Metalsmith('test/fixtures')
    .source('.')
    .destination('tmp')
    .use(dom(options)).build(function(err, files) {
      if(err) return console.log('err: ', err);
      Object.keys(files).forEach(function(filename) {
        files[filename].$ = load(files, filename);
      });
      fn(err, files);
    });
}

function load(files, name) {
  var contents = files[name].contents;
  if (contents !== undefined) {
    return cheerio.load(contents.toString());
  }
  return cheerio.load('');
}

var config = {
  '*': {
    filter: 'a[ext]',
    attr: {
      rel: 'external',
      target: '_blank'
    },
    removeAttr: 'ext',
    addClass: 'is-external'
  }
}

function fnConfig($, data) {
  var links = $('a').each(function() {
    var link = $(this);
    link.attr('href', '#!' + link.attr('href'))
  })

  return $.html();
}


test('should accept a object as an argument', function(t) {
  t.plan(1);
  plugtest(config, function(err, files) {
    t.equal(files['d.html'].$('#ext-link').attr('rel'), 'external');
  });
})

test('should accept a function as an argument', function(t) {
  t.plan(1);
  plugtest(fnConfig, function(err, files) {
    t.equal(files['d.html'].$('#link').attr('href'), '#!/portfolio');
  });
})

test('should accept a mixed array as an argument', function(t) {
  t.plan(2);
  plugtest([config, fnConfig], function(err, files) {
    t.equal(files['d.html'].$('#ext-link').attr('rel'), 'external');
    t.equal(files['d.html'].$('#link').attr('href'), '#!/portfolio');
  });
})

test('should only process html filesz', function(t) {
  t.plan(1);
  plugtest(config, function(err, files) {
    t.equal(files['c.css'].$('#css-linkcheck').attr('rel') === undefined, true);
  });
})
