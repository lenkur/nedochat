const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ' ',
    database: 'nedochat'
});

connection.connect(function(err) {
    if (err) console.log("Errore!" + err);
    console.log("Connected!");
});

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.render('index');
    //mysql
    connection.query("SELECT * FROM messages", function(error, rows, fields) {
        console.log(rows);
    });
});

//Listen on port
server = app.listen(port);

//socket.io instalation
const io = require("socket.io")(server);
var counter = 0;

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })

    //default username
    socket.username = "Anonymous";
    // socket.password = "";

    //listen on change_username
    socket.on('change_username', (data) => {
        console.log(data);
        socket.username = data.username;
        // socket.password = data.password;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        console.log(data);
        //broadcast the new message
        io.sockets.emit('new_message', { username: socket.username, time: data.time, message: data.message });
        connection.query("INSERT INTO messages(author, time, content) VALUES( '" + socket.username + "', '" + data.time + "', '" + data.message + "')");
        connection.query("SELECT * FROM messages", function(error, rows, fields) {
            console.log(rows);
        });
    });
});