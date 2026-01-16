import { Client } from '../models/Client';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { logService } from './LogService';

interface LoginRequest {
    email: string;
    password: string;
}

class AuthService {
    async login({ email, password }: LoginRequest) {
        const client = await Client.findOne({ where: { email } });

        if (!client) {
            throw new Error('E-mail ou senha inválidos');
        }

        const passwordMatch = await bcrypt.compare(password, client.password);

        if (!passwordMatch) {
            throw new Error('E-mail ou senha inválidos');
        }

        const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

        const options: jwt.SignOptions = { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400, };

        const token = jwt.sign(
            {
                id: client.id,
                isAdmin: client.isAdmin,
            },
            JWT_SECRET,
            options
        );

        logService.create({ type: 'Login', id_client: client.id, module: 'Minha Conta' })

        return {
            token,
            client: {
                id: client.id,
                name: client.name,
                surname: client.surname,
                email: client.email,
                isAdmin: client.isAdmin,
            },
        };
    }

    async me(id: number) {
        
        const user = await Client.findOne({ where: { id } });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return {
            client: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        };
    }
}

export const authService = new AuthService();
