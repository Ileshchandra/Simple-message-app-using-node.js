var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database connection url
var dbUrl = ('mongodb://user:1leshpatel@ds163650.mlab.com:63650/ipnode');

//DataBase model
var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// get function
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
})

//post functionality using promises and 'badWord' filter
app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save()
        .then(() => {
            console.log('saved');
            return Message.findOne({ message: 'badWord' })
        })
        .then(censored => {
            if (censored) {
                console.log('censored word found', censored);
                return Message.remove({ _id: censored.id });
            }
            io.emit('message', req.body)
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(500);
            return console.error(err);
        });
});

// IO for realtime message notifications
io.on('connection', (socket) => {
    console.log('a user is connected')
});

//
mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    console.log('mongo db Connection', err);
});

//
var server = http.listen(3000, () => {
    console.log('listening on port:', server.address().port);
});
