import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFoods } from "../../redux/foodActions.js";
import axios from "axios";
import styles from "../Detail/Detail.module.css";
// import { addItemsActions, deleteItemActions } from "../../redux/foodActions.js";
import {
  setItemsActions,
  deleteItemActions,
  putItemActions,
} from "../../redux/shopingCartSlice.js";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import "animate.css";
import logo from "../../assets/logo/LogoViandaExpress.jpeg"
import AddButton from "../../clientComponents/AddButton/AddButton.jsx";
import GoBackHome from "../../clientComponents/GoBackHome/GoBackHome.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Detail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth0();
  const [isItem, setIsItem] = useState(false);
  const orderUser = useSelector(
    (state) => state.shopingCartReducer.pendingOrder
  ); //
  const allItems = useSelector((state) => state.shopingCartReducer.itemsOrder); //

  const dispatch = useDispatch();

  const allFoods = useSelector((state) => state.foodsReducer.allFoods);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!allFoods.length) {
      axios.get("/api").then(() => dispatch(getFoods()));
    } else {
      dispatch(getFoods());
    }
  }, [dispatch]);
  /*To identify if it's an item*/
  useEffect(() => {
    allItems.map((item) => {
      if (item.Food.name === foodDetail.name) {
        setIsItem(true);
        setQuantity(item.quantity);
      }
    });
  }, []);

  const foodDetail = allFoods.find((food) => food.id === id);
  /*To add a new item or delete an item */
  const handleClick = (e) => {
    if (!isAuthenticated) {
      //alert('¡Cuidado! Logueate antes de agregar productos a tu carrito de compras. ¡Gracias!')
      Swal.fire({ 
        title: "¡Cuidado!",
        text: "Logueate antes de agregar productos a tu carrito de compras. ¡Gracias!",
        icon: "error",
        toast: true,
        footer: 'Vianda Express',
	      imageUrl: logo,
        timer: 4000,
        timerProgressBar: true,
        confirmButtonColor: 'var(--accentColor)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    } else {
      if (isItem) {
        setIsItem(false);
        const item = allItems.filter((it) => it.FoodId === id)[0];
        dispatch(deleteItemActions({ id: item?.id, OrderId: orderUser?.id }));
        //-------------------------
        // const bodyDelete = {
        //   userEmail: user?.email,
        //   FoodId: id,
        // };
        // console.log("DeleteAction", bodyDelete);
        // axios
        //   .delete("/item", { data: bodyDelete })
        //   .catch((error) => console.log(error));
        //-------------------------
      } else {
        setIsItem(true);
        const amount = foodDetail?.final_price * quantity;
        dispatch(
          setItemsActions({
            Food: foodDetail,
            FoodId: id,
            OrderId: orderUser?.id,
            name: foodDetail?.name,
            image: foodDetail?.image,
            final_price: foodDetail?.final_price,
            quantity: quantity,
            amount: amount,
          })
        );
        // dispatch(
        //   addItemsActions({
        //     id,
        //     name: foodDetail?.name,
        //     image: foodDetail?.image,
        //     final_price: foodDetail?.final_price,
        //     quantity: quantity,
        //     amount: amount,
        //   })
        // );
        //-------------------------
        // const bodyAdd = {
        //   userEmail: user?.email,
        //   FoodId: id,
        //   quantity: 1,
        //   final_price: foodDetail?.final_price,
        // };
        // axios.post("/item", bodyAdd).catch((error) => console.log(error));
        //-------------------------
      }
    }
  };
  const updateQuantity = (e) => {
    const quantity = parseInt(e.target.value);
    const item = allItems.filter((it) => it.FoodId === id)[0];
    const amount = foodDetail?.final_price * quantity;
    setQuantity(quantity);
    dispatch(
      putItemActions({
        orderId: orderUser?.id,
        itemId: item.id,
        quantity,
        amount,
      })
    );
    // dispatch(deleteItemActions(id));
    // dispatch(
    //   addItemsActions({
    //     id,
    //     name: foodDetail?.name,
    //     image: foodDetail?.image,
    //     final_price: foodDetail?.final_price,
    //     quantity: quantity,
    //     amount: amount,
    //   })
    // );
    //-------------------------
    // const bodyUpdateItem = {
    //   userEmail: user?.email,
    //   FoodId: id,
    //   quantity,
    //   final_price: foodDetail?.final_price,
    // };
    // axios.put("/item", bodyUpdateItem).catch((error) => console.log(error));
    //-------------------------
  };

  return (
    <main className={styles.main}>
      {!foodDetail ? (
        <p>"Cargando..."</p>
      ) : (
        <div className={styles.container}>
          <div className={styles.container1}>
            <h1 className={styles.title}>{foodDetail?.name}</h1>
            <img
              className={styles.image}
              src={foodDetail?.image}
              alt={foodDetail?.name}
            />
            <p className={styles.description}>{foodDetail?.description}</p>
          </div>
          <div className={styles.container2}>
            <h2 className={styles.caract}>Detalles del Producto</h2>
            
            <div className={styles.priceContainer}>
              <span className={styles.priceValue}>${foodDetail?.final_price}</span>
            </div>

            <div className={styles.category}>
              Categoría: <span>{foodDetail?.category}</span>
            </div>

            <div className={styles.diets}>
              Dietas: 
              <div>
                {!foodDetail?.diets.length ? (
                  <span>General</span>
                ) : (
                  foodDetail?.diets.map((diet, index) => (
                    <span key={index}>{index > 0 ? ` | ${diet}` : diet}</span>
                  ))
                )}
              </div>
            </div>

            {!foodDetail?.status && (
              <div className={styles.status}>Estado: <span>No disponible temporalmente</span></div>
            )}

            {foodDetail?.total_score > 4 && (
              <div className={styles.popular}>
                ⭐️ Mejor rankeado! Esta vianda es de las favoritas.
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
              {isItem && (
                <input
                  className={styles.detailinput}
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={updateQuantity}
                />
              )}
              <button 
                className={styles.addButton} 
                onClick={handleClick}
                style={{
                  backgroundColor: isItem ? 'var(--primary-dark)' : 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'var(--transition)',
                  flexGrow: 1
                }}
              >
                {isItem ? (
                  "Agregado al Carrito"
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCartShopping} /> Agregar al Carrito
                  </>
                )}
              </button>
            </div>

            <GoBackHome />
          </div>
        </div>
      )}
    </main>
  );
}
