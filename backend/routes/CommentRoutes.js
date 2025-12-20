const express= require("express")
const router = express.Router();


const {addComment,getComments}= require("../controllers/CommentControllers")

router.post("/comment/:productId",addComment)
router.get("/comment/:productId",getComments)

module.exports=router;