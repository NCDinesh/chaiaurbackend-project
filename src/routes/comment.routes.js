import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, updateComment } from "../controllers/comment.controller.js"

const router=Router()

router.route("/addcomment/:videoId").post(verifyJWT,addComment)
router.route("/updatecomment/:commentId").post(verifyJWT,updateComment)

export default router