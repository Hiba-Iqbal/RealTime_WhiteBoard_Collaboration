// JoinRoomModal.js

import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom"; // Import useHistory from React Router
import styles from "./JoinRoomModal.module.css"; // Import the same styles
import { auth } from "../../Firebase/Firebase";

Modal.setAppElement("#root");

const JoinRoomModal = ({ isOpen, onRequestClose, socket, setUser }) => {
	const [roomKey, setRoomKey] = useState("");
	const navigate = useNavigate();
	const enterRoom = () => {
		const roomId = roomKey;
		const user = auth.currentUser;
		if (user) {
			const roomData = {
				roomId,
				email: user.email,
				userId: user.uid,
				host: false,
				guest: true,
			};
			setUser(roomData);
			socket.emit("UserJoined", roomData);
			navigate(`/${roomId}`);
		} else {
			console.log("User not logged in");
		}
	};

	return (
		<div className={styles.container}>
			<Modal
				isOpen={isOpen}
				onRequestClose={onRequestClose}
				className={styles.modalContent}>
				<h2>Join Room</h2>
				<input
					type='text'
					value={roomKey}
					onChange={(e) => setRoomKey(e.target.value)}
				/>
				<button onClick={enterRoom}>Enter Room</button>
			</Modal>
		</div>
	);
};

export default JoinRoomModal;
