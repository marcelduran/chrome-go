chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  suggest(
    // custom keywords suggestions
    (JSON.parse(localStorage.getItem('custom') || '[]').map(function(custom) {
      var prettyUrl = custom.url.replace(/^https?:\/\//, '');

      return {
        content: custom.url.replace(/%s/g, text),
        description: 'go to ' + prettyUrl.replace(/%s/g, text)
      };
    }) || []).concat(
      // last searches
      JSON.parse(localStorage.getItem('cache') || '[]').map(function(cache) {
        return {
          content: cache,
          description: 'go to ' + cache
        };
      })
    )
  );
});

chrome.omnibox.onInputEntered.addListener(function(slug) {
  // sub goto
  var parts = slug.split(' ');
  if (parts.length > 1) {
    var custom = JSON.parse(localStorage.getItem('custom') || '[]')
      .filter(function(custom) {
        return custom.keyword === parts[0];
      })[0];
    if (custom) {
      slug = custom.url.replace(/%s/g, parts.slice(1).join(' '));
    }
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {
      url: /^https?:\/\//.test(slug) ? slug :
        (localStorage.getItem('default') || 'http://bit.ly/%s')
        .replace(/%s/g, slug)
    });
  });

  // cache searches
  var cache = JSON.parse(localStorage.getItem('cache') || '[]');
  if (cache.indexOf(slug) < 0) {
    cache.unshift(slug);
    cache = cache.slice(0, 10);
    localStorage.setItem('cache', JSON.stringify(cache));
  }
});
