const {Router} = require ("express")
const router = Router();
const booksCtrl = require("../controller/book.controller")

router.get('/books', booksCtrl.getAllBooks);

router.post('/books', booksCtrl.addBook);

router.put('/books', booksCtrl.updateBook);

router.delete('/books/', booksCtrl.deleteBook);

router.get('/books/:Id_book', booksCtrl.getOneBook);

router.get("/books/:Id_user", booksCtrl.getBooksByUser);

module.exports = router;
