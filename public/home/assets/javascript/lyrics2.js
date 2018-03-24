// To hold the response from the user search after the call to our backend responds with the track information 
var spotRes;
// To hold the track URI 
var trackURI;
var currentArtist;
var currentTrack;

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
            $("#copyright").text("© " + response.result.copyright.artist);
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


// Loging out
$("#spotify-login").on('click', function(){
  $.ajax({
    url : "/clearcookie",
    success : function(data){

      console.log(data);
      document.location.href = document.location.hostname + 'login';
    }
  })
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

      displaySong(spotRes.tracks.items); // Puts the array of the song items into the function find song
      console.log(response);
    }
  })
};

// Function to find the song we're looking for
function displaySong(songs){
 //Saves the first song's variables into their corresponding variables
 trackURI = songs[0].uri;
 currentArtist = songs[0].artists[0].name;
 currentTrack = songs[0].name;
 console.log(trackURI);
 // Pushes the trackURI to be played
 pushTrack(trackURI);

 // Prints out the according variables to the corresponding places
 $("#song").text(currentTrack + " ");
 $("#artist").text(currentArtist);

 //On-click events to allow users to choose which mirrors the user can play
 $(".mirror-btn").on('click', function(e){
    var mirrorNum = $(this).val();
    trackURI = songs[mirrorNum].uri;
    currentArtist = songs[mirrorNum].artists[0].name;
    currentTrack = songs[mirrorNum].name
    $("#song").text(currentTrack + " ");
    $("#artist").text(currentArtist);
    console.log(trackURI);
    pushTrack(trackURI);
 });

 //Add the on-click event to allow user to pause and play the track
 $("#play-pause").on('click', function(e){
  player.togglePlay();
});
};

//Function to push the trackURI to be played on the player
function pushTrack(URI){

  fetch('https://api.spotify.com/v1/me/player/play?device_id=' + dev_id ,{
    method: 'PUT',
    body: JSON.stringify({ uris: [URI] }),
    headers : {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
 

 

};


// Function to change the volume of the player
function SetVolume(val){

  var volume = val / 100;
  player.setVolume(volume);
};





