const { Item, Food, sequelize } = require("../../db");

/**
 * Retrieves the best-selling food items.
 * @param {number} [quantity=5] - Number of items to return.
 * @returns {Promise<Array>} - List of best sellers.
 */
const getBestSellersController = async (quantity = 5) => {
  const limit = parseInt(quantity, 10) || 5;

  try {
    const bestSellers = await Item.findAll({
      attributes: [
        'FoodId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_vendidos'],
      ],
      include: [
        {
          model: Food,
          attributes: ['name', 'image', 'final_price'],
        }
      ],
      group: ['FoodId', 'Food.id'],
      order: [[sequelize.literal('total_vendidos'), 'DESC']],
      limit: limit,
    });

    if (bestSellers.length === 0) {
      return [];
    }

    // Format the response for charts or lists
    return bestSellers.map((item) => ({
      id: item.FoodId,
      name: item.Food?.name || 'Unknown',
      image: item.Food?.image,
      price: item.Food?.final_price,
      total_sold: parseInt(item.getDataValue('total_vendidos'), 10),
    }));
    
  } catch (error) {
    console.error("Error in getBestSellersController:", error.message);
    throw new Error("Failed to retrieve best sellers");
  }
};

module.exports = { getBestSellersController };
