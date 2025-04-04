import express from 'express'
import { insertEvents } from '../../controllers/webhook/webhookController.js';

const router = express.Router()

router.post('/devices/:id/notices/', insertEvents);

export default router