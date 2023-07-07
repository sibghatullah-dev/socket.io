var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db.js');
var mydb = new db();

app.get('/', function(req, res) {
    res.send('Working Fine');
});
var sockets = {};
var arr = [];
io.on('connection', function(socket) {

    socket.on('new_post_send', function(data) {
        io.emit('new_post_receive', {});
    });

    socket.on('comment_send', function(data) {
        io.emit('comment_receive', {
            'comment_id': data.comment_id,
            'post_id': data.post_id,
            'user_id': data.user_id,
            'user_name': data.user_name,
            'user_image': data.user_image,
            'comment': data.comment,
            'created_at': data.created_at,
            // 'comments_count': data.comments_count
        });
    });

    socket.on('like_send', function(data) {
        io.emit('like_receive', {
            'post_id': data.post_id,
            'user_id': data.user_id,
            'is_like': data.is_like, // 1:like | 0:unlike
            'user_name': data.user_name,
            'user_image': data.user_image,
            'created_at': data.created_at
        });
    });

    socket.on('new_message_send', function(data) {
        io.emit('new_message_receive', {
            'chat_id': data.chat_id,
            'sender_id': data.sender_id,
            'sender_name': data.sender_name,
            'sender_image': data.sender_image,
            'message': data.message,
            'file_type': data.file_type,
            'file_path': data.file_path,
            'thumbnail': data.thumbnail,
            'file_ratio': data.file_ratio
        });
    });

    socket.on('notification_send', function(data) {
        io.emit('notification_receive', {
            'notification_id': data.notification_id,
            'sender_id': data.sender_id,
            'sender_name': data.sender_name,
            'sender_image': data.sender_image,
            'receiver_id': data.receiver_id,
            'type_id': data.type_id,
            'noti_type': data.noti_type,
            'noti_text': data.noti_text,
            'created_at': data.created_at
        });
    });


    socket.on('disconnect', function() {
        if (sockets[socket.id] != undefined) {
            mydb.releaseRequest(sockets[socket.id].user_id).then(function(result) {
                console.log('disconected: ' + sockets[socket.id].request_id);
                io.emit('request-released', {
                    'request_id': sockets[socket.id].request_id
                });
                delete sockets[socket.id];
            });
        }
    });
});

http.listen(1019, function() {
    console.log('working fine');
});
