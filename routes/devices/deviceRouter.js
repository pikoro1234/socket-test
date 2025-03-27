import express from 'express'
import { getDevices, importDevices } from '../../controllers/devices/deviceController.js'

const router = express.Router()

router.get('/', getDevices)

router.post('/import-devices/', importDevices)

export default router