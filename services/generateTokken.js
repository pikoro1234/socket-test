import jwt from 'jsonwebtoken';

export function generateTokkenApi() {
    const token = jwt.sign({ role: "usuario" }, process.env.SECRET_TOKKEN, { algorithm: 'HS256' })
    return token
}

export function verifyTokken(req, res, next) {
    const tokkenIn = req.headers[ 'authorization' ];
    if (!tokkenIn) return res.status(403).json({ error: 'Token requerido' });
    jwt.verify(tokkenIn, process.env.SECRET_TOKKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                next();
                return res.status(403).json({ error: 'Token expirado' });
            } else if (err.name === 'JsonWebTokenError') {
                next();
                return res.status(403).json({ error: 'Token inválido' });
            } else {
                next();
                return res.status(403).json({ error: 'Error al verificar el token' });
            }
        }
        req.user = decoded;
        next();
    });
}