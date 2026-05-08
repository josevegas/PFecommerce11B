const { getFoodByNameController } = require('../controllers/foodControllers/getFoodByNameController');
const { getAllFoodController } = require('../controllers/foodControllers/getAllFoodsController');
const { postFoodController } = require('../controllers/foodControllers/postFoodController');
const { deleteFoodController } = require('../controllers/foodControllers/deleteFoodController');
const { putFoodController } = require('../controllers/foodControllers/putFoodController');
const { getAdminFoodController } = require('../controllers/foodControllers/getAdminFoodsController');


const getFoodHandler = async (req, res, next) => {
    const { name } = req.query;
    try {
        const response = name ? await getFoodByNameController(name) : await getAllFoodController();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const postFoodHandler = async (req, res, next) => {
    const { description, name, initial_price, discount, diets, category, total_score } = req.body;
    const image = req.file ? req.file.buffer : null;
    try {
        if (!name || !initial_price || !image) throw new Error('Faltan campos obligatorios');
        const finalPrice = Math.ceil(initial_price * (1 - (discount / 100)));
        const newFood = await postFoodController(name, image, description, category, initial_price, discount, finalPrice, total_score, diet);
        res.status(200).json(newFood);
    } catch (error) {
        next(error);
    }
};


const putFoodHandler = async (req, res, next) => {
    const { id } = req.params;
    const image = req.file ? req.file.buffer : null;
    try {
        //body mejorado
        const updated = await putFoodController(id, { ...req.body, image });
        res.status(200).json({ message: "Modificacion exitosa", updated });
    } catch (error) {
        next(error);
    }
};

const deleteFoodHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
        await deleteFoodController(id);
        res.status(200).json({ message: "Se eliminó con éxito" });
    } catch (error) {
        next(error);
    }
};

const getAdminFoodHandler = async (req, res, next) => {
    try {
        const allFood = await getAdminFoodController();
        res.status(200).json(allFood);
    } catch (error) {
        next(error);
    }
};


module.exports = { getFoodHandler, postFoodHandler, putFoodHandler, deleteFoodHandler, getAdminFoodHandler };