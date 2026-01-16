import { Request, Response } from 'express';
import { clientService } from '../services/ClientService';

class ClientController {
    async store(req: Request, res: Response) {
        try {
            await clientService.create(req.body);

            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao cadastar um cliente' });
        }
    }

    async all(req: Request, res: Response) {
        try {
            const { page, limit, name, date } = req.query;

            const clients = await clientService.all({
                name: name?.toString(),
                date: date?.toString(),
                page: !isNaN(Number(page)) ? Number(page) : 1,
                limit: !isNaN(Number(limit)) ? Number(limit) : 10,
            });

            return res.status(200).json(clients);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao listar clientes' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const client = await clientService.show(Number(id));

            return res.status(200).json(client);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao buscar dados do perfil!' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req.user;

            const client = await clientService.update(id, req.body, user.id);

            return res.status(200).json({ message: 'Cliente atualizado com sucesso!', client: client });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao atualizar cliente' });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await clientService.updateStatus(id, req.body);

            return res.status(200).json({ message: 'Status atualizado com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao atualizar status.' });
        }
    }
}

export const clientController = new ClientController();