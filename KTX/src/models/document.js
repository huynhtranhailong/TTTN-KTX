module.exports = function(app) {

    const async = require('async');

    const schema = app.db.Schema({
        name: String,
        originalname: {type: String, default: ""},
        created: {type: Date, default: Date.now()},
        creator: {type: app.db.Schema.ObjectId, ref: 'user'},
        published: {type: Boolean, default: true},
        type:  String,
        cover: {type: Boolean, default: true}
    });


    const Document = app.db.model('document', schema);

    app.model.Document = {
        saveOne: function (document, done) {
            let newDocument = new Document(document);

            newDocument.save(function (err, document) {
                if (err) done({status: -1, error: err});
                else done({status: 1, document: document});
            })
        },
        saveMany: function (documents, done) {
            async.mapSeries(documents, function (document, callback) {
                app.model.Document.saveOne(document, function (message) {
                    callback(null, message);
                })
            }, function (err, result) {
                if (err) done({status: -1, error: err});
                else done({status: 1, documents: result});
            })
        },

        deleteOne: function (id, done) {
            Document.findById(id, function (err, document) {
                if (err) return done({status: -1, error: err});
                if (!document) return done({status: 0});

                document.remove(function (err) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1});
                })
            })
        }
        ,
        togglePublish: function (id, done) {
            Document.findById(id).exec(function (err, document) {
                if (err) return done({status: -1, error: err});
                if (!document) return done({status: 0});

                document.published = !(document.published);

                document.save(function (err, document) {
                    if (err) done({status: -1, error: err});
                    else done({status: 1, document: document});
                })
            })
        },
        getById: function (id, done) {
            Document.findById(id).populate('creator').exec(function (err, document) {
                if (err) return done({status: -1, error: err});
                if (!document) return done({status: 0});
                return done({status: 1, document: document});
            })
        },
        getAll: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const attributes        = args.shift();
            // =========================================================================================================

            let query =
                Document.find({})
                    .sort({created : -1})
                    .populate('creator');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, documents) {
                if (err) done({status: -1, error: err});
                else done({status: 1, documents: documents});
            });
        }

    }
};