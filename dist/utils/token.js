import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
export const generateRefreshToken = () => {
    return crypto.randomUUID();
};
//# sourceMappingURL=token.js.map