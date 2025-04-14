// Kitap işlemleri için gerekli fonksiyonlar

const Book = require("../models/Book.js");

// Kitap listeleme işlemi
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
    res.status(500).json({ message: 'Kitaplar alınırken bir hata oluştu.' });
  }
};

// Yeni kitap ekleme işlemi
const createBook = async (req, res) => {
  try {
    const { title, author, category } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun: title, author, category.' });
    }

    const newBook = new Book(req.body);
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: 'Kitap eklenirken bir hata oluştu.' });
  }
};

// Kitap güncelleme işlemi
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Kitap bulunamadı.' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Kitap güncellenirken bir hata oluştu.' });
  }
};

// Kitap silme işlemi
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Kitap bulunamadı.' });
    }

    res.status(200).json({ message: 'Kitap başarıyla silindi.' });
  } catch (error) {
    res.status(400).json({ message: 'Kitap silinirken bir hata oluştu.' });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};

