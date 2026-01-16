import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    isAdmin: boolean;
}

class AuthMiddleware {
    handle(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Acesso negado. Token não informado.' });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as JwtPayload;

            req.user = { id: decoded.id, isAdmin: decoded.isAdmin };

            return next();
        } catch {
            return res.status(403).json({ message: 'Token inválido ou expirado' });
        }
    }
}

export const authMiddleware = new AuthMiddleware();