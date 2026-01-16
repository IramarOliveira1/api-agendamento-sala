import { Op } from 'sequelize';
import { Log, Client } from '../models';
import dayjs from 'dayjs';

interface ListLogsParams {
    userId: number;
    isAdmin: boolean;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
}

class LogService {
    async create(data: { type: string; module: string; id_client: number; }) {
        await Log.create({ type: data.type, module: data.module, id_client: data.id_client, });
    }

    async index({ userId, isAdmin, search, date, page = 1, limit = 10 }: ListLogsParams) {
        const where: any = {};
        const include = [];

        if (isAdmin) {
            include.push({
                model: Client,
                as: 'client',
                attributes: ['id', 'name', 'surname'],
                where: {
                    isAdmin: false,
                },
            });
        }

        if (!isAdmin) {
            where.id_client = userId;
        }

        if (search) {
            where[Op.or] = [
                { type: { [Op.like]: `%${search.trim()}%` } },
                { module: { [Op.like]: `%${search.trim()}%` } },
            ];

            if (isAdmin) {
                where[Op.or].push({ '$client.name$': { [Op.like]: `%${search.trim()}%` } });
                where[Op.or].push({ '$client.surname$': { [Op.like]: `%${search.trim()}%` } });
            }
        }

        if (date) {
            where.created_at = {
                [Op.between]: [
                    dayjs(date).startOf('day').toDate(),
                    dayjs(date).endOf('day').toDate()
                ]
            };
        }

        const { rows, count } = await Log.findAndCountAll({
            where,
            include,
            order: [['created_at', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
}

export const logService = new LogService();