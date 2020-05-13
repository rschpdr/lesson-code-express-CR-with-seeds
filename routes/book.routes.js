// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require('express');
const router = express.Router();

// ********* require Book model in order to use it *********
const Book = require('../models/Book.model');

// ****************************************************************************************
// GET route to display all the books
// ****************************************************************************************

router.get('/books', (req, res) => {
  Book.find()
    .then(allTheBooksFromDB => {
      console.log(allTheBooksFromDB);
      res.render('books-list', { books: allTheBooksFromDB });
    })
    .catch(err =>
      console.log(`Err while getting the books from the  DB: ${err}`)
    );
});

// ****************************************************************************************
// GET route for displaying the form to create a new book
// ****************************************************************************************

router.get('/books/create', (req, res) => res.render('book-create'));

// ****************************************************************************************
// POST route for saving a new book in the database
// ****************************************************************************************

router.post('/books/create', (req, res) => {
  // console.log(req.body);
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    // .then(bookFromDB => console.log(`New book created: ${bookFromDB.title}.`))
    .then(() => res.redirect('/books'))
    .catch(error => `Error while creating a new book: ${error}`);
});

// ****************************************************************************************
// GET route for querying a specific book from the database
// ****************************************************************************************

router.get('/books/:id/edit', (req, res) => {
  const { id } = req.params;
  Book.findById(id)
    .then(bookToEdit => {
      // console.log(bookToEdit);
      res.render('book-edit', bookToEdit);
    })
    .catch(error =>
      console.log(`Error while getting a single book for edit: ${error}`)
    );
});

// ****************************************************************************************
// POST route to save changes after updates in a specific book
// ****************************************************************************************

router.post('/books/:id/edit', (req, res) => {
  const { id } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    id,
    { title, description, author, rating },
    { new: true }
  )
    .then(updatedBook => res.redirect(`/books/${updatedBook._id}`))
    .catch(error =>
      console.log(`Error while updating a single book: ${error}`)
    );
});

// ****************************************************************************************
// POST route to delete a specific book
// ****************************************************************************************

router.post('/books/:id/delete', (req, res) => {
  const { id } = req.params;

  Book.findByIdAndDelete(id)
    .then(() => res.redirect('/books'))
    .catch(error => console.log(`Error while deleting a book: ${error}`));
});

// ****************************************************************************************
// GET route for displaying the book details page
// ****************************************************************************************

router.get('/books/:someBookId', (req, res) => {
  const { someBookId } = req.params;
  Book.findById(someBookId)
    .then(foundBook => {
      // console.log('Did I find a book?', foundBook);
      res.render('book-details', foundBook);
    })
    .catch(err =>
      console.log(`Err while getting the specific book from the  DB: ${err}`)
    );
});

module.exports = router;
