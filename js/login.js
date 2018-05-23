// Initialize Firebase
var config = {
    apiKey: "AIzaSyAZtHIY_mGTmr5OTsYme9s8U8-yH9bnldM",
    authDomain: "magpie-15077.firebaseapp.com",
    databaseURL: "https://magpie-15077.firebaseio.com",
    projectId: "magpie-15077",
    storageBucket: "magpie-15077.appspot.com",
    messagingSenderId: "683045341213"
};
firebase.initializeApp(config);
console.log("Firebase initialized");

// logged in state even watcher
firebase.auth().onAuthStateChanged(function(user){
    if (user) {
        // signed in
        console.log("user is signed in");
        window.location.href = "welcome.html";
    } else {
        // signed out
        console.log("user is NOT signed in");
    }
});

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("user is signed in");
        // This gives you a Google Access Token. You can use it to access the Google API.
        var accessToken = result.credential.accessToken;
    }).catch(function (error) {
        // Handle Errors here.
        console.log("firebase login error");
        console.log(error.code);
        console.log(error.message);
    });
}