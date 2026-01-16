import { Request, Response } from 'express';
import { authService } from '../services/AuthService';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            return res.json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = await authService.me(Number(req.user.id));

            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
}


export const authController = new AuthController();
