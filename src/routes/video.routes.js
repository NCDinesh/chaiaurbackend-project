import { Router } from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js"

const router = Router()

router.route("/publish").post(verifyJWT, upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]),publishAVideo)

router.route("/getvideo/:videoId").get(getVideoById)
router.route("/deletevideo/:videoId").post(verifyJWT,deleteVideo)
router.route("/togglevideo/:videoId").post(verifyJWT,togglePublishStatus)
router.route("/getallvideos").get(getAllVideos)
router.route("/updatevideo/:videoId").patch(verifyJWT,upload.single("thumbnailFile"),updateVideo)

export default router
