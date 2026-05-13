import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./LoginButton.module.css";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  return (
    <div className={styles.divlogin}>
      <button className={styles.btnuser} onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
};

export default LoginButton;
