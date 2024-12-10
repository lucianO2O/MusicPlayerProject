const express = require('express')
const upload = require("../models/upload")
const router = express.Router()

router
// get all uploads route
    .get('/', async (req, res) => {
        try {
        const uploads = await upload.getUploads()
        res.send(uploads); // sends all uploads as the response
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })

    // upload a new song route
    .post('/upload', async (req, res) => {
        try {
        const { user_id, songDetails } = req.body; // id and song details in the request body
        const file = req.file; 

        const result = await upload.uploadSong(user_id, file, songDetails)
        res.status(201).send(result); // Returns the upload result
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })

 // delete an upload route
    .delete('/:upload_id', async (req, res) => {
        try {
        const { upload_id } = req.params; // get the upload ID from the URL
        const isDeleted = await upload.deleteUpload(upload_id);

        if (isDeleted) {
            res.send({ success: true, message: 'Upload deleted successfully' })
        } else {
            res.status(404).send({ success: false, message: 'Upload not found' })
        }
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })
    
    //update route
    .put('/:upload_id', async (req, res) => {
        try {
            const { upload_id } = req.params;
            const updates = req.body;
    
            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).send({ message: 'No updates provided' })
            }
    
            const success = await uploadModel.updateUpload(upload_id, updates);
    
            if (success) {
                res.status(200).send({ message: 'Upload updated successfully' })
            } else {
                res.status(404).send({ message: 'Upload not found' })
            }
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })

module.exports = router