import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool_urbidata } from '../database/bd_urbicomm.js';
import { helperGetRolUser } from '../helpers/helperUsers.js';

const authMiddleware = async (req, res, next) => {

    // 1. Validamos JWT desde cookies (uso desde navegador)
    const token = req.cookies.access_token;

    if (token) {

        try {

            const user = jwt.verify(token, process.env.SECRET_TOKKEN);
            req.user = user;
            return next();

        } catch (error) {

            console.warn("JWT inválido. Intentando validar API Key...");
        }
    }

    // 2. Validamos API Key desde header (uso externo)
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("ApiKey ")) {

        try {

            const receivedKey = authHeader.split(" ")[ 1 ];
            const [ rows ] = await pool_urbidata.query("SELECT * FROM `user_tokens`");
            const isValid = rows.some(key => bcrypt.compareSync(receivedKey, key.token));

            if (isValid) {

                req.apiAccess = true; // auxiliar para validaciones de aplicaciones externas
                req.position_user = rows[ 0 ].user_id
                req.position_rol = await helperGetRolUser(rows[ 0 ].user_id)
                return next();
            }

        } catch (error) {

            console.warn("API Key required...");
        }
    }

    return res.status(401).json({ success: false, message: "No autorizado" });
}

export default authMiddleware;