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

function sendMessage() {
    connection.invoke("SendMessage", "Hello from Web")
        .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
    //// Agent
    let taskCounter = 0;
    const source = document.getElementById("agent-template").innerHTML;
    const template = Handlebars.compile(source);
    const ip = document.getElementById("MachineIP");
    const agentList = document.getElementById("agentContainer");
    // add machine chạy agent
    document.getElementById("addMachineButton").addEventListener("click", () => {
        const value = ip.value;
        if (value.trim() === "") return;
        connection.invoke("ConnectToAgent", value)
            .then(() => {
                console.log("Connected to agent:", value);
            })
            .catch(err => console.error(err));
        taskCounter++;
        const data = {
            name: value,
            agentNo: taskCounter
        };

        const html = template(data);

        agentList.insertAdjacentHTML("beforeend", html);
    });
    agentList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const cmd = btn.dataset.cmd;
        const ip = btn.dataset.ip;
        if (cmd && ip) {
            if (cmd == "get" || cmd == "startapp" || cmd == "stopapp" || cmd == "startprocess" || cmd == "stopprocess") {
                const container = btn.closest("div");
                const input = container.querySelector("input");
                let value = "";
                if (input) {
                    value = input.value;
                }
                const additionalCmd = `${cmd} ${value}`;
                connection.invoke("SendCommandToAgent", ip, additionalCmd)
                    .catch(err => console.error(err));
                // Handle download file command
            } else {
                connection.invoke("SendCommandToAgent", ip, cmd)
                    .catch(err => console.error(err));
            }
        }
        if (btn.id.startsWith("deleteAgentButton")) {

            const agentNo = btn.id.replace("deleteAgentButton", "");
            const agentDiv = document.getElementById("agent-" + agentNo);

            if (agentDiv) {
                agentDiv.remove();
            }
        }
    });
    ///Mail
    const mailSource = document.getElementById("mail-template").innerHTML;
    const mailTemplate = Handlebars.compile(mailSource);
    const mailList = document.getElementById("mailList");
    let mailCounter = 0;

    // Lắng nghe ip nhận được từ Hub và hiển thị vào hộp thư
    connection.on("ReceiveMessage", (msg) => {
        console.log("Message from Hub:", msg);

        mailCounter++;

        const html = mailTemplate({
            mailNo: mailCounter,
            message: msg.message  // ← lấy IP từ object hoặc nội dung message
        });

        mailList.insertAdjacentHTML("beforeend", html);
    });
    connection.on("ReceiveFile", (file) => {
        const link = document.createElement("a");

        link.href = "data:application/octet-stream;base64," + file.data;
        link.download = file.fileName;
        link.click();

        mailCounter++;
        const html = mailTemplate({
            mailNo: mailCounter,
            message: `Received file: ${file.fileName}`
        });
        mailList.insertAdjacentHTML("beforeend", html);
    });
    mailList.addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.id.startsWith("deleteMailButton")) {
            const mailNo = btn.id.replace("deleteMailButton", "");
            const mailDiv = document.getElementById("mail-" + mailNo);
            if (mailDiv) {
                mailDiv.remove();
            }
        }
    });
});
