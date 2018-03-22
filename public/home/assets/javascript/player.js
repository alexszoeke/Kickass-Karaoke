
var dev_id;
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
    dev_id = device_id;
    console.log('Device ID', device_id);
  })

  player.getCurrentState().then(state => {
    if (!state) {
      console.error('User is not playing music through the Web Playback SDK');
      return;
    }
  
    let {
      current_track,
      next_tracks: [next_track]
    } = state.track_window;
  
    console.log('Currently Playing', current_track);
    console.log('Playing Next', next_track);
  });

  
  };
  

  
  