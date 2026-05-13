import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedCase, setRenderFoodsCase, setCategoryByCase } from '../../redux/adminSlice';
import styles from './SearchBarProducts.module.css';

const SearchBarProducts = () => {
    const allFoods = useSelector((state) => state.foodsReducer.adminFoods);
    const searched = useSelector((state) => state.adminReducer.searched);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { value } = e.target;
        dispatch(setSearchedCase(value));
        dispatch(setCategoryByCase(''));
    };

    return (
        <div className={styles.searchContainer}>
            <input
                value={searched}
                type="text"
                placeholder="🔍 Buscar por nombre..."
                onChange={handleChange}
                className={styles.searchInput}
            />
        </div>
    );
};

export default SearchBarProducts;
