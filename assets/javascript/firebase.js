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
  var artistSongSearch = "";
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
      $("#login").hide();
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
    artistSongSearch = artistSearch + ": " + songSearch;
    // refDatabase.ref("/users/").push(userReference);
    var dbUser = "/users/" + userReference + "/searches/";

    if (artistSearch !== "") {
      refDatabase.ref("/searches/artist").push(artistSearch.toLocaleLowerCase());
      if (user) {
        refDatabase.ref(dbUser + "artist").push(artistSearch.toLocaleLowerCase());
      }
    }

    if (songSearch !== "") {
      refDatabase.ref("/searches/song").push(songSearch.toLowerCase());
      if (user) {
        refDatabase.ref(dbUser + "song").push(songSearch.toLocaleLowerCase());
      }
    }

    if (artistSearch !== "" && songSearch !== "") {
      refDatabase.ref("/searches/artistandsong").push(artistSongSearch.toLocaleLowerCase());
      if (user) {
        refDatabase.ref(dbUser + "artistandsong").push(artistSongSearch.toLocaleLowerCase());
      }
    }
  })

  // Database listener for searches if user not signed in
  function updateGlobeSearch() {
    //Organize artist searches
    refDatabase.ref("/searches/artist").once("value", function (snapshot) {

      arrayGlobeSearchArtist = snapshotToArray(snapshot);

      globeArtist = countGlobalArtistSearch(arrayGlobeSearchArtist);

      //Sort artists by number of times searched
      var sortedGlobeArtist = Object.keys(globeArtist).sort(function (a, b) {
        return globeArtist[b] - globeArtist[a]
      })
      console.log(sortedGlobeArtist);

          console.log(globeArtist);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    // Organize song searches
    refDatabase.ref("/searches/song").once("value", function (snapshot) {

      arrayGlobeSearchSong = snapshotToArray(snapshot);

      globeSong = countGlobalArtistSearch(arrayGlobeSearchSong);
      // Sort songs by number of times searched
      var sortedGlobeSong = Object.keys(globeSong).sort(function (a, b) {
        return globeSong[b] - globeSong[a]
      })
      console.log(sortedGlobeSong);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    //Organize artist and song searches
    refDatabase.ref("/searches/artistandsong").once("value", function (snapshot) {

      arrayGlobeSearchArtistSong = snapshotToArray(snapshot);

      globeArtistSong = countGlobalArtistSearch(arrayGlobeSearchArtistSong);
      // Sort songs by number of times searched
      var sortedGlobeArtistSong = Object.keys(globeArtistSong).sort(function (a, b) {
        return globeArtistSong[b] - globeArtistSong[a]
      })
      for (var i = 0; i < 5; i++) {
        var text = $("<p></p>").text(sortedGlobeArtistSong[i]).addClass("recentSearch");
        $("#recent-display").append(text);
      }

      console.log(sortedGlobeArtistSong);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })

  }
  updateGlobeSearch();

  $("#song-search-btn").on("click", function () {
    $(".recentSearch").remove();
    updateGlobeSearch();
  })


  // Append list of artist to Recent Search


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
      console.log(i);
      count[i] = (count[i] || 0) + 1;
    });
    console.log(count);
    return count;
  }

})