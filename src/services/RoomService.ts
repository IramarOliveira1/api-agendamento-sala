import { Op } from 'sequelize';
import { Room } from '../models/Room';
import dayjs from 'dayjs';
import { Scheduling } from '../models';

interface CreateOrUpdateDTO {
    name: string;
    startTime: string;
    endTime: string;
    roomDuration: number;
    status?: boolean;
}

interface ListRoomParams {
    name?: string;
    page?: number;
    limit?: number;
}

interface GetAvailableRoomsParams {
    date?: string;
    time?: string;
}

class RoomService {
    async create(data: CreateOrUpdateDTO) {
        await Room.create({
            name: data.name.trim().toUpperCase(),
            start_time: data.startTime,
            end_time: data.endTime,
            room_duration: data.roomDuration,
            status: data.status ? 1 : 0,
        });
    }

    async all({ name, page = 1, limit = 10 }: ListRoomParams) {
        const where: any = {};

        if (name) {
            where[Op.or] = [
                { name: { [Op.like]: `%${name.trim()}%` } },
            ];
        }

        const { rows, count } = await Room.findAndCountAll({
            where,
            attributes: [
                'id',
                'name',
                'start_time',
                'end_time',
                'room_duration',
                'status',
            ],
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

    async show(id: number) {
        const room = await Room.findByPk(id, {
            attributes: [
                'id',
                'name',
                'start_time',
                'end_time',
                'room_duration',
                'status',
            ],
        });

        if (!room) {
            throw new Error('Sala não encontrada!');
        }

        return room;
    }

    async update(id: string, data: CreateOrUpdateDTO) {
        const room = await Room.findByPk(id);

        if (!room) {
            throw new Error('Sala não encontrado.');
        }

        await room.update({
            name: data.name.trim().toUpperCase(),
            start_time: data.startTime,
            end_time: data.endTime,
            room_duration: data.roomDuration,
            status: data.status ? 1 : 0,
            updated_at: dayjs()
        });

        return room;
    }

    async getAvailableRooms({ date, time }: GetAvailableRoomsParams) {
        const requestedStart = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm');

        const rooms = await Room.findAll({
            where: { status: true },
            include: [{
                model: Scheduling,
                as: 'schedulings',
                where: {
                    status: 'CONFIRMED',
                    date_scheduling: {
                        [Op.between]: [
                            dayjs(date).startOf('day').toDate(),
                            dayjs(date).endOf('day').toDate()
                        ]
                    }
                },
                required: false
            }],
        });

        return rooms.filter(room => {
            const roomStart = dayjs(`${date} ${room.startTime}`, 'YYYY-MM-DD HH:mm');
            const roomEnd = dayjs(`${date} ${room.endTime}`, 'YYYY-MM-DD HH:mm');
            const requestedEnd = requestedStart.add(room.roomDuration, 'minute');

            const isWithinOperatingHours =
                (requestedStart.isSame(roomStart) || requestedStart.isAfter(roomStart)) &&
                (requestedEnd.isSame(roomEnd) || requestedEnd.isBefore(roomEnd));

            if (!isWithinOperatingHours) return false;

            const hasConflict = room.schedulings?.some(scheduling => {
                const existingStart = dayjs(scheduling.date_scheduling);
                const existingEnd = existingStart.add(room.roomDuration, 'minute');

                return requestedStart.isBefore(existingEnd) && requestedEnd.isAfter(existingStart);
            });

            return !hasConflict;
        }).map(room => ({
            id: room.id,
            name: room.name
        }));
    }
}

export const roomService = new RoomService();