const { Food } = require('../../db');
const cloudinary = require('../../utils/cloudinary');
const { getPublicIdFromImageUrl } = require('../../utils/imageUtils');

const putFoodController = async (id, data) => {
  let foodToUpdate = await Food.findByPk(id);
  if (!foodToUpdate) throw new Error("Producto no encontrado")
  if (data.image) {
    if (foodToUpdate.image?.includes('cloudinary.com')) {
      const publicId = getPublicIdFromImageUrl(foodToUpdate.image)
      await cloudinary.uploader.destroy(publicId);
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