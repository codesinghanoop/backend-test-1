import express from 'express'
import { getImage } from './image.controller.js'
import { protect } from '../../config/middlewares.js'

const router = express.Router()

router.post('/', protect, getImage)

export default router