import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "This channel Id is not valid");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(400, "This channel does not exist");
  }

  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  let unsubscribedSubscription;
  let subscribedSubscription;

  const hasSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (hasSubscription) {
    unsubscribedSubscription = await Subscription.findOneAndDelete({
      subscriber: req.user._id,
      channel: channelId,
    });

    if (!unsubscribedSubscription) {
      throw new ApiError(
        500,
        "Something went wrong while unsubscribing the channel"
      );
    }

    return res.status(200)
    .json(
        new ApiResponse(200, unsubscribedSubscription, "Channel unsubscribed successfully!")
    )
  }else{
    subscribedSubscription = await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })


    if(!subscribedSubscription){
        throw new ApiError(500, "Something went wrong while subscribing the channel")
    }

    return res.status(200)
    .json(
       new ApiResponse(200, subscribedSubscription,"Channel Subscribed Successfully")
    )
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
