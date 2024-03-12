const Media = require('../models/Media')
const { validationResult } = require('express-validator')

// Upload a new media
exports.upload = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    if (!req.file) {
        return res.status(400).json({ errors: 'No file uploaded' })
    }

    const { filename, originalname, size, path, mimetype } = req.file

    const newMedia = {
        filename,
        originalname,
        size,
        path,
        mimetype,
    }

    const media = await Media.create(newMedia)
    res.json(media)
}

// Download a specific media
exports.download = async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id)
        if (media) {
            // Check if file exists
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../../uploads', media.filename)
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found' })
            }
            res.download(media.path, media.originalname)
        } else {
            res.status(404).json({ message: 'Media not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}