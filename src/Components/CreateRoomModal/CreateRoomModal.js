import React, { useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../Firebase/Firebase";
import styles from "./CreateRoomModal.module.css";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const CreateRoomModal = ({ isOpen, onRequestClose, socket, setUser, user }) => {
	const [roomKey, setRoomKey] = useState("");
	const [isCopied, setIsCopied] = useState(false);
	const navigate = useNavigate();
	const generateRoomKey = () => {
		const newRoomKey = uuidv4();
		setRoomKey(newRoomKey);
	};

	const copyRoomKey = async () => {
		try {
			await navigator.clipboard.writeText(roomKey);

			// Set the "Copied!" status and reset it after a short delay (e.g., 3 seconds)
			setIsCopied(true);
			setTimeout(() => {
				setIsCopied(false);
			}, 3000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	};

	const enterRoom = () => {
		const roomId = roomKey;
		const user = auth.currentUser;
		if (user) {
			const roomData = {
				roomId,
				email: user.email,
				userId: user.uid,
				guest: false,
				host: true,
			};
			setUser(roomData);
			// console.log(roomData);
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
				<h2>Create Room</h2>
				<button onClick={generateRoomKey}>Generate Room Key</button>
				<input type='text' value={roomKey} readOnly />
				<button onClick={copyRoomKey}>{isCopied ? "Copied!" : "Copy"}</button>
				<button onClick={enterRoom}>Enter Room</button>
			</Modal>
		</div>
	);
};

export default CreateRoomModal;
