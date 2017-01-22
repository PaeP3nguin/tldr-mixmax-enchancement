var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

// Serve assets in /public.
app.use(express.static(__dirname + '/public'));

// So we can POST.
app.use(bodyParser.urlencoded({
  extended: true
}));

// Since Mixmax calls this API directly from the client-side, it must be whitelisted.
var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

// The editor interface.
app.get('/editor', function (req, res) {
  res.sendFile(__dirname + '/editor.html');
});
app.get('/editor.js', function (req, res) {
  res.sendFile(__dirname + '/editor.js');
});
app.get('/keys.js', function (req, res) {
  res.sendFile(__dirname + '/keys.js');
});
app.get('/he.js', function (req, res) {
  res.sendFile(__dirname + '/he.js');
});

// The in-email representation.
app.post('/api/resolver', cors(corsOptions), require('./api/resolver'));

var pem = require('pem');
var https = require('https');
pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) throw err;

  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app).listen(process.env.PORT || 8910);
});
// app.listen(process.env.PORT || 8910);
