$(document).ready(function () {
    $("table").DataTable( {
        responsive: true,
        pageLength: 50,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Vietnamese.json"
        }

    });

    $("select").select2({language: "vi"});

});