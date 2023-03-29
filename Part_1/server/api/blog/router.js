import express from 'express'
import { addBlog, getAllBlog } from './blog.Controller.js'
import { bulkUpload, compressImage } from '../../config/middlewares.js'

const router = express.Router()

router.get('/', getAllBlog)
router.post('/new', bulkUpload, compressImage, addBlog)

export default router
