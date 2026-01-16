import { Request, Response } from 'express';
import { logService } from '../services/LogService';

class LogController {
    async index(req: Request, res: Response) {
        try {
            const { page, limit, search, date } = req.query;
            const user = req.user;

            const result = await logService.index({
                userId: user.id,
                isAdmin: user.isAdmin,
                search: search?.toString(),
                date: date?.toString(),
                page: !isNaN(Number(page)) ? Number(page) : 1,
                limit: !isNaN(Number(limit)) ? Number(limit) : 10,
            });

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export const logController = new LogController();
