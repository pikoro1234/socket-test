import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateApiKeyModel } from '../../models/apiKey/apiKeyModel.js';

export const generateApiKey = async (req, res) => {

    try {

        const { app } = req.body;

        if (!app) {

            return res.status(400).json({ success: false, message: "nombre de aplicación requerido" });
        }

        const textApiKey = `urbicomm_${app}_${crypto.randomBytes(32).toString("hex")}`;

        const hashApiKey = await bcrypt.hash(textApiKey, 10);

        const response = await generateApiKeyModel(app, hashApiKey);

        if (response <= 0) {

            return res.status(500).json({ success: false, message: "error al generar token" })
        }

        return res.status(200).json({ success: false, message: textApiKey, hash: hashApiKey });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ success: false, message: "error al generar token" })
    }
}