import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, process.env.SECRET_TOKKEN, (err, user) => {

        if (err) return res.status(4003).json({ message: "Token inválido" });

        req.user = user;

        next();
    })
}

export default authMiddleware;