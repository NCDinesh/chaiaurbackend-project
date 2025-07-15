import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js"

const router=Router()

router.route("/addcomment/:videoId").post(verifyJWT,addComment)
router.route("/updatecomment/:commentId").post(verifyJWT,updateComment)
router.route("/deletecomment/:commentId").post(verifyJWT,deleteComment)
router.route("/getcomment/:videoId").get(verifyJWT,getVideoComments)

export default router