import express from 'express'
import { loginUser } from '../../controllers/users/userController.js'
const router = express.Router()

router.post('/', loginUser)

export default router