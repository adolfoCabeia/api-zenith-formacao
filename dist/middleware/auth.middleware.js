import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Não autenticado" });
    }
    const blackListed = await prisma.blacklistedToken.findFirst({
        where: { token },
    });
    if (blackListed) {
        return res.status(401).json({ message: "Token inválido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Token inválido" });
    }
};
//# sourceMappingURL=auth.middleware.js.map