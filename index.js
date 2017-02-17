
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

var FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] ===  FB_VERIFY_TOKEN ) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

app.post('/webhook/', function (req, res) {

    var first_question = {
      "text":"Em que podemos ajudar?",
       "quick_replies":[
         {
           "content_type":"text",
           "title":"Quero Cartas",
           "payload":"CARTAS"
         },
         {
            "content_type":"text",
            "title":"Quero NOTAM",
            "payload":"NOTAM"
         },
         {
            "content_type":"text",
            "title":"Quero METAR/TAF",
            "payload":"METAR_TAF"
         },
         {
            "content_type":"text",
            "title":"Quero ROTAER",
            "payload":"ROTAER"
         },
         {
            "content_type":"text",
            "title":"Quero NASCER/POR DO SOL",
            "payload":"SOL"
         }
       ]
     };

    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        console.log(event);

        if (event.message && event.message.text) {
            var response = first_question;

            var messageData = {
              recipient: {
                id: sender
              },
              message: response
            };

            switch ( event.message.text ) {

              case "Quero Cartas":
                response = "Ainda estamos em fase de testes... desculpe :(";
                sendTextMessage( sender, messageData );
              break;

              case "Quero NOTAM":
                response = "Ainda estamos em fase de testes... desculpe :(";
                sendTextMessage( sender, messageData );
              break;

              case "METAR/TAF":
                response = "Ainda estamos em fase de testes... desculpe :(";
                sendTextMessage( sender, messageData );
              break;

              case "Quero ROTAER":
                response = "Ainda estamos em fase de testes... desculpe :(";
                sendTextMessage( sender, messageData );
              break;

              case "NASCER/POR DO SOL":
                response = "Ainda estamos em fase de testes... desculpe :(";
                sendTextMessage( sender, messageData );
              break;

              default:
                sendTextMessage( sender, messageData );
            }


        }
    }
    res.sendStatus(200);
});



function sendTextMessage(sender, text) {

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:FB_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: text
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
