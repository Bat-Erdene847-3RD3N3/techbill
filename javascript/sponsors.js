check_width()
function check_width(){
    if(screen.height < 568){
        window.location.href = "error.html";
    }
}
function back() {
    window.location.href = 'home.html'
    return;
}