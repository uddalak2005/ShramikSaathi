import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("No token provided");
        return res.status(401).send("No token provided");
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch (err) {
        console.error("No token provided");
        return res.status(401).send("Unauthorized");
    }
};
