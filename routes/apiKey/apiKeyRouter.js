import express from 'express'
import { generateApiKeyStaticPlatforms } from '../../controllers/apiKey/apiKeyController.js';

const router = express.Router()

router.post('/generate/', generateApiKeyStaticPlatforms);

// router.get("/list", listApiKeys);                 // solo admin
// router.get("/protected", validateApiKey, (req, res) => {
//   res.json({ message: "Acceso autorizado vía API Key" });

export default router