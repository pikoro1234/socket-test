import express from 'express'
import { validateFiles } from '../../controllers/urbidermis/urbidermisController.js'

const router = express.Router()

router.post('/', validateFiles)

export default router