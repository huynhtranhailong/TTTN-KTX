module.exports = function(app) {

    const xlsx2json = require('xlsx-json');

    app.plugins.Excel = {
        getInfoByObjectArrayWithHeader: function (pathToExcelFile, workSheetName, done) {
            xlsx2json([{input: pathToExcelFile, sheet: workSheetName}], function (err, jsonArr) {
                if (err) done({status: -1, error: err});
                done({status: 1, data: Object.keys(jsonArr[0]).map(x => jsonArr[0][x])});
            })
        }
    }

};