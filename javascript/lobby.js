check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
function play(){
    window.location.href = 'lobby1.html';
}
function nothing(){
    return; 
}