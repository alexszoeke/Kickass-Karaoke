var videoID;

var search = ;

$.get(
   'https://www.googleapis.com/youtube/v3/search',{

    key: 'AIzaSyCYpdXnHYT5L9Fcx2YJNXGmExFcFygTvGA',
    maxResults: 10,
    part : 'snippet',
    q : search,
    type : 'video'
    },
    function(data){
        console.log(data.items)
        
        addPlayer(data.items[1].id.videoId);
        var tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api";

      
    }

    
);



function addPlayer(ID){
    $("#ytplayer").attr({
        src : 'https://www.youtube.com/embed/'+ ID +'?fs=0&rel=0&showinfo=0&autoplay=1&controls=0fs=0&cc_load_policy=0'});

};