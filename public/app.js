const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://semiprotected-aubrey-undevelopmentally.ngrok-free.dev/remoteHub")
    .build();

connection.on("ReceivePong", (agentId) => {
    console.log("Pong from: " + agentId);
});

connection.start();

function ping() {
    const agentId = document.getElementById("agentId").value;
    connection.invoke("PingAgent", agentId);
}