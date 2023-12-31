import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./Register.module.css";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [alert, setAlert] = useState(null);

	const navigate = useNavigate();

	const handleRegister = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setAlert({ type: "success", message: "Registration successful!" });

			navigate("/home");
		} catch (error) {
			console.error(error.message);
			setAlert({ type: "error", message: error.message });
		}
	};

	return (
		<div className={styles.main_container}>
			<div className={styles.container}>
				<h2>Register</h2>
				<form className={styles.form}>
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

					<button type='button' onClick={handleRegister}>
						Register
					</button>
				</form>
				<p>
					Already have an account?{" "}
					<Link to='/login' style={{ textDecoration: "none" }}>
						Login here
					</Link>
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

export default Register;
