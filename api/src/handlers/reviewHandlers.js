const { getAllReviewsController } = require("../controllers/reviewControllers/getAllReviewsController");
const { getReviewByIdController } = require("../controllers/reviewControllers/getReviewByIdController");
const { postReviewController } = require("../controllers/reviewControllers/postReviewController");
const { putReviewController } = require("../controllers/reviewControllers/putReviewController");

// Handles fetching all reviews or a specific one by ID
const getReviewsHandler = async (req, res, next) => {
  const { id } = req.query; // Changed from body to query for GET requests usually
  try {
    if (id) {
      const review = await getReviewByIdController(id);
      return res.status(200).json(review);
    }
    const allReviews = await getAllReviewsController();
    res.status(200).json(allReviews);
  } catch (error) {
    next(error);
  }
};

const putReviewHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) throw new Error("Review ID is required");
    const updatedReview = await putReviewController(id, req.body);
    res.status(200).json({ message: "Reseña actualizada", updatedReview });
  } catch (error) {
    next(error);
  }
};

const postReviewHandler = async (req, res, next) => {
  const { foodId, userId, comment, rating, itemId } = req.body;
  try {
    // Basic validation in handler
    if (!foodId || !userId || !itemId) throw new Error("Missing required IDs (foodId, userId, itemId)");
    if (rating === undefined) throw new Error("Rating is required");

    const newReview = await postReviewController(foodId, userId, comment, rating, itemId);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviewsHandler, putReviewHandler, postReviewHandler };