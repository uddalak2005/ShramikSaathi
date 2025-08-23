import express from "express";
import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";

interface decodedToken extends JwtPayload {
    id : string;
    email : string;
}


export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        console.error("No token provided");
        return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded : decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as decodedToken;
        req.user = decoded;
        console.log(req.user);
        next();

    }catch(err){
        console.error("No token provided");
        return res.status(401).send("Unauthorized");
    }
}