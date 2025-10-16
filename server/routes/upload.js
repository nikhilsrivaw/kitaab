const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');
const router = express.Router();

//configure multer for temporary file storage 
const upload = multer({
    dest:'uploads/temp/', // temporary storage before cloudinary 
    limits:{
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})


//upload routes 

router.post('/' , upload.single('file') , uploadFile);

module.exports = router;