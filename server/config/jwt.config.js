import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.cookies.userToken || '';

    if (!token) {
        return res.status(401).json({ message: "No autorizado, token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};


export default authenticate;
