import express from 'express'
import { getUserData } from '../../controllers/users/userController.js'

const router = express.Router()

router.get('/me/', getUserData)

export default router