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
    var admin = false;
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
        socket.emit('get_messages', time);
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

            if (username.val() == "Admin") {
                $('#passwordModal').modal('show');
                var adminPassword = $('input#password').val();
                $('#passwordButton').on('click', function() {
                    if (adminPassword == "postironia") {
                        socket.emit('change_username', {
                            username: "Admin",
                            admin: true
                        });
                        admin = true;
                    }
                    $('.ch').removeClass('d-none');
                });
                $('#deleteMessages').on('click', function() {
                    var toDel = [];
                    var list = $(':checked').map(function() {
                        toDel.push($(this).parents('p').data().id);
                    });
                    console.log(toDel);
                    socket.emit('del_messages', toDel);
                });
            } else {
                socket.emit('change_username', {
                    username: username.val()
                });
                $('.ch').addClass('d-none');
            }
        }
        $("#username").val('');
        $("#password").val('');
    });

    //Emit a message
    send_message.click(function() {
        if (message.val() != '') {
            d = new Date();
            time = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
            socket.emit('new_message', {
                message: message.val(),
                time: time
            });
            message.val('');
        }
    });

    //Listen on new_message
    socket.on('new_message', (data) => {
        chatroom.append("<p class='message' data-id='" + data.id + "'>\
            	<span class='form-check form-check-inline ch'>\
   				<input type='checkbox' class='form-check-input'> </span>\
        		<small><span class='text-muted font-weight-light'>" + data.time + "</span></small> " +
            data.username + ": <span class='w-100 inline'>" + data.message + "</span></p>");
        chatroom.scrollTop(chatroom.prop("scrollHeight"));
        if (!admin) $('.ch').addClass('d-none');
        else $('.ch').removeClass('d-none');
    });

    //Listen on get_messages
    socket.on('get_messages', (data) => {
        chatroom.empty();
        for (var i of data)
            chatroom.append("<p class='message' data-id='" + i.id + "'>\
            	<span class='form-check form-check-inline ch'>\
   				<input type='checkbox' class='form-check-input'> </span>\
        		<small><span class='text-muted font-weight-light'>" + i.time + "</span></small> " +
                i.username + ": <span class='w-100 inline'>" + i.message + "</span></p>");
        chatroom.scrollTop(chatroom.prop("scrollHeight"));
        if (!admin) $('.ch').addClass('d-none');
        else $('.ch').removeClass('d-none');
    });
});

function changeAppearance(admin) {

}