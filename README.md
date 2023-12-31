Realtime Board Sharing App Backend
This is the backend for a MERN stack realtime board sharing app. It utilizes Socket.io for real-time communication. The server is built with Express and Node.js.
User Management
The users.js file contains functions to manage users.

addUser
Add a user to the list with the specified information.

const users = require("./utils/users");

// Example usage:
const addedUsers = users.addUser({
  email: "user@example.com",
  userId: "uniqueUserId",
  roomId: "room123",
  host: true,
  guest: false,
  socketId: "socket123",
});

removeUser
Remove a user from the list based on their socket ID.

const removedUser = users.removeUser("socket123");

getUser
Get a user from the list based on their socket ID.

const user = users.getUser("socket123");

getUsersInRoom
Get all users in a specific room.

const usersInRoom = users.getUsersInRoom("room123");
Socket.io Integration
The server.js file sets up the Express server and integrates Socket.io for real-time communication.

UserJoined Event
When a user joins, the UserJoined event is triggered, and the user is added to the list of users. The server then emits events to inform other users in the room about the new user and any existing drawings.

drawing Event
The drawing event is triggered when a user draws on the canvas. The server broadcasts the drawing to all users in the same room.

clearCanvas Event
The clearCanvas event is triggered to clear the canvas for all connected clients.

message Event
The message event allows users to send messages. The server broadcasts the message to all users in the room.

disconnect Event
When a user disconnects, the server removes them from the user list and broadcasts a message to inform other users.

How to Run
Install dependencies: npm install
Start the server: npm run dev
The server will run on http://localhost:5000. Adjust the port in the server.listen function if needed.
