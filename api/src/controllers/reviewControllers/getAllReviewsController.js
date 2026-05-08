const { Review, User, Food } = require("../../db");

/**
 * Retrieves all reviews with associated user and food information.
 * @returns {Promise<Array>} - List of all reviews.
 */
const getAllReviewsController = async () => {
  try {
    const allReviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'image']
        },
        {
          model: Food,
          attributes: ['id', 'name', 'image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return allReviews;
  } catch (error) {
    console.error("Error in getAllReviewsController:", error.message);
    throw new Error("Failed to retrieve reviews");
  }
};

module.exports = { getAllReviewsController };