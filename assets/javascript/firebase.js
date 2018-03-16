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
  var userReference="";

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
      userID =user.email;
      userReference=user.uid;
      console.log(user)
      console.log(user.email);
    } else {
      console.log("not logged in");
    }
  });

  //TODO: Add sign out button to Sign out a user
  auth.signOut().then(function () {
    // Sign-out successful.
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
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


})