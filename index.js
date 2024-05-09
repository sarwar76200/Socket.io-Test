const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log(data);
        io.sockets.emit("receive_message", data);
    });
    socket.on("typing", (data) => {
        if (data.status !== '') {
            socket.broadcast.emit("typing", `${data.user} is ${data.status}`);
            // console.log(`${data.user} is ${data.status}`);
        } else {
            socket.broadcast.emit("typing", data.status);

            console.log(data.status);
        }
        // io.sockets.emit("typing", data);
    });

});

server.listen(process.env.port || 3000, () => console.log("SERVER IS RUNNING"));