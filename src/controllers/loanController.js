const Loan = require('../models/Loan');
const Book = require('../models/Book');
const { sendReminderEmail } = require('../config/mailService');

// Borrowing a book
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: 'Book is not available.' });
    }

    // Create the borrowing transaction
    const loan = new Loan({
      user: req.user.id,
      book: bookId,
    });

    // Update and save the book status
    book.available = false;
    await book.save();
    await loan.save();

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while borrowing the book.' });
  }
};

// Listing books borrowed by the user
const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).populate('book');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while listing borrowed books.' });
  }
};

// Returning a book
const returnBook = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Check the borrowing transaction
    const loan = await Loan.findById(loanId).populate('book');
    if (!loan || loan.isReturned) {
      return res.status(400).json({ message: 'Invalid borrowing transaction.' });
    }

    // Update and save the borrowing status
    loan.isReturned = true;
    loan.returnDate = new Date();
    loan.book.available = true;

    await loan.book.save();
    await loan.save();

    res.status(200).json({ message: 'Book successfully returned.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while returning the book.' });
  }
};

// Function to send reminder emails for overdue loans
const sendLoanReminders = async () => {
  try {
    const today = new Date();

    // Find loans where the return date is overdue
    const overdueLoans = await Loan.find({ returnDate: { $lt: today } }).populate('userId bookId');

    for (const loan of overdueLoans) {
      const { userId, bookId, returnDate } = loan;
      const email = userId.email; // Assuming user model has an email field
      const subject = 'Book Return Reminder';
      const text = `Dear ${userId.username},\n\nThis is a reminder to return the book "${bookId.title}" which was due on ${returnDate.toDateString()}. Please return it as soon as possible to avoid penalties.\n\nThank you.`;

      await sendReminderEmail(email, subject, text);
    }

    console.log('Reminder emails sent successfully.');
  } catch (error) {
    console.error('Error sending loan reminders:', error);
  }
};

module.exports = {
  borrowBook,
  getUserLoans,
  returnBook,
  sendLoanReminders,
};