$(document).ready(function() {
    $(".chatroom").height(($('div.container-fluid').height() - $("nav").height() - $("footer").height()) * 0.85);
});
$(window).on("resize", function() {
    $(".chatroom").height(($('div.container-fluid').height() - $("nav").height() - $("footer").height()) * 0.85);
});

$(function() {
    //make connection
    var socket = io.connect();

    //buttons & inputs
    var message = $("#message");
    var username = $("#username");
    var password = "";
    var send_message = $("#send_message");
    var send_username_password = $("#send_username_password");
    var chatroom = $("#chatroom");

    //Emit a username 
    send_username_password.click(function() {
        console.log(username.val() + $("#password").val());
        if (username.val() == null || username.val() == "" || $("#password").val() == null || $("#password").val() == "")
            alert("Wrong input!");
        else {
            if (password == "") {
                password = $("#password").val();
                socket.emit('change_username', {
                    username: username.val(),
                    password: password
                });
            } else {
                if (password != $("#password").val()) alert("Wrong password!");
                else
                    socket.emit('change_username', {
                        username: username.val()
                    });
            };
        }
        $("#username").val('');
        $("#password").val('');
    });

    //Emit a message
    send_message.click(function() {
    	console.log(message=="");
        var d = new Date();
        var time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        socket.emit('new_message', {
            message: message.val(),
            time: time
        });
        message.val('');
    });

    //Listen on new_message
    socket.on('new_message', (data) => {
        console.log(data);
        chatroom.append("<p class='message'>\
        	<small><span class='text-muted font-weight-light'>" + data.time + "</span></small> " +
            data.username + ": <span class='w-100 inline'>" + data.message + "</span></p>");
    });

});