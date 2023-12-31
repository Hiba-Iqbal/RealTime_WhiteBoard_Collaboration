const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const { addUser, getUser, removeUser } = require("./utils/users");

const io = new Server(server);

// routes
app.get("/", (req, res) => {
	res.send(
		"This is mern realtime board sharing app official server by fullyworld web tutorials"
	);
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
	socket.on("UserJoined", (data) => {
		const { email, userId, roomId, host, guest } = data;
		roomIdGlobal = roomId;
		socket.join(roomId);
		const users = addUser({
			email,
			userId,
			roomId,
			host,
			guest,
			socketId: socket.id,
		});
		socket.emit("UserIsJoined", users);
		console.log({ email, userId });
		socket.broadcast.to(roomId).emit("allUsers", users);
		socket.broadcast.to(roomId).emit("drawingResponse", {
			imageUrl: imgURLGlobal,
		});
	});

	// Handle events or broadcast messages as needed
	socket.on("drawing", (data) => {
		imgURLGlobal = data.imageUrl;
		socket.broadcast.to(roomIdGlobal).emit("drawingResponse", {
			imageUrl: data,
		});
	});

	socket.on("clearCanvas", () => {
		// Broadcast the clearCanvas event to all connected clients
		io.emit("clearCanvas");
	});
	socket.on("message", (data) => {
		const { message } = data;
		const user = getUser(socket.id);
		if (user) {
			socket.broadcast
				.to(roomIdGlobal)
				.emit("messageResponse", {
					message,
					email: user.email,
					timestamp: new Date(),
				});
		}
	});

	socket.on("disconnect", () => {
		const user = getUser(socket.id);
		if (user) {
			removeUser(socket.id);
			socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", {
				email: user.email,
				userId: user.userId,
			});
		}
	});
});

const port = process.env.PORT || 5000;

server.listen(port, () =>
	console.log("server is running on http://localhost:5000")
);
