// Book listing process

const Book = require("../models/Book.js");

// Book listing process
const getAllBooks = async (req, res) => {
  try {
    const { category, sortBy, order } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }

    const books = await Book.find(query).sort(sortOptions);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving books.' });
  }
};

// Adding a new book
const createBook = async (req, res) => {
  try {
    const { title, author, category } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Please fill in all fields: title, author, category.' });
    }

    const newBook = new Book(req.body);
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: 'An error occurred while adding the book.' });
  }
};

// Updating book details
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'An error occurred while updating the book.' });
  }
};

// Deleting a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json({ message: 'Book successfully deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'An error occurred while deleting the book.' });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};

