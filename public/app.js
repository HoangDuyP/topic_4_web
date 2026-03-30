const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://abc123.ngrok-free.app/hub")
    .build();

connection.start()
    .then(() => console.log("Connected"))
    .catch(err => console.error(err));

// nhận result từ agent
connection.on("ReceiveResult", data => {
    console.log("Result:", data);
});

// gửi command
function sendCommand(cmd) {
    connection.invoke("SendCommand", cmd);
}