$(document).ready(function () {

    $("select").selectpicker();

    CKEDITOR.replace('ckeditor', {
        toolbar: [
            { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
            { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
            { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
            { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
            { name: 'insert', items: [ 'Table' ] },
            { name: 'tools', items: [ 'Maximize' ] },
            { name: 'editing', items: [ 'Scayt' ] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor']}
        ],
        language: 'vi'
    });

    CKEDITOR.config.allowedContent = true;

    CKEDITOR.config.height = 500;

    var imgTable = $("#imgTable").DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Thêm ảnh',
                className : 'blue',
                action: function ( e, dt, node, config ) {
                    alert( 'Button activated' );
                }
            }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        },
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,
    });


    var coverTable = $("#coverTable").DataTable({
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        },
        buttons: [
            {
                text: 'My button',
                action: function ( e, dt, node, config ) {
                    alert( 'Button activated' );
                }
            }
        ]
    });


    var fileTable = $("#fileTable").DataTable({
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        },
        buttons: [
            {
                text: 'My button',
                action: function ( e, dt, node, config ) {
                    alert( 'Button activated' );
                }
            }
        ]
    });

    $("#hotNews").click(function () {
        $("input[name=cover]").attr('required', function (_, attr) {
            return !attr
        });
    })

    $("input[name='newsType']").change(function () {
        $("#inside").toggleClass("hidden");
        $("#outside").toggleClass("hidden");
    });


})

function setCover(imgName) {
    $("input[name=cover]").val(imgName);
    $(".imageSelection img:first-child").attr('src', '/document/image/cover/' + imgName);
    $("#coverModal").modal("toggle");
}

function insertImage(imgName) {
    var img = "<p style='text-align: center'><img class='img-responsive' src='/document/image/" + imgName + "'/></p>";
    img = CKEDITOR.dom.element.createFromHtml(img);
    CKEDITOR.instances.ckeditor.insertElement(img);
    $("#imageModal").modal("toggle");
}

function insertFile(fileName, fileOriginalName) {
    var file = "<a href='/admin/document/downloadFile/"+ fileName + '/' + fileOriginalName + "'>" + fileOriginalName + "</a>";
    file = CKEDITOR.dom.element.createFromHtml(file);
    CKEDITOR.instances.ckeditor.insertElement(file);
    $("#fileModal").modal("toggle");
}
