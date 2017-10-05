module.exports = function(app) {

    const moment = require("moment");

    app.get('/dangkyluutru', function (req, res) {
        app.model.Config.getAll(function (data) {
            if (data.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
            const currentDate = new Date();
            const config = data.configs.find(function (x) {
                const configRegister = x.registerTime.filter(x=> moment(x.startDate) <= moment(currentDate) && moment(x.endDate) >= moment(currentDate))
                if(configRegister.length != 0) return true;
                else return false
            })
            if(config){
                app.model.Config.getCurrentSemester(function (result) {
                    if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/registerDom/view.pug', {
                        config : result.config,
                        configRegister : config,
                        accpeted : true
                    });
                });
            }else {
                app.model.Config.getCurrentSemester(function (result) {
                    if (result.status === -1) return res.send('/error/500?redirect=' + encodeURIComponent(req.originalUrl || req.url));
                    res.render('../module/registerDom/view.pug', {
                        config : result.config,
                        configRegister : '',
                        accpeted : false
                    });
                });

            }


        })

    });

};