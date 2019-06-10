check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log('1');
        console.log(user);
    } else {
        // No user is signed in.
        console.log('2');
    }
});
function play() {
    window.location.href = 'lobby1.html';
}
function sponsors() {
    window.location.href = 'sponsors.html';
}
function settings() {
    window.location.href = 'settings.html';
}
function nothing() {
    return;
}