import jwt from "jsonwebtoken";

// const verifyToken = (req, res, next) => {
//     const token = req.headers["authorization"];
//     if (!token) return res.status(403).json({ message: "Acceso denegado. Token requerido." });

//     jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(401).json({ message: "Token inválido o expirado." });
//         req.user = user; // Guardamos al usuario en el request
//         next();
//     });
// };

// Ruta protegida de ejemplo
// app.get("/api/protegida", verifyToken, (req, res) => {
//     res.json({ message: "Accediste a una ruta protegida", user: req.user });
// });


// export function generateTokkenApi() {
//     const token = jwt.sign({ role: "usuario" }, process.env.SECRET_TOKKEN, { algorithm: 'HS256' })
//     return token
// }

// export function verifyTokken(req, res, next) {
//     const tokkenIn = req.headers[ 'authorization' ];
//     if (!tokkenIn) return res.status(403).json({ error: 'Token requerido' });
//     jwt.verify(tokkenIn, process.env.SECRET_TOKKEN, (err, decoded) => {
//         if (err) {
//             if (err.name === 'TokenExpiredError') {
//                 next();
//                 return res.status(403).json({ error: 'Token expirado' });
//             } else if (err.name === 'JsonWebTokenError') {
//                 next();
//                 return res.status(403).json({ error: 'Token inválido' });
//             } else {
//                 next();
//                 return res.status(403).json({ error: 'Error al verificar el token' });
//             }
//         }
//         req.user = decoded;
//         next();
//     });
// }