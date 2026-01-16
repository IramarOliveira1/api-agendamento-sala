
import { Request, Response } from 'express';

import { schedulingService } from '../services/SchedulingService';

class SchedulingController {

    async store(req: Request, res: Response) {
        try {
            const user = req.user;

            await schedulingService.create(req.body, user.id);

            return res.status(201).json({ message: 'Agendamento criado com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao cadastrar uma agendamento!' });
        }
    }

    async all(req: Request, res: Response) {
        try {
            const { page, limit, name, date } = req.query;

            const user = req.user;

            const scheduling = await schedulingService.all({
                page: !isNaN(Number(page)) ? Number(page) : 1,
                limit: !isNaN(Number(limit)) ? Number(limit) : 10,
                name: name?.toString(),
                date: date?.toString(),
                isAdmin: user.isAdmin,
                iduser: user.id,
            });

            return res.status(200).json(scheduling);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao listar agendamentos!' });
        }
    }

    async updateStatus(req: Request, res: Response) {

        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = req.user;

            await schedulingService.updateStatus(Number(id), status?.toString(), user.isAdmin, user.id);

            return res.status(200).json({ message: 'Status atualizado com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao atualizar status agendamento!' });
        }
    }
}


export const schedulingController = new SchedulingController();
