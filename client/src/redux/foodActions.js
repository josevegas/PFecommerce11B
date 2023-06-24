// actions (these are the actions that will be imported in React components)

import axios from "axios";
import { getAllFoods, getAllFoodsByName,/* , getFoodById */ } from "./foodSlice.js";

export const getFoods = () => async (dispatch) => {
    try {
        const response = await axios.get("http://localhost:3001/food"); 
        const allFoods = response.data;
        dispatch(getAllFoods(allFoods));
    } catch (error) {
        console.log(error);
    }
};

export const getNameFood = (name) => async (dispatch) => {
    try {
        const nameFood = await axios.get("http://localhost:3001/food?name=" + name); 
        const allNameFoods = nameFood.data;
        console.log(getAllFoodsByName(allNameFoods))
        dispatch(getAllFoodsByName(allNameFoods));
    } catch (error) {
        console.log(error);
    }
};


// Do not delete. Uncomment and test when the endpoint `http://localhost:3001/food/${id}` is created
// export const getFood = (id) => async (dispatch) => {
//     try {
//         const response = await axios.get(`http://localhost:3001/food/${id}`); 
//         const foodById = response.data;
//         dispatch(getFoodById(foodById));
//     } catch (error) {
//         console.log(error);
//     }
// };
