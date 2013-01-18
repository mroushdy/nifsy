function GetBatchMutualFriends(FBids, accessToken) {
  var requests = [];
  for (var i = 0; i < FBids.length; i++) {
    var request = {
      "method":"GET",
      relative_url: '/me/mutualfriends/' + FBids[i]
    }
    requests.push(request);
  }

  FB.api("/", "POST", {
          access_token: accessToken,
          batch: requests
  }, function(response) {
          if (!response || response.error) {
                  console.log(response.error_description);
          } else {       
                  /*
                  *       Iterate through each Response
                  */
                  for(var i=0,l=response.length; i<l; i++) {
                          /*
                          *       If we have set 'omit_response_on_success' to true in the Request, the Response value will be null, so continue to the next iteration
                          */
                          if(response[i] === null) continue;
                         
                          /*
                          *       Else we are expecting a Response Body Object in JSON, so decode this
                          */
                          var responseBody = JSON.parse(response[i].body);
                         
                          /*
                          *       If the Response Body includes an Error Object, handle the Error
                          */
                          if(responseBody.error) {
                                  // do something useful here
                                  console.log(responseBody.error.message);
                          }
                          /*
                          *       Else handle the data Object
                          */
                          else {
                                  // do something useful here
                                  console.log(responseBody.data);
                          }
                  }                                              
          }              
  });
}