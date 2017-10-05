module.exports = function(app) {

    app.get('/dang-ky-luu-tru',app.authentication.isAuthenticated, function (req, res) {
            //console.log(req.user.userInfo)
            app.model.Config.getAll(function (message) {
                var currentDate = new Date()
                app.model.Config.getCurrentSemester(function (data) {
                    app.model.Register.getRegisterByIdUser(req.user.userInfo._id , function (register) {
                        res.render('../module/reservation/view.pug', {
                            pageTitle: app.title,
                            session: req.user.userInfo,
                            configs : message.configs,
                            currentDate : currentDate,
                            config : data.config,
                            registers : register.registers
                        });
                    })

                })
             })
    });
    app.get('/admin/register/getDescription/:data',app.authentication.isAuthenticated ,function (req,res) {
        const data = req.params.data;
        console.log(data)
        app.model.Config.getDecription(data , function (message) {
            res.send(message);
        })
    })
    app.post('/admin/register/create/:roomType/:registerTime' ,app.authentication.isAuthenticated,function (req,res) {
        const roomType = req.params.roomType;
        const registerTime = req.params.registerTime;

        app.model.Register.createOneByRegisterTime(roomType , registerTime , req.user.userInfo, function (message) {
            res.send(message);
        })
    })
    app.get('/admin/register/remove/:_id1/:_id2' , app.authentication.isAuthenticated , function (req,res) {
        const _idRegister = req.params._id1
        const _idListUser = req.params._id2
        console.log(_idRegister)
        console.log(_idListUser)
        app.model.Register.removeRegisterUser(_idRegister , _idListUser , function (message) {
            res.send(message);
        })
    })
};