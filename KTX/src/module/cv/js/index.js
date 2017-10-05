$(document).ready(function () {
    $('.date').inputmask('dd/mm/yyyy', {placeholder: '__/__/____'});

    $("select").select2({language: "vi"});

    var info = JSON.parse($("#myInfo").val());

    $("#birthplace .province").dvhcvn({onlyProvince: (info.details) ? ((info.details.birthplace) ? info.details.birthplace : 79) : 79});

    $("#permanentAddress .commune").dvhcvn({commune: (info.details) ? ((info.details.permanentAddress) ? (info.details.permanentAddress.communeId ? info.details.permanentAddress.communeId : 27169)  : 27169) : 27169});

    $("#temporaryAddress .commune").dvhcvn({commune: (info.details) ? ((info.details.temporaryAddress) ? (info.details.temporaryAddress.communeId ? info.details.temporaryAddress.communeId : 27169): 27169) : 27169});

    $("#idCardPlace .province").dvhcvn({onlyProvince: (info.details) ? ((info.details.identityCard) ? (info.details.identityCard.place ? info.details.identityCard.place :79) : 79) : 79});

    $("#permanentAddress .province").on('select2:select', function (evt) {
        var newValue = $(this).val();

        $(this).dvhcvn({province: newValue});
    });

    $("#permanentAddress .district").on('select2:select', function (evt) {
        var newValue = $(this).val();

        $(this).dvhcvn({district: newValue});
    });

    $("#temporaryAddress .province").on('select2:select', function (evt) {
        var newValue = $(this).val();

        $(this).dvhcvn({province: newValue});
    });

    $("#temporaryAddress .district").on('select2:select', function (evt) {
        var newValue = $(this).val();

        $(this).dvhcvn({district: newValue});
    });
});
