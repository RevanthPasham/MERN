const express= require("express")
const router = express.Router();

const auth = require("../middleware/auth");
const {addComment,getComments}= require("../controllers/CommentControllers")

router.post("/comment/:productId",auth,addComment)
router.get("/comment/:productId",getComments)

module.exports=router;