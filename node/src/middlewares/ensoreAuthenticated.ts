import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken'
import authConfig from '../config/auth';

interface TokenPayload{
    iat: number;
    exp: number;
    sub:string;
}

export default function ensureAuthenticated(
    request: Request,
    repsonse: Response,
    next: NextFunction): void{

    const authHeader = request.headers.authorization;

    if(!authHeader){
       throw new Error("JWT token is missing");
    }

    const [, token] = authHeader.split(' ');

    try{
        const decode = verify(token, authConfig.jwt.secret);

        const { sub } = decode as TokenPayload; // FORÇA A USAR

        request.user = {
            id: sub,
        }

        return next();
    } catch {
        throw new Error("Invalid JWT token");
    }

    


}