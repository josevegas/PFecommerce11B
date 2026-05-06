const { Food } = require('../../db');
const cloudinary = require('../../utils/cloudinary');

const getPublicIdFromImageUrl = (imageUrl) => {
  // Expresión regular para extraer el public ID de la URL
  const regex = /\/([^/]+)\.[^.]+$/;
  const match = imageUrl.match(regex);
  return match ? match[1] : null;
};

const putFoodController = async (id, data) => {
  let foodToUpdate = await Food.findByPk(id);
  if (!foodToUpdate) throw new Error("Producto no encontrado")
  if (data.image) {
    if (foodToUpdate.image?.includes('cloudinary.com')) {
      await cloudinary.uploader.destroy(getPublicIdFromImageUrl(foodToUpdate.image));
    }
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto'
        },
        (error, result) => {
          error ? reject(error) : resolve(result);
        }
      ).end(data.image);
    });

    data.image = uploadResult.secure_url;
  }
  await foodToUpdate.update(data);
  return foodToUpdate;
};



module.exports = { putFoodController };