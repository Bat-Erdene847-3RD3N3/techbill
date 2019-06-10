check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
//loading remover
delete_me();    
function delete_me(){
    setTimeout(() => {
        let element = document.getElementById("delete_me");
        element.parentNode.removeChild(element);
    }, 4000);
}
var profile;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        profile = user.email.split('@')[0];

        db.ref('users').once('value').then(function (snapshot) {
            snapshot.forEach(function (item) {
                var element = item.val();
                if (element.username == profile) {
                    let a = document.getElementById("name")
                    a.innerHTML = 'Name: ' + element.username;
                    let b = document.getElementById("wins");
                    b.innerHTML = 'Win: ' + element.win;
                    let picture = document.createElement
                    let d = document.getElementById("player_icon")

                }
            });
        });
    } else {
        // No user is signed in.
    }
});
db.ref('gameplay/pool').on('value', function (snapshot) {
    let pool = snapshot.val();
    let c = document.getElementById("box");
    let numberOfPlayers = 0;
    if(pool !== null ) {
        numberOfPlayers = pool.length;
    }
    c.innerHTML = 'Joined Players: ' + numberOfPlayers + '/4';
});
firebase.database().ref('gameplay/pool').on('value', function (snapshot) {
    let pool = snapshot.val();
    if(pool == null){
        return;
    }
    for(let i = 0; i < pool.length; i++){
        if(pool[i].username == firebase.auth().currentUser.email.split('@')[0]){
            let a = document.getElementById("playerIcon");
            a.style.backgroundImage = `url('characters/${i}.png')`;
            a.style.backgroundSize = "contain";
            a.style.backgroundRepeat = 'no-repeat';
            a.style.backgroundPosition = 'center';
        }
    }
});firebase.database().ref('gameplay/pool').once('value').then(snapshot => {
        let pool = snapshot.val();
        if(pool == null){
            return;
        }
        if(pool.length >= 4){
            document.getElementById("join").innerHTML = "Spectate";
            firebase.database().ref('gameplay').once('value', function(snapshot) {
                let gameout = snapshot.val().gamestatus
                gameout = 'Game Has Started'; 
                firebase.database().ref('gameplay').update({
                    gamestatus: gameout
                }); 
            });
        } else {
            firebase.database().ref('gameplay').once('value', function(snapshot) {
                let gamein = snapshot.val().gamestatus
                gamein = 'Unable To Join'; 
                    firebase.database().ref('gameplay').update({
                gamestatus: gamein
                });
            });
        }
    });
function join() {
    firebase.database().ref('gameplay/pool').once('value').then(snapshot => {
        let pool = snapshot.val();                                               
        let username = firebase.auth().currentUser.email.split('@')[0];  
        if (pool === null) {
            pool = [{
                username: username,
                pos: 1,
                balance: 2000,
                lowin: "playing"
            }];
        } else {
            if( pool.length >= 4) {
                let used = false;
                if(used == false){
                    firebase.database().ref('gameplay/pool').once('value').then(snapshot=> {
                        let res = snapshot.val();
                        res = res[0].username;
                        firebase.database().ref('/gameplay').update({
                            turn: res
                        });
                    });
                    used = true;
                }
                firebase.database().ref('/gameplay').update({
                    pending: false,
                    timer: 65
                });
                window.location.href = "gameplay.html";
            } else {
                for(let i = 0; i < pool.length; i++) {
                    if(pool[i].username == username) {
                        return;
                    }
                }
                pool.push({
                    username: username,
                    pos: 1,
                    balance: 2000,
                    lowin: "playing"
                });
            }
        }
        firebase.database().ref('gameplay/pool').set(pool);
    });
}
function back() {
    window.location.href = 'home.html';
}
function settings() {
    window.location.href = 'settings.html';
}
function nothing(){
    return;
}