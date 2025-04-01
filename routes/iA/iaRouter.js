import express from 'express';
import { getProcessData } from '../../controllers/iA/iAController.js';

const router = express.Router()

router.post('/processing-data/', getProcessData);

export default router