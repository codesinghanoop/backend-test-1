import express from 'express'
import { getToken } from './token.controller.js'

const router = express.Router()

router.post('/', getToken)

export default router