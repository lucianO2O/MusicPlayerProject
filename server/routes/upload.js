const express = require('express')
const upload = require("../models/upload")
const router = express.Router()

router
// get all uploads
    .get('/', async (req, res) => {
        try {
        const uploads = await uploadModel.getUploads()
        res.send(uploads); // sends all uploads as the response
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })

    // upload a new song
    .post('/upload', async (req, res) => {
        try {
        const { user_id, songDetails } = req.body; // id and song details in the request body
        const file = req.file; 

        const result = await uploadModel.uploadSong(user_id, file, songDetails)
        res.status(201).send(result); // Returns the upload result
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })

 // delete an upload
    .delete('/:upload_id', async (req, res) => {
        try {
        const { upload_id } = req.params; // get the upload ID from the URL
        const isDeleted = await uploadModel.deleteUpload(upload_id);

        if (isDeleted) {
            res.send({ success: true, message: 'Upload deleted successfully' })
        } else {
            res.status(404).send({ success: false, message: 'Upload not found' })
        }
        } catch (err) {
        res.status(500).send({ message: err.message })
        }
    })

module.exports = router