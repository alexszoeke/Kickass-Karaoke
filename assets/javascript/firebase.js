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
    
    var email="";
    var password="";
    var user;

    // Creating a new user
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

      // Sign in an existing user
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

      //Sign out a user
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

      //Test if there is a user signed in
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          // No user is signed in.
        }
      });
})