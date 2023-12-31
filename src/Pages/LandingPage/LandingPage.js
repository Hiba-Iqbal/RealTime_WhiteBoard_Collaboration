import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
	return (
		<div className={styles.container}>
			<div className={styles.landingPage}>
				<header>
					<h1>Collaborate Drawing</h1>
					<p>Draw, collaborate, and create together in real-time!</p>
				</header>
				<section>
					<Link to='/register' className={`${styles.btn} ${styles.btnPrimary}`}>
						Get Started
					</Link>
					<Link to='/login' className={`${styles.btn} ${styles.btnSecondary}`}>
						Log In
					</Link>
				</section>
			</div>
		</div>
	);
};

export default LandingPage;
