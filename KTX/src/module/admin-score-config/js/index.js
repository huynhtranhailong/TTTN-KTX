$(document).ready(function () {
    $('.tree').treegrid();
});
function addCriteria(id) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'THÊM TIÊU CHÍ',
        content: '<form class="addMenu" action="/admin/score/config/createCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên tiêu chí</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="criteria"/>' +
        '</div></div>' +
            '<div class="form-group">'+
            '<div class="col-sm-6"><b>Điểm tối thiểu</b>'+
            '<div class="form-line">' +
            '<input class="form-control" type="number" name="scoreMin"/>'+
        '</div></div>'+
            '<div class="col-sm-6"><b>Điểm tối đa</b>' +
            '<div class="form-line">' +
            '<input class="form-control" type="number" name="scoreMax"/>'+
            '<input class="form-control hidden" type="text"  name="configId" value="' + id + '"/>' +
        '</div></div>'+
        '</div>'+
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'THÊM',
                btnClass: 'btn-blue',
                action: function () {
                    var scoreMin = $("input[name='scoreMin']").val();
                    var scoreMax = Number($("input[name='scoreMax']").val());
                    var criteria = Number($("input[name='criteria']").val());
                    if(criteria.length <= 0 || scoreMax.length == 0 || scoreMin.length == 0){
                        $.alert('Các trường không được để trống.');
                        return false;
                    } else if (scoreMax < 0 || scoreMin < 0){
                        $.alert('Điểm số phải là số nguyên không âm.');
                        return false;
                    }else if(scoreMin > scoreMax){
                        $.alert('Điểm tối đa không được nhỏ hơn điểm tối thiểu.');
                        return false;
                    }else {
                        $(".addMenu")[0].submit();
                    }
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}

function addSubCriteria(id, criteriaId ) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'THÊM TIÊU CHÍ CON',
        content: '<form class="addMenu" action="/admin/score/config/createSubCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên tiêu chí</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="criteria"/>' +
        '</div></div>' +
        '<div class="form-group">'+
        '<div class="col-sm-6"><b>Điểm tối thiểu</b>'+
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMin"/>'+
        '</div></div>'+
        '<div class="col-sm-6"><b>Điểm tối đa</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMax"/>'+
        '<input class="form-control hidden" type="text"  name="configId" value="' + id + '"/>' +
        '<input class="form-control hidden" type="text"  name="criteriaId" value="' + criteriaId + '"/>' +
        '</div></div>'+
        '</div>'+
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'THÊM',
                btnClass: 'btn-blue',
                action: function () {
                    var scoreMin = $("input[name='scoreMin']").val();
                    var scoreMax = Number($("input[name='scoreMax']").val());
                    var criteria = Number($("input[name='criteria']").val());
                    if(criteria.length <= 0 || scoreMax.length == 0 || scoreMin.length == 0){
                        $.alert('Các trường không được để trống.');
                        return false;
                    } else if (scoreMax < 0 || scoreMin < 0){
                        $.alert('Điểm số phải là số nguyên không âm.');
                        return false;
                    }else if(scoreMin > scoreMax){
                        $.alert('Điểm tối đa không được nhỏ hơn điểm tối thiểu.');
                        return false;
                    }else {
                        $(".addMenu")[0].submit();
                    }
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}

function editCriteria(id, criteriaId, criteria, scoreMin, scoreMax ) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'CHỈNH SỬA TIÊU CHÍ',
        content: '<form class="addMenu" action="/admin/score/config/editCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên tiêu chí</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="criteria" value="' + criteria + '"/>' +
        '</div></div>' +
        '<div class="form-group">'+
        '<div class="col-sm-6"><b>Điểm tối thiểu</b>'+
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMin"  value="' + scoreMin + '"/>' +
        '</div></div>'+
        '<div class="col-sm-6"><b>Điểm tối đa</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMax"  value="' + scoreMax + '"/>' +
        '<input class="form-control hidden" type="text"  name="configId" value="' + id + '"/>' +
        '<input class="form-control hidden" type="text"  name="criteriaId" value="' + criteriaId + '"/>' +
        '</div></div>'+
        '</div>'+
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'LƯU THAY ĐỔI',
                btnClass: 'btn-blue',
                action: function () {
                    var scoreMin = $("input[name='scoreMin']").val();
                    var scoreMax = Number($("input[name='scoreMax']").val());
                    var criteria = Number($("input[name='criteria']").val());
                    if(criteria.length <= 0 || scoreMax.length == 0 || scoreMin.length == 0){
                        $.alert('Các trường không được để trống.');
                        return false;
                    } else if (scoreMax < 0 || scoreMin < 0){
                        $.alert('Điểm số phải là số nguyên không âm.');
                        return false;
                    }else if(scoreMin > scoreMax){
                        $.alert('Điểm tối đa không được nhỏ hơn điểm tối thiểu.');
                        return false;
                    }else {
                        $(".addMenu")[0].submit();
                    }
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}

function editSubCriteria(id, criteriaId, subCriteriaId, criteria, scoreMin, scoreMax ) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'CHỈNH SỬA TIÊU CHÍ CON',
        content: '<form class="addMenu" action="/admin/score/config/editSubCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Tên tiêu chí</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="text" name="criteria" value="' + criteria + '"/>' +
        '</div></div>' +
        '<div class="form-group">'+
        '<div class="col-sm-6"><b>Điểm tối thiểu</b>'+
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMin"  value="' + scoreMin + '"/>' +
        '</div></div>'+
        '<div class="col-sm-6"><b>Điểm tối đa</b>' +
        '<div class="form-line">' +
        '<input class="form-control" type="number" name="scoreMax"  value="' + scoreMax + '"/>' +
        '<input class="form-control hidden" type="text"  name="configId" value="' + id + '"/>' +
        '<input class="form-control hidden" type="text"  name="criteriaId" value="' + criteriaId + '"/>' +
        '<input class="form-control hidden" type="text"  name="subCriteriaId" value="' + subCriteriaId + '"/>' +
        '</div></div>'+
        '</div>'+
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'LƯU THAY ĐỔI',
                btnClass: 'btn-blue',
                action: function () {
                    var scoreMin = $("input[name='scoreMin']").val();
                    var scoreMax = Number($("input[name='scoreMax']").val());
                    var criteria = Number($("input[name='criteria']").val());
                    if(criteria.length <= 0 || scoreMax.length == 0 || scoreMin.length == 0){
                        $.alert('Các trường không được để trống.');
                        return false;
                    } else if (scoreMax < 0 || scoreMin < 0){
                        $.alert('Điểm số phải là số nguyên không âm.');
                        return false;
                    }else if(scoreMin > scoreMax){
                        $.alert('Điểm tối đa không được nhỏ hơn điểm tối thiểu.');
                        return false;
                    }else {
                        $(".addMenu")[0].submit();
                    }
                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}

function deleteCriteria(configId, criteriaId, criteria) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'XÓA TIÊU CHÍ',
        content: '<form class="deleteParentMenu" action="/admin/score/config/deleteCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Bạn có chắc chắn muốn xóa </b>' + '<span class="col-red">' + " " + criteria + '</span>'  +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="criteriaId" value="' + criteriaId + '"/>' +
        '</div></div></form>',
        buttons: {
            formSubmit: {
                text: 'XÓA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".deleteParentMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}

function deleteSubCriteria(configId, criteriaId, subCriteriaId, subCriteria) {
    $.confirm({
        columnClass: 'col-md-5 col-md-offset-4 col-xs-8 col-xs-offset-4',
        title: 'XÓA TIÊU CHÍ CON',
        content: '<form class="deleteChildMenu" action="/admin/score/config/deleteSubCriteria" method="post">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<b>Bạn có chắc chắn muốn xóa </b>' + '<span class="col-red">' + " " + subCriteria + '</span>'  +
        '<input class="form-control hidden" type="text"  name="configId" value="' + configId + '"/>' +
        '<input class="form-control hidden" type="text"  name="criteriaId" value="' + criteriaId + '"/>' +
        '<input class="form-control hidden" type="text"  name="subCriteriaId" value="' + subCriteriaId + '"/>' +
        '</div></div></form>',
        buttons: {
            formSubmit: {
                text: 'XÓA',
                btnClass: 'btn-blue',
                action: function () {
                    $(".deleteChildMenu")[0].submit();

                }
            },
            cancel: {
                text: "HỦY"
                //close
            },
        }
    });
}