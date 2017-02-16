
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('BRPILOT CHATBOT!');
});
//AIRBUSA320!
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAAQ3GcyyjAwBAMVXSYtrI5ysZA3MIxYxRMxtzTT77TiwuZCdOpCtqSULUMCJsqndWOGbxQKZCtrOTmQ6VXd7Rk92uzG45Qh7mjx96on33eBjcx8nNIn4u9ZCxqVAvCglICoAljsZCdi51lgZBjIzJZBh5r7GUlzn1QCB7BhQXjT9wZDZD') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});
