import jwt from 'jsonwebtoken';
import { loginUserModel } from '../../models/users/userModel.js';
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


// app.post("/refresh", (req, res) => {
//     const refreshToken = req.cookies.refresh_token;
//     if (!refreshToken) return res.status(401).json({ message: "Token no encontrado" });

//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: "Token inválido" });

//         const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "15m" });

//         res.cookie("access_token", newAccessToken, {
//             httpOnly: true, secure: true, sameSite: "None", maxAge: 15 * 60 * 1000, path: "/"
//         });

//         res.json({ message: "Token renovado" });
//     });
// });