import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async(localFilePath) => {
    try{
        if (!localFilePath) return null

        //upload file on cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {resource_type:"auto"})

        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response

    } catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) {
      throw new Error("Missing public_id for deletion.");
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
    throw new Error("Failed to delete from Cloudinary");
  }
};

export {uploadOnCloudinary, deleteOnCloudinary}