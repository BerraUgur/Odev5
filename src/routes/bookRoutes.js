const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const { verifyAccessToken } = require("../middleware/auth")

router.get("/", verifyAccessToken, bookController.getAllBooks)
router.post("/", verifyAccessToken, bookController.createBook)
router.put("/", verifyAccessToken, bookController.updateBook)
router.delete("/:bookId", verifyAccessToken, bookController.deleteBook)

module.exports = router