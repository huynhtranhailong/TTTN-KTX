$(document).ready(function () {
    Dropzone.options.frmFileUpload = {
        paramName: "files",
        maxFilesize: 10,
        maxFiles: 10,
        parallelUploads : 10,
        uploadMultiple: true,

        //acceptedFiles: "image/jpeg,image/png,image/gif",
        success: function (file, responseText) {
            window.location.href = responseText;
        }
    };
});