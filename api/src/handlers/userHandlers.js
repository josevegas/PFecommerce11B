const { getUserByEmailController } = require('../controllers/userControllers/getUserByEmailController');
const { getAllUsersController } = require('../controllers/userControllers/getAllusersController.js');       /* Djear getAllusersController en minúscula para que coincida con el archivo */
const { postUserController } = require('../controllers/userControllers/postUserController');
const { putUserController } = require('../controllers/userControllers/putUserController');

const getUserHandler = async (req, res, next) => {
    const { email } = req.query;
    try {
        const response = email ? await getUserByEmailController(email) : await getAllUsersController();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const postUserHandler = async (req, res, next) => {
    try {
        const newUser = await postUserController(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

const putUserHandler = async (req, res, next) => {
    const { email } = req.params;
    try {
        const updatedUser = await putUserController(email, req.body);
        res.status(200).json({ message: 'Usuario actualizado correctamente', user: updatedUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserHandler, postUserHandler, putUserHandler };