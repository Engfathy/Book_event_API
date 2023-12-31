import express from "express";
import jwt from "jsonwebtoken";

const tokenVerifier = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({
                msg: "No token provided. Access denied.",
            });
        }
        
        const secretKey = "ssssshhhhh";
        let decode: any;

        try {
            decode = jwt.verify(token, secretKey);
        } catch (error) {
            return res.status(401).json({
                msg: "Token verification failed. Access denied.",
            });
        }

        req.headers["user"] = decode.user;
        next();
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error.",
        });
    }
};

export default tokenVerifier;
