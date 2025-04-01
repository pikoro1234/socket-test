import express from 'express'
import { generateApiKey } from '../../controllers/apiKey/apiKeyController.js';

const router = express.Router()

router.post('/generate/', generateApiKey);

// router.get("/list", listApiKeys);                 // solo admin
// router.get("/protected", validateApiKey, (req, res) => {
//   res.json({ message: "Acceso autorizado vía API Key" });

export default router