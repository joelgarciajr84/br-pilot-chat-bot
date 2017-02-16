
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

var token = "EAAQ3GcyyjAwBAMVXSYtrI5ysZA3MIxYxRMxtzTT77TiwuZCdOpCtqSULUMCJsqndWOGbxQKZCtrOTmQ6VXd7Rk92uzG45Qh7mjx96on33eBjcx8nNIn4u9ZCxqVAvCglICoAljsZCdi51lgZBjIzJZBh5r7GUlzn1QCB7BhQXjT9wZDZD";
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAAQ3GcyyjAwBAMVXSYtrI5ysZA3MIxYxRMxtzTT77TiwuZCdOpCtqSULUMCJsqndWOGbxQKZCtrOTmQ6VXd7Rk92uzG45Qh7mjx96on33eBjcx8nNIn4u9ZCxqVAvCglICoAljsZCdi51lgZBjIzJZBh5r7GUlzn1QCB7BhQXjT9wZDZD') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
        }
    }
    res.sendStatus(200);
});



function sendTextMessage(sender, text) {
    var messageData = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});
