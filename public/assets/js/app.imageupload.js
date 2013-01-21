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
              resetUpload()
            },
 
            success: function(response) {
                try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                    statusUpload('Bad response from server');
                    return;
                }

                if(response.error) {
                    statusUpload('Oops, something bad happened');
                    return;
                }

                var imageUrlOnServer = response.path;
                
                resetUpload()
                
                statusUpload('Success, file uploaded to:' + imageUrlOnServer);
                $('<img/>').attr('src', imageUrlOnServer).appendTo($('body'));
            }
	});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
    });
    
    function checkUpload() {
        if($('#userPhotoInput').val() !== '') {
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