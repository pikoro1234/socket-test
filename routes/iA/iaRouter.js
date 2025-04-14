import express from 'express';
import { getProcessData } from '../../controllers/iA/iAController.js';
import { validateExpireChat } from '../../controllers/iA/iAController.js';

const router = express.Router()

router.post('/processing-data/', getProcessData);

router.post('/validate-expire-mqtt-chanel/', validateExpireChat);

export default router