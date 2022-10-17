const multer = require('multer')
const path = require('path')

const MIME_TYPES = {
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
    'image/png': '.png',
}

const FILE_SIZE = 0.5;
// const extensionsAllowed = '.jpg' || '.jpeg' || '.png';
// const mimeTypesAllowed = 'image/png' || 'image/jpg' || 'image/jpeg';
const FILE_VALIDATION_ERROR = 'Only .png, .jpg and .jpeg format allowed!'
const FILE_SIZE_ERROR = 'Image over 0.5 MB are not allowed'

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const mimeType = file.mimetype
    const size = file.size;
    if (
        //include
        !Object.keys(MIME_TYPES).includes(mimeType) ||
        !Object.values(MIME_TYPES).includes(extension)
        // !extension.includes(extensionsAllowed) &&
        // !mimeType.includes(mimeTypesAllowed)
        ) {
            req.fileValidationError = FILE_VALIDATION_ERROR
            cb(null, false, new Error(FILE_VALIDATION_ERROR))
        } else {
            cb(null, true)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name.split('.')[0] + '_' + Date.now() + extension)
    }
})


module.exports = multer({ storage, fileFilter, limits:{fileSize: 1000000} }).single('image')
