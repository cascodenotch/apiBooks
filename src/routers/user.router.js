const {Router} = require ("express")
const router = Router();
const usersCtrl = require("../controller/user.controller")

router.post("/register", usersCtrl.register);

module.exports = router;
