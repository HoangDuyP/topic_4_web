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
    const source = document.getElementById("agent-template").innerHTML;
    const template = Handlebars.compile(source);
    const ip = document.getElementById("MachineIP");
    const agentList = document.getElementById("agentContainer");
    document.getElementById("addMachineButton").addEventListener("click", () => {
        taskCounter++;
        const value = ip.value;
        if (value.trim() === "") return;
        const data = {
            name: value,
            agentNo: taskCounter
        };

        const html = template(data);

        agentList.insertAdjacentHTML("beforeend", html);
    });
    agentList.addEventListener("click", (e) => {
    const btn = e.target;
    if (btn.id.startsWith("deleteTaskButton")) {

        const agentNo = btn.id.replace("deleteTaskButton", "");
        const agentDiv = document.getElementById("agent-" + agentNo);

        if (agentDiv) {
            agentDiv.remove();
        }
    }
});
});
