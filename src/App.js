import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import "./App.css";
import Home from "./Pages/Home/Home";
import WhiteBoard from "./Pages/WhiteBoard/WhiteBoard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/Firebase";
import io from "socket.io-client";

const server = "http://localhost:5000";
const connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"],
};

const socket = io(server, connectionOptions);
const App = () => {
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		console.log("Socket connected:", socket.connected);
		socket.on("UserIsJoined", (data) => {
			if (data) {
				console.log("User joined");
				setUsers(data);
				console.log("Users users:", data);
			} else {
				console.log("User joining error");
			}
		});
		socket.on("allUsers", (data) => {
			if (data) {
				setUsers(data);
			} else {
				console.log("User joining error");
			}
		});
	}, []);

	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route
						path='/'
						exact
						element={user ? <Navigate to='/home' /> : <LandingPage />}
					/>
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
					<Route
						path='/home'
						element={
							user ? (
								<Home socket={socket} setUser={setUser} user={user} />
							) : (
								<Navigate to='/' />
							)
						}
					/>
					<Route
						path='/:roomId'
						element={
							user ? (
								<WhiteBoard
									socket={socket}
									user={user}
									users={users}
									setUsers={setUsers}
								/>
							) : (
								<Navigate to='/' />
							)
						}
					/>
				</Routes>
			</Router>
		</div>
	);
};

export default App;
