check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
let tmp, a = 1, pending = false;
//loading remover
delete_me();
function delete_me(){
    setTimeout(() => {
        let element = document.getElementById("delete_me");
        element.parentNode.removeChild(element);
    }, 4000);
}
// chance
function chance(myname) {
    firebase.database().ref(`/gameplay/pool`).once('value').then(snapshot => {
        res = snapshot.val();
        let min = 1;
        let max = 16;
        let random = Math.floor(Math.random() * (+max - +min)) + +min;
        if(random == 10){
            random++;   
        }
        let my_idx;
        for (let i = 0; i < res.length; i++) {
            if (res[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_idx = i;
                break;
            }
        }
        firebase.database().ref(`/Chances/${random}`).once('value').then(snapshot => {
            let res = snapshot.val();
            console.log(res);
            if(res.news == "Good News"){
                let chance_tab = document.getElementById("good");
                chance_tab.setAttribute("class", "center_buy1");
                let opacity = document.getElementById("opacity");
                opacity.style.zIndex = 2;
                opacity.classList.remove("hidden");
                document.getElementById("news").innerHTML = res.Description;
                document.getElementById("chance_icon").style.backgroundImage = "url(icons/good.png)";
                document.getElementById("chance_icon").style.backgroundPosition = "center";
                document.getElementById("chance_icon").style.backgroundSize = "cover";
            } else {
                let chance_tab = document.getElementById("bad");
                chance_tab.setAttribute("class", "center_buy1");
                let opacity = document.getElementById("opacity");
                opacity.style.zIndex = 2;
                opacity.classList.remove("hidden");
                document.getElementById("news1").innerHTML = res.Description;
                document.getElementById("chance_icon1").style.backgroundImage = "url(icons/bad.png)";
                document.getElementById("chance_icon1").style.backgroundPosition = "center";
                document.getElementById("chance_icon1").style.backgroundSize = "cover";

            }
            firebase.database().ref(`/gameplay/pool/${my_idx}`).once('value').then(snapshot => {
                let me = snapshot.val();
                let tax = me.balance - res.tax;
                let pos = me.pos + res.go + 22;
                pos %= 22;
                if(res.go > 0){
                    move(res.go);
                    firebase.database().ref(`/gameplay/pool/${my_idx}`).update({
                        balance: tax
                    });
                } else {
                    firebase.database().ref(`/gameplay/pool/${my_idx}`).update({
                        pos: pos,
                        balance: tax
                    });
                    
                }
            })
        });
    });
    return;
}
//chance pass good
function chance_pass_good(){
    let inddexz = document.getElementById("good");
    inddexz.setAttribute("class", "center_buy");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 0;
    opacity.classList.add("hidden");
    let buy = document.getElementById("good");
    buy.classList.add("hidden");
    return;
}
//chance pass bad
function chance_pass_bad(){
    let inddexz = document.getElementById("bad");
    inddexz.setAttribute("class", "center_buy");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 0;
    opacity.classList.add("hidden");
    let buy = document.getElementById("bad");
    buy.classList.add("hidden");
    return;
}
//surrender no
function No() {
    let el = document.getElementById("surrender_tab");
    el.setAttribute("class", "hidden");
}
//surrender yes
function Yes() {
    window.location.href = "lobby1.html";
}
//surrender
function surrender() {
    let el = document.getElementById("surrender_tab");
    el.setAttribute("class", " ");
    return;
}
//showing stats
function stats() {
    let el = document.getElementById("stat");
    if (el.style.visibility == "visible") {
        el.classList.remove("updown");
        el.style.visibility = "hidden";
        return;
    }
    el.style.visibility = "visible";
    el.classList.add("updown");
    return;
}
// timer
function myTimer(timer) {
    setTimeout(() => {
        firebase.database().ref('/gameplay').update({
            timer: timer
        });
    }, 1000);
}
//turn delay
firebase.database().ref("/gameplay/timer").on('value', function (snapshot) {
    let user;
    let timer = snapshot.val();
    firebase.database().ref('/gameplay/').once('value', function (snapshot) {
        user = snapshot.val();
        if (firebase.auth().currentUser.email.split('@')[0] == user.pool[0].username) {
            if (timer < 1) {
                let idx, profile = user.turn;
                for (let i = 0; i < user.pool.length; i++) {
                    if (user.pool[i].username == profile) {
                        idx = i;
                        break;
                    }
                }
                let balance = user.pool[idx].balance -= 300;
                firebase.database().ref(`/gameplay/pool/${idx}`).update({
                    balance: balance
                });
                    idx = idx  + 1;
                    idx = idx % 4;
                    let myidx = user.pool[idx].username;
                    firebase.database().ref('/gameplay').update({
                        turn: myidx
                    });
                timer = 60;
            } else {
                timer --;
            }
            if(pending){
                timer = 60;
                let truee = false;
                firebase.database().ref('/gameplay').update({
                    pending: truee
                });
            }
            myTimer(timer);
        }
        document.getElementById("time").innerHTML = timer + "sec";
    });
})
//button disabler
firebase.database().ref("/gameplay/turn").on('value', function (snapshot) {
    if (snapshot.val() != firebase.auth().currentUser.email.split('@')[0]) {
        document.getElementById("roll").disabled = true;
    } else {
        document.getElementById("roll").disabled = false;
    }
})
//roll actavivator
function buttonDelay(random) {
    setTimeout(() => {
        let roll_btn = document.getElementById("roll");
        roll_btn.disabled = false;
        firebase.database().ref('/gameplay').once('value').then(snapshot => {
            res = snapshot.val();
            let my_idx;
            for (let i = 0; i < res.pool.length; i++) {
                if (res.pool[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                    my_idx = i;
                }
            }
            let myname = firebase.auth().currentUser.email.split('@')[0];
            let my_pos = res.pool[my_idx].pos;
            firebase.database().ref('/board').once('value').then(snapshot => {
                board = snapshot.val();
                let tax_size = board[my_pos].tax;
                if (board[my_pos].owner == "empty" && board[my_pos].buyable) {
                    show_buy()
                } else {
                    if (board[my_pos].name == "Start"){                    
                    firebase.database().ref(`/gameplay/pool/${my_pos}.balance`).once('value').then(snapshot => {})
                        let rew = snapshot.val();
                        rew += 500;
                        firebase.database().ref(`/gameplay/pool/${my_idx}`).update({
                            balance: rew
                        });
                    }
                    if (board[my_pos].chance) {
                        chance(myname);
                    }
                    if (board[my_pos].go) {
                        portal(myname);
                    }
                    if (board[my_pos].buyable) {
                        if (board[my_pos].owner == myname) {
                            upgrade();
                        } else {
                            tax(myname, board[my_pos].owner, tax_size);
                        }
                    }
                }
            })
        })
    }, random * 1000);
}
//upgrade yes
function upgrade_yes() {
    firebase.database().ref('/gameplay/pool').once('value').then(snapshot => {
        let res = snapshot.val();
        let my_idx;
        for (let i = 0; i < res.length; i++) {
            if (res[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_idx = i;
                break;
            }
        }
        let my_pos = res[my_idx].pos;
        let my_balance = res[my_idx].balance;
        firebase.database().ref(`/board/${my_pos}`).once('value').then(snapshot => {
            let res1 = snapshot.val();
            if(res.pool[my_idx].balance > res1.update){
                let money = res.tax;
                money *= 2;
                let upgraded = res1.upgraded;
                upgraded++;
                let cost = res1.upgrade;
                firebase.database().ref(`/board/${my_idx}`).update({
                    upgraded: upgraded,
                    tax: money
                });
                let new_balance = my_balance - cost;
                firebase.database().ref(`/gameplay/pool`).update({
                    balance: new_balance
                });
                
            } else {
                return;
            }
        });
    });
}
// portal
function portal() {
    firebase.database().ref('/gameplay/pool').once('value').then(snapshot => {
        res = snapshot.val();
        let my_idx;
        for (let i = 0; i < res.length; i++) {
            if (res[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_idx = i;
                break;
            }
        }
        firebase.database().ref(`/board/${res[my_idx].pos}`).once('value').then(snapshot => {
            let portal = snapshot.val();
            portal = portal.go;
            firebase.database().ref(`/gameplay/pool/${my_idx}`).update({
                pos: portal
            });
        });
    });
    return;
}
// tax
function tax(myname, owner, tax_size) {
    firebase.database().ref('/gameplay/pool').once('value').then(snapshot => {
        res = snapshot.val();
        let my_idx, his_idx
        for (let i = 0; i < res.length; i++) {
            if (res[i].username == myname) {
                my_idx = i;
            }
            if (res[i].username == owner) {
                his_idx = i;
            }
        }
        let a = res[my_idx].balance;
        let b = tax_size;
        money = a - b;
        firebase.database().ref(`/gameplay/pool/${my_idx}`).update({
            balance: money
        });
        a = res[his_idx].balance;
        b = tax_size;
        money = a + b;
        firebase.database().ref(`/gameplay/pool/${his_idx}`).update({
            balance: money
        });
    });

    return;
}
//show dice
function my_timeout(dice) {
    setTimeout(() => {
        dice.setAttribute("class", "hidden");
        dice.disabled = false;
    }, 500);
}
//roll
function roll() {
    firebase.database().ref('/gameplay').once('value').then(snapshot => {
        let res = snapshot.val();
        if (res.turn != firebase.auth().currentUser.email.split('@')[0]) {
            return;
        } else {
            let min = 1;
            let max = 7;
            let random = Math.floor(Math.random() * (+max - +min)) + +min;
            buttonDelay(random);
            let roll_btn = document.getElementById("roll");
            roll_btn.setAttribute("disabled", "disabled");
            // roll_btn.disabled = true;
            let profile = firebase.auth().currentUser.email.split('@')[0];
            let idx;
            for (let i = 0; i < res.pool.length; i++) {
                if (res.pool[i].username == profile) {
                    idx = i + 1;
                    idx = idx % 4;
                    break;
                }
            }
            idx = res.pool[idx].username;
            let truee = true;
            firebase.database().ref('/gameplay').update({
                turn: idx,
                pending: truee
            });

            let dice = document.getElementById("table");
            dice.setAttribute("class", "dice");
            dice.setAttribute("disabled", "disabled");
            dice.classList.add("updown");

            document.getElementById("dice").innerHTML = random;
            a = 0;
            my_timeout(dice);
            move(random);
        }
    });
}
// show positions
firebase.database().ref('/gameplay/pool').on('value', snapshot => {

    const pool = snapshot.val();

    for (let i = 0; i < pool.length; i++) {
        let tmp = document.getElementById("avatar-" + i);
        if (tmp != null) {
            tmp.parentNode.removeChild(tmp);
        }

        let pos = pool[i].pos;
        let container = document.getElementById("stop-" + pos);
        let pic = document.createElement("img");
        pic.src = `characters/${i}.png`;
        pic.setAttribute("class", `avatar-${i}`);
        pic.setAttribute('id', `avatar-${i}`);
        pic.classList.add("avatar");
        container.appendChild(pic);
    }
});
// moving character part 2
function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}
//moving characters
function move(random) {
    let a = 0;
    setIntervalX(() => {
        let profile = firebase.auth().currentUser.email.split('@')[0];
        firebase.database().ref('/gameplay/pool').once('value').then(snapshot => {

            let res = snapshot.val();
            let updating, user;
            for (let i = 0; i < res.length; i++) {
                if (res[i].username == profile) {
                    user = i;
                    updating = (res[i].pos) % 22;
                    updating += 1;
                    break;
                }
            }
            firebase.database().ref('/gameplay/pool/' + user).update({
                pos: updating
            });
        });
    }, 500, random);
}
// buy visible 
function show_buy() {
    let tt = document.getElementById("indexz");
    tt.setAttribute("class", "center_buy1");
    firebase.database().ref('/gameplay').once('value').then(snapshot => {
        let res = snapshot.val();
        let opacity = document.getElementById("opacity");
        opacity.style.zIndex = 2;
        opacity.classList.remove("hidden");
        let my_index;
        for (let i = 0; i < res.pool.length; i++) {
            if (res.pool[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_index = i;
                break;
            }
        }
        let my_pos = res.pool[my_index].pos;
        firebase.database().ref(`/board/${my_pos}`).once('value').then(snapshot => {
            let company = snapshot.val();
            document.getElementById("buy_logo").style.backgroundImage = "url(logos/" + company.url + ")";
            document.getElementById("buy_image").style.backgroundImage = `url(icons/${company.type}.png)`;
            document.getElementById("buy_image").style.backgroundSize = "cover";
            document.getElementById("header1").innerHTML = company.name;
            document.getElementById("header2").innerHTML = "Price:" + company.price + "B$";
            document.getElementById("letter1val").innerHTML = company.tax + "B$";
            document.getElementById("letter2val").innerHTML = company.upgrade + "B$";
            document.getElementById("letter3val").innerHTML = " x2";
            document.getElementById("header3").innerHTML = company.info;
        });
        document.getElementById("buy").classList.remove("hidden");
        return;
    });
}
// update visible 
function upgrade() {
    let tt = document.getElementById("indexz_upgrade");
    tt.setAttribute("class", "center_buy1");
    firebase.database().ref('/gameplay').once('value').then(snapshot => {
        let res = snapshot.val();
        let opacity = document.getElementById("opacity");
        opacity.style.zIndex = 2;
        opacity.classList.remove("hidden");
        let my_index;
        for (let i = 0; i < res.pool.length; i++) {
            if (res.pool[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_index = i;
                break;
            }
        }
        let my_pos = res.pool[my_index].pos;
        firebase.database().ref(`/board/${my_pos}`).once('value').then(snapshot => {
            let company = snapshot.val();
            document.getElementById("header1_upgrade").innerHTML = company.name;
            document.getElementById("upgrade_logo").style.backgroundImage = "url(logos/" + company.url + ")";
            document.getElementById("upgrade_image").style.backgroundImage = `url(icons/${company.type}.png)`;
            document.getElementById("upgrade_image").style.backgroundSize = "cover";
            document.getElementById("letter2val_upgrade").innerHTML = company.upgrade + "B$";
            document.getElementById("letter3val_upgrade").innerHTML = Math.floor(company.tax * 2) + "B$";
        });
        document.getElementById("upgrade").classList.remove("hidden");
        return;
    });
}
// stats
firebase.database().ref("/gameplay/pool").on('value', function (snapshot) {
    let pool = snapshot.val();
    for (let i = 0; i < pool.length; i++) {
        let account_icon = document.getElementById(`money${i}icon`);
        account_icon.style.backgroundImage = `url("characters/${i}.png")`;
        account_icon.style.backgroundSize = "contain";
        account_icon.style.backgroundRepeat = "no-repeat";
        account_icon.style.backgroundPosition = "center";
        let name = document.getElementById(`money${i}name`);
        name.innerHTML = pool[i].username;
        let balance = document.getElementById(`money${i}text`);
        balance.innerHTML = 'Cash: ' + pool[i].balance + "B$";
    }
});
//buy pass
function pass() {
    let inddexz = document.getElementById("indexz");
    inddexz.setAttribute("class", "center_buy");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 0;
    opacity.classList.add("hidden");
    let buy = document.getElementById("buy");
    buy.classList.add("hidden");
}
//upgrade pass
function pass_upgrade() {
    let inddexz = document.getElementById("indexz_upgrade");
    inddexz.setAttribute("class", "center_buy");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 0;
    opacity.classList.add("hidden");
    let buy = document.getElementById("upgrade");
    buy.classList.add("hidden");
}
//buy buy
function buy() {
    firebase.database().ref('/gameplay').once('value').then(snapshot => {
        pass();
        let res = snapshot.val();
        let my_index;
        for (let i = 0; i < res.pool.length; i++) {
            if (res.pool[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_index = i;
                break;
            }
        }
        let my_pos = res.pool[my_index].pos;
        let moneyy = res.pool[my_index].balance - document.getElementById("header2").innerHTML.split("B")[0].slice(6);
        firebase.database().ref(`/gameplay/pool/${my_index}`).update({
            balance: moneyy
        });
        firebase.database().ref(`/board/${my_pos}`).update({
            owner: firebase.auth().currentUser.email.split('@')[0]
        });

    });
}//upgrade upgrade
function upgrade_yes() {
    firebase.database().ref('/gameplay').once('value').then(snapshot => {
        pass_upgrade();
        let res = snapshot.val();
        let my_index;
        for (let i = 0; i < res.pool.length; i++) {
            if (res.pool[i].username == firebase.auth().currentUser.email.split('@')[0]) {
                my_index = i;
                break;
            }
        }
        let my_pos = res.pool[my_index].pos;
        let my_balance = res.pool[my_index].balance;
        firebase.database().ref(`/board/${my_pos}`).once('value').then(snapshot => {
            let res1 = snapshot.val();
            let cost = res1.upgrade;
            let tax = res1.tax;
            tax *= 2;
            let moneyy = my_balance - cost;
            firebase.database().ref(`/gameplay/pool/${my_index}`).update({
                balance: moneyy
            });
            firebase.database().ref(`/board/${my_pos}`).update({
                tax: tax
            });
        })

    });
}
//give companies their color
firebase.database().ref("/board").on('value', function (snapshot) {
    let res = snapshot.val();
    firebase.database().ref('/gameplay/pool').once('value', function (snapshot) {
        let response = snapshot.val();
        let users = [];
        color = ["red", "green", "blue", "pink"];
        for (let i = 0; i < response.length; i++) {
            users.push(response[i].username);
        }
        for (let i = 1; i < 23; i++) {
            for (let j = 0; j < users.length; j++) {
                if (res[i].owner == users[j]) {
                    let company = document.getElementById("stop-" + i);
                    company.classList.remove("grey");
                    company.classList.add(color[j]);
                }
            }
        }
        for(let i = 1; i < 23; i++){
            if(res[i].owner == "empty"){
                let company = document.getElementById("stop-" + i);
                if(company.classList.contains("green")){
                    company.classList.remove("green");
                    company.classList.add("grey");
                }
                if(company.classList.contains("blue")){
                    company.classList.remove("blue");
                    company.classList.add("grey");
                }
                if(company.classList.contains("red")){
                    company.classList.remove("red");
                    company.classList.add("grey");
                }
                if(company.classList.contains("pink")){
                    company.classList.remove("pink");
                    company.classList.add("grey");
                }
            }
        }
    })
});
// loser's turn skipper
firebase.database().ref("/gameplay").on('value', function (snapshot) {
    let res = snapshot.val();
    let turn = res.turn;
    for(let i = 0; i < res.pool.length; i++){
        if(res.pool[i].username == turn){
            if(res.pool[i].lowin == "lost"){
                let idx = i;
                idx ++;
                idx %= 4;
                let user = res.pool[idx].username;
                firebase.database().ref(`/gameplay`).update({
                    turn: user
                });
            }
            break;
        }
    }
})
// make them lose
firebase.database().ref("/gameplay/pool").on('value', function (snapshot) {
    let res = snapshot.val();
    for(let i = 0; i < res.length; i++){
        if(Number(res[i].balance) < 0 && res[i].lowin != "lost"){
            firebase.database().ref(`/gameplay/pool/${i}`).update({
                lowin: "lost"
            })
        }
    }
})
//loser counter
firebase.database().ref("/gameplay/pool").on('value', function (snapshot){
    let losers = 0; 
    let res = snapshot.val();
    let idx;
    for(let i = 0; i < res.length; i++){
        if(res[i].username == firebase.auth().currentUser.email.split('@')[0]){
            idx = i;
        }
    }
    for(let i = 0; i < res.length; i++){
        if(res[i].lowin == "lost"){
            losers++;
            if(losers == 3){
                if(res[idx].lowin != "playing"){
                    ending_lose_func();
                } else {
                    firebase.database().ref(`/gameplay/pool/${idx}`).update({
                        balance: 99999
                    });
                    ending_win_func();
                }
            }
        }
    }
})
// ending win 
function ending_win_func(){
    document.getElementById("win").classList.add("win");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 2;
    opacity.classList.remove("hidden");
    let tab = document.getElementById("winlose");
    tab.classList.remove("hidden");
    tab.classList.add("win");
    winlose.setAttribute("class", "center_buy1");
    document.getElementById("winlosetxt").innerHTML = "You are the winner richest person in THE WORLD"
    document.getElementById("winloseimg").style.backgroundImage = "url(icons/good.png)";
    document.getElementById("winloseimg").style.backgroundPosition = "center";
    document.getElementById("winloseimg").style.backgroundSize = "cover";
    document.getElementById("winlose_button").classList.add("win");
}  
// ending lose
function ending_lose_func(){
    document.getElementById("win").classList.add("lose");
    let opacity = document.getElementById("opacity");
    opacity.style.zIndex = 2;
    opacity.classList.remove("hidden");
    let tab = document.getElementById("winlose");
    tab.classList.remove("hidden");
    tab.classList.add("lose");
    winlose.setAttribute("class", "center_buy1");
    document.getElementById("winlosetxt").innerHTML = "Dear player You got Bankrupt"
    document.getElementById("winloseimg").style.backgroundImage = "url(icons/bad.png)";
    document.getElementById("winloseimg").style.backgroundPosition = "center";
    document.getElementById("winloseimg").style.backgroundSize = "cover";
    document.getElementById("winlose_button").classList.add("lose");
}  
// ending func
function winlosefunction(){
    firebase.database().ref(`/gameplay/ended`).once('value').then(snapshot => {
        let used = snapshot.val();
        used++;
        let hooson_zai = [];
        if(used == 4){
            used = 0;
            firebase.database().ref(`/gameplay`).update({
                ended: used
            });
            firebase.database().ref(`/gameplay`).update({
                pool: hooson_zai
            });
            firebase.database().ref(`/new_game/board`).once('value').then(snapshot => {
                let res = snapshot.val()
                firebase.database().ref(`/`).update({
                    board: res
                });
            })
            goToLobby1();
        }
    })
    // window.location.href = "lobby1.html";
}
//fix pending
function goToLobby1(){
    setTimeout(() => {
        window.location.href = "lobby1.html";
    }, 1000);
}
firebase.database().ref("/gameplay/pending").on('value', function (snapshot){
    let res = snapshot.val();
    if(res){
        pending = true;
    } else {
        pending = false;
    }
})
// turn 
firebase.database().ref("/gameplay/turn").on('value', function (snapshot){
    let res = snapshot.val();
    document.getElementById("turn").innerHTML = "It's " + res + "'s turn";
})
firebase.database().ref('/gameplay/pool').on('value', function (snapshot){
    let res =snapshot.val()
    for(let i = 0; i < 4; i ++){
        if(res[i].pos == 0){
            firebase.database().ref(`/gameplay/pool/${i}`).update({
                pos: 0
            });
        } 
    }
})

var new_game = {"board":[null,{"buyable":false,"chance":false,"go":false,"name":"Start","owner":false,"price":false,"tax":-200,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"Face of social","name":"Facebook","owner":"empty","price":240,"tax":56,"type":"web","upgrade":300,"upgraded":0,"url":"fb.jpg"},{"buyable":false,"chance":true,"go":false,"name":"Chance","owner":false,"price":false,"tax":false,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"World's second best smartphone brand.","name":"Huawei","owner":"empty","price":60,"tax":12,"type":"phone","upgrade":100,"upgraded":0,"url":"huawei.jpg"},{"buyable":false,"chance":false,"go":12,"name":"Portal","owner":false,"price":false,"tax":false,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"Looks fresh as it sounds like.","name":"Nike","owner":"empty","price":180,"tax":20,"type":"shopping","upgrade":200,"upgraded":0,"url":"nike.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Even the logo looks like motor.","name":"Renault","owner":"empty","price":300,"tax":40,"type":"car","upgrade":400,"upgraded":0,"url":"renault.jpg"},{"buyable":true,"chance":false,"go":false,"info":"The third richest company.","name":"Amazon","owner":"empty","price":350,"tax":45,"type":"web","upgrade":400,"upgraded":0,"url":"amazon.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Most successful smartphone company.","name":"Samsung","owner":"empty","price":260,"tax":35,"type":"phone","upgrade":300,"upgraded":0,"url":"samsung.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Looks like plant","name":"Adidas","owner":"empty","price":200,"tax":25,"type":"shopping","upgrade":200,"upgraded":0,"url":"adidas.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Japanese enough","name":"Toyota","owner":"empty","price":140,"tax":16,"type":"car","upgrade":200,"upgraded":0,"url":"toyota.png"},{"buyable":false,"chance":false,"go":16,"name":"Portal","owner":false,"price":false,"tax":false,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"Youtube more like HotTube","name":"Youtube","owner":"empty","price":220,"tax":30,"type":"web","upgrade":300,"upgraded":0,"url":"youtube.jpg"},{"buyable":false,"chance":true,"go":false,"name":"Chance","owner":false,"price":false,"tax":false,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"Solid as rock","name":"Nokia","owner":"empty","price":140,"tax":16,"type":"phone","upgrade":200,"upgraded":0,"url":"nokia.jpg"},{"buyable":false,"chance":false,"go":5,"name":"Portal","owner":false,"price":false,"tax":false,"upgrade":false,"upgraded":0},{"buyable":true,"chance":false,"go":false,"info":"Classic as usual","name":"Converse","owner":"empty","price":60,"tax":13,"type":"shopping","upgrade":100,"upgraded":0,"url":"converse.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Even the logo looks like motor","name":"Volkwagen","owner":"empty","price":300,"tax":40,"type":"car","upgrade":400,"upgraded":0,"url":"volkswagen.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Tech Giant in Sillicon Valley","name":"Google","owner":"empty","price":320,"tax":80,"type":"web","upgrade":400,"upgraded":0,"url":"google.jpg"},{"buyable":true,"chance":false,"go":false,"info":"Success as always","name":"Apple","owner":"empty","price":400,"tax":85,"type":"phone","upgrade":400,"upgraded":0,"url":"apple.jpg"},{"buyable":true,"chance":false,"go":false,"info":"The name is even in songs","name":"Gucci","owner":"empty","price":200,"tax":44,"type":"shopping","upgrade":200,"upgraded":0,"url":"gucci.jpg"},{"buyable":true,"chance":false,"go":false,"info":"It looks like two people?","name":"Hyundai","owner":"empty","price":220,"tax":56,"type":"car","upgrade":300,"upgraded":0,"url":"hyundai.jpg"}]};