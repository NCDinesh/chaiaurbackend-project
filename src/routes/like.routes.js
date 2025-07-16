import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike,toggleVideoLike } from "../controllers/like.controller.js";

const router=Router();
router.route("/likeunlikevideo/:videoId").get(verifyJWT,toggleVideoLike)
router.route("/togglecommentlike/:commentId").get(verifyJWT,toggleCommentLike)
router.route("/getlikedvideos").get(verifyJWT,getLikedVideos)
export default router

