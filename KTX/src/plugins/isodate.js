module.exports = function(app) {

    app.plugins.ISODate = {
        parse: function (dateString) {
            const dateArray = dateString.split('/');
            const result = new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
            return isNaN(result.getTime()) ? null : result;
        }
        ,
        stringify: function(date) {
            date = new Date(date);

            return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
        }
    }

};