import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
configDotenv()

const authMiddleware = (req , res , next) => {
    const authheader = req.headers.authorization
    const token = authheader?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next()
}

export default authMiddleware
