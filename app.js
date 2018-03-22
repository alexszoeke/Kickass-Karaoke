var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var spotify = require('spotify');
var SpotifyWebApi = require('spotify-web-api-node');
var bodyParser = require('body-parser')

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '6b5333e36255420cbe72baede7fde86d',
  clientSecret: 'cacee0742a844488a33ad4623eeaed1c',
  redirectUri: 'http://localhost:8888/callback'
});
var client_id = '6b5333e36255420cbe72baede7fde86d'; // Your client id
var client_secret = 'cacee0742a844488a33ad4623eeaed1c'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri



/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();



// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')).use(cookieParser());

app.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  //Requesting for authorization
  var scope = 'streaming user-read-birthdate user-modify-playback-state user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

});

var access_token;
app.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log("/Callback ");
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        access_token = body.access_token,
          refresh_token = body.refresh_token;
        spotifyApi.setAccessToken(access_token);
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/home?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.post('/search', function (req, res) {
 
  console.log('test');
  console.log(req.body);
  spotifyApi.search(req.body.artist + ' ' + req.body.title, ['track'], { limit: 5, offset: 1 }, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      //console.log(data.body.tracks);
      res.json(data.body);
    }
  });
 
});

app.put('/play', function (req, res){

  console.log("In play");
  var Request = req.body;

  var play = {
    url: 'https://api.spotify.com/v1/me/player/play?device_id=' + Request.dev_id,
    method: "PUT",
    json: true,
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json',
      'Authorization': 'Bearer ' + Request.access_token  
    },
    body: {   
      data: {
        'uris' : Request.URI,
      }
    }
};

   request(play, function(error, response){
     console.log(response);
     console.log("-------------------------------------------------------------")
   });

    
})
console.log('Listening on 8888');
app.listen(process.env.PORT || 8888);
