$(document).ready(function() {
    $(".chatroom").height(($('div.container-fluid').height() - $("nav").height() - $("footer").height()) * 0.85);
});
$(window).on("resize", function() {
    $(".chatroom").height(($('div.container-fluid').height() - $("nav").height() - $("footer").height()) * 0.85);
});

$(function() {
    //make connection
    var socket = io.connect();
    var start = false;
    //buttons & inputs
    var message = $("#message");
    var username = $("#username");
    // var password = "";
    var send_message = $("#send_message");
    var send_username_password = $("#send_username_password");
    var chatroom = $("#chatroom");
    var d = new Date();
    var time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

    if (!start) {
        socket.emit('get_messages', {
            time: time
        });
        start = true;
    }

    //Emit a username 
    send_username_password.click(function() {
        if (username.val() == null || username.val() == ""
            // || $("#password").val() == null || $("#password").val() == ""
        )
            alert("Wrong input!");
        else {
            // if (password == "") {
            //     password = $("#password").val();
            //     socket.emit('change_username', {
            //         username: username.val(),
            //         password: password
            //     });
            // } else {
            //     if (password != $("#password").val()) alert("Wrong password!");
            //     else
            socket.emit('change_username', {
                username: username.val()
            });
            // };
        }
        $("#username").val('');
        $("#password").val('');
    });

    //Emit a message
    send_message.click(function() {
        if (message.val() != '') {
            time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()+ ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
            socket.emit('new_message', {
                message: message.val(),
                time: time
            });
            message.val('');
        }
    });

    //Listen on new_message
    socket.on('new_message', (data) => {
        chatroom.append("<p class='message'>\
        	<small><span class='text-muted font-weight-light'>" + data.time + "</span></small> " +
            data.username + ": <span class='w-100 inline'>" + data.message + "</span></p>");
        chatroom.scrollTop(chatroom.prop("scrollHeight"));
    });

    //Listen on get_messages
    socket.on('get_messages', (data) => {
        for (var i of data)
            chatroom.append("<p class='message'>\
        	<small><span class='text-muted font-weight-light'>" + i.time + "</span></small> " +
                i.username + ": <span class='w-100 inline'>" + i.message + "</span></p>");
        chatroom.scrollTop(chatroom.prop("scrollHeight"));
    });
});