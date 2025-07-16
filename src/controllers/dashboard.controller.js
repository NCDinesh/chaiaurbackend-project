import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const allVideo = await Video.find({
        owner: req.user._id
    })

     if (allVideo.length === 0) {
           return res.status(404).json(
            new ApiResponse(404, [], "No videos found for this channel")
        );
    }

    return res.status(200).
    json(
        new ApiResponse(200,allVideo,"All videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }