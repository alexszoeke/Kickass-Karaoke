// To hold the response from the user search after the call to our backend responds with the track information 
var spotRes;
// To hold the track URI 
var trackURI;

//Capture User input 
$("#song-search-btn").on("click", function(event){
    // Prevent the page from refreshing
    event.preventDefault();
    // Captures the artist val
    var artistSearch = $("#artist-search").val();
    // Captures the title val
    var titleSearch = $("#title-search").val();
    // Captures the artist val
    $("#artist-search").val("");
    // Captures the title val
    $("#title-search").val("");


      // Building the queryURL for the call to the lyrics API
      var queryURL = "https://orion.apiseeds.com/api/music/lyric/" + artistSearch + "/" + titleSearch + "?apikey=0h9uFKahJatBRHJodKUdrmqLEqp360ySpHaaFMeAgVoi4jPViLLQaYTIhdGyPjQm";
      // Ajax call to the lyrics API
      $.ajax({
        url: queryURL,
        method: "GET",
        success: function (response) {
        
            //for loop to replace the js /n with <br> the entire string to make them new lines in html
            var fix = response.result.track.text;
            while (fix.indexOf("\n") !== -1) {
              fix = fix.replace("\n", "<br>")
        
            }
            // Displays the lyrics
            $("#lyrics-display").html(fix);
            console.log(response.result.track.text.indexOf("\n"))
            // Pushing the artist and title into the function callSpotify
            callSpotify(artistSearch, titleSearch);
            
          },
          error: function (xhr, ajaxOptions, thrownError) {
            // In case the song is not avaiable in the Lyrics API
            $("#lyrics-display").html("This song is not available. Please try another song!");
            
          }
    });
});

//clearing lyrics on log out
$("#logout").on("click", function(event){
  $("#lyrics-display").empty();
});

// Function to go into our back-end js to get the spotifiy information for our track
function callSpotify(artist, title){

  $.ajax({
    url: '/search', // Goes into our backend in the '/search' path
    method: 'POST', 
    dataType: "JSON",
    data: {artist, title}, // Passes the data of the artist and title into our backend
    success: function(response){ // The response of our backend
      console.log("In response"); // To make sure we're in the response
      spotRes = response; // Holding the response into the variable spotRes

      findSong(spotRes.tracks.items); // Puts the array of the song items into the function find song
      console.log(response);
    }
  })
};

// Function to find the song we're looking for
function findSong(songs){
 //Saves the first song's uri into the variabel trackURI
 trackURI = songs[0].uri;
 console.log(trackURI);
 pushURI(trackURI);
 
 };

//Function to push the trackURI into our back-end

function pushURI(URI){

//   $.ajax({
//     method: 'PUT',
//     url: 'https://api.spotify.com/v1/me/player/play?device_id=' + dev_id,    
//     data: {
//       context_uri : URI,
//       offset: {
//         position: 5
//       }
//     },
//     headers: {
//       'Accept' : 'application/json',
//       'Content-Type' : 'application/json',
//       'Authorization': "Bearer " + access_token  
//     },
//     success: function(response){
//       console.log("Success in call to player");
//       console.log(response);
//     },
//     error: function(err){
//       console.log('Error : ' + err);
//     }
// });

  $.ajax({
    url: '/play', //Call to our backend in the '/play' path
    method: 'PUT',
    dataType: 'JSON',
    data: {URI, dev_id, access_token}, // Pushes the track URI the device ID and the access_token into our call to our backend
    success: function(response){
      console.log("Response successful");
      console.log(response);
    }, 
  })

}






