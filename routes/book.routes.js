// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require("express");
const router = express.Router();

// ********* require Book model in order to use it *********
const Book = require("../models/Book.model");

// Requisição HTTP
// Header
// Body - GET não tem body

// CREATE
router.post("/books/create", async (req, res) => {
  // Acessar os dados no body da requisição
  const data = req.body;
  console.log("REQ BODY => ", data);

  // Inserir esses dados no banco
  try {
    const result = await Book.create({ ...data, rate: Number(data.rate) });
    console.log("RESULTADO DA INSERÇÃO => ", result);

    // Retornar sucesso para o usuário
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// UPDATE
router.post("/books/update/:someBookId", async (req, res) => {
  const { someBookId } = req.params;

  const data = req.body;

  try {
    const result = await Book.updateOne({ _id: someBookId }, { $set: data });
    console.log(result);

    res.redirect(`/books/${someBookId}`);
  } catch (err) {
    throw new Error(err);
  }

  // Atualizar com os novos dados no banco
  // Retornar sucesso ou erro para o usuário
});

// DELETE
router.get("/books/delete/:someBookId", async (req, res) => {
  // Decidir qual livro deletar
  const { someBookId } = req.params;

  // Deletar o livro do banco
  try {
    const result = await Book.deleteOne({ _id: someBookId });
    console.log(result);

    res.redirect("/books");
  } catch (err) {
    throw new Error(err);
  }

  // Retornar sucesso ou erro para o usuário
});

// ****************************************************************************************
// GET route to display all the books
// ****************************************************************************************

router.get("/books", (req, res) => {
  Book.find()
    .then((allTheBooksFromDB) => {
      console.log(allTheBooksFromDB);
      res.render("books-list", { books: allTheBooksFromDB });
    })
    .catch((err) =>
      console.log(`Err while getting the books from the  DB: ${err}`)
    );
});

// ****************************************************************************************
// GET route for displaying the book details page
// ****************************************************************************************

router.get("/books/:someBookId", (req, res) => {
  const { someBookId } = req.params;
  Book.findById(someBookId)
    .then((foundBook) => {
      // console.log('Did I find a book?', foundBook);
      res.render("book-details", foundBook);
    })
    .catch((err) =>
      console.log(`Err while getting the specific book from the  DB: ${err}`)
    );
});

module.exports = router;
