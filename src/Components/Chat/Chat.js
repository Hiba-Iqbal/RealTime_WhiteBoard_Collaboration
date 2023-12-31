import React, { useEffect, useState } from "react";
import styles from "./Chat.module.css";

const Chat = ({ users, socket, user }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleReceivedMessage = (data) => {
      setChat((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResponse", handleReceivedMessage);

    // Cleanup the event listener when the component is unmounted
    return () => {
      socket.off("messageResponse", handleReceivedMessage);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const newMessage = {
        message,
        email: "You",
        timestamp: Date.now(),
      };
      setChat((prevChats) => [...prevChats, newMessage]);
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Chat Room</h2>
      </div>
      <div className={styles.chatMessages}>
        {chat.map((msg, index) => (
          <div key={index} className={styles.message}>
            <strong>{msg.email}:</strong> {msg.message}{" "}
            <span className={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className={styles.messageInput}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
