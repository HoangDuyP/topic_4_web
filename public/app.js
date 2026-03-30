const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://xxxx.ngrok-free.app/hub")
    .withAutomaticReconnect()
    .build();

connection.start()
    .then(() => {
        console.log("Connected to Hub");
    })
    .catch(err => {
        console.error("Connection failed:", err);
    });
// nhận result từ agent
connection.on("ReceiveMessage", (msg) => {
    console.log("Message from Hub:", msg);
});

// gửi command
function sendMessage() {
    connection.invoke("SendMessage", "Hello from Web")
        .catch(err => console.error(err));
}