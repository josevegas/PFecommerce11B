const { Review, Food, sequelize, Item, User } = require("../../db");

/**
 * Creates a new review for a food item and updates its average rating.
 * @param {string|number} foodId - The ID of the food item.
 * @param {string|number} userId - The ID of the user.
 * @param {string} comment - The review comment.
 * @param {number} rating - The review rating (1-5).
 * @param {string|number} itemId - The ID of the order item associated with this review.
 */
const postReviewController = async (foodId, userId, comment, rating, itemId) => {
  // Validation
  if (!foodId || !userId || !itemId) throw new Error("Faltan IDs obligatorios");
  if (rating < 1 || rating > 5) throw new Error("La calificación debe estar entre 1 y 5");
  if (!comment || comment.trim().length === 0) throw new Error("El comentario no puede estar vacío");

  // Check if entities exist
  const [food, user, item] = await Promise.all([
    Food.findByPk(foodId),
    User.findByPk(userId),
    Item.findByPk(itemId)
  ]);

  if (!food) throw new Error("Food item not found");
  if (!user) throw new Error("User not found");
  if (!item) throw new Error("Order item not found");

  try {
    // Create the review within a transaction to ensure data integrity
    const result = await sequelize.transaction(async (t) => {
      const newReview = await Review.create({
        FoodId: foodId,
        UserId: userId,
        comment: comment.trim(),
        rating,
        ItemId: itemId
      }, { transaction: t });

      // Link review to item
      await Item.update(
        { ReviewId: newReview.id },
        { where: { id: itemId }, transaction: t }
      );

      // Recalculate average rating for the food
      const averageResult = await Review.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
        where: { FoodId: foodId },
        transaction: t
      });

      const average = averageResult.get('averageRating') || rating; // Fallback to current rating if first review

      await Food.update(
        { total_score: parseFloat(average).toFixed(2) },
        { where: { id: foodId }, transaction: t }
      );

      return newReview;
    });

    return result;
  } catch (error) {
    console.error("Error in postReviewController:", error.message);
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

module.exports = { postReviewController };
