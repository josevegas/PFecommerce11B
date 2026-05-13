import { useAuth0 } from "@auth0/auth0-react";
import styles from "./LogoutButton.module.css";

const LogoutButton = () => {
  const { logout } = useAuth0();
  const handleLogout = () => {
    // Definimos la URL de retorno. 
    // Si tienes configurada una variable de entorno en Vercel (ej. VITE_BASE_URL), úsala.
    // De lo contrario, window.location.origin funcionará siempre que esté en la "Allowed Logout URLs" de Auth0.
    const returnUrl = import.meta.env.VITE_LOGOUT_URL || window.location.origin;
    logout({
      logoutParams: {
        returnTo: returnUrl
      }
    });
  };
  return (
    <button className={styles.btnuser}
      onClick={handleLogout}
    /* onClick={() => logout( {returnTo: "https://viandaexpress.vercel.app/"} )} */
    >Cerrar sesión
    </button>
  );
};

export default LogoutButton;