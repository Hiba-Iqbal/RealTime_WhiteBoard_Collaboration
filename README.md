**Real-Time Collaborative Whiteboard Application**
This React application utilizes WebSocket technology to create a real-time collaborative whiteboard. Users can draw, write, and collaborate on a shared canvas in real time. The application includes several key features and additional considerations for a comprehensive collaborative experience.

**Key Features**

**Canvas Drawing**
Freehand Drawing: Users can draw on the canvas using a mouse or touch input.
Drawing Tools: Tools include different colors, Shapes options, and can redo, undo and clear Canvas.

**Real-Time Collaboration**
WebSocket Integration: Changes made by one user on the canvas are immediately synchronized with all other connected users.

**User Authentication**
Firebase Authentication: Implements a basic user authentication system using Firebase for signup and login.
User Identifiers: Each user's drawings are identified by their avatar.

**Chat Feature**
Real-Time Chat: Users can communicate in real time via a chat panel.
Username and Timestamps: Messages display usernames and timestamps.

**How to Run Locally**
Clone the repository: git clone [url]

Install dependencies: npm install

Set up Firebase:

Create a Firebase project and obtain the configuration details.

Replace the Firebase configuration in the application.

Start the application: npm start

Open the application in your browser: http://localhost:3000
