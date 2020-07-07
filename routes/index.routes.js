const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model");

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/new-book", (req, res) => res.render("books-create"));

router.get("/modify-book/:someBookId", async (req, res) => {
  // Selecionar qual o livro a ser atualizado
  const { someBookId } = req.params;

  try {
    // Recuperar os dados deste livro
    const bookData = await Book.findById(someBookId);

    res.render("books-update", {
      book: bookData,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
