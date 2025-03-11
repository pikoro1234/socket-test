import express from 'express'
import { getAllDataInflux, getResponseIa, getResponseIa } from '../controllers/deviceDataController.js';

const router = express.Router()

router.post('/', getAllDataInflux)

router.post('/', getResponseIa)

export default router