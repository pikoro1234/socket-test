import express from 'express'
import { getDevicesNoFilter, importDevices } from '../../controllers/devices/deviceController.js'

const router = express.Router()

router.get('/getter-devices/', getDevicesNoFilter)

router.post('/import-devices/', importDevices)

export default router