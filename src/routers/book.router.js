const {Router} = require ("express")
const router = Router();
const booksCtrl = require("../controller/book.controller")

router.post('/books', booksCtrl.addBook);

router.put('/books', booksCtrl.updateBook);

router.delete('/books/', booksCtrl.deleteBook);

router.get('/books/user/:Id_user', booksCtrl.getBooksByUser);

router.get('/books/filter', booksCtrl.getBooksByUserAndId);

module.exports = router;
