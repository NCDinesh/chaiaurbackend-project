import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished = true} = req.body

    if(!title || title?.trim()==="") {
        throw new ApiError(400, "Title Content is required")
    }

    if(!description || description?.trim()=== "") {
        throw new ApiError(400, "Description content is required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0].path
    const thumbnailFileLocalPath = req.files?.thumbnail?.[0].path

    if(!videoFileLocalPath) {
        throw new ApiError(400, "Video File missing!")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)

    if(!videoFile) {
        throw new ApiError(500, "Something went wrong while uploading video file on cloudinary")
    } 

    const video = await Video.create({
        videoFile : {
            public_id : videoFile?.public_id,
            url: videoFile?.url
        },

        thumbnail: {
            public_id : thumbnail?.public_id,
            url: thumbnail?.url
        },
        title,
        description,
        isPublished,
        owner: req.user._id,
        duration: videoFile?.duration
    })

    if(!video) {
        throw new ApiError(500, "Something went wrong while storing the video in database")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200,video, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(400,"video not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video fetched successfully!")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body
    const thumbnailFile = req.file?.path

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "This video is not valid")
    }
    
if (
  !thumbnailFile &&
  (!title || title.trim() === "") &&
  (!description || description.trim() === "")
) {
  throw new ApiError(400, "At least one non-empty field is required for update");
}
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, " This Video id is not valid")
    }

    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You don't have permission to delete this video")
    }

    if(video.videoFile){
        await deleteOnCloudinary(video.videoFile.public_id,"video")
    }

    const deleteResponse = await Video.findByIdAndDelete(videoId)
    if(!deleteResponse) {
        throw new ApiError(500, "Something went wrong while deleting video!!")
    }

    return res.status(200)
    .json( 
        new ApiResponse(200, deleteResponse, "Video deleted successfully")
    )
})



const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"This video id is not valid")

    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You dont have permission to toggle this video")
    }

    video.isPublished = !video.isPublished

    await video.save({validateBeforeSave : false})

    return res.status(200).json(
        new ApiResponse (200, video, "Video toggled Successfully!")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}