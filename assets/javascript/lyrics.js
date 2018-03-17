$(".song-search-btn").on("click", function(event){
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
            
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $("#lyrics-display").html("This song is not available. Please try another song!");
            
          }


    });
});

