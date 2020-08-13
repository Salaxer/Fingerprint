function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        window.location.replace("https://salaxer.com/Menu.html");
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        window.location.replace("https://salaxer.com/Iniciosesion.html");
        // [START_EXCLUDE]
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
  
  }
  window.onload = function() {
    initApp();
  };