import { Router } from "express";
import { getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router= Router()

router.route("/getchannelvideos").get(verifyJWT,getChannelVideos)

export default router;