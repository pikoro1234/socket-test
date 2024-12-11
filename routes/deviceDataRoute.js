import express from 'express'
import { getAllDataInflux } from '../controllers/deviceDataController.js';

const router = express.Router()

router.post('/', getAllDataInflux)

// router.get('/', getAllWorkspaces);

// router.post('/', getAllDevices);

// router.get('/:id', getDataDevice);

export default router