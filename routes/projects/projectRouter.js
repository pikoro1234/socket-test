import express from 'express'
import { createProjectData, getProjectData } from '../../controllers/projects/projectController.js';

const router = express.Router()

router.post('/', createProjectData)

router.get('/:id', getProjectData)

export default router