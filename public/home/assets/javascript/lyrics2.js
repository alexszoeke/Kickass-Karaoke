var spotRes;
var trackURI;
//Capture User input
$("#song-search-btn").on("click", function(event){
    event.preventDefault();
    var artistSearch = $("#artist-search").val();
    var titleSearch = $("#title-search").val();



      var queryURL = "https://orion.apiseeds.com/api/music/lyric/" + artistSearch + "/" + titleSearch + "?apikey=0h9uFKahJatBRHJodKUdrmqLEqp360ySpHaaFMeAgVoi4jPViLLQaYTIhdGyPjQm";

      $.ajax({
        url: queryURL,
        method: "GET",
        success: function (response) {
            console.log(response);
        
            //for loop or replace for the entire string to make them new lines
            var fix = response.result.track.text;
            while (fix.indexOf("\n") !== -1) {
              fix = fix.replace("\n", "<br>")
        
            }
        
            $("#lyrics-display").html(fix);
            console.log(response.result.track.text.indexOf("\n"))
            callSpotify(artistSearch, titleSearch);
            
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $("#lyrics-display").html("This song is not available. Please try another song!");
            
          }

    });


});


function callSpotify(artist, title){

  $.ajax({
    url: '/search',
    method: 'POST',
    dataType: "JSON",
    data: {artist, title},
    success: function(response){
      console.log("In response");
      spotRes = response;
      findSong(spotRes.tracks.items);
      console.log(response);
    }
  })
};

function findSong(songs){
// var indexArtist;
// var indexTitle;
 trackURI = songs[0].uri;
 console.log(trackURI);
 
 $("#spotPlayer").html('<iframe src="https://open.spotify.com/embed?access_token=' + access_token + '&uri=' + trackURI + '" frameborder="0" allow="encrypted-media" allowtransparency="true"></iframe>');


  // for (var i = 0; indexArtist != artist && indexTitle != title; i++){
  //   indexArtist = songs[i].artist[0].name;
  //   indexTitle = song[i].name;
  //   trackURI = song[i].uri;
  // }

  // console.log(indexArtist + ' ' + indexTtitle + ' ' + trackURI);
}







