
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

                if (userType != "premium"){
                  var sorryDiv = $("<div>").attr({
                    id : "sorry-div",
                    class : "row"
                  });
                  var sorry = $("<h4>").text("Sorry, your spotify account is not premium, so music play back is not possible. Please log-in with a premium spotify account.")
                  var spotLoginBtn = $("<a>").attr({
                    id : "spotify-login",
                    href : "/login",
                    class : "btn btn-primary mb-2"
                  }).text("Login with new spotify account");
                  $(sorryDiv).append(sorry);
                  $(sorryDiv).append(spotLoginBtn);

                  $("#main-display").html(sorryDiv);
                }
              }
          });
        };



