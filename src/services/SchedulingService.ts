import { Op } from 'sequelize';
import dayjs from 'dayjs';
import { Scheduling } from '../models/Scheduling';
import { Room } from '../models/Room';
import { Client } from '../models/Client';
import { logService } from './LogService';

interface CreateSchedulingDTO {
    date: string;
    time: string;
    id_room: number;
}

interface ListSchedulingDTO {
    page?: number;
    limit?: number;
    name?: string;
    date?: string;
    isAdmin: boolean;
    iduser: number;
}

class SchedulingService {

    async create({ date, time, id_room }: CreateSchedulingDTO, id_client: number) {
        const dateScheduling = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();

        const alreadyScheduled = await Scheduling.findOne({
            where: {
                id_room,
                date_scheduling: dateScheduling
            }
        });

        if (alreadyScheduled) {
            throw new Error('Este horário já está ocupado para esta sala');
        }

        await Scheduling.create({
            date_scheduling: dateScheduling,
            id_room,
            id_client,
        });

        await logService.create({
            type: 'Criação de agendamento',
            module: 'Agendamento',
            id_client: id_client,
        });
    }

    async all({ page = 1, limit = 10, name, date, isAdmin, iduser }: ListSchedulingDTO) {
        const where: any = {};

        if (!isAdmin && iduser) {
            where.id_client = iduser;
        }

        if (date) {
            where.date_scheduling = {
                [Op.between]: [
                    dayjs(date).startOf('day').toDate(),
                    dayjs(date).endOf('day').toDate()
                ]
            };
        }

        const { rows, count } = await Scheduling.findAndCountAll({
            where,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['name', 'surname'],
                    ...(name && {
                        where: {
                            name: { [Op.like]: `%${name}%` }
                        }
                    })
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['name']
                }
            ],
            attributes: ['id', 'date_scheduling', 'status'],
            limit,
            offset: (page - 1) * limit,
            order: [['date_scheduling', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        };
    }

    async updateStatus(id: number, status?: string, isAdmin?: boolean, id_client?: number) {

        if (status === 'CONFIRMED' && !isAdmin) {
            throw new Error('Somente o administrador pode confirmar o agendamento.');
        }

        await logService.create({
            type: status === 'CONFIRMED' ? 'Confirmação de agendamento' : 'Cancelamento de agendamento',
            module: 'Agendamento',
            id_client: Number(id_client),
        });

        await Scheduling.update(
            { status: status },
            { where: { id } }
        );
    }
}

export const schedulingService = new SchedulingService();