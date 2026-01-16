import { Request, Response, NextFunction } from 'express';

class IsAdminMiddleware {
    handle(req: Request, res: Response, next: NextFunction) {
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: 'Acesso restrito' });
        }

        return next();
    }
}

export const isAdminMiddleware = new IsAdminMiddleware();

