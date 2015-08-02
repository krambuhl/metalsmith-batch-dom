# metalsmith-dom

Processes HTML pages and modifies dom elements using [Cheerio](https://github.com/cheeriojs/cheerio).  Provides a config style and standard cheerio api to manipulate dom element attributes and classes.

## Installation

    $ npm install metalsmith-dom --save-dev

## Javascript Usage

Pass with options to `Metalsmith#use`:

```js
var dom = require('metalsmith-dom');

var config = {
  'a': {
    filter: function(tag) {
      var href = $(tag).attr('href');
      return href.indexOf('http://www.google.com') !== -1 
          && href.indexOf('http://google.com') !== -1;
    },
    attr: {
      rel: 'external',
      target: '_blank',
    },
    addClass: 'is-external'
  }
};

metalsmith.use(dom({
  'a': {
    filter: function(tag) {
      var href = $(tag).attr('href');
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

### Function options

```
var dom = require('metalsmith-dom');

metalsmith.use(dom(function($, metadata, filename) {
  $('a').each(function() {
    var link = $(this);
    link.attr('href', '#!' + link.attr('href'));
  })
}));
```

## License

MIT