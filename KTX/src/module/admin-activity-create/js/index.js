$(document).ready(function () {
    $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
    $('.time24').inputmask('hh:mm', { placeholder: '__:__ _m', alias: 'time24', hourFormat: '24' });


    $("input[name='time-type']").change(function () {
        var $singleDay = $("#singleDayDetails");
        var $multipleDays = $("#multipleDaysDetails");
        $singleDay.toggleClass("hidden");
        $multipleDays.toggleClass("hidden");
        $singleDay.find('input').attr('required', function(_, attr){ return !attr});
        $multipleDays.find('input').attr('required', function(_, attr){ return !attr});
    });

    $("select[name='category']").change(function () {
        var $this = $(this);
        $.post('/admin/activity/id/get', {category: $this.val().toString()}, function (data, success) {
            if (data.status === -1) return sweetAlert("Oops...", "Đã xảy ra lỗi trong quá trình cấp phát mã số!", "error");
            $("input[name='id']").val(data.id.toString());
        });
    });



    var imgTable = $("#imgTable").DataTable({
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        select: {
            style: 'single',
            selector: 'td:first-child'
        },
        order: [[1, 'asc']]
    });


    $("#imageModal button:first-child").click(function () {
        var imgName = imgTable.rows({selected: true}).data()[0][2];
        $(".imageSelection img").attr('src', '/media/img/gallery/' + imgName);
        $("input[name=cover]").val(imgName);
        $("#imageModal").modal("toggle");
    })

})