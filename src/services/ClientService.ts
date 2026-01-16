import { Client } from '../models/Client';
import bcrypt from 'bcrypt';
import { logService } from './LogService';
import { Op } from 'sequelize';
import dayjs from 'dayjs';

interface ListClientsParams {
    page: number;
    limit: number;
    name?: string;
    date?: string;
}

interface UpdateStatus {
    status: boolean;
}

interface ClientUpdateData {
    name: string;
    surname: string;
    email: string;
    password?: string;
    cep: string;
    address: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

class ClientService {
    async create(data: {
        name: string;
        surname: string;
        email: string;
        password: string;
        cep: string;
        address: string;
        number?: number;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string
    }) {

        const emailExists = await Client.findOne({ where: { email: data.email } });

        if (emailExists) {
            throw new Error('E-mail já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const client = await Client.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: hashedPassword,
            cep: data.cep,
            address: data.address,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
        });

        await logService.create({
            type: 'Criação de conta',
            module: 'Minha Conta',
            id_client: client.id,
        });
    }

    async all({ page, limit, name, date }: ListClientsParams) {
        const where: any = { isAdmin: { [Op.ne]: true } };

        if (name) {
            where[Op.or] = [
                { name: { [Op.like]: `%${name.trim()}%` } },
                { surname: { [Op.like]: `%${name.trim()}%` } },
            ];
        }

        if (date) {
            where.created_at = {
                [Op.between]: [
                    dayjs(date).startOf('day').toDate(),
                    dayjs(date).endOf('day').toDate()
                ]
            };
        }

        const { rows, count } = await Client.findAndCountAll({
            where,
            attributes: [
                'id',
                'created_at',
                'name',
                'surname',
                'address',
                'number',
                'complement',
                'neighborhood',
                'city',
                'state',
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
        const client = await Client.findByPk(id, {
            attributes: [
                'name',
                'surname',
                'email',
                'isAdmin',
                'cep',
                'address',
                'number',
                'complement',
                'neighborhood',
                'city',
                'state',
                'status',
            ],
        });

        if (!client) {
            throw new Error('Perfil não encontrado!');
        }

        return client;
    }

    async update(id: string, data: ClientUpdateData, id_client: number) {
        const client = await Client.findByPk(id);

        if (!client) {
            throw new Error('Perfil não encontrado!');
        }

        if (data.email) {
            const existingClient = await Client.findOne({
                where: {
                    email: data.email,
                    id: { [Op.ne]: id },
                },
            });

            if (existingClient) {
                throw new Error('Email já está em uso por outro usuário.');
            }
        }

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 12);
            data.password = hashedPassword;
        }

        await client.update(data);

        await logService.create({
            type: 'Alteração de perfil',
            module: 'Minha Conta',
            id_client: Number(id_client),
        });

        return { id: client.id, name: client.name, surname: client.surname, email: client.email, isAdmin: client.isAdmin };
    }

    async updateStatus(id: string, status: UpdateStatus) {
        const client = await Client.findByPk(id);

        if (!client) {
            throw new Error('Cliente não encontrado.');
        }

        await client.update({ status: status.status ? 1 : 0 });
    }
}

export const clientService = new ClientService();