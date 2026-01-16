import { Request, Response } from 'express';
import { roomService } from '../services/RoomService';

class RoomController {

    async store(req: Request, res: Response) {
        try {
            await roomService.create(req.body);

            return res.status(201).json({ message: 'Sala cadastrada com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao cadastrar uma sala!' });
        }
    }

    async all(req: Request, res: Response) {
        try {
            const { page, limit, name } = req.query;

            const rooms = await roomService.all({
                page: !isNaN(Number(page)) ? Number(page) : 1,
                limit: !isNaN(Number(limit)) ? Number(limit) : 10,
                name: name?.toString(),
            });

            return res.status(200).json(rooms);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao listar salas!' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const room = await roomService.show(Number(id));

            return res.status(200).json(room);
        } catch (error: any) {
            console.log(error);
            return res.status(400).json({ message: error.message ?? 'Erro ao buscar dados da sala!' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await roomService.update(id, req.body);

            return res.status(200).json({ message: 'Sala atualizada com sucesso!' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao atualizar sala!' });
        }
    }

    async getAvailableRooms(req: Request, res: Response) {
        try {
            const { date, time } = req.query;

            const getRoom = await roomService.getAvailableRooms({
                date: date?.toString(),
                time: time?.toString()
            });

            return res.status(200).json(getRoom);
        } catch (error: any) {
            return res.status(400).json({ message: error.message ?? 'Erro ao salas dísponiveis!' });
        }
    }
}

export const roomController = new RoomController();
