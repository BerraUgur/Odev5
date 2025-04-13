const Book = require("../models/Book.js")
const path = require("path")
const fs = require("fs")

const getAllBooks = (req, res) => {
  try {
    const books = Book.findAll()
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createBook = (req, res) => {
  try {
    const newBook = { id: Date.now(), ...req.body }

    // Boş alan kontrolü
    if (!newBook.title || !newBook.author || !newBook.year || !newBook.genre || !newBook.pages) {
      return res.status(400).json({
        message: "Please complete all fields: title, author, year, genre, pages.",
      })
    }

    // Duplicate kontrolü
    const books = Book.findAll()
    const duplicateBook = books.find((book) => book.title === newBook.title)
    if (duplicateBook) {
      return res.status(400).json({ message: "Please do not duplicate book title!" })
    }

    Book.create(newBook)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateBook = (req, res) => {
  try {
    const { id, title, author, year, genre, pages } = req.body

    if (!title || !author || !year || !genre || !pages) {
      return res.status(400).json({
        message: "Please complete all fields: title, author, year, genre, pages.",
      })
    }

    const updatedBook = Book.update(id, { title, author, year, genre, pages })

    if (updatedBook) {
      res.json({ success: true, book: updatedBook })
    } else {
      res.status(404).json({ success: false, message: "Kitap bulunamadı" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteBook = (req, res) => {
  try {
    const { bookId } = req.params

    const findBook = Book.findById(bookId)
    if (findBook) {
      Book.delete(bookId)
      res.status(200).json({
        message: "Book deleted successfully",
      })
    } else {
      res.status(404).json({ success: false, message: "Book not found!" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
}

