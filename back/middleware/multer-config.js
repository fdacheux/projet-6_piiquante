const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg' : '.jpg',
    'image/jpeg' : '.jpg',
    'image/png' : '.png'
};

const extensionsAllowed = '.jpg' || '.jpeg' || '.png';
const mimeTypesAllowed = 'image/png' || 'image/jpg' || 'image/jpeg';
const FILE_VALIDATION_ERROR = 'Only .png, .jpg and .jpeg format allowed!';


const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if ( //include
    !Object.keys(MIME_TYPES).includes(mimeType) || !Object.values(MIME_TYPES).includes(extension)
        // !extension.includes(extensionsAllowed) &&
        // !mimeType.includes(mimeTypesAllowed)
    ) {
        req.fileValidationError = FILE_VALIDATION_ERROR
        cb(null, false, new Error(FILE_VALIDATION_ERROR));
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
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name.split('.')[0] + '_' + Date.now() +  extension);
    } 
});

module.exports = multer({ storage, fileFilter }).single('image');