$(document).ready(function() {
 
    statusUpload('Choose a file :)');

    var uploadform = $('#uploadForm');
 
    // Check to see when a user has selected a file                                                                                                                
    var timerId;
    timerId = setInterval(checkUpload, 500);
 
    uploadform.submit(function() {
        statusUpload('uploading the file ...');

        $(this).ajaxSubmit({                                                                                                                 
            
            dataType: 'text',
            
            error: function(xhr) {
		      statusUpload('Error: ' + xhr.status);
              //error 413 means file is too large
              resetUpload();
            },
 
            success: function(response) {
                try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                    statusUpload('Bad response from server');
                    return;
                }
                
                console.log(response);
                
                if(response.error) {
                    statusUpload('Oops, something bad happened');
                    return;
                }

                var imageUrlOnServer = response.path;
                
                resetUpload();
                
                statusUpload('Success, file uploaded to:' + imageUrlOnServer);
                $('<img/>').attr('src', imageUrlOnServer).appendTo($('body'));
            }
	});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
    });
    
    function isImage(filename) {
        var ext = filename.split('.').pop();
        switch (ext.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
            //etc
            return true;
        }
        return false;
    }

    function checkUpload() {
        if($('#userPhotoInput').val() !== '') {
            if(!isImage($('#userPhotoInput').val())){ statusUpload('this file is not an image'); return; }
            clearInterval(timerId);
            uploadform.submit();
        }
    } 

    function resetUpload() {
        uploadform.resetForm();
        timerId = setInterval(checkUpload, 500);
    }

    function statusUpload(message) {
	    $('#status').text(message);
    }
});