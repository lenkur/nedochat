const express = require('express');
const port = process.env.PORT || 8000;
const app = express();

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

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })

    //default username
    socket.username = "Anonymous";
    socket.password = "";

    //listen on change_username
    socket.on('change_username', (data) => {
    	console.log(data);
        socket.username = data.username;
        socket.password = data.password;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
    	console.log(data);
        //broadcast the new message
        io.sockets.emit('new_message', {  username: socket.username, time: data.time, message: data.message});
    });
});