
/**
* Obtains parameters from the hash of the URL
* @return Object
*/

var userDisplayNameSource = document.getElementById('user-name-template').innerHTML,
    userDisplayNameTemplate = Handlebars.compile(userDisplayNameSource),
    userDisplayNamePlaceholder = document.getElementById('display-name')


var url = new URL(window.location.href);
var access_token = url.searchParams.get("access_token");
    refresh_token = url.searchParams.get("refresh_token");

        if (access_token) {

          $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                  console.log(response);
                userDisplayNamePlaceholder.innerHTML = userDisplayNameTemplate(response);

              }
          });
        };



