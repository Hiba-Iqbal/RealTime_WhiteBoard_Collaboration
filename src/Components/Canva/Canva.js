import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./Canva.module.css";
import rough from "roughjs";

const Canvas = ({
	selectedTool,
	selectedColor,
	canvaRef,
	ctxRef,
	elements,
	setElements,
	socket,
	user,
	image,
	setImage,
}) => {
	// State for drawing activity
	const [isDrawing, setIsDrawing] = useState(false);
	useEffect(() => {
		socket.on("drawingResponse", (data) => {
			setImage(data.imageUrl);
		});
	}, [socket, setImage]);

	useEffect(() => {
		// Set up canvas context
		const canva = canvaRef.current;
		const ctx = canva.getContext("2d");
		ctxRef.current = ctx;
	}, [canvaRef, ctxRef]);

	useLayoutEffect(() => {
		// Draw elements using roughjs
		const roughCanvas = rough.canvas(canvaRef.current);
		const ctx = ctxRef.current;

		if (elements.length > 0) {
			// Clear canvas before re-drawing
			ctx.clearRect(0, 0, canvaRef.current.width, canvaRef.current.height);
		}
		elements.forEach((ele) => {
			if (ele.selectedTool === "pencil") {
				roughCanvas.linearPath(ele.path, { stroke: ele.stroke, roughness: 0 });
			} else if (ele.selectedTool === "line") {
				roughCanvas.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
					stroke: ele.stroke,
					roughness: 0,
				});
			} else if (ele.selectedTool === "rectangle") {
				const { startX, startY, width, height } = ele;
				roughCanvas.rectangle(startX, startY, width, height, {
					stroke: ele.stroke,
					roughness: 0,
				});
			}
		});

		const canvasImage = canvaRef.current.toDataURL();
		socket.emit("drawing", canvasImage);
	}, [elements, canvaRef, ctxRef, socket]);

	const handleMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		// Start drawing based on the selected tool
		if (
			selectedTool === "pencil" ||
			selectedTool === "line" ||
			selectedTool === "rectangle"
		) {
			setElements((prevElements) => [
				...prevElements,
				{
					offsetX,
					offsetY,
					stroke: selectedColor, // Set the stroke color to the selected color
					selectedTool,
					path:
						selectedTool === "pencil"
							? [[offsetX, offsetY]]
							: selectedTool === "line"
							? [] // Initialize path for the line tool
							: [], // Initialize path for the rectangle tool
					...(selectedTool === "line"
						? { width: offsetX, height: offsetY }
						: {}),
					...(selectedTool === "rectangle"
						? { startX: offsetX, startY: offsetY }
						: {}),
				},
			]);
		}
		setIsDrawing(true);
	};

	const handleMouseMove = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		if (isDrawing) {
			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								...ele,
								...(selectedTool === "pencil"
									? { path: [...ele.path, [offsetX, offsetY]] }
									: {}),
								...(selectedTool === "line"
									? { width: offsetX, height: offsetY }
									: {}),
								...(selectedTool === "rectangle"
									? {
											width: offsetX - ele.offsetX,
											height: offsetY - ele.offsetY,
									  }
									: {}),
						  }
						: ele
				)
			);
		}
	};

	const handleMouseUp = () => {
		setIsDrawing(false);
	};

	return (
		<div className={styles.canvasContainer}>
			{user.host ? (
				<canvas
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					ref={canvaRef}
					className={styles.canvas}
					width='800'
					height='600'></canvas>
			) : (
				<canvas
					ref={canvaRef}
					className={styles.canvas}
					width='800'
					height='600'></canvas>
			)}
		</div>
	);
};

export default Canvas;
