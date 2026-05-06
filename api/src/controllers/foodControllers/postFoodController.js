const { Food } = require('../../db');
const cloudinary = require('../../utils/cloudinary');

const postFoodController = async (name, image, description, category, initial_price, discount, final_price, total_score, diet) => {
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                allowed_formats: ['jpg', 'jpeg', 'png']
            },
            (error, result) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(result);
                }
            }
        ).end(image);
    });

    const product = await Food.create({
        name,
        image: uploadResult.secure_url,
        description,
        category,
        initial_price,
        discount,
        final_price,
        total_score,
        diets: diet
    });
    return product.dataValues;
};


module.exports = { postFoodController };
