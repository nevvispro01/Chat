function Display(name, message){
    document.getElementById('messages').innerHTML = '';
    document.getElementById('messages').innerHTML += '<div>' + name + ": " + message + '</div>';
}

console.log("запуск файла logical.js");

var socket = io.connect("/");


socket.on("loadMessage", (data) => {
    console.log("124djgjidsg");
    Display(data.userName, data.newMessage);
});