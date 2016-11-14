
// var {peerserver,
//         webSocketServer,
//         emitter,
//         peerServerEventListner,
//         socketTransaction} from '../../client/server';

import {peerserver,
        webSocketServer,
        emitter,
        peerServerEventListner,
        socketTransaction} from '../../server';


var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var fs = require('fs');
var key = fs.readFileSync('../../hacksparrow-key.pem');
var cert = fs.readFileSync('../../hacksparrow-cert.pem');
var https = require('https');

console.log(peerserver," webrtc");


var https_options = {
    key: key,
    cert: cert
};


var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
//app.use(webpackHotMiddleware(compiler))

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})



var server = https.createServer(https_options, app).listen(9090);
let brokerServer = peerserver({server});
brokerServer(webSocketServer);

let listner = peerServerEventListner()(socketTransaction);
emitter.addListners(listner);
console.log("end")