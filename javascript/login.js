check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAQRwC4rj8zSa-AnVgA2WAAnXHFQqClF6c",
    authDomain: "nest-avac.firebaseapp.com",
    databaseURL: "https://nest-avac.firebaseio.com",
    projectId: "nest-avac",
    storageBucket: "nest-avac.appspot.com",
    messagingSenderId: "204529136753",
    appId: "1:204529136753:web:919aaa1dc1095ffd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function back() {
    window.location.href = 'index.html';
}
function login() {
    var name = document.getElementById('Name').value;
    name = name.toLowerCase();
    var email = name + '@avac.com';

    var password = document.getElementById('Password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        window.location.href = 'home.html';
    }).catch(function (error) {
        let el = document.getElementById("warningg");
        el.hidden = false;
        // el.setAttribute("class", "warning");
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}