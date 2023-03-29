// Setup middlewares
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'path'
import sharp from 'sharp'
import multer from 'multer'
import jwt from 'jsonwebtoken'

export const middleware = (app) => {
  app.use(morgan('dev'));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
};


export const protect = async (req, res, next) => {
    const { token, path } = req.body
    console.log('token',token);
    try {
        if (token) {
            try {
                const decoded = jwt.verify(token, 'anoop124')

                if (decoded.path != path) throw Error('Invalid token')
                next()
            } catch (error) {
                throw new Error('Unauthorized, token failed - ' + error.message)
            }
        } else {
            throw new Error('Unauthorized, No token found')
        }
    } catch (error) {
        res.status(401)
        res.send(error.message)
        next(error)
    }
}


export const compressImage = async (req, res, next) => {
    const __dirname = path.resolve()
    req.body.image_names = { main_image: [], additional_images: [] }

    try {
        if (!req.files.main_image && !req.body.date_time) return next()

        let allImages = !req.files?.additional_images
            ? req.files.main_image.concat([])
            : req.files.main_image.concat(req.files.additional_images)

        await Promise.all(
            allImages.map(async (file) => {
                const fileName =
                    file.fieldname +
                    '-' +
                    req.body.date_time +
                    path.extname(file.originalname)

                const scaleTo75 = await sharp(file.buffer)
                    .metadata()
                    .then(({ width }) =>
                        sharp(file.buffer)
                            .resize(Math.round(width * 0.75))
                            .toBuffer()
                    )

                await sharp(scaleTo75)
                    .toFormat('jpeg')
                    .jpeg({ mozjpeg: true })
                    .toFile(path.join(__dirname, '/images') + `/${fileName}`)

                fileName.startsWith('main')
                    ? req.body.image_names.main_image.push('images/' + fileName)
                    : req.body.image_names.additional_images.push(
                          'images/' + fileName
                      )
            })
        )

        next()
    } catch (error) {
        next(error)
    }
}

const maxSize = 1024 * 1024

const storage = multer.memoryStorage()

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('only jpg Images allowed', false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
    limits: { fileSize: maxSize },
    onFileUploadStart: function (file, req, res) {
        if (req.files.file.length > maxSize) {
            return false
        }
    },
})


const uploader = upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 5 },
])

export const bulkUpload = (req, res, next) => {
    uploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.send(err.message)
        } else if (err) {
            return res.send(err)
        }

        next()
    })
}