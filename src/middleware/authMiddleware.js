const authMiddleware = (req , res , next) => {

    const token = authheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next()
}

export default authMiddleware
