import React, { useEffect, useState, useRef} from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatusAction} from "../../redux/adminSlice";
import { Link } from "react-router-dom";
import styles from "./ListOrders.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import 'animate.css';
import logo from "../../assets/logo/LogoViandaExpress.jpeg"

const ListOrders = ({id, User_name, total_price, createdAt, status, order_status}) => {
  
    const [selectedStatus, setSelectedStatus] = useState('');
    const [previousStatus, setPreviousStatus] = useState('');
    const orderId = id;
    const dispatch = useDispatch();

    useEffect(() => {
      // Almacena el estado seleccionado en el almacenamiento local
      localStorage.setItem('selectedStatus', selectedStatus);
    }, [selectedStatus]);

    useEffect(() => {
      // Restaura el estado seleccionado desde el almacenamiento local al cargar el componente
      const storedStatus = localStorage.getItem('selectedStatus');
      if (storedStatus) {
        setSelectedStatus(storedStatus);
        setPreviousStatus(storedStatus);
      }
    }, []);

    const handleChangeSelect = async (e) => {
      const order_status = e.target.value;
      setSelectedStatus(order_status);
  
      if (order_status === 'Procesando' || order_status === 'Enviado' || order_status === 'Entregado') {
        const result = await Swal.fire({
          title: 'Confirmación',
          text: `¿Estás seguro de que deseas establecer el estado como ${order_status}?`,
          icon: 'question',
          toast: true,
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
          footer: 'Vianda Express',
          imageUrl: logo,
          confirmButtonColor: 'var(--accentColor)',
          showClass: {
          popup: 'animate__animated animate__fadeInDown'},
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
        });
  
        if (result.isConfirmed) {
          dispatch(updateOrderStatusAction(orderId, order_status));
          Swal.fire({
            title: 'Estado actualizado',
            text: `El estado se ha establecido como ${order_status}.`,
            icon:'success',
            toast: true,
            confirmButtonColor: 'var(--accentColor)',
            timer: 3000,
            timerProgressBar: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'},
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',}
          });
        }else{
          setSelectedStatus(previousStatus);
        }
      } else {
        dispatch(updateOrderStatusAction(orderId, order_status));
      }
    };
      /*
    const handleChangeSelect = async (e) => {
        const newOrderStatus = e.target.value;
        setSelectedStatus(newOrderStatus);
        dispatch(updateOrderStatusAction(id, newOrderStatus));
      };
      */
    const statusClass = status === 'approved' ? styles['status-approved'] : styles['status-pending'];

    return(
        <tr className={styles.tds}>
            <td className={styles.tbodys}>#{id.substring(id.length - 4)}</td>
            <td className={styles.tbodys} style={{ fontWeight: 500 }}>{User_name}</td>
            <td className={styles.tbodys}>${total_price}</td>
            <td className={styles.tbodys}>{new Date(createdAt).toLocaleDateString()}</td>
            <td className={styles.tbodys}>
                <span className={`${styles.badge} ${statusClass}`}>
                  {status}
                </span>
            </td>
            <td className={styles.tbodys}>
                <select className={styles.select} value={selectedStatus || order_status} onChange={handleChangeSelect}>
                    <option value="">Cambiar Estado</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                </select>
            </td>
            <td className={styles.tbodys}>
                <Link to={`/order/detail/${id}`}>
                    <button className={styles.button} title="Ver Detalle">
                      <FontAwesomeIcon icon={faListOl} />
                    </button>
                </Link>
            </td>
        </tr>  
    )
}

export default ListOrders;