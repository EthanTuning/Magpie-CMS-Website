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
    } else {
        // signed out
        console.log("user is NOT signed in");
        alert("You have been logged out of your account. Returning to login.");
        window.location.href = "admin-login.html";
    }
});

function getToken() {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ false).then(function (idToken) {
        console.log("token: " + idToken);
    }).catch(function (error) {
        console.log("failed to get token");
        console.log(error);
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("logout successful");
    }).catch(function(error) {
        // An error happened.
        console.log("logout NOT successful");
        console.log(error);
    });
}