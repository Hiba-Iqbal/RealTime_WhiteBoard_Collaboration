// Home.js
import React, { useState } from "react";
import CreateRoomModal from "./../../Components/CreateRoomModal/CreateRoomModal";
import JoinRoomModal from "../../Components/JoinRoomModal/JoinRoomModal";
import styles from "./Home.module.css";
import { auth } from "../../Firebase/Firebase";

const Home = ({ socket, setUser, user }) => {
	const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false);
	const [isJoinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

	const openCreateRoomModal = () => setCreateRoomModalOpen(true);
	const closeCreateRoomModal = () => setCreateRoomModalOpen(false);

	const openJoinRoomModal = () => setJoinRoomModalOpen(true);
	const closeJoinRoomModal = () => setJoinRoomModalOpen(false);

	const handleLogout = async () => {
		try {
			await auth.signOut(); // Use the Firebase signOut function
		} catch (error) {
			console.error("Error during logout:", error.message);
		}
	};

	return (
		<div className={styles.homeContainer}>
			<h2 className={styles.heading}>
				Welcome to the Collaborative Real-Time App
			</h2>
			<div className={styles.buttonContainer}>
				<button className={styles.button} onClick={openCreateRoomModal}>
					Create Room
				</button>
			</div>
			<div className={styles.buttonContainer}>
				<button className={styles.button} onClick={openJoinRoomModal}>
					Join Room
				</button>
			</div>
			<div className={styles.buttonContainer}>
				<button className={styles.button} onClick={handleLogout}>
					Logout
				</button>
			</div>
			<CreateRoomModal
				socket={socket}
				setUser={setUser}
				isOpen={isCreateRoomModalOpen}
				onRequestClose={closeCreateRoomModal}
				user={user}
			/>
			<JoinRoomModal
				socket={socket}
				setUser={setUser}
				isOpen={isJoinRoomModalOpen}
				onRequestClose={closeJoinRoomModal}
				user={user}
			/>
		</div>
	);
};

export default Home;
