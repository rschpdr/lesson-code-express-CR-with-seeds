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
