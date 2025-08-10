import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const allSubscribes = await Subscription.aggregate([
      {
        $match: { channel: new mongoose.Types.ObjectId(userId) },
      },
      {
        $count: "subscribers",
      },
    ]);

    const allVideos = await Video.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(userId) },
      },
      {
        $count: "Videos",
      },
    ]);

    const allViews = await Video.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    // Fix: define videoIds for counting videoLikes
    const videos = await Video.find({ owner: userId }).select("_id");
    const videoIds = videos.map((v) => v._id);

    const videoLikes = await Like.countDocuments({
      video: { $in: videoIds },
    });

    const commentIds = await Comment.find({ owner: userId }).distinct("_id");
    const commentLikes = await Like.countDocuments({
      comment: { $in: commentIds },
    });

    const stats = {
      subscribers: allSubscribes[0]?.subscribers || 0,
      totalVideos: allVideos[0]?.Videos || 0,
      totalVideoViews: allViews[0]?.totalViews || 0,
      totalVideoLikesReceived: videoLikes,
      totalCommentLikesReceived: commentLikes,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
  } catch (error) {
    console.error("Error in getChannelStats:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

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