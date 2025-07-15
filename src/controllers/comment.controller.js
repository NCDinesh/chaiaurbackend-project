import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

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
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }