# metalsmith-batch-dom

Processes HTML pages and modifies dom elements using [Cheerio](https://github.com/cheeriojs/cheerio).  Provides a config style and standard cheerio api to manipulate dom element attributes and classes.

## Installation

    $ npm install metalsmith-batch-dom --save-dev

## Javascript Usage

Pass with options to `Metalsmith#use`:

##### Config Object Style

Dom manipulation can be defined using an object where the key is the dom selector and value is an object of functions keys and arguments values.

```js
var dom = require('metalsmith-batch-dom');

metalsmith.use(dom({
  'a': {
    filter: function() {
      var href = $(this).attr('href');
      return href.indexOf('http://www.google.com') !== -1 
          && href.indexOf('http://google.com') !== -1;
    },
    attr: {
      rel: 'external',
      target: '_blank',
    },
    addClass: 'is-external'
  }
}))
```

###### A Note About Ordering

While in json config mode, filtering type functions (filter, reject, eq) are preferred before manipulation type functions (attr, addClass).  If you need to customize this behavior, use the function style configuration.

##### Function Option Style

A function can be used as options. The function is called for each file with the cheerio html, file metadata, and filename as arguments.

```js
var dom = require('metalsmith-batch-dom');

metalsmith.use(dom(function($, metadata, filename) {
  $('a').each(function() {
    var link = $(this);
    link.attr('href', '#!' + link.attr('href'));
  })
}));
```

## License

MIT