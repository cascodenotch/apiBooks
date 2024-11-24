const {Router} = require ("express")
const router = Router();
const booksCtrl = require("../controller/book.controller")

router.get('/books', booksCtrl.getAllBooks);

router.get("/books/:Id_user", booksCtrl.getBooksByUser);

module.exports = router;
