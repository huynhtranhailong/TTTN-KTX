module.exports = function(app) {
    var moment = require('moment');

    var schema = app.db.Schema({
        listUser : [Object({
            user : {type : app.db.Schema.ObjectId, ref : 'user'},
            roomType : String,
            date : Date,
            status : String,

        })
        ]
    });

    const Register = app.db.model('register', schema);

    app.model.Register = {
        createOne: function (done) {
            let thisRegister = new Register();
            thisRegister.save(function (err, register) {
                if (err) done({status: -1, error: err});
                else return done({status: 1, register: register})
            })
        },
        removeById: function (id, done) {
            Register.findByIdAndRemove(id, function (err,register) {
                if (err) done({status: -1, error: err});
                else return done({status: 1})
            })
        }
        //Bầu viết
        ,
        createOneByRegisterTime: function (roomType , registerTime  , userInfo, done) {
            app.model.Config.getAll(function ( message) {
                var data = message.configs.map(x=>x.registerTime.filter(x => x._id == registerTime ))
                //console.log(registerTime)
                var temp = data.filter(x=> x != '')
                //console.log(test);
                const listUserRegister = temp[0][0].listUserRegister;
                //console.log(listUserRegister);
                Register.findOne({_id : listUserRegister} , function (err, register) {
                    if(!err){
                        //console.log(register.listUser)
                        //console.log(userInfo);
                        var temp = register.listUser.filter(x=>x.user == userInfo._id)
                        //console.log(temp);
                        if(temp.length == 0) {
                            var date = new Date();
                            var data = {user: userInfo, roomType: roomType, date: date, status: '0'};
                            register.listUser.push(data)
                            register.save(function (err, register) {
                                console.log('lol');
                                if (err) done({status: -1, error: err});
                                else done({status: 1, register: register});
                            })
                        }
                        else{
                            done({status : -1});
                        }
                    }
                })

            })
        },
        getRegisterByIdUser: function (idUser , done) {
            Register.find({} , function (err , registers) {
                if(!err){
                    var result = registers.map(function (x) {
                        var temp = x.listUser.filter(y=> y.user == idUser)
                        if(temp.length != 0){
                            return Object({ _id : x._id, listUser : temp})
                        }else return null
                    }).filter(y => y!= null)
                    //console.log(result);
                    done({status: 1 , registers : result});
                    // var temp = registers.map(x=>x.listUser.filter(y=>y.user == idUser)).filter(z=>z != '')
                    //  console.log(temp);
                    //  done({status: 1 , registers : temp})
                }
            })
        },
        removeRegisterUser : function (_idRegister,_idListUser , done) {
            Register.findOne({_id : _idRegister } , function (err ,register) {
                if(!err){
                    var temp =register.listUser.findIndex(x=>x._id == _idListUser)
                    console.log(temp)
                    console.log(register.listUser[temp]);
                    register.listUser.splice(temp, 1);
                    register.save(function (err, register) {
                        console.log('lol');
                        if (err) done({status: -1, error: err});
                        else done({status: 1, register: register});
                    })
                }
            })
        },
        getAll: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Register.find({})
            if (attributes)
                query.select(attributes);

            query.exec(function (err, registers) {
                if (err) done({status: -1, error: err});
                else done({status: 1, registers: registers});
            });
        },
        // Của rô
        getById: function () {
            const args = new Array(arguments.length).fill(null).map((value, index) => arguments[index]);
            // Arguments list ==========================================================================================
            const done              = args.pop();                                                   // Callback function
            const id                = args.shift();
            const attributes        = args.shift();
            // =========================================================================================================

            let query = Register.findById(id).populate('listUser.user');

            if (attributes)
                query.select(attributes);

            query.exec(function (err, register) {
                if (err) done({status: -1, error: err});
                else done({status: 1, register: register});
            });
        },
        updateStatus: function (data, done) {
            Register.findById(data.registerId, function (err, register) {
                if (err) done({status: -1, error: err});
                else {
                    const Index = register.listUser.findIndex(x => x._id == data.rowId);
                    if (register.listUser[Index].status == '1')
                        register.listUser[Index].status = '0';
                    else
                        register.listUser[Index].status = '1';
                    register.save(function (err, register) {
                        if (err) done({status: -1, error: err});
                        else done({status: 1, register: register});
                    })
                }
            })
        },
        finishChecking: function (registerID, done) {
            Register.findById(registerID, function (err, register) {
                if (err) done({status: -1, error: err});
                else {
                    var users = register.listUser.map(function (x,index) {
                        if(x.status != "1"){
                            register.listUser[index].status = "-1";
                        }
                    })
                    register.save(function (err, register) {
                        if (err) done({status: -1, error: err});
                        else done({status: 1});
                    })
                }
            })
        }
    }
}
