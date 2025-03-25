import express from 'express'
import { createProjectData } from '../../controllers/projects/projectController.js';

const router = express.Router()

router.post('/', createProjectData)

export default router