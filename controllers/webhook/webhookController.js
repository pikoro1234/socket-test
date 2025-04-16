import { insertEventsWarningsModel } from '../../models/webhook/webhookModel.js';

export const insertEvents = async (req, res) => {

    try {

        if (!req.headers.authorization) {

            return res.status(401).json({ success: false, message: "User no autorizado." });
        }

        if (req.body && Object.keys(req.body).length === 0) {

            return res.status(404).json({ success: false, message: "Not found." });
        }

        const response = await insertEventsWarningsModel(req.body);

        if (response === 0) {

            return res.status(404).json({ success: false, message: "Bad Request." });
        }

        return res.status(200).json({ success: true, message: "Insert correct." });

    } catch (error) {

        console.log(error);
    }
}