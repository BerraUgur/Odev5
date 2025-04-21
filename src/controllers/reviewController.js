const Review = require('../models/Review');

// Adding a book review
const addReview = async (req, res) => {
  try {
    const { bookId, reviewText, rating } = req.body;

    // Create a new review
    const review = new Review({
      user: req.user.id,
      book: bookId,
      reviewText,
      rating,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while adding the review.' });
  }
};

// Deleting a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Review check
    const review = await Review.findById(reviewId);
    if (!review || review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this review.' });
    }

    await review.remove();
    res.status(200).json({ message: 'Review successfully deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the review.' });
  }
};

// Listing reviews
const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;

    // Query reviews by book
    const query = bookId ? { book: bookId } : {};
    const reviews = await Review.find(query).populate('user', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the reviews.' });
  }
};

module.exports = {
  addReview,
  deleteReview,
  getReviews,
};