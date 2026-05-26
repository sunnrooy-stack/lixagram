import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import path from "path"

const uploadOnCloudinary=async (file)=>{
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key:process.env.CLOUDINARY_API_KEY, 
            api_secret:process.env.CLOUDINARY_API_SECRET
        });
        const result=await cloudinary.uploader.upload(file,{
            resource_type:'auto',
        })
        fs.unlinkSync(file)
        return result.secure_url
    } catch (error) {
        console.error("Cloudinary upload failed, falling back to local server storage:", error.message || error)
        // Extract the filename from the file path
        const filename = path.basename(file)
        const port = process.env.PORT || 8000
        const localUrl = `http://localhost:${port}/${filename}`
        console.log("Local URL fallback generated:", localUrl)
        // Do NOT unlink the file so it can be served locally from public/
        return localUrl
    }
}

export default uploadOnCloudinary