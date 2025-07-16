import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
  throw new ApiError(400, "This video id is not valid");
}


    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError (404,"Video not found")
    }

    const aggregateComments = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },

        {
            $sort: {
                createdAt : -1
            }
        },

        {
        $lookup: {
            from: "users",
            localField:"Owner",
            foreignField:"_id",
            as: "owner"
        }
        },

       { $addFields: {
            owner : {$first: "$owner"}
        }},

        {
            $project: {
                content: 1,
                createdAt:1,
                updatedAt:1,
                "owner.fullName":1,
                "owner.username":1,
                "owner.avatar":1
            }
        }
    ])

    const result = await Comment.aggregatePaginate(aggregateComments, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Video comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const {comment} = req.body
    const {videoId} = req.params

    if(!comment || comment?.trim()==="") {
        throw new ApiError(404, "Comment is required")
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400,"This video id is not valid")
    }

    const videoComment = await Comment.create({
        content:comment,
        video:videoId,
        Owner : req.user._id
    })

    if(!videoComment) {
        throw new ApiError(500,"Something went wrong while creating video comment")
    }

    return res.status(200)
    .json( 
        new ApiResponse(200, videoComment,"video comment created successfully")
    )

})

const updateComment = asyncHandler(async (req, res) => {
   const {newContent} = req.body
   const {commentId} = req.params

   if(!newContent || newContent.trim()===""){
    throw new ApiError(400, "This video id is not valid")
   }

   const comment = await Comment.findById(commentId)

   if(!comment) {
    throw new ApiError(404, "Comment not found")
   }

   if(comment.Owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to update this comment")
   }

   const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
        $set: {
            content:newContent
        }
    },

    {
        new:true
    }
   )

   if(!updateComment) {
    throw new ApiError(400, "Error while updating comment")
   }

   return res.status(200)
   .json(
    new ApiResponse(200,updateComment,"comment updated successfully")
   )
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(404,"This comment id is not valid")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(comment.Owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this comment")
    }

    const deleteComment= await Comment.deleteOne({_id:commentId})

    if(!deleteComment){
        throw new ApiError(500, "something went wrong while deleting comment")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, deleteComment, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }