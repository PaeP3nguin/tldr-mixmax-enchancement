module.exports = function (req, res) {
  console.log('req.body', req.body)
  var data = JSON.parse(req.body.params);
  if (!data) {
    res.status(403 /* Unauthorized */).send('Invalid params');
    return;
  }

  var html = '<img style="max-width:100%;" src="' + data.src + '" width="' + width + '"/>';
  html += '<h4>' + data.title + '</h4>';
  for (var i = 0, l = data.text.length; i < l; i++) {
    html += '<p>' + data.text[i] + '</p>';
  }
  res.json({
    body: html
  });
};