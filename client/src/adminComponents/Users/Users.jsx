import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersAction } from '../../redux/adminSlice';
import styles from './Users.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

const Users = () => {
  const allUsers = useSelector((state) => state.adminReducer.users)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsersAction())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`/user/${id}`);
        dispatch(getAllUsersAction());
        Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
    }
  }

  // Handler to change user type (Admin / Client)
  const handleChangeType = async (email, newType) => {
    try {
      await axios.put(`/user/${email}`, { type: newType });
      dispatch(getAllUsersAction());
      Swal.fire('Actualizado', 'Tipo de usuario actualizado.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el tipo de usuario', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Usuarios Registrados</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.length > 0 &&
            allUsers.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>
                  <select
                    className={`${styles.roleBadge} ${e.type === 'Admin' ? styles.roleAdmin : styles.roleUser}`}
                    value={e.type}
                    onChange={(ev) => handleChangeType(e.email, ev.target.value)}
                    style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Client">Client</option>
                  </select>
                </td>
                <td>
                  <button className={styles.deleteButton} onClick={() => handleDelete(e.id)} title="Eliminar Usuario">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;