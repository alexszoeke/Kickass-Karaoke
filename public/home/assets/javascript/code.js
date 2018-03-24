
/**
* Obtains parameters from the hash of the URL
* @return Object
*/



var userSpotifyEmail;
var spotifyUserID;
var spotifyDisplayName;
var userType;

var url = new URL(window.location.href);
var access_token = url.searchParams.get("access_token");
var refresh_token = url.searchParams.get("refresh_token");
console.log("Access_token "  + access_token);
        if (access_token) {

          $.ajax({
              url: 'https://api.spotify.com/v1/me',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                  console.log(response);
                userSpotifyEmail = response.email;
                spotifyUserID = response.id;
                spotifyDisplayName = response.display_name;
                userType = response.product;
              }
          });
        };



