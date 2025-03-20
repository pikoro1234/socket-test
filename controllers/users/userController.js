import { loginUserModel } from '../../models/users/userModel.js';
import { generateTokkenApi } from '../../services/generateTokken.js';

export const loginUser = async (req, res) => {
    console.log(req.body);

    try {
        if (!req.body.username || req.body.username === '') {
            return res.status(400).json({ message: 'User/Password Required' });
        }

        if (!req.body.userpassword || req.body.userpassword === '') {
            return res.status(400).json({ message: 'User/Password Required' });
        }

        const { username, userpassword } = req.body;

        const isLocalhost = req.headers.origin?.includes("localhost");
        const isProduction = !isLocalhost; // Si no es localhost, es producción

        const accessToken = generateTokkenApi();
        const refreshToken = generateTokkenApi();

        console.log(accessToken);
        console.log(refreshToken);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: isProduction, // ✅ En producción debe ser true
            sameSite: "None", // 🔥 Necesario para sitios cruzados
            path: "/",
            domain: isProduction ? "urbicomm.io" : undefined, // ✅ Solo en producción
            maxAge: 15 * 60 * 1000, // 15 minutos
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "None",
            path: "/",
            domain: isProduction ? "urbicomm.io" : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        return res.status(200).json({ message: "Login correcto", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error usuario no válido" });
    }
};
