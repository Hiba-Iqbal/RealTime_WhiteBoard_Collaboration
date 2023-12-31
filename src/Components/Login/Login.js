import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./Login.module.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [alert, setAlert] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setAlert({ type: "success", message: "Login successful!" });
			navigate("/home");
		} catch (error) {
			console.error(error.message);
			setAlert({ type: "error", message: error.message });
		}
	};

	return (
		<div className={styles.main_container}>
			<div className={styles.container}>
				<h2>Login</h2>
				<form>
					<label>Email:</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label>Password:</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button type='button' onClick={handleLogin}>
						Login
					</button>
				</form>
				<p>
					Don't have an account? <Link to='/register'>Register here</Link>
				</p>

				{alert && (
					<div className={`${styles.alert} ${styles[alert.type]}`}>
						{alert.message}
					</div>
				)}
			</div>
		</div>
	);
};

export default Login;
