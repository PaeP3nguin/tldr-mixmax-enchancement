var request = require('request');
var keys = require("../keys.js");

module.exports = function (req, res) {
  console.log('req.body', req.body)
  var data = JSON.parse(req.body.params);
  if (!data) {
    res.status(403 /* Unauthorized */).send('Invalid params');
    return;
  }

  request({
    url: 'http://api.aylien.com/api/v1/extract?url=' + encodeURIComponent(data.url) + '&best_image=true',
    headers: {
      "X-AYLIEN-TextAPI-Application-Key": keys.aylien,
      "X-AYLIEN-TextAPI-Application-ID": keys.aylien_id
    }
  }, function (error, response, body) {
    var aylien_data = JSON.parse(body);
    var html =
      '<a href="' + data.url + '" style=" text-decoration: none; color: initial;">\
        <div style="border: 1px solid #99b0e1; border-radius: 4px; padding: 8px; display: flex;">\
          <div style="display: flex; flex-direction: column; justify-content: space-between;"><img src=' + aylien_data.image + ' style="height: 100px; object-fit: cover; max-width: 120px;">\
            <img src="https://localhost:8910/lil_logo.png" style="width: 100px;"></div>';
    html += '<div style="margin-left: 8px;"><h4 style="font-family: \'Avenir Next\', \'Segoe UI\', \'Calibri\', Arial, sans-serif; font-weight: 600; margin: 0 0 8px 0;">' + data.title + '</h4>';
    for (var i = 0, l = data.text.length; i < l; i++) {
      if (data.text[i].trim().length > 0) {
        html += '<p style="font-family: \'Segoe UI\', \'Helvetica Neue\', Helvetica, \'Calibri\', Arial, sans-serif; font-size: small">' + data.text[i] + '</p>';
      }
    }
    html += '</div></div></a>';
    res.json({
      body: html
    });
  });
};