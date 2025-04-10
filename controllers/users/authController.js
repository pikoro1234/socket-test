import jwt from 'jsonwebtoken';
import { generateKeyCommTempUserModel, loginUserModel } from '../../models/users/authModel.js';
import { getDataCompletModel } from '../../models/users/userModel.js';
import { publish_my_data_agent } from '../../helpers/helperIa.js';
import { getEntorno } from '../../services/custom.js';

export const loginUser = async (req, res) => {

    try {

        const { username, userpassword } = req.body;

        if (!username || username === '') {
            return res.status(400).json({ success: false, message: 'User/Password Required' });
        }

        if (!userpassword || userpassword === '') {
            return res.status(400).json({ success: false, message: 'User/Password Required' });
        }

        const response = await loginUserModel(req.body);

        const generate_key_comm = await generateKeyCommTempUserModel(response.uuid);

        if (generate_key_comm.success) {

            const user = { id: response.uuid, username, role_id: response.rol_id };

            const accessToken = jwt.sign(user, process.env.SECRET_TOKKEN, { expiresIn: "50m" });

            const refreshToken = jwt.sign(user, process.env.SECRET_TOKKEN, { expiresIn: "7d" });

            res.cookie("access_token", accessToken, {
                httpOnly: true, secure: getEntorno(), sameSite: getEntorno() ? "None" : "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, maxAge: 50 * 60 * 1000, path: "/"
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true, secure: getEntorno(), sameSite: getEntorno() ? "None" : "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, maxAge: 7 * 24 * 60 * 60 * 1000, path: "/"
            });

            const data_complet_user = await getDataCompletModel(response.uuid, response.rol_id);

            const data_agent = `{
                "extra_data": {
                "comm_key": "${generate_key_comm.message}",
                "data": ${JSON.stringify(data_complet_user)}
                }
            }`

            const data_response_agent = await publish_my_data_agent(data_agent);

            console.log(data_response_agent);

            return res.json({ success: true, message: "Login correcto", commtext: generate_key_comm.message });

        } else {

            res.json({ success: fals, message: "Login incorrecto" });
        }

    } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: "Error usuario no válido" });
    }
};

export const logoutUser = async (req, res) => {

    try {

        res.clearCookie("access_token", {
            httpOnly: true, secure: getEntorno(), sameSite: getEntorno() ? "None" : "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, path: "/"
        });

        res.clearCookie("refresh_token", {
            httpOnly: true, secure: getEntorno(), sameSite: getEntorno() ? "None" : "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, path: "/"
        });

        return res.json({ success: true, message: "Logout exitoso" });

    } catch (error) {

        console.error("Error en logout:", error);
        return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
    }
}

export const refreshToken = async (req, res) => {

    console.log(req);

    try {

        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {

            return res.status(401).json({ success: false, message: "Refresh token no proporcionado" });
        }

        // verificamos que el token es valido
        jwt.verify(refreshToken, process.env.SECRET_TOKKEN, (err, user) => {

            if (err) {

                return res.status(403).json({ success: false, message: "Refresh token inválido o expirado" });
            }

            // generamos nuevo token_access si refresh_token es correcto
            const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_TOKKEN, { expiresIn: "15m" });

            res.cookie("access_token", newAccessToken, {
                httpOnly: true, secure: getEntorno(), sameSite: "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, maxAge: 15 * 60 * 1000, path: "/",
            });

            res.json({ message: "Access token renovado correctamente", success: true });

        })
    } catch (error) {

        console.error("Error al refrescar token", error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
}