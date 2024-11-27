import express from 'express'
import { getAllDevices } from '../controllers/DevicesController'

const router = express.Router()

router.get('/devices',getAllDevices)