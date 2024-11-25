const {Router} = require ("express")
const router = Router();
const booksCtrl = require("../controller/book.controller")

router.get('/books', booksCtrl.getAllBooks);

router.post('/books', booksCtrl.addBook);

router.put('/books', booksCtrl.updateBook);

router.delete('/books/', booksCtrl.deleteBook);

router.get('/books/book/:Id_book', booksCtrl.getOneBook);

// nuevas

router.get('/books/user/:Id_user', booksCtrl.getBooksByUser);

router.get('/books/filter', booksCtrl.getBooksByUserAndId);

module.exports = router;
