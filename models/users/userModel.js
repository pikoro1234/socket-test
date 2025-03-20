// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
import { generateTokkenApi } from '../../services/generateTokken.js';
import { pool_urbidata } from '../../database/bd_urbicomm.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const updatePassword = (textPassword) => {
    // isertamos en base de datos el nuevos pass y si todo esta correcto retornamos el pass
    try {
        const sha256Hash = crypto.createHash('sha256').update(textPassword).digest('hex');
    } catch (error) {
        console.log(error);
    }
}

export const loginUserModel = async (username, userpassword, res, req) => {
    let message = ''

    const isLocalhost = req.headers.origin?.includes("localhost");
    const isProduction = !isLocalhost; // Solo es producción si NO viene de localhost

    try {
        const [ user ] = await pool_urbidata.query('SELECT * FROM users WHERE email = ?', [ username ]);
        if (user.length === 0 || !await (bcrypt.compare(userpassword, user[ 0 ].password))) {
            message = "Credenciales incorrectas"
        } else {
            message = "Login correcto!!!"
        }


        const accessToken = generateTokkenApi()
        const refresToken = generateTokkenApi()
        console.log(accessToken);
        console.log(refresToken);

        // res.cookie("access_token", accessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "Strict",
        //     maxAge: 15 * 60 * 1000
        // });

        // res.cookie("refresh_token", refresToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "Strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        // res.cookie("access_token", accessToken, {
        //     httpOnly: true,
        //     secure: true, // ⚠️ En producción con HTTPS debe ser true
        //     sameSite: "None", // Permitir envío entre diferentes dominios
        //     maxAge: 15 * 60 * 1000, // 15 minutos
        // });

        // res.cookie("refresh_token", refresToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "None",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        // });

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: isProduction, // ✅ secure: false si es localhost, true en producción
            sameSite: isProduction ? "None" : "Lax", // ✅ "Lax" en localhost, "None" en producción
            maxAge: 15 * 60 * 1000, // 15 minutos
        });

        res.cookie("refresh_token", refresToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });


        // return message

        // console.log(user.rows);
        // console.log(user[ 0 ].password);

        // const res = await (bcrypt.compare(userpassword, result[ 0 ][ 0 ].password))
        // console.log(res);
    } catch (error) {
        console.log(error);
    }


    return message;
}