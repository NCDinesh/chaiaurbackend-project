import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router= Router()

router.route("/getchannelvideos").get(verifyJWT,getChannelVideos)
router.route("/getchannelstats").get(verifyJWT,getChannelStats)

export default router;