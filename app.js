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
    socket.admin = false;
    // socket.password = "";

    //listen on change_username
    socket.on('change_username', (data) => {
        console.log(data);
        socket.username = data.username;
        // socket.password = data.password;
        socket.admin = data.admin;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //insert message to database
        connection.query("INSERT INTO messages(username, t, message) VALUES( '" + socket.username + "', '" + data.time + "', '" + data.message + "')");
        var id;
        connection.query("SELECT MAX (id) FROM messages", (error, results, fields) => {
            id = results;
        });
        //broadcast the new message
        io.sockets.emit('new_message', { id: id, username: socket.username, time: data.time, message: data.message });
    });

    //listen on get_messages
    socket.on('get_messages', (time) => {
        var history = [];
        var sql = "SELECT * FROM messages";
        connection.query(sql, (error, results, fields) => {
            if (error)
                return console.error(error.message);
            for (var i of results) {
                history.push({ id: i.id, username: i.username, time: i.t, message: i.message });
            }
            socket.emit('get_messages', history);
        });
    });

    //listen on del_messages
    // if (socket.admin) {
    socket.on('del_messages', (data) => {
        console.log(data);

        if (data != null) {
            var str = "id=" + data[0];
            for (var i = 1; i < data.length; ++i)
                str += " AND id=" + data[i];
            console.log(str);
            var sql = 'DELETE FROM messages WHERE ' + str;
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                var history = [];
                var sql = "SELECT * FROM messages";
                connection.query(sql, (error, results, fields) => {
                    if (error)
                        return console.error(error.message);
                    console.log(results);
                    for (var i of results) {
                        history.push({ id: i.id, username: i.username, time: i.t, message: i.message });
                    }
                    io.sockets.emit('get_messages', history);
                });
            });
        }
    });
    // }
});