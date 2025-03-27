import express from 'express'
import { getDevices, getDevicesNoFilter, importDevices } from '../../controllers/devices/deviceController.js'

const router = express.Router()

router.get('/', getDevices);

router.get('/getter-devices/', getDevicesNoFilter);

router.post('/import-devices/', importDevices);

export default router