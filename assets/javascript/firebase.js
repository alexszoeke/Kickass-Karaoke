$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDmwvFfCQzD-Tv7TExc-qgiJTxYrb0lY-E",
    authDomain: "kickass-karaoke.firebaseapp.com",
    databaseURL: "https://kickass-karaoke.firebaseio.com",
    projectId: "kickass-karaoke",
    storageBucket: "kickass-karaoke.appspot.com",
    messagingSenderId: "483755345592"
  };
  firebase.initializeApp(config);

  // Start code here
  var refDatabase = firebase.database();
  var auth = firebase.auth();

  var email = "";
  var password = "";
  var user;
  var artistSearch = "";
  var songSearch = "";
  var userID = "";
  var userReference = "";
  var globalSearchArtist;
  var globalSearchSong;
  var arrayGlobeSearchArtist = [];
  var arrayGlobeSearchSong = [];
  var globeArtist = {};
  var globeSong = {};

  $("#register").on("click", function (event) {
    // Creating a new user
    event.preventDefault();
    console.log("register button clicked");
    email = $("#username").val().trim();
    password = $("#inputPassword2").val().trim();
    console.log(email, password);

    auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  });

  // Sign in an existing user
  $("#login").on("click", function (event) {
    event.preventDefault();
    email = $("#username").val().trim();
    password = $("#inputPassword2").val().trim();

    auth.signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

  })

  //Test if there is a user signed in
  auth.onAuthStateChanged(function (user) {
    if (user) {
      userID = user.email;
      userReference = user.uid;
      $("#register").hide();
      // $("#login").hide();
      $("#logout").show();
      console.log(user)
      console.log(user.email);
    } else {
      console.log("not logged in");
      $("#register").show();
      $("#login").show();
      $("#logout").hide();
    }
  });

  //TODO: Add sign out button to Sign out a user
  $("#logout").on("click", function () {
    event.preventDefault();
    auth.signOut().then(function () {
      console.log("signout successful");
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  });

  //saving searches to database
  $("#song-search-btn").on("click", function (event) {
    event.preventDefault();
    artistSearch = $("#artist-search").val().trim();
    songSearch = $("#title-search").val().trim();
    // refDatabase.ref("/users/").push(userReference);
    var dbUser = "/users/" + userReference + "/searches/";

    if (artistSearch !== "") {
      refDatabase.ref("/searches/artist").push(artistSearch);
      refDatabase.ref(dbUser + "artist").push(artistSearch);
    }
    if (songSearch !== "") {
      refDatabase.ref("/searches/song").push(songSearch);
      refDatabase.ref(dbUser + "song").push(songSearch);
    }
  })

  // Database listener for searches if user not signed in

  refDatabase.ref("/searches/artist").on("value", function (snapshot) {

    arrayGlobeSearchArtist = snapshotToArray(snapshot);

    globeArtist = countGlobalArtistSearch(arrayGlobeSearchArtist);

    //Sort by number of times searched
    var sortedGlobeArtist = Object.keys(globeArtist).sort(function (a, b) {
      return globeArtist[b] - globeArtist[a]
    })
    //TODO:  build for loop to use sorted artist array instead of object
    Object.keys(globeArtist).forEach(function (key) {
      var text = $("<p></p>").text(key)
      $("#recent-display").append(text);
    });

    console.log(globeArtist);

    console.log(sortedGlobeArtist);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  })

  refDatabase.ref("/searches/song").on("value", function (snapshot) {

    arrayGlobeSearchSong = snapshotToArray(snapshot);
    globeSong = countGlobalArtistSearch(arrayGlobeSearchSong);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  })



  // Append list of artist to Recent Sear


  function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  function countGlobalArtistSearch(arr) {

    var count = {};
    arr.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });
    console.log(count);
    return count;
  }

})