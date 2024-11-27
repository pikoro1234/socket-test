import express from 'express'
import { getAllWorkspaces, getAllDevices, getDataDevice } from '../controllers/deviceController.js'

const router = express.Router()

router.get('/', getAllWorkspaces);

router.post('/', getAllDevices);

router.get('/:id', getDataDevice);

export default router