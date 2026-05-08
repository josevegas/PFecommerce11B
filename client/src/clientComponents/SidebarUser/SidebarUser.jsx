import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListOl, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./SidebarUser.module.css";
import { Link } from "react-router-dom";
import GoBackHome from "../GoBackHome/GoBackHome.jsx";

const SidebarUser = () => {
  return (
    <aside className={styles.container}>
      <ul className={styles.sidebar}>
        <li className={styles.row}>
          <Link to="/micuenta/misdatos" className={styles.links}>
            <FontAwesomeIcon icon={faUser} /> Mis datos
          </Link>
        </li>
        <li className={styles.row}>
          <Link to="/micuenta/misordenes" className={styles.links}>
            <FontAwesomeIcon icon={faListOl} /> Mis órdenes
          </Link>
        </li>
        <li className={styles.row}>
          <Link to="/micuenta/misfavoritos" className={styles.links}>
            <FontAwesomeIcon icon={faHeart} /> Mis favoritos
          </Link>
        </li>
        <li className={styles.row} style={{ padding: '20px 30px' }}>
          <GoBackHome />
        </li>
      </ul>
    </aside>
  );
};

export default SidebarUser;
