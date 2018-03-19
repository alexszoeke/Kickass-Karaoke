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
  var dbUser;
  var userOnline = false;
  var artistSearch = "";
  var songSearch = "";
  var artistSongSearch = "";
  var userID = "";
  var userReference = "";
  var globalSearchArtist;
  var userSeachArtist;
  var globalSearchSong;
  var userSearchSong;
  var arrayGlobeSearchArtist = [];
  var arrayUserSeachArtist = [];
  var arrayGlobeSearchSong = [];
  var arrayUserSearchSong = [];
  var globeArtist = {};
  var userArtist = {};
  var globeSong = {};
  var userSong = {};

  $("#register").on("click", function (event) {
    // Creating a new user
    event.preventDefault();
    console.log("register button clicked");
    email = $("#username").val().trim();
    password = $("#inputPassword2").val().trim();
    $("#username").val("");
    $("#inputPassword2").val("");
    $("#username").hide();
    $("#inputPassword2").hide();
    console.log(email);

    auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorCode) {
        $(".modal-title").text("Registration Error");
        $(".modal-body").text(errorMessage);
        $("#loginModal").modal();
      } else {
        console.log(errorMessage);
      }
    });
  });

  // Sign in an existing user
  $("#login").on("click", function (event) {
    event.preventDefault();
    email = $("#username").val().trim();
    password = $("#inputPassword2").val().trim();
    $("#username").val("");
    $("#inputPassword2").val("");
    $("#username").hide();
    $("#inputPassword2").hide();
    $("#register").hide();
    $("#login").hide();
    $("#logout").show();

    auth.signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorCode) {
        $(".modal-title").text("Sign In Error");
        $(".modal-body").text(errorMessage);
        $("#loginModal").modal();
      } else {
        console.log(errorMessage);
      }
    });

  })

  //Test if there is a user signed in
  auth.onAuthStateChanged(function (user) {
    if (user) {
      userID = user.email;
      userReference = user.uid;
      dbUser = "/users/" + userReference + "/searches/";
      userOnline = true;
      $(".recentSearch").remove();
      updateUserSearch();
      console.log(user)
      console.log(user.email);
    } else {
      console.log("not logged in");
      $("#register").show();
      $("#login").show();
      $("#logout").hide();
    }
  });

  //User signout
  $("#logout").on("click", function () {
    event.preventDefault();
    signOut();
  });

  //saving searches to database
  $("#song-search-btn").on("click", function (event) {
    event.preventDefault();
    artistSearch = $("#artist-search").val().trim();
    songSearch = $("#title-search").val().trim();
    var tempLowerCase = artistSearch + ": " + songSearch;
    artistSongSearch = titleCase(tempLowerCase);


    if (artistSearch !== "") {
      refDatabase.ref("/searches/artist").push(artistSearch.toLowerCase());
      if (userOnline === true) {
        refDatabase.ref(dbUser + "artist").push(artistSearch.toLowerCase());
      }
    }

    if (songSearch !== "") {
      refDatabase.ref("/searches/song").push(songSearch.toLowerCase());
      if (userOnline === true) {
        refDatabase.ref(dbUser + "song").push(songSearch.toLowerCase());
      }
    }

    if (artistSearch !== "" && songSearch !== "") {
      refDatabase.ref("/searches/artistandsong").push(artistSongSearch);
      if (userOnline === true) {
        refDatabase.ref(dbUser + "artistandsong").push(artistSongSearch);
      }
    }
    $(".recentSearch").remove();
    if (userOnline === true) {
      updateUserSearch();
    } else {
      updateGlobeSearch();
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
      // Post top 5 searches to page under Trending
      for (var i = 0; i < 5; i++) {
        var text = $("<p></p>").text(sortedGlobeArtistSong[i]).addClass("recentSearch");
        $("#recent-display").append(text);
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })

  }
  if (userOnline === true) {
    updateUserSearch();
  } else {
    updateGlobeSearch();
  }


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
  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    console.log(splitStr.join(""));
    return splitStr.join(' ');
  }


  // User specific search history
  function updateUserSearch() {
    //Organize artist searches
    refDatabase.ref(dbUser + "artist").once("value", function (snapshot) {

      arrayUserSearchArtist = snapshotToArray(snapshot);

      userArtist = countGlobalArtistSearch(arrayUserSearchArtist);

      //Sort artists by number of times searched
      var sortedUserArtist = Object.keys(userArtist).sort(function (a, b) {
        return userArtist[b] - userArtist[a]
      })
      console.log(sortedUserArtist);

      console.log(userArtist);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    // Organize song searches
    refDatabase.ref(dbUser + "song").once("value", function (snapshot) {

      arrayUserSearchSong = snapshotToArray(snapshot);

      userSong = countGlobalArtistSearch(arrayUserSearchSong);
      // Sort songs by number of times searched
      var sortedUserSong = Object.keys(userSong).sort(function (a, b) {
        return userSong[b] - userSong[a]
      })
      console.log(sortedUserSong);

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    //Organize artist and song searches
    refDatabase.ref(dbUser + "artistandsong").once("value", function (snapshot) {

      arrayUserSearchArtistSong = snapshotToArray(snapshot);

      userArtistSong = countGlobalArtistSearch(arrayUserSearchArtistSong);
      // Sort songs by number of times searched
      var sortedUserArtistSong = Object.keys(userArtistSong).sort(function (a, b) {
        return userArtistSong[b] - userArtistSong[a]
      })
      for (var i = 0; i < 5; i++) {
        var text = $("<p></p>").text(sortedUserArtistSong[i]).addClass("recentSearch");
        $("#recent-display").append(text);
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })

  }
  function signOut() {
    auth.signOut().then(function () {
      $("#username").show();
      $("#inputPassword2").show();
      $(".recentSearch").remove();
      updateGlobeSearch();
      auth.signOut().then(function () {
        console.log("signout successful");
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    });
  }
  //Idle time calculator to sign out with no activity
  var idleTime = 0;
  //Increment the idle time counter every minute.
  var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

  //Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });
  $(this).keypress(function (e) {
    idleTime = 0;
  })
  function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 9) { // 10 minutes
      if (userOnline = true) {
        signOut();
      }
    }
  }

})