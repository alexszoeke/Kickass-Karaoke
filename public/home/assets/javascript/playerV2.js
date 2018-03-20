window.onSpotifyWebPlaybackSDKReady = () => {
    var player = new Spotify.Player({
        name: 'Kickass Karaoke Player',
        spotify_uri : trackURI,
        getOAuthToken: callback => {
            $.ajax ({
                url : '/refresh_token',
                data: {
                    'refresh_token': refresh_token
                  }
                }).done(function(data) {
                  access_token = data.access_token;
           
            });
            callback(access_token);
        }
    })
   
    
   player.connect().then(success => {
       if (success){
           console.log("Connection to Spotify Succeeded")
       }
   });
   
   player.addListener('ready', ({ device_id }) => {
    console.log('The Web Playback SDK is ready to play music!');
    console.log('Device ID', device_id);
  })
   
   
   $('#togglePlayer').on('click', function(){
      player.togglePlay();
      console.log(player.togglePlay());
  })
  
  };
  

  
  