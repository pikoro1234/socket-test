import express from 'express'
import { loginUser, refreshToken } from '../../controllers/users/authController.js'

const router = express.Router()

router.post("/login/", loginUser);

// router.post("/logout", logoutUser);

router.post("/refresh", refreshToken);

export default router