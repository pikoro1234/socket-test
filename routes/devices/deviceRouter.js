import express from 'express'
import { getDevices } from '../../controllers/devices/deviceController.js'

const router = express.Router()

router.get('/', getDevices)

export default router