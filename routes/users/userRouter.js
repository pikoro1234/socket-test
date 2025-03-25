import express from 'express'
import { getUserData, getUserProjects } from '../../controllers/users/userController.js'

const router = express.Router()

router.get('/me/', getUserData)

router.get('/projects/', getUserProjects);

export default router