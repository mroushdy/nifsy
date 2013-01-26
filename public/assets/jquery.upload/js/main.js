/*
 * jQuery File Upload Plugin JS Example 7.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global $, window, document */

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '/listings/photos/upload',
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );

    var error = false;
    $('#fileupload').bind('fileuploadadded', function (e, data) {
        if(error) {
            $('.alert-error').addClass('hide');
        }
        $.each(data.files, function (index, file) {
            if(file.error == "Filetype not allowed") {
                $('#error-wrong-file-type').removeClass('hide');
                error = true;
            } else if(file.error == "File is too big") {
                $('#error-file-too-large').removeClass('hide');
                error = true;
            }
        });
    });

    $('#fileupload').fileupload('option', {
        maxFileSize: 2000000,
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        process: [
            {
                action: 'load',
                fileTypes: /^image\/(gif|jpeg|png)$/,
                maxFileSize: 2000000 // 2MB
            },
            {
                action: 'resize',
                maxWidth: 1440,
                maxHeight: 900
            },
            {
                action: 'save'
            }
        ]
    });

    $("#next").click(function() {
        if($('.files li').length > 0) {
            //redirect
        } else {
            $('#no-images-added').modal('show');
        }
    });

/*
    // Load existing files:
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: $('#fileupload').fileupload('option', 'url'),
        dataType: 'json',
        context: $('#fileupload')[0]
    }).done(function (result) {
        $(this).fileupload('option', 'done').call(this, null, {result: result});
    });
*/

});
