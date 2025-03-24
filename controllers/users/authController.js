import jwt from 'jsonwebtoken';
import { loginUserModel } from '../../models/users/authModel.js';
import { getEntorno } from '../../services/helper.js';

export const loginUser = async (req, res) => {

    try {

        const { username, userpassword } = req.body;

        if (!username || username === '') {
            return res.status(400).json({ message: 'User/Password Required' });
        }

        if (!userpassword || userpassword === '') {
            return res.status(400).json({ message: 'User/Password Required' });
        }

        const response = await loginUserModel(req.body);

        if (response) {

            const user = { id: response.uuid, username };

            const accessToken = jwt.sign(user, process.env.SECRET_TOKKEN, { expiresIn: "15m" });

            const refreshToken = jwt.sign(user, process.env.SECRET_TOKKEN, { expiresIn: "7d" });

            res.cookie("access_token", accessToken, {
                httpOnly: true, secure: getEntorno(), sameSite: "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, maxAge: 15 * 60 * 1000, path: "/"
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true, secure: getEntorno(), sameSite: "Lax", domain: getEntorno() ? "urbicomm.io" : undefined, maxAge: 7 * 24 * 60 * 60 * 1000, path: "/"
            });

            res.json({ message: "Login correcto", success: true });

        } else {

            res.json({ message: "Login incorrecto", success: false });
        }

    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: "Error usuario no válido" });
    }
};

export const refreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {

            return res.status(401).json({ message: "Refresh token no proporcionado" });
        }

        // verificamos que el token es valido
        jwt.verify(refreshToken, process.env.SECRET_TOKKEN, (err, user) => {

            if (err) {

                return res.status(403).json({ message: "Refresh token inválido o expirado" });
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
        res.status(500).json({ message: "Error del servidor" });
    }
}