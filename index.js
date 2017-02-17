
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
            var wip = "Ainda estamos em fase de testes... desculpe";
            switch ( event.message.text ) {

              case "Quero Cartas":

                sendTextMessage( sender, wip );
              break;

              case "Quero NOTAM":

                sendTextMessage( sender, wip );
              break;

              case "Quero METAR/TAF":

                sendTextMessage( sender, wip );
              break;

              case "Quero ROTAER":
                text = "Ainda estamos em fase de testes... desculpe";
                sendTextMessage( sender, wip );
              break;

              case "NASCER/POR DO SOL":

                sendTextMessage( sender, wip );
              break;

              default:
                sendTextMessage( sender, first_question );
            }


        }
    }
    res.sendStatus(200);
});



function sendTextMessage(sender, text) {
    if( text === 'Ainda estamos em fase de testes... desculpe' ){
        var text_msg = {'text':text};
        var messageData = {
          recipient: {
            id: sender
          },
          message: text_msg
        };
        console.log("ENVIANDO AO USUARIO TEXTO SIMPLES " +  JSON.stringify(messageData));
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:FB_PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }else{
        var messageData = {
          recipient: {
            id: sender
          },
          message: text
        };
        console.log("ENVIANDO AO USUARIO TEXTO SIMPLES " +  JSON.stringify(messageData));
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:FB_PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }


}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});
