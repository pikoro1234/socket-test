import express from 'express'
import { getDevices, getDevicesNoFilter, importDevices, getMyDetailsDevice } from '../../controllers/devices/deviceController.js'


import { getDataDevice } from '../../controllers/deviceController.js';

const router = express.Router()

router.get('/', getDevices);

router.get('/getter-devices/', getDevicesNoFilter);

router.post('/import-devices/', importDevices);

// router.get('/:id', getMyDetailsDevice);

router.get('/:id', getDataDevice);

export default router