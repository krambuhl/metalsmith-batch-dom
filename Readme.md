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

function fnConfig($, data, opts) {
  var links = $('a').filter(function() {
    var href = $(tag).attr('href');
    return href.indexOf('http://www.google.com') !== -1 
        && href.indexOf('http://google.com') !== -1;
  }).attr({
    rel: 'external',
    target: '_blank'
  }).addClass('is-external');
}

metalsmith
  .use(dom(config))
  .use(dom([config, fnConfig]));
```


## License

MIT