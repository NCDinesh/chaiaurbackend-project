import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
const router = Router()

router.route("/togglesubscription/:channelId").get(verifyJWT,toggleSubscription)
router.route("/getsubscriber/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/getsubscribedchannel/:subscriberId").get(verifyJWT,getSubscribedChannels)

export default router