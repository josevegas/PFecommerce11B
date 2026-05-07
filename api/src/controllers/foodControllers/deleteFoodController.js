const { Food } = require('../../db');
const cloudinary = require('../../utils/cloudinary');
const { getPublicIdFromImageUrl } = require('../../utils/imageUtils');

const deleteFoodController = async (foodId) => {
    const deletedFood = await Food.findByPk(foodId)
    if (!deletedFood) throw new Error("Producto no encontrado");
    if (deletedFood.image && deletedFood.image.includes('cloudinary.com')) {
        const publicId = getPublicIdFromImageUrl(deletedFood.image)
        await cloudinary.uploader.destroy(publicId);
    }
    await Food.destroy({
        where: { id: foodId }
    });
    return { message: "Producto eliminado correctamente" };
};

module.exports = { deleteFoodController };