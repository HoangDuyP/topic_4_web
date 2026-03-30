const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://semiprotected-aubrey-undevelopmentally.ngrok-free.dev/hub")
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
document.addEventListener("DOMContentLoaded", () => {
    let taskCounter = 0;

// compile template 1 lần
const source = document.getElementById("agent-template").innerHTML;
const template = Handlebars.compile(source);

document.getElementById("addMachineButton").addEventListener("click", () => {
    taskCounter++;

    const data = {
        name: "Hoàng Duy PC",
        taskNo: taskCounter
    };

    const html = template(data);

    document.getElementById("agentContainer").insertAdjacentHTML("beforeend", html);
});
});
