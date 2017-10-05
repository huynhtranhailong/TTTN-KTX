module.exports = function(app) {

    const Jimp = require("jimp");
    const async = require('async');

    app.plugins.Image = {
        minimizeOne: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            //==========================Argument list==========================//
            const done = args.pop();
            const file = args.shift();
            const destination = args.shift();
            const defaultWidth = args.shift();
            const defaultQuality = args.shift();
            //=================================================================//
            Jimp.read(file.path, function (err, lenna) {
                if (err) return done({status: -1, error: err});

                if (!app.fs.existsSync(app.path.join(app.publicPath, destination))) app.fs.mkdirSync(app.path.join(app.publicPath, destination));

                const basename = app.path.basename(file.path);

                const destinationFilePath = app.path.join(app.publicPath, destination, basename + '.jpg');

                app.fs.openSync(destinationFilePath, 'w');

                lenna.resize(defaultWidth, Math.round(defaultWidth * lenna.bitmap.height / lenna.bitmap.width)).quality(defaultQuality).write(destinationFilePath);
                app.fs.renameSync(destinationFilePath, app.path.join(app.publicPath, destination, basename));
                if(((lenna.bitmap.width/lenna.bitmap.height) >= 2.5 ) && ((lenna.bitmap.width/lenna.bitmap.height) <= 4) ){
                    const coverFilePath = app.path.join(app.publicPath, destination,'cover', basename + '.jpg');
                    lenna.resize(1100, 400).quality(defaultQuality).write(coverFilePath);
                    app.fs.renameSync(coverFilePath, app.path.join(app.publicPath, destination,'cover', basename));
                    done({status: 1, file: basename, cover :true});
                }else
                    done({status: 1, file: basename, cover :false});

            });
        },
        minimizeMany: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            //==========================Argument list==========================//
            const done = args.pop();
            const files = args.shift();
            const destination = args.shift();
            const defaultWidth = args.shift();
            const defaultQuality = args.shift();
            const childSettings = args.shift();
            //=================================================================//

            async.mapSeries(files,
                function (file, callback) {
                    app.plugins.Image.minimizeOne(file, destination, defaultWidth, defaultQuality, childSettings, function (message) {
                        callback(null, message);
                    });
                },
                function (err, results) {
                    if (err) return done({status: -1, error: err});
                    done({status: 1, results: results});
                })
        }

    };

};