const multer = require('multer')
const path = require('path')

const MIME_TYPES = {
    'image/jpg': ['.jpg', '.jpg'],
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png', '.png'],
}

const FILE_VALIDATION_ERROR = 'Only .png, .jpg and .jpeg format allowed!'

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const mimeType = file.mimetype
    if (
        !Object.keys(MIME_TYPES).includes(mimeType) ||
        !Object.values(MIME_TYPES)
            .map((val) => val.at(0))
            .includes(extension)
    ) {
        req.fileValidationError = FILE_VALIDATION_ERROR
        cb(null, false, new Error(FILE_VALIDATION_ERROR))
    } else {
        cb(null, true)
    }
}

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, 'images')
    },

    filename: (_req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype].at(1)
        callback(null, name.split('.')[0] + '_' + Date.now() + extension)
    },
})

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1000000 },
}).single('image')
