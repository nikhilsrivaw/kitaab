const cloudinary = require('../config/cloudinary');

const uploadFile = async (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                message : "No file uploaded"
            })
        }

        const result  = await cloudinary.uploader.upload(req.file.path,{
            folder:"kitaab/chat",
            resource_type:'auto' // handles images , videos , PDFS etc 
        })

        return res.status(200).json({
            success: true,
            file:{
                url: result.secure_url,
                public_id: result.public_id,
                resource_type:result.resource_type,
                size:result.bytes,
                original_filename: req.file.originalname
            }
        });
    } catch (error) {
        console.error("Upload error" , error);
        return res.status(500).json({message : error.message})
        
    }
}

module.exports = { uploadFile };