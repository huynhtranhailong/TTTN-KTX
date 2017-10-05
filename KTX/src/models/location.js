module.exports = function(app) {

    var schema = app.db.Schema({
        email:          String,
        position: [
            {
                lat:    Number,
                lng:    Number,
                time:   Date
            }
        ]
    });

    const Location = app.db.model('location', schema);

    app.model.Location = {
        savePosition: function (email, position, done) {
            Location.findOne({email: email}, function (err, location) {
                if (err) done({status: -1, error: err});
                else {
                    if (location) {
                        location.position.push(position);

                        location.save(function (err, location) {
                            if (err) done({status: -1, error: err});
                            else done({status: 1, location: location});
                        })
                    }
                    else {
                        let location = new Location();

                        location.email = email;
                        location.position = [position];

                        location.save(function (err, location) {
                            if (err) done({status: -1, error: err});
                            else done({status: 1, location: location});
                        });
                    }
                }
            })
        }
    };
};