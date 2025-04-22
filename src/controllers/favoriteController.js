const Favorite = require('../models/Favorite');

// Add a book to favorites
const addFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const favorite = new Favorite({ userId, bookId });
    await favorite.save();

    res.status(201).json({ message: 'Book added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add favorite', error: error.message });
  }
};

// Get all favorite books for a user
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user

    const favorites = await Favorite.find({ userId }).populate('bookId');
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
};

// Remove a book from favorites
const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    await Favorite.findByIdAndDelete(favoriteId);
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };