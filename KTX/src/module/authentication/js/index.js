$(document).ready(function () {
    
    $.post('/test/getAllStudents', function (data, success) {
        if (success) {
            $.each(data.studentsInfo, function (index, item) {
                var row =
                    "<tr>" +
                        "<td>" + item.id + "</td>" +
                        "<td>" + item.name + "</td>" +
                        "<td>" + (item.gender ? "Male" : "Female") + "</td>" +
                    "</tr>";
                $("#studentInfoTable > tbody").append(row);
            });
        }
    })
    $("#saveStudent").click(function () {
        var studentInfo = parseInForm("#inputStudentInfo");

        $.post('/test/addStudent', studentInfo, function (data, success) {
            if (success)
                alert("Thêm sinh viên thành công");
            else alert("Thêm sinh viên thất bại");
        });
    });

    $("#inputId2").keyup(function (event) {
        if (event.keyCode == 13)
            alert("Duy");
    })
});

function parseInForm(formId) {
    var url = $(formId).serialize();

    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = decodeURIComponent(hash[1]);
    }
    return myJson;
}