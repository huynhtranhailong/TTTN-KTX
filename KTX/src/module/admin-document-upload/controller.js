module.exports = function(app) {

    app.get('/admin/document/upload', app.authentication.isLevelThreeUserOrUpper,
        function (req, res) {
                res.render('../module/admin-document-upload/view.pug', {
                    pageTitle: app.title,
                    session: req.user.userInfo
            })
        });

    app.post('/admin/document/upload', app.authentication.isLevelThreeUserOrUpper,
        app.plugins.Upload.multipleByDestination('/temp'),
        function (req, res) {
            const files = req.files;
            files.forEach(function (file) {
                if(file.mimetype.indexOf("image") != -1){
                    app.plugins.Image.minimizeOne(file, "/document/image", 800, 60, function (message) {
                        if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                        const document = {
                            name : message.file,
                            originalname : file.originalname,
                            created : Date.now(),
                            creator : req.user.userInfo,
                            published : true,
                            cover : message.cover,
                            type : 'image'
                        }
                        app.model.Document.saveOne(document, function (message) {
                            if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                            app.fs.unlinkSync(file.path);
                        })
                    });
                    }
                    else{
                        app.fs.renameSync(file.path , app.publicPath+ '/document/file/'+ app.path.basename(file.path))
                        const document = {
                            name : app.path.basename(file.path),
                            originalname : file.originalname,
                            created : Date.now(),
                            creator : req.user.userInfo,
                            published : true,
                            cover : false,
                            type : 'file'
                        }
                        app.model.Document.saveOne(document, function (message) {
                            if (message.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                            //app.fs.unlinkSync(file.path);
                        })
                }
            })
            res.send('/admin/document/upload');
        })
};