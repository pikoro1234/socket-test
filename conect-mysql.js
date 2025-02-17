import mysql from "mysql2/promise";

const host_db = 'dev.urbidata.io';
const user_db = 'NearbySensor';
const password_db = 'bluebox1';
const name_db = 'urbidata_platform';


const testConnection = async () => {
    try {
        // Conectar a la base de datos
        const connection = await mysql.createConnection({
            host: host_db,
            user: user_db,
            password: password_db,
            database: name_db
        });

        console.log("✅ Conexión exitosa a la base de datos");

        // Ejecutar una consulta de prueba
        const [rows] = await connection.query("SELECT NOW() AS current_time");
        console.log("🕒 Hora del servidor MySQL:", rows);

        // Cerrar la conexión
        await connection.end();
    } catch (error) {
        console.error("❌ Error de conexión:", error);
    }
};

// Llamar a la función de prueba
testConnection();




// import express from "express";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: "https://tu-frontend.com",
//     credentials: true, // Permitir cookies en solicitudes CORS
// }));

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

//     // Verificación de usuario en la base de datos (ficticia)
//     if (username === "admin" && password === "123456") {
//         const token = jwt.sign({ username }, "SECRETO", { expiresIn: "1h" });

//         // Enviar el token en una cookie segura
//         res.cookie("authToken", token, {
//             httpOnly: true,
//             secure: true,  // Solo en HTTPS
//             sameSite: "strict",
//             maxAge: 3600000, // 1 hora
//         });

//         return res.json({ message: "Login exitoso" });
//     }

//     res.status(401).json({ message: "Credenciales incorrectas" });
// });

// app.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));


// EN EL FRONT 
// const fetchProfile = async () => {
//     const response = await fetch("https://tu-backend.com/api/profile", {
//         method: "GET",
//         credentials: "include"  // Esto hace que la cookie sea enviada automáticamente
//     });

//     const data = await response.json();
//     console.log(data);
// };
