module.exports = function(app) {
    app.get('/admin/score/config', app.authentication.isAdmin, function (req, res) {
        app.model.Config.getCurrentSemester(function (message) {
            res.render('../module/admin-score-config/view.pug', {
                pageTitle: app.title,
                session: (req.user) ? req.user.userInfo : null,
                currentConfig: message.config
            })
        })
    })
    app.post('/admin/score/config/createCriteria', app.authentication.isAdmin, function (req, res) {
        let criteria = req.body.criteria;
        let scoreMin = req.body.scoreMin;
        let scoreMax = req.body.scoreMax;
        let configId = req.body.configId;
        app.model.Config.createCriteria(configId, criteria, scoreMin, scoreMax, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
    app.post('/admin/score/config/createSubCriteria', app.authentication.isAdmin, function (req, res) {
        let criteria = req.body.criteria;
        let scoreMin = req.body.scoreMin;
        let scoreMax = req.body.scoreMax;
        let configId = req.body.configId;
        let criteriaId = req.body.criteriaId;
        app.model.Config.createSubCriteria(configId, criteriaId, criteria, scoreMin, scoreMax, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
    app.post('/admin/score/config/editCriteria', app.authentication.isAdmin, function (req, res) {
        let criteria = req.body.criteria;
        let scoreMin = req.body.scoreMin;
        let scoreMax = req.body.scoreMax;
        let configId = req.body.configId;
        let criteriaId = req.body.criteriaId;
        app.model.Config.editCriteria(configId, criteriaId, criteria, scoreMin, scoreMax, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
    app.post('/admin/score/config/editSubCriteria', app.authentication.isAdmin, function (req, res) {
        let criteria = req.body.criteria;
        let scoreMin = req.body.scoreMin;
        let scoreMax = req.body.scoreMax;
        let configId = req.body.configId;
        let criteriaId = req.body.criteriaId;
        let subCriteriaId = req.body.subCriteriaId;
        app.model.Config.editSubCriteria(configId, criteriaId, subCriteriaId, criteria, scoreMin, scoreMax, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
    app.post('/admin/score/config/deleteCriteria', app.authentication.isAdmin, function (req, res) {
        let configId = req.body.configId;
        let criteriaId = req.body.criteriaId;
        app.model.Config.deleteCriteria(configId, criteriaId, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
    app.post('/admin/score/config/deleteSubCriteria', app.authentication.isAdmin, function (req, res) {
        let configId = req.body.configId;
        let criteriaId = req.body.criteriaId;
        let subCriteriaId = req.body.subCriteriaId;
        app.model.Config.deleteSubCriteria(configId, criteriaId, subCriteriaId, function (message) {
            if(message.status == 1){
                res.redirect('/admin/score/config');
            }
        })
    });
};