const express = require('express');
const app = express();

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.render('index');
});

//Listen on port 3000
server = app.listen(3000);

//socket.io instalation
const io = require("socket.io")(server);

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })

    //default username
    socket.username = "Anonymous";

    //listen on change_username
    socket.on('change_username', (data) => {
    	console.log(data);
        socket.username = data.username;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
    	console.log(data);
        //broadcast the new message
        io.sockets.emit('new_message', { message: data.message, username: socket.username});
    });
});