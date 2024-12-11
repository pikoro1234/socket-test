import express from 'express'
import { getAllDataInflux } from '../controllers/deviceDataController.js';

const router = express.Router()

router.post('/', getAllDataInflux)

export default router