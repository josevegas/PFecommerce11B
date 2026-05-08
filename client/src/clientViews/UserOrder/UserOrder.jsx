import { useDispatch, useSelector } from "react-redux";
import { getUserOrderAction } from "../../redux/userSlice";
import { useEffect } from "react";
import styles from "./UserOrder.module.css";
import { getUserDetailAction } from "../../redux/userSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import SidebarUser from "../../clientComponents/SidebarUser/SidebarUser";

const UserOrder = () => {
  const dispatch = useDispatch();
  const orderUser = useSelector((state) => state.usersReducer.userOrder);
  const userDetail = useSelector((state) => state.usersReducer.userDetail);
  console.log("order", orderUser);
  const { user, isAuthenticated } = useAuth0();
  const email = user?.email;
  const id = userDetail[0]?.id;

  useEffect(() => {
    dispatch(getUserOrderAction(id));
    dispatch(getUserDetailAction(email));
  }, [dispatch]);

  return (
    <div className={styles.mainContainer}>
      <SidebarUser />
      <section className={styles.contentContainer}>
        <h1>Mis Órdenes</h1>
        <div className={styles.tableWrapper}>
          <table className={styles.destable}>
            <thead>
              <tr>
                <th>Número de orden</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {orderUser.map((o) => (
                <tr key={o.id}>
                  <td><code style={{ fontSize: '0.8rem', color: '#666' }}>{o.id.substring(0, 8)}...</code></td>
                  <td style={{ fontWeight: '600' }}>${o.total_price}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status-${o.order_status}`] || styles['status-PENDIENTE']}`}>
                      {o.order_status || "PENDIENTE"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/micuenta/misordenes/detalle/${o.id}`} className={styles.viewButton}>
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default UserOrder;
