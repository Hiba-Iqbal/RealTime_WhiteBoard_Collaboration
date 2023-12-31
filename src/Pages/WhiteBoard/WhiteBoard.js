import React, { useEffect, useRef, useState } from "react";
import styles from "./WhiteBoard.module.css";
import Canvas from "../../Components/Canva/Canva";
import Avatar from "react-avatar";
import Chat from "./../../Components/Chat/Chat";

const WhiteBoard = ({ socket, user, users, setUsers }) => {
	// Refs
	const canvaRef = useRef(null);
	const ctxRef = useRef(null);

	// State
	const [image, setImage] = useState(null);
	const [selectedTool, setSelectedTool] = useState("pencil");
	const [selectedColor, setSelectedColor] = useState("#000000");
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	useEffect(() => {
		const handleReceivedClearCanvas = () => {
			const canvas = canvaRef.current;
			const context = canvas.getContext("2d");

			// Clear the canvas locally
			context.fillStyle = "white";
			context.fillRect(0, 0, canvas.width, canvas.height);

			// Update local state
			setElements([]);
			setImage(null);
		};

		const handleReceivedDraw = (data) => {
			// Handle drawing events from both host and guest
			// Update local state to reflect the drawing
			setElements((prevElements) => [...prevElements, data]);
		};

		// Set up socket listeners
		socket.on("clearCanvas", handleReceivedClearCanvas);
		socket.on("draw", handleReceivedDraw);

		// Clean up the socket listeners when the component unmounts
		return () => {
			socket.off("clearCanvas", handleReceivedClearCanvas);
			socket.off("draw", handleReceivedDraw);
		};
	}, [socket]);

	// Event Handlers
	const handleToolChange = (tool) => setSelectedTool(tool);

	const handleColorChange = (color) => setSelectedColor(color);

	const handleUndo = () => {
		if (elements.length > 1) {
			setHistory((prevHistory) => [
				...prevHistory,
				elements[elements.length - 1],
			]);
			setElements((prevElements) =>
				prevElements.filter((ele, index) => index !== elements.length - 1)
			);
		}
	};

	const handleRedo = () => {
		setElements((prevElements) => [
			...prevElements,
			history[history.length - 1],
		]);
		setHistory((prevHistory) =>
			prevHistory.filter((ele, index) => index !== history.length - 1)
		);
	};

	const handleClearCanvas = () => {
		const canvas = canvaRef.current;
		const context = canvas.getContext("2d");

		// Clear the canvas locally
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Clear the canvas for all users by emitting a socket event
		socket.emit("clearCanvas");

		// Update local state for host and guest
		setElements([]);
		setImage(null);
	};

	return (
		<div className={styles.whiteBoardGrid}>
			<div className={styles.whiteBoard}>
				<div className={styles.header}>
					<div className={styles.avatarContainer}>
						{users.map((usr, index) => (
							<div key={index} className={styles.avatar_title}>
								{usr.host ? (
									<>
										<p>Host</p>
										<Avatar size='40' round={true} name={usr.email} />
									</>
								) : (
									<>
										<p>Guest</p>
										<Avatar size='40' round={true} name={usr.email} />
									</>
								)}
							</div>
						))}
					</div>

					<h1>White Board</h1>
				</div>
				{user && user.host ? (
					<>
						<div className={styles.toolbar}>
							<div
								className={`${styles.pencilContainer} ${styles.toolbarItem}`}>
								<input
									type='checkbox'
									id='pencil'
									checked={selectedTool === "pencil"}
									onChange={() => handleToolChange("pencil")}
								/>
								<label htmlFor='pencil'>Pencil</label>
							</div>
							<div>
								<input
									type='checkbox'
									id='line'
									checked={selectedTool === "line"}
									onChange={() => handleToolChange("line")}
								/>
								<label htmlFor='line'>Line</label>
							</div>
							<div>
								<input
									type='checkbox'
									id='rectangle'
									checked={selectedTool === "rectangle"}
									onChange={() => handleToolChange("rectangle")}
								/>
								<label htmlFor='rectangle'>Rectangle</label>
							</div>
							<div>
								<input
									type='color'
									id='color'
									value={selectedColor}
									onChange={(e) => handleColorChange(e.target.value)}
								/>
								<label htmlFor='color'>Color:</label>
							</div>
							<button onClick={handleUndo}>Undo</button>
							<button onClick={handleRedo} disabled={history.length < 1}>
								Redo
							</button>
							<button onClick={handleClearCanvas}>Clear Canvas</button>
						</div>

						<div className={styles.canvasContainer}>
							<Canvas
								selectedTool={selectedTool}
								selectedColor={selectedColor}
								canvaRef={canvaRef}
								ctxRef={ctxRef}
								elements={elements}
								setElements={setElements}
								socket={socket}
								user={user}
								image={image}
								setImage={setImage}
							/>
						</div>
					</>
				) : (
					<div className={styles.main}>
						<p>Host is presenting</p>
						<div className={styles.canvasContainer}>
							<Canvas
								selectedTool={selectedTool}
								selectedColor={selectedColor}
								canvaRef={canvaRef}
								ctxRef={ctxRef}
								elements={elements}
								setElements={setElements}
								socket={socket}
								user={user}
								image={image}
								setImage={setImage}
								disabled={true}
							/>
							{image && (
								<img src={image} alt='Canvas' className={styles.canvasImage} />
							)}
						</div>
					</div>
				)}
				<div className={styles.chatModal}>
					<Chat users={users} socket={socket} user={user} />
				</div>
			</div>
		</div>
	);
};

export default WhiteBoard;
