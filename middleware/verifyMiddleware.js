import bcrypt from 'bcrypt';
import { text_key_compare } from '../no-trackin.js';

const verifyMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("ApiKey ")) {

        try {

            const receivedKey = authHeader.split(" ")[ 1 ];
            const isValid = bcrypt.compareSync(receivedKey, text_key_compare);

            if (isValid) {
                return next();
            }

        } catch (error) {

            console.warn("API Key required...");
            return res.status(401).json({ message: "Unauthorized" });

        }
    }

    return res.status(401).json({ message: "No autorizado" });

}
export default verifyMiddleware;
