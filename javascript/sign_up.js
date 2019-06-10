check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
function clear() {
    let el = document.getElementById("warningg");
    el.hidden = true;
}
function back() {
    window.location.href = 'index.html';
}
function sign_up() {
    
    var name = document.getElementById('Name').value;
    name = name.toLowerCase();
    console.log(name);
    var email = name + '@avac.com';


    var password = document.getElementById('Password').value;
    var repassword = document.getElementById('Repassword').value;
    if (password != repassword) {
        let el = document.getElementById("warningg");
        el.hidden = false;
        el = document.getElementById("warninggText");
        el.innerHTML = "Incorrect password! Please rewrite the password";
    }
    if (password == repassword) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            db.ref('users/').push({
                username: name,
                win: 0
            })
            window.location.href = 'login.html';
        }).catch(function (error) {
            let el = document.getElementById("warningg");
            setTimeout(() => {
                document.getElementById("warningg").hidden = true;
            }, 1000);
            el.hidden = false;
            el = document.getElementById("warninggText");
            el.innerHTML = "The name is unable to use!"
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
        });
    }
}