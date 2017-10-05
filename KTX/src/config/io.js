module.exports = function(app) {

    // Create user ids
    var userIds = [];

    // New connection
    app.io.on('connection', function(socket){
        //console.log('Socket IO: An user connected!');

        socket.on('disconnect', function() {
            if (socket.userId != undefined && socket.userId != -1) {
                // Remove from userIds array
                var index = userIds.indexOf(socket.userId);
                if (index>-1) userIds.splice(index, 1);
            }

            app.io.emit('userIds', userIds);
            console.log('Socket IO: An user disconnected!', userIds);
        });

        socket.on('set userId', function(userId) {
            // Add userIds array
            if (!isNaN(parseInt(userId))) {
                var index = userIds.indexOf(userId);
                if (index==-1) userIds.push(userId);
            }

            app.io.emit('userIds', userIds);
            console.log('Socket IO: Hi, I am '+userId+'!', userIds);
        });

        socket.on('round1: get test', function(userId) {
            app.model.Round1Question.getTest(userId, function (test) {
                app.io.emit('round1: get test', userId, test);
            });
        });

        socket.on('round1: ready', function(userId) {
            app.io.emit('round1: ready', userId);
        });

        socket.on('round1: start test', function(userId) {
            app.io.emit('round1: start test', userId);
        });

        socket.on('round1: change question', function(userId, questionId) {
            app.io.emit('round1: change question', userId, questionId);
        });

        socket.on('round1: send result', function(userId, questionId, result) {
            app.model.Round1Question.changeResult(userId, questionId, result, function(results) {
                app.io.emit('round1: send result', results);
            });
        });
    });
};