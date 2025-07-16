import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This video is not valid");
  }

  const existingvideoLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  let like;
  let unlike;

  if (existingvideoLike) {
    unlike = await Like.deleteOne({
      video: videoId,
      likedBy: req.user._id,
    });

    if (!unlike) {
      throw new ApiError(500, "Something went wrong while unliking video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  } else {
    like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong while liking video");
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    const unlike = await Like.deleteOne({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (!unlike) {
      throw new ApiError(500, "Error while unliking comment");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  }

  const like = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!like) {
    throw new ApiError(500, "Error while liking comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Comment liked successfully"));
});


const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerInfo",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$ownerInfo", 0] },
            },
          },
          {
            $project: {
              ownerInfo: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: "$videoDetails", // flatten the videoDetails array
    },
    {
      $replaceRoot: {
        newRoot: "$videoDetails", // extract only the video info
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Fetched liked videos successfully")
  );
});

export { toggleCommentLike,  toggleVideoLike, getLikedVideos };
