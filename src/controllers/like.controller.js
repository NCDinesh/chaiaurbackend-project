import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "This video is not valid")
    }

    const existingvideoLike = await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })

    let like;
    let unlike;

    if(existingvideoLike) {
        unlike = await Like.deleteOne({
            video:videoId,
            likedBy:req.user._id
        })

    if(!unlike) {
        throw new ApiError(500,"Something went wrong while unliking video")
    }
        return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
    
    
    }else{
        like= await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        if(!like) {
            throw new ApiError(500,"Something went wrong while liking video")
        }
    }

    return res.status(201)
      .json(new ApiResponse(200, {}, "Video liked successfully"));
    
    }
)

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}