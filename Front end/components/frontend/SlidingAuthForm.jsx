import React, { useRef } from "react";
import styles from "../../styles/SlidingAuthForm.module.css";

export default function SlidingAuthForm() {
  const containerRef = useRef(null);

  const handleSignUpClick = () => {
    containerRef.current.classList.add(styles["right-panel-active"]);
  };

  const handleSignInClick = () => {
    containerRef.current.classList.remove(styles["right-panel-active"]);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles["form-container"] + " " + styles["sign-up-container"]}
      >
        <form>
          <h1>Create Account</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>
      <div
        className={styles["form-container"] + " " + styles["sign-in-container"]}
      >
        <form>
          <h1>Sign in</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
        </form>
      </div>
      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div
            className={styles["overlay-panel"] + " " + styles["overlay-left"]}
          >
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button
              className={styles.ghost}
              onClick={handleSignInClick}
              type="button"
            >
              Sign In
            </button>
          </div>
          <div
            className={styles["overlay-panel"] + " " + styles["overlay-right"]}
          >
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button
              className={styles.ghost}
              onClick={handleSignUpClick}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
