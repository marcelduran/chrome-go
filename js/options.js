// load cache
$('#cache').append(
  JSON.parse(localStorage.getItem('cache') || '[]').map(function(item) {
    return '<span class="tag">' + item + '</span>';
  }).join('')
);

// load custom keywords/urls
$('#custom').prepend(
  JSON.parse(localStorage.getItem('custom') || '[]').reduce(function(p, c) {
    return p + '<li class="custom-item">' +
      '<input type="text" class="span2 custom-keyword" placeholder="keyword e.g.: foo" value="' +
      c.keyword + '">\n' +
      '<input type="text" class="span6 custom-url" placeholder="url e.g.: http://bar.com/%s" value="' +
      c.url + '"></li>';
  }, '')
);

// add more custom lines
$('#more-custom').on('click', function() {
  $('#custom').append(
    '<li class="custom-item">' +
    '<input type="text" class="span2 custom-keyword" placeholder="keyword e.g.: foo">\n' +
    '<input type="text" class="span6 custom-url" placeholder="url e.g.: http://bar.com/%s"></li>'
  ).children().last().find('.custom-keyword').focus();
});

// clear cache
$('#clear-cache').on('click', function() {
  localStorage.removeItem('cache');
  $('#cache').empty();
});

// save
$('#save').on('click', function() {
  // default
  localStorage.setItem('default', $('#default-url').val() || 'http://bit.ly/%s');

  // custom
  var custom = [];
  $('#custom .custom-item').each(function(i, item) {
    var keyword = $(item).find('.custom-keyword').val(),
        url = $(item).find('.custom-url').val();

    if (keyword && url) {
      custom.push({keyword: keyword, url: url});
    }
  });
  localStorage.setItem('custom', JSON.stringify(custom));

  window.close();
});
