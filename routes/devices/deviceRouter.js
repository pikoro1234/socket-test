import express from 'express'
import { getDevices, getDevicesNoFilter, importDevices, getMyDetailsDevice, getMyDataHistoricDevice } from '../../controllers/devices/deviceController.js'

const router = express.Router()

router.get('/', getDevices);

router.get('/getter-devices/', getDevicesNoFilter);

router.post('/import-devices/', importDevices);

router.get('/:id', getMyDetailsDevice);

router.post('/:id/history', getMyDataHistoricDevice);

export default router